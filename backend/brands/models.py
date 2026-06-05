import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify


def brand_logo_upload_to(instance, filename):
    return f"brands/logos/{uuid.uuid4().hex}.avif"


class Segment(models.Model):
    name = models.CharField("nome", max_length=120, unique=True)
    description = models.TextField("descrição", blank=True)
    is_active = models.BooleanField("ativo", default=True)

    class Meta:
        verbose_name = "segmento"
        verbose_name_plural = "segmentos"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Brand(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendente"
        ACTIVE = "ACTIVE", "Ativa"
        INACTIVE = "INACTIVE", "Inativa"
        REJECTED = "REJECTED", "Rejeitada"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="brands",
        verbose_name="proprietário",
    )
    name = models.CharField("nome", max_length=150)
    slug = models.SlugField("slug", max_length=180, unique=True, blank=True)
    instagram = models.CharField("Instagram", max_length=100, blank=True)
    segment = models.ForeignKey(
        Segment,
        on_delete=models.PROTECT,
        related_name="brands",
        verbose_name="segmento",
    )
    description = models.TextField("descrição")
    logo = models.ImageField("logo", upload_to=brand_logo_upload_to, blank=True, null=True)
    status = models.CharField("status", max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        verbose_name = "marca"
        verbose_name_plural = "marcas"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["owner", "name"], name="unique_brand_name_per_owner"),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or uuid.uuid4().hex[:12]
            slug = base_slug
            counter = 1

            while Brand.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)
