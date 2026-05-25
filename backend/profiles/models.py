import uuid

from django.conf import settings
from django.db import models


def customer_profile_photo_upload_to(instance, filename):
    return f"customers/profiles/{uuid.uuid4().hex}.avif"


class CustomerProfile(models.Model):
    class Gender(models.TextChoices):
        MALE = "MALE", "Masculino"
        FEMALE = "FEMALE", "Feminino"
        NON_BINARY = "NON_BINARY", "Não Binário"
        PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY", "Prefiro não informar"
        OTHER = "OTHER", "Outro"

    customer = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="cliente",
    )
    cpf = models.CharField("CPF", max_length=14, unique=True)
    birth_date = models.DateField("data de nascimento")
    whatsapp = models.CharField("WhatsApp", max_length=20)
    gender = models.CharField("gênero", max_length=20, choices=Gender.choices)
    profile_photo = models.ImageField(
        "foto de perfil",
        upload_to=customer_profile_photo_upload_to,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "perfil de cliente"
        verbose_name_plural = "perfis de clientes"
        ordering = ["customer__first_name", "customer__last_name"]

    def __str__(self):
        return f"Perfil de {self.customer}"
