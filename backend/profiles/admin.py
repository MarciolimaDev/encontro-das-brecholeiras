from django.contrib import admin

from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("customer", "cpf", "birth_date", "whatsapp", "gender")
    list_filter = ("gender",)
    search_fields = ("customer__email", "customer__first_name", "customer__last_name", "cpf", "whatsapp")
    autocomplete_fields = ("customer",)
