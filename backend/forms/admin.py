from django.contrib import admin

from .models import MemberApplication


@admin.register(MemberApplication)
class MemberApplicationAdmin(admin.ModelAdmin):
    list_display = ("customer", "brand", "status", "data_consent", "communication_consent", "created_at")
    list_filter = ("status", "data_consent", "communication_consent", "prohibition_acknowledgement", "created_at")
    search_fields = ("customer__email", "customer__first_name", "customer__last_name", "brand__name")
    autocomplete_fields = ("customer", "brand")
    readonly_fields = ("created_at", "updated_at")
