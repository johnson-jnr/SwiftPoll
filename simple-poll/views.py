import hashlib
import hmac
import json

from django.conf import settings
from django.db import IntegrityError
from inertia import render
from django.shortcuts import get_object_or_404, redirect
from ipware import get_client_ip
from polls.forms import PollForm, PollVoteForm
from polls.models import Option, Poll, Vote
from django.db.models import Count
from allauth.account.forms import LoginForm, SignupForm
from allauth.account.models import EmailConfirmationHMAC
from allauth.account.utils import complete_signup, perform_login
from django.contrib.auth import logout


def home(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PollForm(data)
        if form.is_valid():
            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            options = [o.strip() for o in data.get("options", []) if o.strip()]
            user = request.user if request.user.is_authenticated else None
            poll = Poll.objects.create(title=title, description=description, user=user)

            Option.objects.bulk_create(
                [Option(poll=poll, text=option) for option in options]
            )
            return redirect("poll_detail", public_id=poll.public_id)
        else:
            return render(request, "Index", {"errors": form.errors})
    return render(request, "Index")


def poll_detail(request, public_id):
    poll = get_object_or_404(
        Poll.objects.prefetch_related("options"),
        public_id=public_id,
    )
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
                "user": poll.user,
                "active": poll.active,
                "created_at": poll.created_at,
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
            return redirect("home")
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
    return render(request, "ForgotPassword")


def signout(request):
    logout(request)
    return redirect("home")


def result(request, public_id):
    poll = get_object_or_404(
        Poll.objects.prefetch_related("options"),
        public_id=public_id,
    )
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
                "user": poll.user,
                "active": poll.active,
                "created_at": poll.created_at,
                "options": options,
                "total_vote": total_vote,
            },
        },
    )
