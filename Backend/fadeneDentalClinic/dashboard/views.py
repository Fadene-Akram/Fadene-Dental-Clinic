from datetime import datetime, timedelta
from django.db.models import Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response
from appointments.models import Appointment
from expenses.models import Expense
from patients.models import Patient
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.utils.timezone import now
from calendar import monthrange

@api_view(['GET'])
def monthly_report(request):
    now_date = now().date()
    first_day_of_month = datetime(now_date.year, now_date.month, 1).date()
    last_day_of_month = datetime(now_date.year, now_date.month, monthrange(now_date.year, now_date.month)[1]).date()

    total_revenue = Appointment.objects.filter(date__gte=first_day_of_month, date__lte=last_day_of_month).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
    total_remaining = Appointment.objects.filter(date__gte=first_day_of_month, date__lte=last_day_of_month).aggregate(Sum('remaining_amount'))['remaining_amount__sum'] or 0
    total_expenses = Expense.objects.filter(date__gte=first_day_of_month, date__lte=last_day_of_month).aggregate(Sum('amount'))['amount__sum'] or 0
    total_working_time = Appointment.objects.filter(date__gte=first_day_of_month, date__lte=last_day_of_month).aggregate(Sum('duration'))['duration__sum'] or 0

    return Response({
        'total_expenses': total_expenses,
        'total_remaining_current_month': total_remaining,
        'total_revenue_current_month': total_revenue,
        'total_working_time_current_month': total_working_time
    })


@require_GET
def patient_population(request):
    period = request.GET.get('period', 'Week').capitalize()  # Normalize case

    def get_age_category(age):
        if age < 18:
            return 'children'
        elif age < 60:
            return 'adults'
        else:
            return 'elderly'

    today = now().date()
    result = []

    if period == 'Week':
        # Get the most recent Sunday as the start of the current week
        start_date = today - timedelta(days=today.weekday() + 1 if today.weekday() != 6 else 0)
        end_date = start_date + timedelta(days=6)

        # Generate labels for each day (Sun-Sat)
        date_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        result = [{ 'period': date_labels[i], 'children': 0, 'adults': 0, 'elderly': 0 } for i in range(7)]

        patients = Patient.objects.filter(registration_date__date__gte=start_date, registration_date__date__lte=end_date)

        for patient in patients:
            day_index = (patient.registration_date.date() - start_date).days
            age_category = get_age_category(patient.age)
            if 0 <= day_index < 7:
                result[day_index][age_category] += 1

    elif period == 'Month':
        first_day_of_month = datetime(today.year, today.month, 1).date()
        last_day_of_month = datetime(today.year, today.month, monthrange(today.year, today.month)[1]).date()

        result = [
            {'period': 'Week 1', 'children': 0, 'adults': 0, 'elderly': 0},
            {'period': 'Week 2', 'children': 0, 'adults': 0, 'elderly': 0},
            {'period': 'Week 3', 'children': 0, 'adults': 0, 'elderly': 0},
            {'period': 'Week 4', 'children': 0, 'adults': 0, 'elderly': 0}
        ]

        patients = Patient.objects.filter(registration_date__date__gte=first_day_of_month, registration_date__date__lte=last_day_of_month)

        for patient in patients:
            week_index = min(3, (patient.registration_date.day - 1) // 7)
            age_category = get_age_category(patient.age)
            result[week_index][age_category] += 1

    elif period == 'Year':
        first_day_of_year = datetime(today.year, 1, 1).date()
        last_day_of_year = datetime(today.year, 12, 31).date()

        # Create a result list for each month
        month_labels = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        result = [{'period': month, 'children': 0, 'adults': 0, 'elderly': 0} for month in month_labels]

        patients = Patient.objects.filter(registration_date__date__gte=first_day_of_year, registration_date__date__lte=last_day_of_year)

        for patient in patients:
            month_index = patient.registration_date.month - 1  # 0-based index for January-December
            age_category = get_age_category(patient.age)
            result[month_index][age_category] += 1

    else:
        result = [{'period': 'Default', 'children': 0, 'adults': 0, 'elderly': 0}]

    return JsonResponse({'data': result})


@api_view(['GET'])
def revenue_expenses_view(request, filter_type):
    today = now().date()

    time_period_data = {
        "revenue": [],
        "total_expenses": [],
        "labels": [],
    }

    if filter_type == "Week":
        # Find the most recent Sunday (start of the current week)
        start_date = today - timedelta(days=today.weekday() + 1 if today.weekday() != 6 else 0)
        end_date = start_date + timedelta(days=6)

        date_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        for i in range(7):
            day = start_date + timedelta(days=i)
            revenue = Appointment.objects.filter(date__gte=day, date__lt=day + timedelta(days=1)).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
            total_expenses = Expense.objects.filter(date__gte=day, date__lt=day + timedelta(days=1)).aggregate(Sum('amount'))['amount__sum'] or 0
            
            time_period_data["revenue"].append(float(revenue))
            time_period_data["total_expenses"].append(float(total_expenses))
            time_period_data["labels"].append(date_labels[i])

    elif filter_type == "Month":
        first_day_of_month = datetime(today.year, today.month, 1).date()
        last_day_of_month = datetime(today.year, today.month, monthrange(today.year, today.month)[1]).date()

        week_boundaries = [
            {'label': 'Week 1', 'start': first_day_of_month, 'end': first_day_of_month + timedelta(days=6)},
            {'label': 'Week 2', 'start': first_day_of_month + timedelta(days=7), 'end': first_day_of_month + timedelta(days=13)},
            {'label': 'Week 3', 'start': first_day_of_month + timedelta(days=14), 'end': first_day_of_month + timedelta(days=20)},
            {'label': 'Week 4', 'start': first_day_of_month + timedelta(days=21), 'end': last_day_of_month}
        ]

        for week in week_boundaries:
            revenue = Appointment.objects.filter(date__gte=week['start'], date__lte=week['end']).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
            total_expenses = Expense.objects.filter(date__gte=week['start'], date__lte=week['end']).aggregate(Sum('amount'))['amount__sum'] or 0
            
            time_period_data["revenue"].append(float(revenue))
            time_period_data["total_expenses"].append(float(total_expenses))
            time_period_data["labels"].append(week['label'])

    elif filter_type == "Year":
        first_day_of_year = datetime(today.year, 1, 1).date()
        last_day_of_year = datetime(today.year, 12, 31).date()

        for month in range(1, 13):
            start_of_month = datetime(today.year, month, 1).date()
            end_of_month = datetime(today.year, month, monthrange(today.year, month)[1]).date()

            revenue = Appointment.objects.filter(date__gte=start_of_month, date__lte=end_of_month).aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
            total_expenses = Expense.objects.filter(date__gte=start_of_month, date__lte=end_of_month).aggregate(Sum('amount'))['amount__sum'] or 0
            
            time_period_data["revenue"].append(float(revenue))
            time_period_data["total_expenses"].append(float(total_expenses))
            time_period_data["labels"].append(start_of_month.strftime('%B'))  # January, February, etc.

    else:
        return Response({"error": "Invalid filter type"}, status=400)

    return Response(time_period_data)


@api_view(['GET'])
def get_patient_gender_count(request):
    male_count = Patient.objects.filter(gender='M').count()
    female_count = Patient.objects.filter(gender='F').count()

    return Response({
        'male_count': male_count,
        'female_count': female_count,
    })
