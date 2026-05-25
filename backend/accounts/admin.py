from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    model = Customer
    ordering = ("email",)
    list_display = ("email", "public_id", "first_name", "last_name", "role", "is_active", "is_staff", "date_joined")
    list_filter = ("role", "is_active", "is_staff", "is_superuser", "groups")
    search_fields = ("email", "first_name", "last_name")

    fieldsets = (
        (None, {"fields": ("email", "public_id", "password")}),
        ("Dados pessoais", {"fields": ("first_name", "last_name", "role")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Datas importantes", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "first_name", "last_name", "role", "password1", "password2"),
            },
        ),
    )
    readonly_fields = ("public_id", "last_login", "date_joined")
