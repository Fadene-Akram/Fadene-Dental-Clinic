from django.urls import path
from .views import add_patient,patient_list,delete_patient,edit_patient,Appointment_patient_list
from appointments.views import patient_summary,patient_consultations

urlpatterns = [
    path('add/', add_patient, name='add_patient'),
    path('get_patients/', patient_list, name='patient_list'),
    path('delete/<int:patient_id>/', delete_patient, name='delete_patient'),
    path('edit/<int:patient_id>/', edit_patient, name='edit_patient'),
    path('summary/<int:patient_id>/', patient_summary, name='patient_summary'),
    path('consultations/<int:patient_id>/', patient_consultations, name='patient_consultations'),
    path('appointment_patient_list/', Appointment_patient_list, name='appointment_patient_list'),


]