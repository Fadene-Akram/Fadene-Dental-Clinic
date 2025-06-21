from django.urls import path
from .views import get_appointments,create_appointment,update_appointment ,delete_appointment

urlpatterns = [
    path('', get_appointments, name='appointment-list'),
    path('create/', create_appointment, name='appointment-create'),
    path('update/', update_appointment, name='appointment-update'),
    path('delete/<int:appointment_id>/', delete_appointment, name='appointment-delete'),
]