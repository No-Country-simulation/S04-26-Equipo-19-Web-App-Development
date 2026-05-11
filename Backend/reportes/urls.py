from django.urls import path
from . import views

urlpatterns = [

    path(
        "crear-reporte/",
        views.crear_reporte,
        name="crear_reporte"
    ),

    path(
        "resolver/",
        views.resolver,
        name="resolver"
    ),

    path(
        "cerrar-reporte/<int:id>/",
        views.cerrar_reporte,
        name="cerrar_reporte"
    ),
]