from django.contrib import admin
from django.urls import path, include, re_path

from . import views

handler404 = views.error_404
handler403 = views.error_403

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    path("signout/", views.signout, name="signout"),
    path("forgot-password/", views.forgot_password, name="forgot_passsword"),
    path("backoffice/", admin.site.urls),
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
    path("accounts/", include("allauth.socialaccount.providers.google.urls")),
    path("<str:public_id>/", views.poll_detail, name="poll_detail"),
    path("<str:public_id>/settings/", views.poll_settings, name="poll_settings"),
    path("<str:public_id>/vote/", views.vote, name="vote"),
    path("<str:public_id>/result/", views.result, name="result"),
    path("", views.home, name="home"),
]
