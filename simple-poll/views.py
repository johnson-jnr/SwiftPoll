from inertia import render


def home(request):
    return render(request, "Index")


def login(request):
    return render(request, "Login")


def signup(request):
    return render(request, "Signup")
