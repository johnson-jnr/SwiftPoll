import hashlib
import hmac
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.conf import settings
from django.db import IntegrityError
from inertia import render
from django.shortcuts import get_object_or_404, redirect
from ipware import get_client_ip
from polls.forms import PollForm, PollSettingsForm, PollVoteForm
from polls.models import Option, Poll, Vote
from django.db.models import Count
from allauth.account.forms import (
    LoginForm,
    ResetPasswordForm,
    ResetPasswordKeyForm,
    SignupForm,
    UserTokenForm,
)
from allauth.account.internal.flows import password_reset as password_reset_flows
from allauth.account.models import EmailConfirmationHMAC
from allauth.account.utils import complete_signup, perform_login
from allauth.account.views import INTERNAL_RESET_SESSION_KEY
from django.contrib.auth import logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import PermissionDenied

RESET_URL_KEY = "set-password"


def home(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PollForm(data)
        if form.is_valid():
            options = [o.strip() for o in data.get("options", []) if o.strip()]
            user = request.user if request.user.is_authenticated else None
            is_draft = form.cleaned_data["is_draft"]
            start_date = form.cleaned_data["start_date"]

            # go live immediately if published and no start date scheduled
            active = not is_draft and start_date is None

            poll = Poll.objects.create(
                title=form.cleaned_data["title"],
                description=form.cleaned_data["description"],
                allow_public_results=form.cleaned_data["allow_public_results"],
                is_draft=is_draft,
                start_date=start_date,
                end_date=form.cleaned_data["end_date"],
                active=active,
                user=user,
            )

            Option.objects.bulk_create(
                [Option(poll=poll, text=option) for option in options]
            )
            messages.success(request, "Poll created successfully!")
            return redirect("poll_detail", public_id=poll.public_id)
        else:
            return render(request, "Index", {"errors": form.errors})
    return render(request, "Index")


def poll_detail(request, public_id):
    poll = get_object_or_404(
        Poll.objects.prefetch_related("options"),
        public_id=public_id,
    )
    is_owner = request.user.is_authenticated and poll.user == request.user
    if not poll.active and not is_owner:
        return render(request, "PollNotActive")

    user = None
    if poll.user:
        user = {"username": poll.user.username}
    errors = request.session.pop("errors", {})
    return render(
        request,
        "PollDetail",
        {
            "public_id": public_id,
            "errors": errors,
            "poll": {
                "title": poll.title,
                "description": poll.description,
                "user": user,
                "active": poll.active,
                "public_id": poll.public_id,
                "created_at": poll.created_at,
                "allow_public_results": poll.allow_public_results,
                "allow_one_vote_per_ip": poll.allow_one_vote_per_ip,
                "options": [{"id": o.id, "text": o.text} for o in poll.options.all()],
            },
        },
    )


def vote(request, public_id):
    poll = get_object_or_404(
        Poll.objects.prefetch_related("options"), public_id=public_id
    )

    if request.method == "POST":
        data = json.loads(request.body)
        form = PollVoteForm(data)

        if form.is_valid():
            client_ip, _ = get_client_ip(request)

            hashed_ip = hmac.new(
                settings.IP_HASH_SECRET_KEY.encode(),
                client_ip.encode(),
                hashlib.sha256,
            ).hexdigest()

            try:
                Vote.objects.create(
                    poll=poll,
                    option=form.cleaned_data["option"],
                    hashed_ip_address=hashed_ip,
                )

                # send updated vote counts to all clients viewing this poll
                options = list(
                    poll.options.annotate(vote_count=Count("vote"))
                    .values("id", "text", "vote_count")
                    .order_by("-vote_count")
                )
                total_votes = sum(option["vote_count"] for option in options)
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f"poll_{public_id}",
                    {
                        "type": "poll_update",
                        "data": {
                            "total_votes": total_votes,
                            "options": options,
                        },
                    },
                )

                return redirect("poll_detail", public_id=public_id)
            except IntegrityError:
                request.session["errors"] = {
                    "general": "You have already voted on this poll."
                }
                return redirect("poll_detail", public_id=public_id)
        else:
            request.session["errors"] = {
                k: "\n".join(v) for k, v in form.errors.items()
            }
            return redirect("poll_detail", public_id=public_id)

    return redirect("poll_detail", public_id=public_id)


def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = LoginForm(data=data, request=request)
        if form.is_valid():
            perform_login(
                request,
                form.user,
                email_verification=settings.ACCOUNT_EMAIL_VERIFICATION,
            )
            return redirect(settings.LOGIN_REDIRECT_URL)
        else:
            errors = {
                ("general" if k == "__all__" else k): "\n".join(v)
                for k, v in form.errors.items()
            }
            return render(request, "Login", {"errors": errors})
    return render(request, "Login")


def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = SignupForm(data=data)
        if form.is_valid():
            user = form.save(request)
            complete_signup(request, user, settings.ACCOUNT_EMAIL_VERIFICATION, "/")
            return redirect("home")
        else:
            errors = {
                ("general" if k == "__all__" else k): "\n".join(v)
                for k, v in form.errors.items()
            }
            return render(request, "Signup", {"errors": errors})
    return render(request, "Signup")


def confirm_email(request, key):
    confirmation = EmailConfirmationHMAC.from_key(key)
    if not confirmation:
        return render(
            request, "ConfirmEmail", {"error": "Invalid or expired confirmation link."}
        )

    if request.method == "POST":
        confirmation.confirm(request)
        return redirect("home")

    return render(
        request,
        "ConfirmEmail",
        {
            "email": confirmation.email_address.email,
            "username": confirmation.email_address.user.get_username(),
        },
    )


def forgot_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = ResetPasswordForm(data)
        if form.is_valid():
            form.save(request)
            return render(request, "ForgotPassword")
        else:
            errors = {
                ("general" if k == "__all__" else k): "\n".join(v)
                for k, v in form.errors.items()
            }
            return render(request, "ForgotPassword", {"errors": errors})
    return render(request, "ForgotPassword")


def password_reset_from_key(request, uidb36, key):
    if key != RESET_URL_KEY:
        # First visit (real key in URL): validate, store in session, redirect
        token_form = UserTokenForm(data={"uidb36": uidb36, "key": key})
        if token_form.is_valid():
            request.session[INTERNAL_RESET_SESSION_KEY] = key
            return redirect(
                reverse(
                    "account_reset_password_from_key",
                    kwargs={"uidb36": uidb36, "key": RESET_URL_KEY},
                )
            )
        return render(request, "PasswordResetFromKey", {"token_fail": True})

    # Second visit ("set-password" URL): read real key from session
    real_key = request.session.get(INTERNAL_RESET_SESSION_KEY, "")
    token_form = UserTokenForm(data={"uidb36": uidb36, "key": real_key})
    if not real_key or not token_form.is_valid():
        return render(request, "PasswordResetFromKey", {"token_fail": True})

    reset_user = token_form.reset_user

    if request.method == "POST":
        data = json.loads(request.body)
        form = ResetPasswordKeyForm(data, user=reset_user, temp_key=real_key)
        if form.is_valid():
            form.save()
            password_reset_flows.finalize_password_reset(request, reset_user)
            return redirect("login")
        else:
            errors = {
                ("general" if k == "__all__" else k): "\n".join(v)
                for k, v in form.errors.items()
            }
            return render(request, "PasswordResetFromKey", {"errors": errors})

    return render(request, "PasswordResetFromKey")


def error_404(request, exception):
    response = render(request, "errors/Error404", {})
    response.status_code = 404
    return response


def error_403(request, exception):
    response = render(request, "errors/Error403", {})
    response.status_code = 403
    return response


@login_required
def signout(request):
    logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)


def result(request, public_id):
    poll = get_object_or_404(
        Poll.objects.prefetch_related("options"),
        public_id=public_id,
    )
    is_owner = request.user.is_authenticated and poll.user == request.user
    if not poll.allow_public_results and not is_owner:
        raise PermissionDenied

    user = None
    if poll.user:
        user = {"username": poll.user.username}
    options = list(
        poll.options.annotate(vote_count=Count("vote"))
        .values("id", "text", "vote_count")
        .order_by("-vote_count")
    )
    total_vote = sum(option["vote_count"] for option in options)
    return render(
        request,
        "PollResult",
        {
            "public_id": public_id,
            "poll": {
                "title": poll.title,
                "description": poll.description,
                "user": user,
                "active": poll.active,
                "created_at": poll.created_at,
                "options": options,
                "total_vote": total_vote,
            },
        },
    )


@login_required
def poll_settings(request, public_id):
    if request.method == "PUT":
        poll = get_object_or_404(Poll, public_id=public_id)
        data = json.loads(request.body)
        form = PollSettingsForm(data=data)
        if form.is_valid():
            poll.allow_one_vote_per_ip = form.cleaned_data["allow_one_vote_per_ip"]
            poll.allow_public_results = form.cleaned_data["allow_public_results"]
            poll.save()
            messages.success(request, "Poll settings updated successfully.")
        else:
            errors = {k: "\n".join(v) for k, v in form.errors.items()}
            return render(request, "Dashborad", {"errors": errors})
    return redirect("dashboard")


@login_required
def dashboard(request):
    polls = (
        Poll.objects.filter(user=request.user)
        .values(
            "id",
            "title",
            "description",
            "active",
            "is_draft",
            "public_id",
            "created_at",
            "allow_public_results",
            "allow_one_vote_per_ip",
        )
        .annotate(total_vote=Count("votes"))
        .order_by("-created_at")
    )
    total_votes = sum(poll["total_vote"] for poll in polls)
    return render(request, "Dashboard", {"polls": polls, "total_votes": total_votes})
