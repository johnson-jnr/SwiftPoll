from inertia.test import InertiaTestCase
from polls.models import Poll, Option, Vote


class PollTestCase(InertiaTestCase):
    def test_home_page(self):
        self.client.get("/")
        self.assertComponentUsed("Index")

    def test_poll_detail(self):
        poll = Poll.objects.create(title="Test Poll")
        Option.objects.create(poll=poll, text="Option A")
        Option.objects.create(poll=poll, text="Option B")

        self.client.get(f"/{poll.public_id}/")
        self.assertComponentUsed("PollDetail")

    def test_poll_result(self):
        poll = Poll.objects.create(title="Result Poll", allow_public_results=True)
        option = Option.objects.create(poll=poll, text="Option A")
        Vote.objects.create(poll=poll, option=option, hashed_ip_address="abc123")

        self.client.get(f"/{poll.public_id}/result/")
        self.assertComponentUsed("PollResult")

    def test_login_page(self):
        self.client.get("/login/")
        self.assertComponentUsed("Login")

    def test_signup_page(self):
        self.client.get("/signup/")
        self.assertComponentUsed("Signup")
