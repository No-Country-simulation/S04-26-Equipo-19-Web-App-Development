from django.db import models


class Area(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre






class Reporte(models.Model):

    TIPOS_INCIDENTE = [
        ("falla_mecanica", "Falla mecánica"),
        ("falla_electrica", "Falla eléctrica"),
        ("desvio_calidad", "Desvío de calidad"),
        ("accidente", "Accidente"),
        ("casi_accidente", "Casi accidente"),
        ("mantenimiento_preventivo", "Mantenimiento preventivo"),
        ("problema_operativo", "Problema operativo"),
        ("otro", "Otro"),
    ]

    PRIORIDADES = [
        ("baja", "Baja"),
        ("media", "Media"),
        ("alta", "Alta"),
        ("critica", "Crítica"),
    ]

    TURNOS = [
        ("manana", "Mañana"),
        ("tarde", "Tarde"),
        ("noche", "Noche"),
    ]

    ESTADOS = [
        ("abierto", "Abierto"),
        ("en_proceso", "En proceso"),
        ("cerrado", "Cerrado"),
    ]

    titulo = models.CharField(
        max_length=150
    )

    area = models.ForeignKey(
        'Area',
        on_delete=models.PROTECT,
        related_name="reportes"
    )

    tipo_incidente = models.CharField(
        max_length=50,
        choices=TIPOS_INCIDENTE
    )

    otro_tipo = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    prioridad = models.CharField(
        max_length=20,
        choices=PRIORIDADES
    )

    turno = models.CharField(
        max_length=20,
        choices=TURNOS
    )

    sector_ubicacion = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    descripcion = models.TextField(
        max_length=500
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="abierto"
    )

    reportado_por = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.SET_NULL,
        related_name="reportes_realizados",
        null=True,
        blank=True
    )

    asignado_a = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.SET_NULL,
        related_name="reportes_asignados",
        null=True,
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.titulo