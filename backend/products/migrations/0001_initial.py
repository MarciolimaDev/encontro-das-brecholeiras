import django.db.models.deletion
from django.db import migrations, models

import products.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("brands", "0002_brand_slug"),
    ]

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=160, verbose_name="título")),
                ("description", models.TextField(blank=True, verbose_name="descrição")),
                ("price", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="preço")),
                ("photo", models.ImageField(blank=True, null=True, upload_to=products.models.product_photo_upload_to, verbose_name="foto")),
                ("status", models.CharField(choices=[("DRAFT", "Rascunho"), ("ACTIVE", "Ativo"), ("SOLD", "Vendido"), ("INACTIVE", "Inativo")], default="ACTIVE", max_length=20, verbose_name="status")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="criado em")),
                ("updated_at", models.DateTimeField(auto_now=True, verbose_name="atualizado em")),
                ("brand", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="products", to="brands.brand", verbose_name="brechó")),
            ],
            options={
                "verbose_name": "produto",
                "verbose_name_plural": "produtos",
                "ordering": ["-created_at", "title"],
            },
        ),
    ]
