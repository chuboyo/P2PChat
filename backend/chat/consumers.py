import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from .models import Message
from rest_framework.authtoken.views import Token
from .helpers import apply_wrappers, extract_params, get_token, get_user_helper

@apply_wrappers
class ChatConsumer(AsyncWebsocketConsumer):
    """ChatConsumer class. Has methods to connect, disconnect, receive and propagate messages via websocket."""

    # connect authenticated user to websocket
    async def connect(self):
        if self.scope['query_string']:
            params = str(self.scope['query_string']).split("&")
            token, room = extract_params(params)
        else:
            token = ""
            room= ""

        self.room_group_name = f'{room}_room'

        try:
            user = await self.get_user(token)
        except:
            user = None

        if user:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    # disconnect user from websocket
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # create an entry for received messages on Message model.
    @database_sync_to_async
    def create_message(self, message, username):
        message_obj = Message.objects.create(
            content=message,
            author=username
        )
        return message_obj
    
    # get user token for authentication
    @database_sync_to_async
    def get_user(self, token):
        user = get_user_helper(token)
        return user

    # receive message from websocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']

        # Create a new message object and save it to the database
        message_obj = await self.create_message(message, username)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_obj.content,
                'username': message_obj.author,
                'timestamp': str(message_obj.timestamp),
                "is_read": message_obj.is_read,
                "id": message_obj.id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']
        is_read = event['is_read']
        id = event['id']

        # Send the message to the websocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'timestamp': timestamp,
            'is_read': is_read,
            'id': id
        }))

@apply_wrappers
class ReadConsumer(AsyncWebsocketConsumer):
    """ReadConsumer class. Has methods to connect, disconnect, receive and propagate messages via websocket."""

    # connect authenticated user to websocket
    async def connect(self):
        if self.scope['query_string']:
            params = str(self.scope['query_string']).split("&")
            token, room = extract_params(params)
        else:
            token = ""
            room= ""

        self.room_group_name = f'{room}_reader'

        try:
            user = await self.get_user(token)
        except:
            user = None

        if user:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    # disconnect user from websocket
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # mark messages as read on Message model
    @database_sync_to_async
    def mark_read(self, ids):
        if ids:
            message_objs = Message.objects.filter(
                id__in=ids,
            )
            marked_ids = []
            for message in message_objs:
                message.is_read = True
                message.save()
                marked_ids.append(message.id)
            return marked_ids
        return []
    
    # get user token for authentication
    @database_sync_to_async
    def get_user(self, token):
        user = get_user_helper(token)
        return user
    

    # receive message ids to mark as read from websocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        ids = data['ids']

        # Create a new message object and save it to the database
        read_ids = await self.mark_read(ids)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'read_message',
                'message': read_ids,
            }
        )

    # send message ids that have been marked as read to websocket 
    async def read_message(self, event):
        message = event['message']

        # Send the message to the websocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))