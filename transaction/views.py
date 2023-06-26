from datetime import date
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, TransactionSerializer, BudgetSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from .models import User, Transaction, Budget
from django.db.models import Q, Sum
from django.db.models.functions import TruncMonth
from dateutil.relativedelta import relativedelta


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def partial_update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
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
        filter_conditions = Q()
    
        if categories:
            filter_conditions &= Q(category__in=categories)
    
        if tr_type:
            filter_conditions &= Q(tr_type=tr_type)
    
        if from_date:
            filter_conditions &= Q(date__gte=from_date)
    
        if to_date:
            filter_conditions &= Q(date__lte=to_date)
    
        transactions = transactions.filter(filter_conditions)
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
    
    @action(detail=False)
    def get_count(self, request):
        transactions = self.queryset.filter(user=request.user)
        total_transaction_count = len(transactions)
        total_expenses_count = len(transactions.filter(tr_type="Expense"))
        total_income_count = len(transactions.filter(tr_type="Income"))
        transactions = transactions.filter(date__month=date.today().month, date__year=date.today().year)
        curr_transaction_count = len(transactions)
        curr_expenses_count = len(transactions.filter(tr_type="Expense"))
        curr_income_count = len(transactions.filter(tr_type="Income"))
        return Response({"message": "retrieved count successfully",
                         "totalTransaction": total_transaction_count,
                         "totalExpense": total_expenses_count, 
                         "totalIncome": total_income_count,
                         "currTransaction": curr_transaction_count,
                         "currExpense": curr_expenses_count, 
                         "currIncome": curr_income_count}, status=200)
    
    @action(detail=False)
    def get_budget_spent(self, request):
        transactions = self.queryset.filter(user=request.user, tr_type="Expense", date__month=date.today().month, date__year=date.today().year)
        spent = transactions.aggregate(Sum('amt'))['amt__sum'] or 0
        return Response({"message": "retrieved budget spent successfully",
                         "spent": spent}, status=200)
    
    @action(detail=False)
    def get_net_total(self, request):
        transactions = self.queryset.filter(user=request.user, date__gte=request.user.date_joined.date())
        total = 0
        total -= transactions.filter(tr_type="Expense").aggregate(Sum('amt'))['amt__sum'] or 0
        total += transactions.filter(tr_type="Income").aggregate(Sum('amt'))['amt__sum'] or 0
        return Response({"message": "retrieved total successfully",
                         "total": total}, status=200)
    
    @action(detail=False)
    def get_categories_distribution(self, request):
        option = request.query_params.get('option')
        expenses = self.queryset.filter(user=request.user, tr_type="Expense")
        
        if option == "CurrentMonth" :
            expenses = expenses.filter(date__month=date.today().month, date__year=date.today().year)
        elif option == "CurrentYear" :
            expenses = expenses.filter(date__year=date.today().year)

        categories = list(expenses.values_list('category', flat=True).distinct())
        expense_amounts = []
        for category in categories:
            total_amount = expenses.filter(category=category).aggregate(Sum('amt'))['amt__sum']
            expense_amounts.append(total_amount)
        return Response({"categories": categories, 
                         "expenses" : expense_amounts}, status=200)
    
    @action(detail=False)
    def get_transactions_distribution(self, request):
        tr_type = request.query_params.get('tr_type')
        months = int(request.query_params.get('months'))

        current_month = date.today().replace(day=1)

        start_date = current_month - relativedelta(months=months - 1)

        transactions = self.queryset.filter(user=request.user, tr_type=tr_type, date__gte=start_date)
        transactions = transactions.annotate(month=TruncMonth('date')).values('month').annotate(total=Sum('amt'))

        labels = []
        amounts = []
     
        for i in range(months):
            month = current_month - relativedelta(months=months - 1 - i)
            amount =  transactions.get(month=month)['total'] if transactions.filter(month=month).exists() else 0
            labels.append(month.strftime('%B'))
            amounts.append(amount)
        
        return Response({"months": labels, "amounts": amounts}, status=200)



    
class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

    def create(self, request):
        request.data['user'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def list(self, request):
        budget = self.queryset.filter(user=request.user, month=date.today().month).first()
        if budget :
            serializer = self.get_serializer(budget)
            return Response(serializer.data, status=200)
        else:
            return Response([], status=204)
    
    def partial_update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)