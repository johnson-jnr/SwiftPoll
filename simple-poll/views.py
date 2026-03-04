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
    return render(request, "Login")


def signup(request):
    return render(request, "Signup")
