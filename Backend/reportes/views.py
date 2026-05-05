from django.shortcuts import render, redirect, get_object_or_404
from .forms import ReporteForm
from .models import Reporte

# Campos mínimos del formulario:
#    Tipo de incidente.
#    Área.
#    Descripción breve.
#    Prioridad.
#    Fecha/hora automática o visible.


def crear_reporte(request):
    if request.method == "POST":
        form = ReporteForm(request.POST)
        if form.is_valid():
            reporte = form.save()
            return redirect("reporte_detalles", id=reporte.id)
    else:
        form = ReporteForm()

    return render(request, 'reporte.html', {'form': form})

def reporte_detalles(request, id):
    reporte = get_object_or_404(Reporte, id=id)
    return render(request, "reporte_detalles.html", {"reporte": reporte})