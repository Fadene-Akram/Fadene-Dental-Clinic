from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils.dateparse import parse_date
from datetime import timedelta,datetime
from .models import Appointment, Patient
from .serializers import AppointmentSerializer

@api_view(['GET'])
def patient_summary(request, patient_id):
    """
    API endpoint to retrieve a summary of a patient's appointments.
    This endpoint calculates and returns the total paid amount, total remaining amount, 
    and the total number of appointments for a specific patient.
    Args:
        request (HttpRequest): The HTTP request object.
        patient_id (int): The ID of the patient whose appointment summary is being retrieved.
    Returns:
        Response: A JSON response containing:
            - totalPaidAmount (float): The total amount paid by the patient.
            - totalRemainingAmount (float): The total remaining amount owed by the patient.
            - totalConsultaion (int): The total number of appointments for the patient.
    """
    
    appointments = Appointment.objects.filter(patient_id=patient_id)
    
    # Add some debug printing
    print(f"Patient ID: {patient_id}")
    print(f"Number of appointments: {appointments.count()}")
    
    total_paid = sum(appointment.paid_amount for appointment in appointments)
    total_remaining = sum(appointment.remaining_amount for appointment in appointments)
    total_appointments = appointments.count()
    
    return Response({
        'totalPaidAmount': total_paid,  # Match the keys in your frontend
        'totalRemainingAmount': total_remaining,
        'totalConsultaion': total_appointments  # Note the typo in 'Consultaion'
    })


@api_view(['GET'])
def patient_consultations(request, patient_id):
    """
    API endpoint to retrieve a list of consultations for a specific patient.
    This endpoint returns details of all appointments for the patient, including
    date, time, cost, description, paid amount, and remaining amount.

    Args:
        request (HttpRequest): The HTTP request object.
        patient_id (int): The ID of the patient whose consultations are being retrieved.

    Returns:
        Response: A JSON response containing a list of consultations with:
            - date (str): The date of the appointment (formatted as YYYY-MM-DD).
            - time (str): The time of the appointment (formatted as HH:MM AM/PM).
            - cost (float): The total cost of the appointment.
            - description (str): The description of the appointment.
            - paid (float): The amount paid for the appointment.
            - remaining (float): The remaining amount owed for the appointment.
    """
    consultations = Appointment.objects.filter(patient_id=patient_id).order_by('-date')
    
    consultation_list = [
        {
            'date': appointment.date.strftime('%Y-%m-%d'),  # Format date as string
            'time': appointment.start_time.strftime('%I:%M %p'),  # Format time as string
            'cost': float(appointment.paid_amount + appointment.remaining_amount),  # Total cost
            'description': appointment.description or '',
            'paid': float(appointment.paid_amount),
            'remaining': float(appointment.remaining_amount)
        } for appointment in consultations
    ]
    
    return Response(consultation_list)


@api_view(['GET'])
def get_appointments(request):
    """
    API Endpoint: Get Appointments
    This API endpoint retrieves a list of appointments based on the specified view type 
    (day, week, or month) and a base date provided as query parameters.
    Parameters:
        - request (HttpRequest): The HTTP request object containing query parameters.
        - view (str, optional): The type of view to filter appointments. 
          Accepted values are 'day', 'week', or 'month'. Defaults to 'day'.
        - date (str, required): The base date for filtering appointments in the format 'YYYY-MM-DD'.
    Returns:
        - Response: A JSON response containing a list of serialized appointments 
          ordered by date and start time, or an error message with an appropriate HTTP status code.
    Raises:
        - HTTP 400 Bad Request: If the 'date' parameter is missing or invalid.
        - HTTP 400 Bad Request: If the 'view' parameter is invalid.
    Filtering Logic:
        - 'day': Fetches appointments for the specified date.
        - 'week': Fetches appointments from the Sunday before the base date to the following Saturday.
        - 'month': Fetches appointments for the specified month and year.
    """
    view = request.query_params.get('view', 'day')
    date_str = request.query_params.get('date')
    
    if not date_str:
        return Response(
            {"error": "Date parameter is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        base_date = parse_date(date_str)
        if not base_date:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    except ValueError:
        return Response(
            {"error": "Invalid date"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Filter appointments based on view type
    if view == 'day':
        queryset = Appointment.objects.filter(date=base_date)
    elif view == 'week':
        # Adjust logic to fetch from Sunday before base_date to Saturday
        days_since_sunday = base_date.weekday() + 1 if base_date.weekday() < 6 else 0
        start_of_week = base_date - timedelta(days=days_since_sunday)
        end_of_week = start_of_week + timedelta(days=6)

        queryset = Appointment.objects.filter(
            date__range=[start_of_week, end_of_week]
        )
    elif view == 'month':
        queryset = Appointment.objects.filter(
            date__year=base_date.year,
            date__month=base_date.month
        )
    else:
        return Response(
            {"error": "Invalid view type. Use 'day', 'week', or 'month'"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Order appointments by date and time
    queryset = queryset.order_by('date', 'start_time')
    
    # Serialize and return
    serializer = AppointmentSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_appointment(request):
    """
    API Endpoint: Create a new appointment.
    This function handles the creation of a new appointment while ensuring 
    that there are no time conflicts with existing appointments. It validates 
    the input data, checks for overlapping time slots, and saves the appointment 
    if no conflicts are found.
    Args:
        request (HttpRequest): The HTTP request object containing appointment 
        details in the request data.
    Returns:
        Response: 
            - HTTP 201 Created: If the appointment is successfully created.
            - HTTP 400 Bad Request: If the input data is invalid or there is a 
              time conflict with an existing appointment.
    Request Data:
        - date (str): The date of the appointment in "YYYY-MM-DD" format.
        - start_time (str): The start time of the appointment in "HH:MM:SS" format.
        - duration (int): The duration of the appointment in minutes.
    Response:
        - On success: Returns the serialized appointment data.
        - On failure: Returns an error message indicating the issue.
    """
    print(f"Request data: {request.data}")
    serializer = AppointmentSerializer(data=request.data)
    
    if serializer.is_valid():
        # Extract appointment details from validated data
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['start_time']
        duration = serializer.validated_data['duration']
        
        # Combine date and time to create datetime objects
        start_datetime_str = f"{date} {start_time}"
        start_datetime = datetime.strptime(start_datetime_str, "%Y-%m-%d %H:%M:%S")
        end_datetime = start_datetime + timedelta(minutes=duration)
        
        # Check for overlapping appointments
        existing_appointments = Appointment.objects.filter(date=date)
        for existing_appointment in existing_appointments:
            existing_start_str = f"{date} {existing_appointment.start_time}"
            existing_start = datetime.strptime(existing_start_str, "%Y-%m-%d %H:%M:%S")
            existing_end = existing_start + timedelta(minutes=existing_appointment.duration)
            
            # Check if appointments overlap
            if (start_datetime < existing_end and end_datetime > existing_start):
                return Response(
                    {"error": f"Time slot conflicts with an existing appointment for {existing_appointment.patient.full_name} at {existing_appointment.start_time}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # If no conflicts, save the appointment
        appointment = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_appointment(request):
    """
    API Endpoint to update an existing appointment.
    This endpoint allows updating the details of an existing appointment by providing the appointment ID 
    and other fields to be updated. It also validates the patient information by their full name.
    Args:
        request (Request): The HTTP request object containing the data to update the appointment.
    Request Body:
        - id (int): The ID of the appointment to be updated. (Required)
        - patient (str): The full name of the patient associated with the appointment. (Required)
        - Other fields: Any other fields of the appointment model that need to be updated.
    Returns:
        Response: 
            - 200 OK: If the appointment is successfully updated, returns the updated appointment data.
            - 400 Bad Request: If required fields are missing or invalid data is provided.
            - 404 Not Found: If the appointment or patient does not exist.
    Raises:
        Appointment.DoesNotExist: If the appointment with the given ID is not found.
        Patient.DoesNotExist: If the patient with the given full name is not found.
    """


    appointment_id = request.data.get('id') 
    if not appointment_id:
        return Response({"error": "Appointment ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure `patient` full name is provided
    patient_fullname = request.data.get("patient")
    print(f"Patient Full Name: {patient_fullname}")
    if not patient_fullname:
        return Response({"error": "Patient full name is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate and fetch the patient by full name
    try:
        patient = Patient.objects.get(full_name=patient_fullname)
        print(f"Patient ID: {patient.id}")
        request.data['patient_id'] = patient.id  # Add patient ID to the request data
    except Patient.DoesNotExist:
        return Response({"error": "Invalid patient full name"}, status=status.HTTP_400_BAD_REQUEST)

    # Update appointment fields
    print(f"Request data: {request.data}")
    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    print(serializer.is_valid())
    print(serializer.errors)
    if serializer.is_valid():
        serializer.save()  # Save with the updated patient ID
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_appointment(request, appointment_id):
    """
    API Endpoint: Delete an Appointment
    This endpoint deletes an appointment by its ID.
    Args:
        request (HttpRequest): The HTTP request object.
        appointment_id (int): The ID of the appointment to be deleted.
    Returns:
        Response: 
            - 204 No Content: If the appointment is successfully deleted.
            - 404 Not Found: If the appointment with the given ID does not exist.
    """
    
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        print(f"Deleting appointment: {appointment}")
        appointment.delete()
        return Response(
            {"message": "Appointment deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
