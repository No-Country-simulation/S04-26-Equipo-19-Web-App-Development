from django.shortcuts import redirect


def redirect_por_rol(user):
    if user.rol == "operador":
        return redirect("crear_reporte")

    elif user.rol == "supervisor":
        return redirect("supervision")

    elif user.rol == "tecnico":
        return redirect("resolver")

    elif user.rol == "manager":
        return redirect("dashboard")

    return redirect("login")