from rest_framework import serializers
from .models import Task
from django.utils import timezone

class TaskSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'due_date', 'color', 'created_at', 'updated_at']
    
    def validate_due_date(self, value):
        """
        Check that the due date is not in the past if provided.
        """
        if value and value < timezone.now().date():
            raise serializers.ValidationError("Due date cannot be in the past")
        return value