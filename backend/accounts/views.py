from io import BytesIO
from decimal import Decimal, InvalidOperation
from uuid import uuid4

from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from PIL import Image, ImageOps

from events.models import Event
from forms.models import MemberApplication
from brands.models import Brand, Segment
from products.models import Product, ProductCategory


def event_banner_url(event, request):
    if not event.banner:
        return ""

    banner_name = event.banner.name
    if banner_name.lower().endswith(".avif"):
        webp_name = f"{banner_name[:-5]}.webp"
        if event.banner.storage.exists(webp_name):
            return request.build_absolute_uri(event.banner.storage.url(webp_name))

    return request.build_absolute_uri(event.banner.url)


def serialize_customer(user):
    return {
        "id": str(user.public_id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role,
        "is_staff": user.is_staff,
    }


def is_admin_user(user):
    return user.is_staff or user.role in {
        user.Role.SUPER_ADMIN,
        user.Role.ADMIN,
    }


def serialize_pending_application(application):
    customer = application.customer
    profile = customer.profile if hasattr(customer, "profile") else None
    address = customer.addresses.first()

    return {
        "id": application.id,
        "name": f"{customer.first_name} {customer.last_name}".strip(),
        "brand": application.brand.name,
        "date": application.created_at.strftime("%d/%m/%Y"),
        "status": application.status,
        "customer": {
            "email": customer.email,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "cpf": profile.cpf if profile else "",
            "birth_date": profile.birth_date.isoformat() if profile else "",
            "whatsapp": profile.whatsapp if profile else "",
            "gender": profile.get_gender_display() if profile else "",
        },
        "address": {
            "cep": address.cep if address else "",
            "street": address.street if address else "",
            "number": address.number if address else "",
            "neighborhood": address.neighborhood if address else "",
            "city": address.city if address else "",
            "uf": address.uf if address else "",
            "complement": address.complement if address else "",
        },
        "brand_details": {
            "name": application.brand.name,
            "instagram": application.brand.instagram,
            "segment": application.brand.segment.name,
            "description": application.brand.description,
            "status": application.brand.status,
        },
        "application": {
            "activities_interest": application.activities_interest,
            "experience": application.experience,
            "exposition_structure": application.exposition_structure,
            "previous_fair": application.previous_fair,
            "prohibition_acknowledgement": application.prohibition_acknowledgement,
            "how_did_you_know": application.how_did_you_know,
            "data_consent": application.data_consent,
            "communication_consent": application.communication_consent,
        },
    }


def serialize_member(customer):
    profile = customer.profile if hasattr(customer, "profile") else None
    address = customer.addresses.first()
    brand = customer.brands.first()

    return {
        "id": str(customer.public_id),
        "name": f"{customer.first_name} {customer.last_name}".strip(),
        "email": customer.email,
        "role": customer.role,
        "role_label": customer.get_role_display(),
        "is_active": customer.is_active,
        "is_staff": customer.is_staff,
        "date_joined": customer.date_joined.strftime("%d/%m/%Y"),
        "profile": {
            "cpf": profile.cpf if profile else "",
            "whatsapp": profile.whatsapp if profile else "",
            "gender": profile.get_gender_display() if profile else "",
        },
        "address": {
            "city": address.city if address else "",
            "uf": address.uf if address else "",
        },
        "brand": {
            "name": brand.name if brand else "",
            "segment": brand.segment.name if brand else "",
            "status": brand.status if brand else "",
        },
    }


def serialize_brand(brand, request):
    owner = brand.owner
    profile = owner.profile if hasattr(owner, "profile") else None
    application = brand.member_applications.order_by("-created_at").first()

    return {
        "id": brand.id,
        "name": brand.name,
        "slug": brand.slug,
        "instagram": brand.instagram,
        "description": brand.description,
        "status": brand.status,
        "status_label": brand.get_status_display(),
        "segment": {
            "id": brand.segment_id,
            "name": brand.segment.name,
        },
        "owner": {
            "id": str(owner.public_id),
            "name": f"{owner.first_name} {owner.last_name}".strip() or owner.email,
            "email": owner.email,
            "whatsapp": profile.whatsapp if profile else "",
        },
        "logo": request.build_absolute_uri(brand.logo.url) if brand.logo else "",
        "products_count": brand.products.count() if hasattr(brand, "products") else 0,
        "application": {
            "id": application.id if application else None,
            "status": application.status if application else "",
            "status_label": application.get_status_display() if application else "",
            "created_at": application.created_at.strftime("%d/%m/%Y") if application else "",
            "activities_interest": application.activities_interest if application else "",
            "experience": application.experience if application else "",
            "exposition_structure": application.exposition_structure if application else "",
            "previous_fair": application.previous_fair if application else "",
            "prohibition_acknowledgement": application.prohibition_acknowledgement if application else False,
            "how_did_you_know": application.how_did_you_know if application else "",
            "data_consent": application.data_consent if application else False,
            "communication_consent": application.communication_consent if application else False,
        },
    }


def serialize_product(product, request):
    return {
        "id": product.id,
        "title": product.title,
        "description": product.description,
        "price": str(product.price),
        "status": product.status,
        "status_label": product.get_status_display(),
        "category": {
            "id": product.category_id,
            "name": product.category.name if product.category else "",
        },
        "photo": request.build_absolute_uri(product.photo.url) if product.photo else "",
        "created_at": product.created_at.strftime("%d/%m/%Y"),
    }


def serialize_product_category(category):
    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "is_active": category.is_active,
        "products_count": category.products.count() if hasattr(category, "products") else 0,
    }


def serialize_shop_brand(brand, request):
    owner = brand.owner
    profile = owner.profile if hasattr(owner, "profile") else None
    address = owner.addresses.first()
    application = brand.member_applications.order_by("-created_at").first()

    return {
        "user": serialize_customer(owner),
        "brand": serialize_brand(brand, request),
        "profile": {
            "cpf": profile.cpf if profile else "",
            "whatsapp": profile.whatsapp if profile else "",
            "gender": profile.get_gender_display() if profile else "",
            "profile_photo": request.build_absolute_uri(profile.profile_photo.url) if profile and profile.profile_photo else "",
        },
        "address": {
            "cep": address.cep if address else "",
            "street": address.street if address else "",
            "number": address.number if address else "",
            "city": address.city if address else "",
            "uf": address.uf if address else "",
            "neighborhood": address.neighborhood if address else "",
            "complement": address.complement if address else "",
        },
        "application": {
            "status": application.status if application else "",
            "status_label": application.get_status_display() if application else "",
            "created_at": application.created_at.strftime("%d/%m/%Y") if application else "",
        },
    }


def get_active_shop_brand(user, slug):
    brands = user.brands.select_related("owner", "owner__profile", "segment").prefetch_related("member_applications", "products")
    brand = brands.filter(slug=slug).first() if slug else brands.order_by("name").first()

    if not brand:
        return None, Response({"detail": "Brechó não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if brand.status != Brand.Status.ACTIVE:
        return None, Response({"detail": "Brechó inativo."}, status=status.HTTP_403_FORBIDDEN)

    return brand, None


def serialize_segment(segment):
    return {
        "id": segment.id,
        "name": segment.name,
    }


def serialize_event(event, request):
    return {
        "id": str(event.public_id),
        "title": event.title,
        "description": event.description,
        "event_type": event.event_type,
        "event_type_label": event.get_event_type_display(),
        "location": event.location,
        "city": event.city,
        "uf": event.uf,
        "start_date": event.start_date.strftime("%d/%m/%Y %H:%M"),
        "end_date": event.end_date.strftime("%d/%m/%Y %H:%M"),
        "start_date_input": event.start_date.strftime("%Y-%m-%dT%H:%M"),
        "end_date_input": event.end_date.strftime("%Y-%m-%dT%H:%M"),
        "status": event.status,
        "status_label": event.get_status_display(),
        "is_featured": event.is_featured,
        "registration_open": event.registration_open,
        "banner": event_banner_url(event, request),
    }


def parse_event_datetime(value):
    parsed = parse_datetime(value or "")
    if not parsed:
        return None
    if timezone.is_naive(parsed):
        return timezone.make_aware(parsed)
    return parsed


def parse_bool(value):
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "on", "yes", "sim"}


def event_payload_error(data):
    required_fields = ["title", "description", "location", "start_date", "end_date"]
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return f"Campos obrigatórios ausentes: {', '.join(missing)}"

    if data.get("event_type", Event.EventType.EVENT) not in Event.EventType.values:
        return "Tipo de evento inválido."

    if data.get("status", Event.Status.DRAFT) not in Event.Status.values:
        return "Status de evento inválido."

    start_date = parse_event_datetime(data.get("start_date"))
    end_date = parse_event_datetime(data.get("end_date"))
    if not start_date or not end_date:
        return "Datas inválidas."
    if end_date < start_date:
        return "A data de término deve ser maior ou igual à data de início."

    return None


def apply_event_payload(event, data):
    event.title = data["title"].strip()
    event.description = data["description"].strip()
    event.event_type = data.get("event_type") or Event.EventType.EVENT
    event.location = data["location"].strip()
    event.city = (data.get("city") or "").strip()
    event.uf = (data.get("uf") or "").strip().upper()
    event.start_date = parse_event_datetime(data.get("start_date"))
    event.end_date = parse_event_datetime(data.get("end_date"))
    event.status = data.get("status") or Event.Status.DRAFT
    event.is_featured = parse_bool(data.get("is_featured"))
    event.registration_open = parse_bool(data.get("registration_open"))
    return event


def attach_event_banner(event, files):
    banner = files.get("banner") if files else None
    if banner:
        event.banner = convert_image_to_webp(banner, "events/banners")
    return event


def convert_image_to_webp(uploaded_file, upload_dir):
    try:
        image = Image.open(uploaded_file)
        image = ImageOps.exif_transpose(image)
    except Exception as exc:
        raise ValueError("Banner inválido. Envie uma imagem JPG, PNG, WebP ou AVIF.") from exc

    if image.mode not in {"RGB", "RGBA"}:
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

    output = BytesIO()
    image.save(output, format="WEBP", quality=86, method=6)
    output.seek(0)

    return ContentFile(output.read(), name=f"{upload_dir}/{uuid4().hex}.webp")


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""

    if not email or not password:
        return Response({"detail": "Informe e-mail e senha."}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import authenticate

    user = authenticate(request, username=email, password=password)
    if not user or not user.is_active:
        return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

    if not is_admin_user(user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": serialize_customer(user),
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def shop_login(request):
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""

    if not email or not password:
        return Response({"detail": "Informe e-mail e senha."}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import authenticate

    user = authenticate(request, username=email, password=password)
    if not user or not user.is_active:
        return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

    brand = user.brands.order_by("name").first()
    if not brand:
        return Response({"detail": "Nenhum brechó encontrado para esta conta."}, status=status.HTTP_403_FORBIDDEN)

    if brand.status != Brand.Status.ACTIVE:
        return Response({"detail": "Seu brechó ainda não está ativo para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": serialize_customer(user),
            "brand": serialize_brand(brand, request),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def shop_me(request):
    brand_slug = request.query_params.get("slug")
    brand, error = get_active_shop_brand(request.user, brand_slug)
    if error:
        return error

    return Response(serialize_shop_brand(brand, request))


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def shop_products(request, slug):
    brand, error = get_active_shop_brand(request.user, slug)
    if error:
        return error

    if request.method == "GET":
        products = brand.products.order_by("-created_at", "title")
        return Response(
            {
                "shop": serialize_shop_brand(brand, request),
                "categories": [serialize_product_category(category) for category in ProductCategory.objects.filter(is_active=True).order_by("name")],
                "products": [serialize_product(product, request) for product in products],
            }
        )

    title = (request.data.get("title") or "").strip()
    price = request.data.get("price")
    category_id = request.data.get("category_id")
    if not title:
        return Response({"detail": "Informe o nome do produto."}, status=status.HTTP_400_BAD_REQUEST)
    if not price:
        return Response({"detail": "Informe o preço do produto."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        category = ProductCategory.objects.get(pk=category_id, is_active=True)
    except (ProductCategory.DoesNotExist, TypeError, ValueError):
        return Response({"detail": "Categoria inválida."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        normalized_price = Decimal(str(price).replace(",", "."))
    except InvalidOperation:
        return Response({"detail": "Preço inválido."}, status=status.HTTP_400_BAD_REQUEST)

    product_status = request.data.get("status") or Product.Status.ACTIVE
    if product_status not in Product.Status.values:
        return Response({"detail": "Status de produto inválido."}, status=status.HTTP_400_BAD_REQUEST)

    product = Product(
        brand=brand,
        category=category,
        title=title,
        description=(request.data.get("description") or "").strip(),
        price=normalized_price,
        status=product_status,
    )

    photo = request.FILES.get("photo")
    if photo:
        try:
            product.photo = convert_image_to_webp(photo, "products/photos")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    product.save()
    return Response({"product": serialize_product(product, request)}, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def shop_product_detail(request, slug, product_id):
    brand, error = get_active_shop_brand(request.user, slug)
    if error:
        return error

    try:
        product = brand.products.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({"detail": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    title = (request.data.get("title") or "").strip()
    price = request.data.get("price")
    category_id = request.data.get("category_id")
    if not title:
        return Response({"detail": "Informe o nome do produto."}, status=status.HTTP_400_BAD_REQUEST)
    if not price:
        return Response({"detail": "Informe o preço do produto."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        category = ProductCategory.objects.get(pk=category_id, is_active=True)
    except (ProductCategory.DoesNotExist, TypeError, ValueError):
        return Response({"detail": "Categoria inválida."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        normalized_price = Decimal(str(price).replace(",", "."))
    except InvalidOperation:
        return Response({"detail": "Preço inválido."}, status=status.HTTP_400_BAD_REQUEST)

    product_status = request.data.get("status") or Product.Status.ACTIVE
    if product_status not in Product.Status.values:
        return Response({"detail": "Status de produto inválido."}, status=status.HTTP_400_BAD_REQUEST)

    product.category = category
    product.title = title
    product.description = (request.data.get("description") or "").strip()
    product.price = normalized_price
    product.status = product_status

    photo = request.FILES.get("photo")
    if photo:
        try:
            product.photo = convert_image_to_webp(photo, "products/photos")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    product.save()
    return Response({"product": serialize_product(product, request)})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def shop_settings(request, slug):
    brand, error = get_active_shop_brand(request.user, slug)
    if error:
        return error

    name = (request.data.get("name") or "").strip()
    description = (request.data.get("description") or "").strip()
    if not name:
        return Response({"detail": "Informe o nome do brechó."}, status=status.HTTP_400_BAD_REQUEST)
    if not description:
        return Response({"detail": "Informe a descrição do brechó."}, status=status.HTTP_400_BAD_REQUEST)

    brand.name = name
    brand.instagram = (request.data.get("instagram") or "").strip().lstrip("@")
    brand.description = description

    logo = request.FILES.get("logo")
    if logo:
        try:
            brand.logo = convert_image_to_webp(logo, "brands/logos")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    brand.save()
    return Response(serialize_shop_brand(brand, request))


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def shop_account(request, slug):
    brand, error = get_active_shop_brand(request.user, slug)
    if error:
        return error

    user = request.user
    profile = user.profile if hasattr(user, "profile") else None
    address = user.addresses.first()

    email = (request.data.get("email") or "").strip()
    first_name = (request.data.get("first_name") or "").strip()
    last_name = (request.data.get("last_name") or "").strip()
    whatsapp = (request.data.get("whatsapp") or "").strip()

    if not email:
        return Response({"detail": "Informe o e-mail."}, status=status.HTTP_400_BAD_REQUEST)
    if not first_name:
        return Response({"detail": "Informe o nome."}, status=status.HTTP_400_BAD_REQUEST)
    if not last_name:
        return Response({"detail": "Informe o sobrenome."}, status=status.HTTP_400_BAD_REQUEST)
    if not profile:
        return Response({"detail": "Perfil não encontrado."}, status=status.HTTP_400_BAD_REQUEST)
    if not address:
        return Response({"detail": "Endereço não encontrado."}, status=status.HTTP_400_BAD_REQUEST)

    existing_email = user.__class__.objects.filter(email=email).exclude(pk=user.pk).exists()
    if existing_email:
        return Response({"detail": "Este e-mail já está em uso."}, status=status.HTTP_409_CONFLICT)

    user.email = email
    user.first_name = first_name
    user.last_name = last_name
    profile.whatsapp = whatsapp

    photo = request.FILES.get("profile_photo")
    if photo:
        try:
            profile.profile_photo = convert_image_to_webp(photo, "customers/profiles")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    address.cep = (request.data.get("cep") or "").strip()
    address.street = (request.data.get("street") or "").strip()
    address.number = (request.data.get("number") or "").strip()
    address.neighborhood = (request.data.get("neighborhood") or "").strip()
    address.city = (request.data.get("city") or "").strip()
    address.uf = (request.data.get("uf") or "").strip().upper()
    address.complement = (request.data.get("complement") or "").strip()

    user.save(update_fields=["email", "first_name", "last_name"])
    profile.save(update_fields=["whatsapp", "profile_photo"])
    address.save(update_fields=["cep", "street", "number", "neighborhood", "city", "uf", "complement"])

    return Response(serialize_shop_brand(brand, request))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_me(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    return Response({"user": serialize_customer(request.user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    User = request.user.__class__
    pending_applications = (
        MemberApplication.objects.select_related("customer", "customer__profile", "brand", "brand__segment")
        .prefetch_related("customer__addresses")
        .filter(status=MemberApplication.Status.PENDING, brand__status=Brand.Status.PENDING)
        .order_by("-created_at")
    )
    upcoming_events = Event.objects.filter(status=Event.Status.PUBLISHED).order_by("start_date")[:3]
    approved_count = MemberApplication.objects.filter(status=MemberApplication.Status.APPROVED).count()

    return Response(
        {
            "user": serialize_customer(request.user),
            "metrics": {
                "total_members": User.objects.filter(is_active=True).count(),
                "active_events": Event.objects.filter(status=Event.Status.PUBLISHED).count(),
                "textile_saved_kg": approved_count * 15,
                "new_registrations": Brand.objects.filter(status=Brand.Status.PENDING).count(),
            },
            "pending_approvals": [serialize_pending_application(application) for application in pending_applications[:5]],
            "events": [
                {
                    "id": str(event.public_id),
                    "title": event.title,
                    "location": ", ".join(part for part in [event.location, event.city, event.uf] if part),
                    "date": event.start_date.strftime("%d %b").upper(),
                    "attendees": "0",
                    "image": event_banner_url(event, request),
                }
                for event in upcoming_events
            ],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_members(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    User = request.user.__class__
    members = (
        User.objects.select_related("profile")
        .prefetch_related("addresses", "brands", "brands__segment")
        .filter(is_active=True)
        .order_by("first_name", "last_name", "email")
    )

    return Response(
        {
            "user": serialize_customer(request.user),
            "metrics": {
                "total_members": members.count(),
                "brecholeiras": members.filter(role=User.Role.BRECHOLEIRA).count(),
                "admins": members.filter(role__in=[User.Role.SUPER_ADMIN, User.Role.ADMIN]).count(),
                "active_brands": sum(1 for member in members if member.brands.filter(status="ACTIVE").exists()),
                "pending_approvals": Brand.objects.filter(status=Brand.Status.PENDING).count(),
            },
            "members": [serialize_member(member) for member in members],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_brands(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    brands = (
        Brand.objects.select_related("owner", "owner__profile", "segment")
        .prefetch_related("member_applications")
        .order_by("name")
    )
    segments = Segment.objects.filter(is_active=True).order_by("name")

    return Response(
        {
            "user": serialize_customer(request.user),
            "metrics": {
                "total_brands": brands.count(),
                "active": brands.filter(status=Brand.Status.ACTIVE).count(),
                "inactive": brands.filter(status=Brand.Status.INACTIVE).count(),
                "pending": brands.filter(status=Brand.Status.PENDING).count(),
            },
            "segments": [serialize_segment(segment) for segment in segments],
            "brands": [serialize_brand(brand, request) for brand in brands],
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_product_categories(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        categories = ProductCategory.objects.order_by("name")
        return Response(
            {
                "user": serialize_customer(request.user),
                "metrics": {
                    "total_categories": categories.count(),
                    "active": categories.filter(is_active=True).count(),
                    "inactive": categories.filter(is_active=False).count(),
                    "pending_approvals": Brand.objects.filter(status=Brand.Status.PENDING).count(),
                },
                "categories": [serialize_product_category(category) for category in categories],
            }
        )

    name = (request.data.get("name") or "").strip()
    description = (request.data.get("description") or "").strip()
    if not name:
        return Response({"detail": "Informe o nome da categoria."}, status=status.HTTP_400_BAD_REQUEST)

    category, created = ProductCategory.objects.get_or_create(
        name=name,
        defaults={"description": description, "is_active": True},
    )
    if not created:
        return Response({"detail": "Já existe uma categoria com este nome."}, status=status.HTTP_409_CONFLICT)

    return Response({"category": serialize_product_category(category)}, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def admin_product_category_detail(request, category_id):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    try:
        category = ProductCategory.objects.get(pk=category_id)
    except ProductCategory.DoesNotExist:
        return Response({"detail": "Categoria não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get("action")
    if action:
        if action == "activate":
            category.is_active = True
        elif action == "deactivate":
            category.is_active = False
        else:
            return Response({"detail": "Ação inválida."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        name = (request.data.get("name") or "").strip()
        if not name:
            return Response({"detail": "Informe o nome da categoria."}, status=status.HTTP_400_BAD_REQUEST)
        category.name = name
        category.description = (request.data.get("description") or "").strip()

    category.save()
    return Response({"category": serialize_product_category(category)})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def admin_brand_detail(request, brand_id):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    try:
        brand = Brand.objects.select_related("owner", "owner__profile", "segment").get(pk=brand_id)
    except Brand.DoesNotExist:
        return Response({"detail": "Brechó não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get("action")
    if action:
        if action == "activate":
            brand.status = Brand.Status.ACTIVE
        elif action == "approve":
            brand.status = Brand.Status.ACTIVE
            latest_application = brand.member_applications.order_by("-created_at").first()
            if latest_application:
                latest_application.status = MemberApplication.Status.APPROVED
                latest_application.save(update_fields=["status", "updated_at"])
        elif action == "deactivate":
            brand.status = Brand.Status.INACTIVE
        elif action == "reject":
            brand.status = Brand.Status.REJECTED
            latest_application = brand.member_applications.order_by("-created_at").first()
            if latest_application:
                latest_application.status = MemberApplication.Status.REJECTED
                latest_application.save(update_fields=["status", "updated_at"])
        else:
            return Response({"detail": "Ação inválida."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        name = (request.data.get("name") or "").strip()
        description = (request.data.get("description") or "").strip()
        segment_id = request.data.get("segment_id")
        status_value = request.data.get("status")

        if not name:
            return Response({"detail": "Informe o nome do brechó."}, status=status.HTTP_400_BAD_REQUEST)
        if not description:
            return Response({"detail": "Informe a descrição do brechó."}, status=status.HTTP_400_BAD_REQUEST)
        if status_value not in Brand.Status.values:
            return Response({"detail": "Status inválido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            segment = Segment.objects.get(pk=segment_id, is_active=True)
        except (Segment.DoesNotExist, TypeError, ValueError):
            return Response({"detail": "Segmento inválido."}, status=status.HTTP_400_BAD_REQUEST)

        brand.name = name
        brand.instagram = (request.data.get("instagram") or "").strip().lstrip("@")
        brand.description = description
        brand.segment = segment
        brand.status = status_value

    brand.save()
    brand = Brand.objects.select_related("owner", "owner__profile", "segment").get(pk=brand.pk)
    return Response({"brand": serialize_brand(brand, request)})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def admin_events(request):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        events = Event.objects.order_by("-start_date", "title")
        return Response(
            {
                "user": serialize_customer(request.user),
                "metrics": {
                    "total_events": events.count(),
                    "published": events.filter(status=Event.Status.PUBLISHED).count(),
                    "drafts": events.filter(status=Event.Status.DRAFT).count(),
                    "registration_open": events.filter(registration_open=True).count(),
                    "pending_approvals": Brand.objects.filter(status=Brand.Status.PENDING).count(),
                },
                "events": [serialize_event(event, request) for event in events],
            }
        )

    payload_error = event_payload_error(request.data)
    if payload_error:
        return Response({"detail": payload_error}, status=status.HTTP_400_BAD_REQUEST)

    event = apply_event_payload(Event(), request.data)
    try:
        event = attach_event_banner(event, request.FILES)
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    event.save()

    return Response({"event": serialize_event(event, request)}, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def admin_event_detail(request, event_id):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    try:
        event = Event.objects.get(public_id=event_id)
    except Event.DoesNotExist:
        return Response({"detail": "Evento não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    payload_error = event_payload_error(request.data)
    if payload_error:
        return Response({"detail": payload_error}, status=status.HTTP_400_BAD_REQUEST)

    event = apply_event_payload(event, request.data)
    try:
        event = attach_event_banner(event, request.FILES)
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    event.save()

    return Response({"event": serialize_event(event, request)})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def admin_member_application_status(request, application_id):
    if not is_admin_user(request.user):
        return Response({"detail": "Usuário sem permissão para acessar o painel."}, status=status.HTTP_403_FORBIDDEN)

    action = request.data.get("action")
    if action not in {"approve", "reject"}:
        return Response({"detail": "Ação inválida."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        application = MemberApplication.objects.select_related("brand").get(pk=application_id)
    except MemberApplication.DoesNotExist:
        return Response({"detail": "Inscrição não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if action == "approve":
        application.status = MemberApplication.Status.APPROVED
        application.brand.status = "ACTIVE"
    else:
        application.status = MemberApplication.Status.REJECTED
        application.brand.status = "REJECTED"

    application.save(update_fields=["status", "updated_at"])
    application.brand.save(update_fields=["status"])

    return Response({"id": application.id, "status": application.status, "brand_status": application.brand.status})

# Create your views here.
