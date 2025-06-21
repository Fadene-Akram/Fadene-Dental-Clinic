from rest_framework import serializers
from .models import Expense

class ExpenseFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'name', 'amount', 'date', 'type']
