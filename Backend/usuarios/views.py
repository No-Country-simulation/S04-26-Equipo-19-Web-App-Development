from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


from .forms import UsuarioCreationForm
from .models import Usuario
from .utils import redirect_por_rol


# pagina de inicio
def inicio(request):

    if request.user.is_authenticated:
        return redirect_por_rol(request.user)

    return render(request, "inicio.html")

# Cierre de session
def logout_view(request):
    logout(request)
    return redirect("login")

# Registro
def registro(request):
    if request.method == "POST":
        form = UsuarioCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = UsuarioCreationForm()

    return render(request, "registro.html", {"form": form})


# Login
def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "").strip()

        if not email or not password:
            return render(request, "login.html", {"error": "Completá todos los campos"})

        try:
            validate_email(email)
        except ValidationError:
            return render(request, "login.html", {"error": "Email inválido"})

        try:
            user_obj = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return render(request, "login.html", {"error": "Credenciales inválidas"})

        user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            return redirect_por_rol(user)

        return render(request, "login.html", {"error": "Credenciales inválidas"})

    return render(request, "login.html")


# Acceso denegado (VERSIÓN LIMPIA)
def acceso_denegado(request):
    return render(request, "acceso_denegado.html", {
        "home_url": redirect_por_rol(request.user).url
    })