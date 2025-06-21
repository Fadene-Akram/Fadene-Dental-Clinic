from django.urls import path
from .views import get_laboratory_expenses, get_consumable_expenses,create_expense,get_expense_summary

urlpatterns = [
    path('laboratory-expenses/', get_laboratory_expenses, name='laboratory_expenses'),
    path('consumables-expenses/', get_consumable_expenses, name='consumables_expenses'),
    path('create/', create_expense, name='create_expense'),
    path('summary/', get_expense_summary, name='expense_summary')
]