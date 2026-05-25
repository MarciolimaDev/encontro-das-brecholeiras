# Generated manually for brands.Segment and brands.Brand.

import django.conf
import django.db.models.deletion
from django.db import migrations, models

import brands.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Segment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True, verbose_name="nome")),
                ("description", models.TextField(blank=True, verbose_name="descrição")),
                ("is_active", models.BooleanField(default=True, verbose_name="ativo")),
            ],
            options={
                "verbose_name": "segmento",
                "verbose_name_plural": "segmentos",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Brand",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150, verbose_name="nome")),
                ("instagram", models.CharField(blank=True, max_length=100, verbose_name="Instagram")),
                ("description", models.TextField(verbose_name="descrição")),
                ("logo", models.ImageField(blank=True, null=True, upload_to=brands.models.brand_logo_upload_to, verbose_name="logo")),
                ("status", models.CharField(choices=[("PENDING", "Pendente"), ("ACTIVE", "Ativa"), ("INACTIVE", "Inativa"), ("REJECTED", "Rejeitada")], default="PENDING", max_length=20, verbose_name="status")),
                ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="brands", to=django.conf.settings.AUTH_USER_MODEL, verbose_name="proprietário")),
                ("segment", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="brands", to="brands.segment", verbose_name="segmento")),
            ],
            options={
                "verbose_name": "marca",
                "verbose_name_plural": "marcas",
                "ordering": ["name"],
                "constraints": [models.UniqueConstraint(fields=("owner", "name"), name="unique_brand_name_per_owner")],
            },
        ),
    ]
