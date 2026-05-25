from django.conf import settings
from django.db import models
from django.utils import timezone


class MemberApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendente"
        IN_REVIEW = "IN_REVIEW", "Em análise"
        APPROVED = "APPROVED", "Aprovada"
        REJECTED = "REJECTED", "Rejeitada"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="member_applications",
        verbose_name="cliente",
    )
    brand = models.ForeignKey(
        "brands.Brand",
        on_delete=models.CASCADE,
        related_name="member_applications",
        verbose_name="marca",
    )
    activities_interest = models.TextField("atividades de interesse")
    experience = models.TextField("experiência")
    exposition_structure = models.TextField("estrutura de exposição")
    previous_fair = models.TextField("participação anterior em feira", blank=True)
    prohibition_acknowledgement = models.BooleanField("ciência das proibições", default=False)
    how_did_you_know = models.CharField("como conheceu", max_length=255)
    data_consent = models.BooleanField("consentimento de dados", default=False)
    communication_consent = models.BooleanField("consentimento de comunicação", default=False)
    status = models.CharField("status", max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField("criado em", default=timezone.now)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        verbose_name = "inscrição de membro"
        verbose_name_plural = "inscrições de membros"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer} - {self.brand}"
