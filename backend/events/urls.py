from django.urls import path

from . import views

urlpatterns = [
    path("events/", views.public_events, name="public-events"),
    path("events/<slug:slug>/", views.public_event_detail, name="public-event-detail"),
    path("products/", views.public_products, name="public-products"),
    path("products/<int:product_id>/", views.public_product_detail, name="public-product-detail"),
    path("featured-brands/", views.public_featured_brands, name="public-featured-brands"),
    path("brecholeiras/", views.public_brecholeiras, name="public-brecholeiras"),
]
