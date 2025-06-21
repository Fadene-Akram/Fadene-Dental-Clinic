from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    USER_ROLES = (
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
    )
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    security_question = models.CharField(max_length=255)
    security_answer = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=USER_ROLES)

    def save(self, *args, **kwargs):
        if not self.pk:  # Only for new records
            if not self.password.startswith('pbkdf2_sha256$'):
                self.password = make_password(self.password)
            if not self.security_answer.startswith('pbkdf2_sha256$'):
                self.security_answer = make_password(self.security_answer)
                
        super().save(*args, **kwargs)

    class Meta:
        db_table = "users"
