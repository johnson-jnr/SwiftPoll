from django.db import models
from django.conf import settings
from nanoid import generate


def short_id():
    return generate(size=12)


class Poll(models.Model):
    public_id = models.CharField(
        max_length=12, unique=True, default=short_id, editable=False
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)

    # settings
    is_draft = models.BooleanField(default=True)
    active = models.BooleanField(default=False)
    allow_one_vote_per_ip = models.BooleanField(default=True)
    allow_public_results = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Option(models.Model):
    text = models.CharField(max_length=200)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="options")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class Vote(models.Model):
    hashed_ip_address = models.CharField(max_length=64)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    voted_at = models.DateTimeField(auto_now_add=True)
    option = models.ForeignKey(Option, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["poll", "hashed_ip_address"], name="unique_vote_per_ip"
            )
        ]
