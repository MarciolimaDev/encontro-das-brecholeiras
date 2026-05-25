import json

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from addresses.models import Address
from brands.models import Brand, Segment
from profiles.models import CustomerProfile

from .models import MemberApplication


GENDER_MAP = {
    "Masculino": CustomerProfile.Gender.MALE,
    "Feminino": CustomerProfile.Gender.FEMALE,
    "Não binário": CustomerProfile.Gender.NON_BINARY,
    "Prefiro não informar": CustomerProfile.Gender.PREFER_NOT_TO_SAY,
    "Outros": CustomerProfile.Gender.OTHER,
}


def get_name_parts(data):
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()

    if first_name:
        return first_name, last_name

    full_name = (data.get("nome") or "").strip()
    parts = full_name.split()
    return parts[0], " ".join(parts[1:]) if len(parts) > 1 else ""


def require_fields(data, fields):
    missing = [field for field in fields if not data.get(field)]
    if missing:
        return f"Campos obrigatórios ausentes: {', '.join(missing)}"
    return None


@csrf_exempt
@require_POST
def create_member_application(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "JSON inválido."}, status=400)

    required_error = require_fields(
        data,
        [
            "first_name",
            "last_name",
            "cpf",
            "telefone",
            "email",
            "password",
            "nascimento",
            "cep",
            "endereco",
            "numero",
            "bairro",
            "cidade",
            "estado",
            "genero",
            "segmentos",
            "atividades",
            "ciencia_regra",
            "como_conheceu",
        ],
    )
    if required_error:
        return JsonResponse({"detail": required_error}, status=400)

    if not data.get("veracidade"):
        return JsonResponse({"detail": "É necessário aceitar a declaração de veracidade."}, status=400)

    segmentos = data.get("segmentos") or []
    atividades = data.get("atividades") or []
    if not isinstance(segmentos, list) or not segmentos:
        return JsonResponse({"detail": "Selecione ao menos um segmento."}, status=400)
    if not isinstance(atividades, list) or not atividades:
        return JsonResponse({"detail": "Selecione ao menos uma atividade."}, status=400)

    gender = GENDER_MAP.get(data.get("genero"))
    if not gender:
        return JsonResponse({"detail": "Gênero inválido."}, status=400)

    first_name, last_name = get_name_parts(data)
    User = get_user_model()

    try:
        with transaction.atomic():
            customer = User.objects.create_user(
                email=data["email"],
                password=data["password"],
                first_name=first_name,
                last_name=last_name,
            )

            CustomerProfile.objects.create(
                customer=customer,
                cpf=data["cpf"],
                birth_date=data["nascimento"],
                whatsapp=data["telefone"],
                gender=gender,
            )

            Address.objects.create(
                customer=customer,
                cep=data["cep"],
                street=data["endereco"],
                number=data["numero"],
                neighborhood=data["bairro"],
                city=data["cidade"],
                uf=data["estado"].upper(),
                complement=data.get("complemento", ""),
            )

            segment, _ = Segment.objects.get_or_create(name=segmentos[0])
            brand_name = data.get("marca") or f"Marca de {first_name}"
            brand = Brand.objects.create(
                owner=customer,
                name=brand_name,
                instagram=(data.get("instagram") or "").lstrip("@"),
                segment=segment,
                description=data.get("estrutura_brecho") or "Cadastro realizado pelo formulário de curadoras.",
            )

            application = MemberApplication.objects.create(
                customer=customer,
                brand=brand,
                activities_interest="\n".join(atividades),
                experience=data.get("experiencia", ""),
                exposition_structure=data.get("estrutura_expor", ""),
                previous_fair=data.get("feiras", ""),
                prohibition_acknowledgement=data.get("ciencia_regra") == "Ciente",
                how_did_you_know=data["como_conheceu"],
                data_consent=bool(data.get("veracidade")),
                communication_consent=bool(data.get("comunicacoes")),
            )
    except IntegrityError:
        return JsonResponse({"detail": "Já existe um cadastro com estes dados."}, status=409)

    return JsonResponse(
        {
            "customer_id": str(customer.public_id),
            "brand_id": brand.id,
            "application_id": application.id,
            "status": application.status,
        },
        status=201,
    )
