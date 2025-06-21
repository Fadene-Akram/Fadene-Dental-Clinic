from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password,make_password
import secrets
from django.core.cache import cache
from .models import User
from .serializers import (
    RegisterUserSerializer,
    LoginUserSerializer,
    ResetPasswordSerializer,
    SecurityQuestionSerializer,
)

# Register API
@api_view(["POST"])
def register_user(request):
    # Extract role from request data
    role = request.data.get("role", "").lower()

    # Prevent multiple doctors but allow multiple nurses
    if role == "doctor" and User.objects.filter(role="doctor").exists():
        return Response(
            {"status": "error", "message": "Sign-up is disabled. Only one doctor is allowed."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success", "message": "User registered successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login API
@api_view(["POST"])
def login_user(request):
    serializer = LoginUserSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                token = secrets.token_hex(32)
                cache.set(f"user_token_{user.id}", token, timeout=86400)
                return Response(
                    {"status": "success", "message": "Login successful", "token": token ,"role": user.role},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": "error", "message": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except User.DoesNotExist:
            return Response({"status": "error", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Forgot Password API
@api_view(["POST"])
def reset_password(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(username=serializer.validated_data["username"])
        user.password = make_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"status": "success", "message": "Password reset successful"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get Security Question API
@api_view(["POST"])
def get_security_question(request):
    serializer = SecurityQuestionSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = User.objects.get(username=serializer.validated_data["username"])
            return Response({"status": "success", "security_question": user.security_question}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
