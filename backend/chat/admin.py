from django.contrib import admin
from .models import Message
from django.contrib.auth import get_user_model

# Register your models here.

# Message model
admin.site.register(Message) 

# custom user model
admin.site.register(get_user_model())

