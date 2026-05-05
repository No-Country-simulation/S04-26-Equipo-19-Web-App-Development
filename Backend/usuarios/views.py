from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages


# REGISTRO DE USUARIO 
def registro(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save() # Esto guarda al usuario en la base de datos
            username = form.cleaned_data.get('username')
            messages.success(request, f'¡Cuenta creada para {username}!')
            return redirect('admin:index') # Lo manda al login del admin
    else:
        form = UserCreationForm()

    return render(request, 'registro.html', {'form': form})

# Create your views here.
