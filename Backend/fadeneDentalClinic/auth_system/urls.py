from django.urls import path
from .views import login_user, register_user, reset_password ,get_security_question

urlpatterns = [
    path("login/", login_user, name="login"),
    path("register/", register_user, name="register"),
    path("get_security_question/", get_security_question, name="get_security_question"),
    path("reset_password/", reset_password, name="reset_password"),
]