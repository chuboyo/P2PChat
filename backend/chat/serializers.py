from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from .helpers import create_token
from django.contrib.auth import get_user_model


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serialize username, email, password and id field for users."""

    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
   

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'password')
        read_only_fields = ('id',)

    # create user and user token
    def create(self, validated_data):
        user = get_user_model().objects.create_user(email=validated_data['email'], username=validated_data['username'], password=validated_data['password'])
        create_token(user=user)
        return user
        

class UserLoginSerializer(serializers.Serializer):
    """Serialize email and password field for user login."""

    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    # validate user credentials
    def validate(self, data):
        user = get_user_model().objects.get(username=data["username"])
        if not user.check_password(data["password"]):
            raise AuthenticationFailed(
                "Invalid credentials", status.HTTP_401_UNAUTHORIZED
            )
        return data

    # get authenticated user
    def create(self, validated_data):
        user = get_user_model().objects.get(username=validated_data["username"])
        return user
    

