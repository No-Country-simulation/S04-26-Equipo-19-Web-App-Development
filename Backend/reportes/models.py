from django.db import models

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

    tipo_incidente = models.CharField(choices=TIPO_INCIDENTE_OPCIONES)
    area = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=250)
    prioridad = models.CharField(choices=PRIORIDAD_OPCIONES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_incidente} - {self.area}"
    