from rest_framework import viewsets, permissions
from .serializers import UserSerializer, TransactionSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User, Transaction

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"message": "login successfully",
                             "user": username,
                             "token": token.key}, status=200)

        return Response({"username": "User not found"}, status=400)
    
class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "logout successfully"}, status=200)
    
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    pagination_class = PageNumberPagination
    page_size = 5
    
    def create(self, request):
        request.data['user'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list(self, request):
        transactions = self.queryset.filter(user=request.user).order_by('-date')
        pagination = self.pagination_class()
        pagination.page_size = self.page_size
        page = pagination.paginate_queryset(queryset=transactions, request=request)
        serializer = self.get_serializer(page, many=True)
        return pagination.get_paginated_response(serializer.data)
    
    def destroy(self, request, pk=None):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)

    def partial_update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    @action(detail=False)
    def get_categories(self, request):
        categories = list(self.queryset.filter(user=request.user).values_list('category', flat=True).distinct())
        if 'Others' not in categories :
            categories.append('Others')
        return Response({"message": "categories retrieved successfully", 
                         "categories": categories}, status=200)