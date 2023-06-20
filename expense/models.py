from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    starting_amt = models.DecimalField(default=0, max_digits=12, decimal_places=2)


