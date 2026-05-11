from django.db import models
from django.conf import settings


class Reporte(models.Model):

    TIPO_INCIDENTE_OPCIONES = [
        ("bug", "Bug"),
        ("mejora", "Mejora"),
        ("soporte", "Soporte"),
    ]

    PRIORIDAD_OPCIONES = [
        ("baja", "Baja"),
        ("media", "Media"),
        ("alta", "Alta"),
    ]

    ESTADO_OPCIONES = [
        ("abierto", "Abierto"),
        ("en_proceso", "En proceso"),
        ("cerrado", "Cerrado"),
    ]

    tipo_incidente = models.CharField(max_length=20, choices=TIPO_INCIDENTE_OPCIONES)

    area = models.CharField(max_length=30)

    descripcion = models.TextField(max_length=250)

    prioridad = models.CharField(max_length=20, choices=PRIORIDAD_OPCIONES)

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_OPCIONES,
        default="abierto"
    )

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    tecnico = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reportes_asignados"
    )

    def __str__(self):
        return f"{self.tipo_incidente} - {self.area}"