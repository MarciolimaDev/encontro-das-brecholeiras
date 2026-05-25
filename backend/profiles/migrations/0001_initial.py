# Generated manually for profiles.CustomerProfile.

import django.conf
import django.db.models.deletion
from django.db import migrations, models

import profiles.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomerProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("cpf", models.CharField(max_length=14, unique=True, verbose_name="CPF")),
                ("birth_date", models.DateField(verbose_name="data de nascimento")),
                ("whatsapp", models.CharField(max_length=20, verbose_name="WhatsApp")),
                ("gender", models.CharField(choices=[("MALE", "Masculino"), ("FEMALE", "Feminino"), ("NON_BINARY", "Não Binário"), ("PREFER_NOT_TO_SAY", "Prefiro não informar"), ("OTHER", "Outro")], max_length=20, verbose_name="gênero")),
                ("profile_photo", models.ImageField(blank=True, null=True, upload_to=profiles.models.customer_profile_photo_upload_to, verbose_name="foto de perfil")),
                ("customer", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="profile", to=django.conf.settings.AUTH_USER_MODEL, verbose_name="cliente")),
            ],
            options={
                "verbose_name": "perfil de cliente",
                "verbose_name_plural": "perfis de clientes",
                "ordering": ["customer__first_name", "customer__last_name"],
            },
        ),
    ]
