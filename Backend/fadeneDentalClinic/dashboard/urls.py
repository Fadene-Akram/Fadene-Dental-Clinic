from django.urls import path
from .views import monthly_report,patient_population,revenue_expenses_view,get_patient_gender_count


urlpatterns = [
    path('monthly_report/', monthly_report, name='monthly_report' ),
    path('patient_population/', patient_population, name='patient_population' ),
    path('revenue_expenses/<str:filter_type>/', revenue_expenses_view, name='revenue_expenses'),
    path('get_patient_gender_count',get_patient_gender_count,name='get_patient_gender_count')
]