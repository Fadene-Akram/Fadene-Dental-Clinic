from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Expense
from .serializers import ExpenseFetchSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.db.models import Sum


class ExpensePagination(PageNumberPagination):
    page_size = 6  # Set items per page
    page_size_query_param = 'itemsPerPage'  # Allow the client to override this with a query parameter
    max_page_size = 100  # Optional, limit max items per page

@api_view(['GET'])
def get_laboratory_expenses(request):
    queryset = Expense.objects.filter(type=Expense.ExpenseType.LABORATORY).order_by('-date')
    paginator = ExpensePagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = ExpenseFetchSerializer(result_page, many=True)

    return paginator.get_paginated_response({
        'laboratory_expenses': serializer.data
    })


@api_view(['GET'])
def get_consumable_expenses(request):
    queryset = Expense.objects.filter(type=Expense.ExpenseType.CONSUMABLES).order_by('-date')
    paginator = ExpensePagination()
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = ExpenseFetchSerializer(result_page, many=True)

    return paginator.get_paginated_response({
        'consumable_expenses': serializer.data
    })


@api_view(['POST'])
def create_expense(request):

    if request.method == 'POST':
        # Map incoming type to model type
        type = request.data.get('type')
        if type not in ['laboratory', 'consumables']:
            return Response({"detail": "Invalid expense type"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new Expense object
        expense = Expense(
            name=request.data.get('name'),
            amount=request.data.get('amount'),
            date=request.data.get('date'),
            type=type
        )

        # Save the expense
        expense.save()

        # Return the newly created expense data
        serializer = ExpenseFetchSerializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

@api_view(['GET'])
def get_expense_summary(request):
    """
    Get summary information for the expense dashboard:
    - Total expenses value
    - Total number of expenses
    - Total laboratory expenses value
    - Total consumable expenses value
    """
    # Calculate total expenses value
    total_amount = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
    
    # Count total number of expenses
    total_count = Expense.objects.count()
    
    # Calculate total laboratory expenses
    lab_amount = Expense.objects.filter(
        type=Expense.ExpenseType.LABORATORY
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Calculate total consumable expenses
    consumable_amount = Expense.objects.filter(
        type=Expense.ExpenseType.CONSUMABLES
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    return Response({
        'total_expenses': float(total_amount),
        'total_count': total_count,
        'laboratory_expenses': float(lab_amount),
        'consumable_expenses': float(consumable_amount)
    })