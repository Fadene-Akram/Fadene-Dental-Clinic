from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Patient
from .serializers import PatientSerializer,PatientFetchSerializer
from django.db.models import Q
from datetime import datetime


@api_view(['GET'])
def patient_list(request):
    # Query parameters
    search_term = request.query_params.get('searchTerm', '')
    start_date = request.query_params.get('startDate')
    end_date = request.query_params.get('endDate')
    gender = request.query_params.get('gender', 'All')
    age_group = request.query_params.get('age', 'All Ages')
    page = int(request.query_params.get('page', 1))
    limit = int(request.query_params.get('limit', 8))

    # Start with all patients
    queryset = Patient.objects.all()

    # Search filter
    if search_term:
        queryset = queryset.filter(
            Q(full_name__icontains=search_term) | 
            Q(phone_number__icontains=search_term)
        )

    # Gender filter
    if gender != 'All':
        gender_map = {
            'Male': 'M',
            'Female': 'F',
        }
        queryset = queryset.filter(gender=gender_map.get(gender, gender))

    # Age group filter
    if age_group != 'All Ages':
        current_year = datetime.now().year
        if age_group == 'Children':
            queryset = queryset.filter(age__lt=18)
        elif age_group == 'Adult':
            queryset = queryset.filter(age__gte=18, age__lt=60)
        elif age_group == 'Elderly':
            queryset = queryset.filter(age__gte=60)

    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        queryset = queryset.filter(registration_date__date__gte=start_date)

    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        queryset = queryset.filter(registration_date__date__lte=end_date)

    # Pagination
    total_patients = queryset.count()
    total_pages = (total_patients + limit - 1) // limit
    
    # Calculate offset and limit
    offset = (page - 1) * limit
    queryset = queryset[offset:offset+limit]

    # Serialize the data
    serializer = PatientFetchSerializer(queryset, many=True)

    # Prepare response
    return Response({
        'patients': serializer.data,
        'totalPages': total_pages,
        'currentPage': page,
        'totalPatients': total_patients
    })



@api_view(['POST'])
def add_patient(request):
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_patient(request, patient_id):

    try:
        patient = Patient.objects.get(id=patient_id)
        patient.delete()
        return Response({"message": "Patient deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['PUT'])
def edit_patient(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PatientSerializer(patient, data=request.data, partial=True)  # Allow partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def Appointment_patient_list(request):
    queryset = Patient.objects.all()
    serializer = PatientFetchSerializer(queryset, many=True)

    return Response({'patients': serializer.data})  