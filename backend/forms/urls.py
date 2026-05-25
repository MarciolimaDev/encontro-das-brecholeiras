from django.urls import path

from .views import create_member_application

app_name = "forms"

urlpatterns = [
    path("member-applications/", create_member_application, name="member-application-create"),
]
