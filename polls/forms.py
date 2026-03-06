from django import forms

from .models import Option, Poll


class PollForm(forms.ModelForm):
    class Meta:
        model = Poll
        fields = [
            "title",
            "description",
        ]


class PollVoteForm(forms.Form):
    option = forms.ModelChoiceField(queryset=Option.objects.all())


class PollSettingsForm(forms.ModelForm):
    class Meta:
        model = Poll
        fields = ["active", "allow_one_vote_per_ip", "allow_public_results"]
