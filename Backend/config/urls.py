from django.contrib import admin
from django.urls import path
from usuarios import views as usuarios_views
from reportes import views as reportes_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # ruta de inicio
    path("", usuarios_views.inicio, name="inicio"),


    # auth
    path('login/', usuarios_views.login_view, name='login'),
    path('registro/', usuarios_views.registro, name='registro'),

    # acceso denegado
    path('acceso-denegado/', usuarios_views.acceso_denegado, name='acceso_denegado'),

    # rutas por rol
    path('crear-reporte/', reportes_views.crear_reporte, name='crear_reporte'),
    path('supervision/', reportes_views.supervision, name='supervision'),
    path('resolver/', reportes_views.resolver, name='resolver'),
    path('dashboard/', reportes_views.dashboard, name='dashboard'),

    # cerrar reporte
    path(
    'cerrar-reporte/<int:id>/',
    reportes_views.cerrar_reporte,
    name='cerrar_reporte'
),

    # detalle
    path('reporte/<int:id>/', reportes_views.reporte_detalles, name='reporte_detalles'),
    path('logout/', usuarios_views.logout_view, name='logout'),
]

