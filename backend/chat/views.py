from .serializers import  UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .helpers import get_token


class UserViewset(viewsets.ModelViewSet):
    """Viewset for create, login and logout user views."""

    serializer_class = UserRegisterSerializer
    queryset = get_user_model().objects.all()


    def get_serializer_class(self):
        if self.action == "login":
            return UserLoginSerializer
        if self.action == "logout":
            return UserLogoutSerializer
        return UserRegisterSerializer


    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = self.get_serializer_class()(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            token = get_token(user=user)
            response = Response({"token": token.key, "user": user.username})
            return response
        except AuthenticationFailed as e:
            return Response({"message": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except NotAuthenticated as e:
            return Response({"message": str(e)}, status=status.HTTP_403_FORBIDDEN)
        