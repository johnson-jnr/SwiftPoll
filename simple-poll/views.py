import json

from inertia import render
from django.shortcuts import redirect

from polls.forms import PollForm
from polls.models import Option, Poll


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
    return render(request, "PollDetail", {"public_id": public_id})


def login(request):
    return render(request, "Login")


def signup(request):
    return render(request, "Signup")
