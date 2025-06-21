from rest_framework.permissions import BasePermission

class IsDoctor(BasePermission):
    """
    Grants access only to doctors.
    """
    def has_permission(self, request, view):
        return request.user.role == "doctor"


class IsDoctorOrNurse(BasePermission):
    """
    Doctors have full access, nurses have restricted access.
    """
    def has_permission(self, request, view):
        return request.user.role in ["doctor", "nurse"]
