from django.contrib import admin

from .models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("customer", "cep", "street", "number", "neighborhood", "city", "uf")
    list_filter = ("uf", "city")
    search_fields = ("customer__email", "customer__first_name", "customer__last_name", "cep", "street", "city")
    autocomplete_fields = ("customer",)
