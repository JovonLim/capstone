from rest_framework import viewsets, permissions
from .serializers import UserSerializer, TransactionSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
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
            login(request, user)
            data = UserSerializer(user).data
            return Response({"message": "login successfully",
                             "user": data,
                             "token": token.key}, status=200)

        return Response({"username": "User not found"}, status=400)
    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
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
        tr_type = request.query_params.get('tr_type')
        categories = request.query_params.getlist('categories[]')
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')
        transactions = self.queryset.filter(user=request.user)
        if categories :
            transactions = transactions.filter(category__in=categories)
        if tr_type : 
            transactions = transactions.filter(tr_type=tr_type)
        if from_date :
            transactions = transactions.filter(date__gte=from_date)
        if to_date : 
            transactions = transactions.filter(date__lte=to_date)
        pagination = self.pagination_class()
        pagination.page_size = self.page_size
        page = pagination.paginate_queryset(queryset=transactions.order_by('-date'), request=request)
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