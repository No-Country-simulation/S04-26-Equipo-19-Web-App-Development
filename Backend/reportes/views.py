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

            # usuario automático
            reporte.reportado_por = request.user

            # técnico automático
            tecnico = Usuario.objects.filter(
                rol="tecnico",
                activo=True
            ).first()

            if tecnico:
                reporte.asignado_a = tecnico

            reporte.save()

            return redirect(
                "reporte_detalles",
                id=reporte.id
            )

    else:
        form = ReporteForm()

    return render(
        request,
        "crear_reporte.html",
        {"form": form}
    )




# detalle
@login_required
def reporte_detalles(request, id):

    reporte = get_object_or_404(
        Reporte,
        id=id
    )

    context = {
        "reporte": reporte,

        "titulo": reporte.titulo,
        "area": reporte.area.nombre if reporte.area else "",
        "tipo_incidente": reporte.get_tipo_incidente_display(),
        "otro_tipo": reporte.otro_tipo,
        "prioridad": reporte.get_prioridad_display(),
        "turno": reporte.get_turno_display(),
        "sector_ubicacion": reporte.sector_ubicacion,
        "descripcion": reporte.descripcion,
        "estado": reporte.get_estado_display(),

        "reportado_por": reporte.reportado_por,
        "tecnico": reporte.asignado_a,

        "fecha_creacion": reporte.fecha_creacion,
    }

    return render(
        request,
        "reporte_detalles.html",
        context
    )

    
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
        asignado_a=request.user,
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
        asignado_a=request.user
    )

    reporte.estado = "cerrado"
    reporte.save()

    return redirect("resolver")