from rest_framework import serializers
from django.contrib.auth.hashers import make_password,check_password
from .models import User

class RegisterUserSerializer(serializers.ModelSerializer):
    security_question = serializers.CharField(max_length=255)  
    security_answer = serializers.CharField(write_only=True)  
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.USER_ROLES)

    class Meta:
        model = User
        fields = ["id", "username", "password", "security_question", "security_answer", "role"]

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        validated_data["security_answer"] = make_password(validated_data["security_answer"])
        user = User.objects.create(**validated_data)
        return user


# Serializer for login
class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    
# Serializer for getting security question
class SecurityQuestionSerializer(serializers.Serializer):
    username = serializers.CharField()



# Serializer for password reset
class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    security_answer = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        try:
            user = User.objects.get(username=data["username"])
            if not check_password(data["security_answer"], user.security_answer):
                raise serializers.ValidationError({"security_answer": "Incorrect security answer"})
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User not found"})
        return data