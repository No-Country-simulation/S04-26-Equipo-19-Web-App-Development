# usuarios/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Usuario


class UsuarioCreationForm(UserCreationForm):

    class Meta:
        model = Usuario

        fields = (
            'nombre',
            'email',
            'rol',
            'area',
            'activo',
        )