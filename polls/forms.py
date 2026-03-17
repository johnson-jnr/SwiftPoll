from django import forms

from .models import Option, Poll


ISO_DATETIME_FORMATS = ['%Y-%m-%dT%H:%M:%S.%fZ', '%Y-%m-%dT%H:%M:%SZ']


class PollForm(forms.ModelForm):
    start_date = forms.DateTimeField(input_formats=ISO_DATETIME_FORMATS, required=False)
    end_date = forms.DateTimeField(input_formats=ISO_DATETIME_FORMATS, required=False)

    class Meta:
        model = Poll
        fields = [
            "title",
            "description",
            "allow_public_results",
            "is_draft",
            "start_date",
            "end_date",
        ]

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")
        if start_date and end_date and end_date <= start_date:
            self.add_error("end_date", "End date must be after start date.")
        return cleaned_data


class PollVoteForm(forms.Form):
    option = forms.ModelChoiceField(queryset=Option.objects.all())


class PollSettingsForm(forms.ModelForm):
    start_date = forms.DateTimeField(input_formats=ISO_DATETIME_FORMATS, required=False)
    end_date = forms.DateTimeField(input_formats=ISO_DATETIME_FORMATS, required=False)

    class Meta:
        model = Poll
        fields = ["is_draft", "allow_one_vote_per_ip", "allow_public_results", "start_date", "end_date"]

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")
        if start_date and end_date and end_date <= start_date:
            self.add_error("end_date", "End date must be after start date.")
        return cleaned_data
