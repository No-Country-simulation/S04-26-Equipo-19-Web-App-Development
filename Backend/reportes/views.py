from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .forms import ReporteForm
from .models import Reporte
from usuarios.utils import redirect_por_rol


def rol_requerido(rol_permitido):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):

            if not request.user.is_authenticated:
                return redirect("login")

            if request.user.rol != rol_permitido:
                return redirect("acceso_denegado")

            return view_func(request, *args, **kwargs)

        return wrapper
    return decorator


# 🧑‍🏭 OPERADOR
@login_required
@rol_requerido("operador")
def crear_reporte(request):
    if request.method == "POST":
        form = ReporteForm(request.POST)
        if form.is_valid():
            reporte = form.save()
            return redirect("reporte_detalles", id=reporte.id)
    else:
        form = ReporteForm()

    return render(request, "crear_reporte.html", {"form": form})


# 📄 detalle
@login_required
def reporte_detalles(request, id):
    reporte = get_object_or_404(Reporte, id=id)
    return render(request, "reporte_detalles.html", {"reporte": reporte})


# 🧑‍🔧 SUPERVISOR
@login_required
@rol_requerido("supervisor")
def supervision(request):
    return render(request, "supervision.html")


# 🔧 TÉCNICO
@login_required
@rol_requerido("tecnico")
def resolver(request):
    return render(request, "resolver.html")


# 🧑‍💼 MANAGER
@login_required
@rol_requerido("manager")
def dashboard(request):
    return render(request, "dashboard.html")