# Generated manually for forms.MemberApplication.

import django.conf
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0001_initial"),
        ("brands", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="MemberApplication",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("activities_interest", models.TextField(verbose_name="atividades de interesse")),
                ("experience", models.TextField(verbose_name="experiência")),
                ("exposition_structure", models.TextField(verbose_name="estrutura de exposição")),
                ("previous_fair", models.TextField(blank=True, verbose_name="participação anterior em feira")),
                ("prohibition_acknowledgement", models.BooleanField(default=False, verbose_name="ciência das proibições")),
                ("how_did_you_know", models.CharField(max_length=255, verbose_name="como conheceu")),
                ("data_consent", models.BooleanField(default=False, verbose_name="consentimento de dados")),
                ("communication_consent", models.BooleanField(default=False, verbose_name="consentimento de comunicação")),
                ("status", models.CharField(choices=[("PENDING", "Pendente"), ("IN_REVIEW", "Em análise"), ("APPROVED", "Aprovada"), ("REJECTED", "Rejeitada")], default="PENDING", max_length=20, verbose_name="status")),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now, verbose_name="criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="atualizado em")),
                ("brand", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="member_applications", to="brands.brand", verbose_name="marca")),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="member_applications", to=django.conf.settings.AUTH_USER_MODEL, verbose_name="cliente")),
            ],
            options={
                "verbose_name": "inscrição de membro",
                "verbose_name_plural": "inscrições de membros",
                "ordering": ["-created_at"],
            },
        ),
    ]
