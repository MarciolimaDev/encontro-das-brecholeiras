import uuid

from django.db import migrations, models
from django.utils.text import slugify


def populate_brand_slugs(apps, schema_editor):
    Brand = apps.get_model("brands", "Brand")
    used_slugs = set()

    for brand in Brand.objects.order_by("id"):
        base_slug = slugify(brand.name) or uuid.uuid4().hex[:12]
        slug = base_slug
        counter = 1

        while slug in used_slugs or Brand.objects.filter(slug=slug).exclude(pk=brand.pk).exists():
            counter += 1
            slug = f"{base_slug}-{counter}"

        brand.slug = slug
        brand.save(update_fields=["slug"])
        used_slugs.add(slug)


class Migration(migrations.Migration):
    dependencies = [
        ("brands", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="brand",
            name="slug",
            field=models.SlugField(blank=True, max_length=180, null=True, unique=True, verbose_name="slug"),
        ),
        migrations.RunPython(populate_brand_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="brand",
            name="slug",
            field=models.SlugField(blank=True, max_length=180, unique=True, verbose_name="slug"),
        ),
    ]
