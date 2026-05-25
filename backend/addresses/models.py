from django.conf import settings
from django.db import models


class Address(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="addresses",
        verbose_name="cliente",
    )
    cep = models.CharField("CEP", max_length=9)
    street = models.CharField("rua", max_length=255)
    number = models.CharField("número", max_length=20)
    neighborhood = models.CharField("bairro", max_length=120)
    city = models.CharField("cidade", max_length=120)
    uf = models.CharField("UF", max_length=2)
    complement = models.CharField("complemento", max_length=255, blank=True)

    class Meta:
        verbose_name = "endereço"
        verbose_name_plural = "endereços"
        ordering = ["customer__first_name", "customer__last_name", "city", "street"]

    def __str__(self):
        return f"{self.street}, {self.number} - {self.city}/{self.uf}"
