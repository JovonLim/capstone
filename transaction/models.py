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
    description = models.CharField(max_length=30, blank=True, default="")
    category = models.CharField(max_length=30, default="Others")
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user}'s {self.tr_type} : {self.amt} on {self.category}"