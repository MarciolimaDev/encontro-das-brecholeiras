from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Event
from products.models import Product
from brands.models import Brand


def corrected_banner_name(event):
    if not event.banner:
        return ""

    banner_name = event.banner.name
    if banner_name.lower().endswith(".avif"):
        webp_name = f"{banner_name[:-5]}.webp"
        if event.banner.storage.exists(webp_name):
            return webp_name

    return banner_name


def event_banner_url(event, request):
    banner_name = corrected_banner_name(event)
    if not banner_name:
        return ""

    return request.build_absolute_uri(event.banner.storage.url(banner_name))


def serialize_public_event(event, request):
    start_date = timezone.localtime(event.start_date)
    end_date = timezone.localtime(event.end_date)

    return {
        "id": str(event.public_id),
        "title": event.title,
        "slug": event.slug,
        "description": event.description,
        "event_type": event.event_type,
        "event_type_label": event.get_event_type_display(),
        "location": event.location,
        "city": event.city,
        "uf": event.uf,
        "location_label": ", ".join(part for part in [event.location, event.city, event.uf] if part),
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "start_date_label": start_date.strftime("%d/%m/%Y %H:%M"),
        "end_date_label": end_date.strftime("%d/%m/%Y %H:%M"),
        "day": start_date.strftime("%d"),
        "month": start_date.strftime("%b").replace(".", "").upper(),
        "status": event.status,
        "status_label": event.get_status_display(),
        "is_featured": event.is_featured,
        "registration_open": event.registration_open,
        "banner": event_banner_url(event, request),
    }


def serialize_public_product(product, request):
    brand = product.brand
    owner = brand.owner
    profile = owner.profile if hasattr(owner, "profile") else None
    address = owner.addresses.first()
    products_count = getattr(product, "active_products_count", None)

    return {
        "id": product.id,
        "title": product.title,
        "description": product.description,
        "price": f"R$ {product.price:.2f}".replace(".", ","),
        "status": product.status,
        "status_label": product.get_status_display(),
        "image": request.build_absolute_uri(product.photo.url) if product.photo else "",
        "category": {
            "id": product.category_id,
            "name": product.category.name if product.category else "",
        },
        "brand": {
            "name": brand.name,
            "slug": brand.slug,
            "instagram": brand.instagram,
            "description": brand.description,
            "logo": request.build_absolute_uri(brand.logo.url) if brand.logo else "",
            "segment": brand.segment.name,
            "products_count": products_count if products_count is not None else brand.products.filter(status=Product.Status.ACTIVE).count(),
            "city": address.city if address else "",
            "uf": address.uf if address else "",
            "owner": {
                "name": f"{owner.first_name} {owner.last_name}".strip(),
                "profile_photo": request.build_absolute_uri(profile.profile_photo.url) if profile and profile.profile_photo else "",
            },
        },
    }


def serialize_featured_brand(brand, request):
    profile = brand.owner.profile if hasattr(brand.owner, "profile") else None

    return {
        "id": brand.id,
        "name": brand.name,
        "slug": brand.slug,
        "instagram": brand.instagram,
        "logo": request.build_absolute_uri(brand.logo.url) if brand.logo else "",
        "segment": brand.segment.name,
        "products_count": brand.active_products_count,
        "owner": {
            "name": f"{brand.owner.first_name} {brand.owner.last_name}".strip(),
            "profile_photo": request.build_absolute_uri(profile.profile_photo.url) if profile and profile.profile_photo else "",
        },
    }


def published_events_queryset():
    return Event.objects.filter(status=Event.Status.PUBLISHED).order_by("start_date", "title")


@api_view(["GET"])
@permission_classes([AllowAny])
def public_events(request):
    events = published_events_queryset()
    return Response({"events": [serialize_public_event(event, request) for event in events]})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_products(request):
    products = (
        Product.objects.select_related("brand", "brand__owner", "brand__owner__profile", "brand__segment", "category")
        .prefetch_related("brand__owner__addresses")
        .filter(status=Product.Status.ACTIVE, brand__status=Brand.Status.ACTIVE)
        .annotate(active_products_count=Count("brand__products", filter=Q(brand__products__status=Product.Status.ACTIVE)))
        .order_by("-created_at")
    )
    if request.query_params.get("limit") != "all":
        products = products[:8]
    return Response({"products": [serialize_public_product(product, request) for product in products]})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_featured_brands(request):
    brands = (
        Brand.objects.select_related("owner", "owner__profile", "segment")
        .filter(status=Brand.Status.ACTIVE)
        .annotate(active_products_count=Count("products", filter=Q(products__status=Product.Status.ACTIVE)))
        .filter(active_products_count__gt=0)
        .order_by("-active_products_count", "name")[:6]
    )
    return Response({"brands": [serialize_featured_brand(brand, request) for brand in brands]})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_brecholeiras(request):
    brands = (
        Brand.objects.select_related("owner", "owner__profile", "segment")
        .filter(status=Brand.Status.ACTIVE)
        .annotate(active_products_count=Count("products", filter=Q(products__status=Product.Status.ACTIVE)))
        .order_by("-active_products_count", "name")
    )
    return Response({"brands": [serialize_featured_brand(brand, request) for brand in brands]})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_event_detail(request, slug):
    try:
        event = published_events_queryset().get(slug=slug)
    except Event.DoesNotExist:
        return Response({"detail": "Evento não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"event": serialize_public_event(event, request)})


@api_view(["GET"])
@permission_classes([AllowAny])
def public_product_detail(request, product_id):
    try:
        product = (
            Product.objects.select_related("brand", "brand__owner", "brand__owner__profile", "brand__segment", "category")
            .prefetch_related("brand__owner__addresses")
            .annotate(active_products_count=Count("brand__products", filter=Q(brand__products__status=Product.Status.ACTIVE)))
            .get(pk=product_id, status=Product.Status.ACTIVE, brand__status=Brand.Status.ACTIVE)
        )
    except Product.DoesNotExist:
        return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"product": serialize_public_product(product, request)})
