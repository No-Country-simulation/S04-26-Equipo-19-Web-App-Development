from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROLES = [
        ("operador", "Operador"),
        ("supervisor", "Supervisor"),
        ("tecnico", "Tecnico"),
        ("manager", "Manager"),
    ]

    rol = models.CharField(max_length=20, choices=ROLES, default="operador")

    ocupado = models.BooleanField(default=False)