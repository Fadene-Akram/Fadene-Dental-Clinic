from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Scheduled', 'Scheduled'),
        ('In_Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    due_date = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['status', 'due_date', 'created_at']