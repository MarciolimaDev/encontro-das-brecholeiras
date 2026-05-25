# Generated manually for addresses.Address.

import django.conf
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Address",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("cep", models.CharField(max_length=9, verbose_name="CEP")),
                ("street", models.CharField(max_length=255, verbose_name="rua")),
                ("number", models.CharField(max_length=20, verbose_name="número")),
                ("neighborhood", models.CharField(max_length=120, verbose_name="bairro")),
                ("city", models.CharField(max_length=120, verbose_name="cidade")),
                ("uf", models.CharField(max_length=2, verbose_name="UF")),
                ("complement", models.CharField(blank=True, max_length=255, verbose_name="complemento")),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="addresses", to=django.conf.settings.AUTH_USER_MODEL, verbose_name="cliente")),
            ],
            options={
                "verbose_name": "endereço",
                "verbose_name_plural": "endereços",
                "ordering": ["customer__first_name", "customer__last_name", "city", "street"],
            },
        ),
    ]
