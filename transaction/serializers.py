from rest_framework import serializers
from .models import User, Transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'starting_amt', 'date_joined']

    def create(self, validated_data):
        user = super().create(validated_data)
        password = validated_data.get('password')
        user.set_password(password)
        user.save()
        return user

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'