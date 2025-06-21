from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'date', 'start_time', 'duration', 'paid_amount', 'remaining_amount','description')
    search_fields = ('patient__full_name', 'date')
    list_filter = ('date',)
