from django.test import TestCase, SimpleTestCase
from channels.testing import ApplicationCommunicator
from .consumers import ChatConsumer, ReadConsumer
from .models import Message
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .helpers import create_token

class WebSocketConsumerTests(TestCase):
    """Test chat consumer and read consumer."""
    
    def setUp(self):
        self.message = Message.objects.create(
             author='chuboyo',
             content="Test Message"
        )

    async def test_chat_consumer(self):
        communicator = ApplicationCommunicator(ChatConsumer.as_asgi(),  {"type": "http"})
        await communicator.send_input({
            "type": "chat_message",
            "message": self.message.content,
            "username": self.message.author,
            "timestamp": str(self.message.timestamp),
            "is_read": self.message.is_read,
            "id": self.message.id
        })
        event = await communicator.receive_output(timeout=5)
        assert event["type"] == "websocket.send"

    async def test_read_consumer(self):
        communicator = ApplicationCommunicator(ReadConsumer.as_asgi(),  {"type": "http"})
        await communicator.send_input({
            "type": "read_message",
            "message": [self.message.id],
        })
        event = await communicator.receive_output(timeout=5)
        assert event["type"] == "websocket.send"

class UserAPITest(APITestCase):
    """Test sign up and login."""

    def setUp(self):
        self.user = get_user_model().objects.create_user(
             email='chuboyo@gmail.com',
             username="chubi",
             password='escalibur'
        )
        self.user.save()
        create_token(user=self.user)

    def test_register_user(self):
        url = reverse('user-list')
        data = {'username': 'fantastic',
                'email': 'fantastic@email.com',
                'password': '2Password',
                }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_user_login(self):
        url = reverse('user-login')
        data = {'username': self.user.username,
                'password': 'escalibur'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
