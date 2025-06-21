from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'





class PatientFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id', 
            'full_name', 
            'age', 
            'date_of_birth', 
            'phone_number', 
            'gender', 
            'registration_date'
        ]