from django.urls import path, include
from .routers import router

urlpatterns = [
    path("v1/", include(router.urls)),
]
