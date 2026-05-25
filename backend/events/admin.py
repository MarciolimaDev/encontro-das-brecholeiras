from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "event_type", "location", "start_date", "end_date", "status", "is_featured")
    list_filter = ("event_type", "status", "is_featured", "registration_open", "start_date")
    search_fields = ("title", "description", "location", "city", "uf")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("public_id", "created_at", "updated_at")
