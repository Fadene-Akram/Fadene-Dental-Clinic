from django.db import models



class Expense(models.Model):
    class ExpenseType(models.TextChoices):
        LABORATORY = "laboratory"
        CONSUMABLES = "consumables"
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    type = models.CharField(max_length=20, choices=ExpenseType.choices)
    
    def __str__(self):
        return f"{self.name} - {self.amount}"
    

    