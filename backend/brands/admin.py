from django.contrib import admin

from .models import Brand, Segment


@admin.register(Segment)
class SegmentAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "segment", "status", "instagram")
    list_filter = ("status", "segment")
    search_fields = ("name", "owner__email", "owner__first_name", "owner__last_name", "instagram")
    autocomplete_fields = ("owner", "segment")
