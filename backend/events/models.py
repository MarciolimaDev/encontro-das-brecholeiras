import uuid

from django.db import models
from django.utils import timezone
from django.utils.text import slugify


def event_banner_upload_to(instance, filename):
    return f"events/banners/{uuid.uuid4().hex}.avif"


class Event(models.Model):
    class EventType(models.TextChoices):
        EVENT = "EVENT", "Evento"
        FAIR = "FAIR", "Feirinha"
        FESTIVAL = "FESTIVAL", "Festival"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Rascunho"
        PUBLISHED = "PUBLISHED", "Publicado"
        CANCELLED = "CANCELLED", "Cancelado"
        FINISHED = "FINISHED", "Finalizado"

    public_id = models.UUIDField("id público", default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField("título", max_length=180)
    slug = models.SlugField("slug", max_length=220, unique=True, blank=True)
    description = models.TextField("descrição")
    event_type = models.CharField("tipo", max_length=20, choices=EventType.choices, default=EventType.EVENT)
    location = models.CharField("local", max_length=255)
    city = models.CharField("cidade", max_length=120, blank=True)
    uf = models.CharField("UF", max_length=2, blank=True)
    start_date = models.DateTimeField("data de início")
    end_date = models.DateTimeField("data de término")
    banner = models.ImageField("banner", upload_to=event_banner_upload_to, blank=True, null=True)
    status = models.CharField("status", max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField("destaque", default=False)
    registration_open = models.BooleanField("inscrições abertas", default=False)
    created_at = models.DateTimeField("criado em", default=timezone.now)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        verbose_name = "evento"
        verbose_name_plural = "eventos"
        ordering = ["start_date", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Event.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
