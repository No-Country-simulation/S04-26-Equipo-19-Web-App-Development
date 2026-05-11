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


# OPERADOR
# DESPUÉS
from usuarios.models import Usuario  # agregá este import arriba del archivo

@login_required
@rol_requerido("operador")
def crear_reporte(request):
    if request.method == "POST":
        form = ReporteForm(request.POST)
        if form.is_valid():
            reporte = form.save(commit=False)

            # Asignar primer técnico disponible
            tecnico = Usuario.objects.filter(rol="tecnico", ocupado=False).first()
            if tecnico:
                reporte.tecnico = tecnico
                tecnico.ocupado = True
                tecnico.save()

            reporte.save()
            return redirect("reporte_detalles", id=reporte.id)
    else:
        form = ReporteForm()

    return render(request, "crear_reporte.html", {"form": form})




# detalle
@login_required
def reporte_detalles(request, id):
    reporte = get_object_or_404(Reporte, id=id)
    return render(request, "reporte_detalles.html", {"reporte": reporte})


# SUPERVISOR
@login_required
@rol_requerido("supervisor")
def supervision(request):
    return render(request, "supervision.html")


# TÉCNICO
@login_required
@rol_requerido("tecnico")
def resolver(request):

    reporte = Reporte.objects.filter(
        tecnico=request.user,
        estado="abierto"
    ).first()

    return render(request, "resolver.html", {
        "reporte": reporte
    })


# MANAGER
@login_required
@rol_requerido("manager")
def dashboard(request):
    return render(request, "dashboard.html")

@login_required
@rol_requerido("tecnico")
def cerrar_reporte(request, id):

    reporte = get_object_or_404(
        Reporte,
        id=id,
        tecnico=request.user
    )

    reporte.estado = "cerrado"
    reporte.save()

    request.user.ocupado = False
    request.user.save()

    return redirect("resolver")