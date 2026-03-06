"""
URL configuration for sonic_inertia project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path

from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    path("signout/", views.signout, name="signout"),
    path("forgot-password/", views.forgot_password, name="forgot_passsword"),
    path("admin/", admin.site.urls),
    path(
        "accounts/confirm-email/<str:key>/",
        views.confirm_email,
        name="account_confirm_email",
    ),
    re_path(
        r"^accounts/password/reset/key/(?P<uidb36>[0-9A-Za-z]+)-(?P<key>.+)/$",
        views.password_reset_from_key,
        name="account_reset_password_from_key",
    ),
    path("accounts/", include("allauth.urls")),
    path("<str:public_id>/", views.poll_detail, name="poll_detail"),
    path("<str:public_id>/settings/", views.poll_settings, name="poll_settings"),
    path("<str:public_id>/vote/", views.vote, name="vote"),
    path("<str:public_id>/result/", views.result, name="result"),
    path("", views.home, name="home"),
]
