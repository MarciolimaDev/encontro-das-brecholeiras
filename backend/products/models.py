import uuid

from django.db import models


def product_photo_upload_to(instance, filename):
    return f"products/photos/{uuid.uuid4().hex}.webp"


class ProductCategory(models.Model):
    name = models.CharField("nome", max_length=120, unique=True)
    description = models.TextField("descrição", blank=True)
    is_active = models.BooleanField("ativo", default=True)
    created_at = models.DateTimeField("criado em", auto_now_add=True)

    class Meta:
        verbose_name = "categoria de produto"
        verbose_name_plural = "categorias de produto"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Rascunho"
        ACTIVE = "ACTIVE", "Ativo"
        SOLD = "SOLD", "Vendido"
        INACTIVE = "INACTIVE", "Inativo"

    brand = models.ForeignKey("brands.Brand", on_delete=models.CASCADE, related_name="products", verbose_name="brechó")
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="categoria",
        blank=True,
        null=True,
    )
    title = models.CharField("título", max_length=160)
    description = models.TextField("descrição", blank=True)
    price = models.DecimalField("preço", max_digits=10, decimal_places=2)
    photo = models.ImageField("foto", upload_to=product_photo_upload_to, blank=True, null=True)
    status = models.CharField("status", max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        verbose_name = "produto"
        verbose_name_plural = "produtos"
        ordering = ["-created_at", "title"]

    def __str__(self):
        return self.title
