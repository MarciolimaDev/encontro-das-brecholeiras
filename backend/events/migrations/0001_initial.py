# Generated manually for events.Event.

import django.utils.timezone
import uuid
from django.db import migrations, models

import events.models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("public_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="id público")),
                ("title", models.CharField(max_length=180, verbose_name="título")),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True, verbose_name="slug")),
                ("description", models.TextField(verbose_name="descrição")),
                ("event_type", models.CharField(choices=[("EVENT", "Evento"), ("FAIR", "Feirinha"), ("FESTIVAL", "Festival")], default="EVENT", max_length=20, verbose_name="tipo")),
                ("location", models.CharField(max_length=255, verbose_name="local")),
                ("city", models.CharField(blank=True, max_length=120, verbose_name="cidade")),
                ("uf", models.CharField(blank=True, max_length=2, verbose_name="UF")),
                ("start_date", models.DateTimeField(verbose_name="data de início")),
                ("end_date", models.DateTimeField(verbose_name="data de término")),
                ("banner", models.ImageField(blank=True, null=True, upload_to=events.models.event_banner_upload_to, verbose_name="banner")),
                ("status", models.CharField(choices=[("DRAFT", "Rascunho"), ("PUBLISHED", "Publicado"), ("CANCELLED", "Cancelado"), ("FINISHED", "Finalizado")], default="DRAFT", max_length=20, verbose_name="status")),
                ("is_featured", models.BooleanField(default=False, verbose_name="destaque")),
                ("registration_open", models.BooleanField(default=False, verbose_name="inscrições abertas")),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now, verbose_name="criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="atualizado em")),
            ],
            options={
                "verbose_name": "evento",
                "verbose_name_plural": "eventos",
                "ordering": ["start_date", "title"],
            },
        ),
    ]
