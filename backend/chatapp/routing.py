from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from chat.consumers import ChatConsumer, ReadConsumer

websocket_urlpatterns = [
    re_path(r'chat/', ChatConsumer.as_asgi()),
    re_path(r'read/', ReadConsumer.as_asgi()),
]