from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, LoginView, LogoutView, TransactionViewSet, BudgetViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename="user")
router.register(r'transactions', TransactionViewSet, basename="transactions")
router.register(r'budgets', BudgetViewSet, basename="budget")

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view())
]