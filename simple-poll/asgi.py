"""
ASGI config for simple-poll project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import polls.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "simple-poll.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(polls.routing.websocket_urlpatterns),
})
