from django import forms
from .models import Reporte


class ReporteForm(forms.ModelForm):

    class Meta:
        model = Reporte

        exclude = [
            "estado",
            "reportado_por",
            "tecnico",
            "fecha_creacion",
        ]

    def clean_descripcion(self):

        descripcion = self.cleaned_data["descripcion"]

        if len(descripcion) < 15:
            raise forms.ValidationError(
                "La descripción debe tener al menos 15 caracteres."
            )

        if len(descripcion) > 500:
            raise forms.ValidationError(
                "La descripción no puede superar 500 caracteres."
            )

        return descripcion

    def clean(self):

        cleaned_data = super().clean()

        tipo = cleaned_data.get("tipo_incidente")
        otro_tipo = cleaned_data.get("otro_tipo")

        if tipo == "otro" and not otro_tipo:
            raise forms.ValidationError(
                "Debe especificar el tipo de incidente."
            )

        return cleaned_data