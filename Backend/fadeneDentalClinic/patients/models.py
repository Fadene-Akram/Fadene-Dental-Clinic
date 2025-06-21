from django.db import models

class Patient(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    age = models.IntegerField()
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=15, unique=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    registration_date = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'patient'  

    def __str__(self):
        return self.full_name
