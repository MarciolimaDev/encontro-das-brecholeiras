import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True, verbose_name="nome")),
                ("description", models.TextField(blank=True, verbose_name="descrição")),
                ("is_active", models.BooleanField(default=True, verbose_name="ativo")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="criado em")),
            ],
            options={
                "verbose_name": "categoria de produto",
                "verbose_name_plural": "categorias de produto",
                "ordering": ["name"],
            },
        ),
        migrations.AddField(
            model_name="product",
            name="category",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="products", to="products.productcategory", verbose_name="categoria"),
        ),
    ]
