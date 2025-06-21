from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'amount', 'date', 'type']
    search_fields = ['name', 'type']
    list_filter = ['type', 'date']
