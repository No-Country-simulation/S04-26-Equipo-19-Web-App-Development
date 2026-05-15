# usuarios/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from .forms import UsuarioCreationForm

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):

    add_form = UsuarioCreationForm

    model = Usuario

    list_display = (
        'id',
        'nombre',
        'email',
        'rol',
        'area',
        'activo',
        'is_superuser',
    )

    ordering = ('email',)

    fieldsets = (
        (None, {
            'fields': (
                'email',
                'password'
            )
        }),

        ('Información personal', {
            'fields': (
                'nombre',
                'rol',
                'area'
            )
        }),

        ('Permisos', {
            'fields': (
                'activo',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),

        ('Fechas', {
            'fields': (
                'last_login',
                'fecha_creacion'
            )
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'nombre',
                'email',
                'rol',
                'area',
                'activo',
                'password1',
                'password2',
            ),
        }),
    )

    readonly_fields = (
        'fecha_creacion',
        'last_login',
    )



