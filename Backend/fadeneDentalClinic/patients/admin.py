from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'id', 'age', 'date_of_birth', 'phone_number', 'gender', 'registration_date')
    search_fields = ('full_name', 'phone_number')
    list_filter = ('gender', 'registration_date')

