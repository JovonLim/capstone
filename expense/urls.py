from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, LoginView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename="user")

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view())
]