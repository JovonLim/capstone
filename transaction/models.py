from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class User(AbstractUser):
    starting_amt = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(Decimal('0.00'))])

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        expense = "Expense"
        income = "Income"
    amt = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    tr_type = models.CharField(max_length=7, choices=TransactionType.choices)
    category = models.CharField(max_length=30, default="Others")
    date = models.DateField(null=True)
