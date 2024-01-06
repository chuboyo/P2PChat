from django.db import models
from django.contrib.auth.models import AbstractUser


class Message(models.Model):
  """Message model, has fields for author, message content, timestamp and read receipts."""

  author = models.CharField(max_length=255)
  content = models.TextField()
  timestamp = models.DateTimeField(auto_now_add=True)
  is_read = models.BooleanField(default=False)


  def __str__(self):
    return f'{self.pk} {self.author}: {self.content}'
  
class CustomUser(AbstractUser):
  
  def __str__(self):
    return f'{self.pk} {self.username}'
  


