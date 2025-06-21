from django.db import models
from patients.models import Patient

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")  
    date = models.DateField()
    start_time = models.TimeField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes")  
    description = models.TextField(blank=True, null=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        db_table = 'appointment'  

    def __str__(self):
        return f"Appointment for {self.patient.full_name} on {self.date} at {self.start_time}"
