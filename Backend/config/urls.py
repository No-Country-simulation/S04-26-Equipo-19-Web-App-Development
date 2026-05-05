from django.contrib import admin
from django.urls import path
from usuarios import views as usuarios_views   # Aquí están tus funciones: registro y crear_reporte
from reportes import views as reportes_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registrar/', usuarios_views.registro, name='registrar'),
    path('reporte/', reportes_views.crear_reporte, name="crear_reporte"), 
    path('reporte/<int:id>/', reportes_views.reporte_detalles, name="reporte_detalles"),
]
