from django.contrib import admin
from django.urls import path
from usuarios import views as usuarios_views
from reportes import views as reportes_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # auth
    path('login/', usuarios_views.login_view, name='login'),
    path('registro/', usuarios_views.registro, name='registro'),

    # 🔥 destinos por rol
    path('crear-reporte/', reportes_views.crear_reporte, name='crear_reporte'),
    path('supervision/', reportes_views.supervision, name='supervision'),
    path('resolver/', reportes_views.resolver, name='resolver'),
    path('dashboard/', reportes_views.dashboard, name='dashboard'),
]