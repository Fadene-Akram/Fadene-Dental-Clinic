from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from patients.models import Patient

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), 
        source='patient', 
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id', 
            'patient', 
            'patient_id', 
            'date', 
            'start_time', 
            'duration', 
            'description', 
            'paid_amount', 
            'remaining_amount'
        ]

    def to_representation(self, instance):
        """
        Customize the representation to match the frontend component's expected format
        """
        representation = super().to_representation(instance)
        representation.update({
            'time': instance.start_time.strftime('%I:%M %p'),
            'patient': instance.patient.full_name,
            'paid': float(instance.paid_amount),
            'remaining': float(instance.remaining_amount)
        })
        return representation