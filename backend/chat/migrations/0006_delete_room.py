# Generated by Django 4.2.7 on 2024-01-07 00:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_alter_room_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Room',
        ),
    ]