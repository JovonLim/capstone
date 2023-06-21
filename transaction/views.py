from rest_framework import viewsets, permissions
from .serializers import UserSerializer, TransactionSerializer
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
        return Response({"message": "login successfully"}, status=200)
    
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    
    def create(self, request):
        request.data['user'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list(self, request):
        transactions = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data, status=200)
    
    @action(detail=False)
    def get_categories(self, request):
        categories = list(self.queryset.filter(user=request.user).values_list('category', flat=True).distinct())
        if 'Others' not in categories :
            categories.append('Others')
        return Response({"message": "categories retrieved successfully", 
                         "categories": categories}, status=200)