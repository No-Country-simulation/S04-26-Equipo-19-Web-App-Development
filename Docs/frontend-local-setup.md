# Guía para correr el Frontend de OpsCore en local

Esta guía explica cómo levantar el frontend de **OpsCore** en una máquina local para poder probar la interfaz desde el navegador.

> **Importante:** este proyecto usa **Next.js**, por lo tanto **no se debe abrir un archivo `index.html` manualmente con Live Server**.  
> La aplicación se ejecuta con el servidor de desarrollo de Next.js y se prueba desde el navegador.

---

## 1. Requisitos previos

Antes de empezar, asegurarse de tener instalado:

- **Node.js**
- **npm**
- **Git**

Para verificarlo, ejecutar en la terminal:

```bash
node -v
npm -v
git --version
```

Si alguno de esos comandos falla, primero hay que instalar la herramienta correspondiente.

---

## 2. Clonar el proyecto

Desde la carpeta donde quieras guardar el proyecto, ejecutar:

```bash
git clone https://github.com/No-Country-simulation/S04-26-Equipo-19-Web-App-Development.git
```

Luego entrar a la carpeta del proyecto:

```bash
cd S04-26-Equipo-19-Web-App-Development
```

---

## 3. Cambiar a la rama de desarrollo

La rama principal de integración del equipo es `develop`.

```bash
git checkout develop
git pull origin develop
```

Esto asegura que el proyecto esté actualizado con los últimos cambios del equipo.

---

## 4. Entrar a la carpeta del frontend

El frontend está dentro de la carpeta `frontend`.

```bash
cd frontend
```

> Todos los comandos de Node, como `npm install`, `npm run dev` o `npm run build`, deben ejecutarse dentro de esta carpeta.

---

## 5. Instalar dependencias

Dentro de la carpeta `frontend`, ejecutar:

```bash
npm install
```

Este comando instala todas las dependencias necesarias para que el proyecto funcione en local.

---

## 6. Levantar el servidor de desarrollo

Ejecutar:

```bash
npm run dev
```

Si todo está correcto, la terminal debería mostrar una URL similar a esta:

```txt
http://localhost:3000
```

Abrir esa URL en el navegador.

---

## 7. Probar la aplicación en el navegador

Desde el navegador se puede testear el flujo visual del frontend.

### Rutas principales

| Ruta | Descripción |
| --- | --- |
| `http://localhost:3000` | Página principal o dashboard inicial. |
| `http://localhost:3000/reports` | Vista de reportes o listado de incidentes. |
| `http://localhost:3000/incidents/new` | Formulario para registrar un nuevo incidente. |
| `http://localhost:3000/incidents/INC-001` | Vista de detalle de un incidente de prueba. |

> Las rutas pueden variar si el equipo frontend actualiza la estructura.  
> Si alguna ruta no funciona, revisar las carpetas dentro de `src/app`.

---

## 8. Cómo probar el formulario de incidentes

Entrar a:

```txt
http://localhost:3000/incidents/new
```

Luego:

1. Completar los campos del formulario.
2. Enviar el formulario.
3. Revisar si aparecen validaciones visuales.
4. Observar qué datos se cargan o simulan.

Actualmente el frontend puede estar usando **datos mockeados**, por lo tanto el formulario puede no guardar todavía información en una base de datos real.

El objetivo para backend es validar:

- Qué campos necesita enviar el frontend.
- Qué estructura de datos espera el formulario.
- Qué nombres de propiedades se están usando.
- Qué validaciones visuales existen.
- Qué endpoint debería consumir el frontend cuando el backend esté listo.

---

## 9. Estructura importante del frontend

Archivos y carpetas relevantes:

```txt
frontend/src/app
```

Contiene las rutas principales de Next.js.

```txt
frontend/src/components
```

Contiene componentes reutilizables de UI.

```txt
frontend/src/data
```

Contiene datos mockeados usados temporalmente por el frontend.

```txt
frontend/src/app/incidents/new
```

Ruta del formulario de creación de incidentes.

```txt
frontend/src/app/incidents/[id]
```

Ruta dinámica para ver el detalle de un incidente.

```txt
frontend/src/app/reports
```

Ruta relacionada con reportes o listado de incidentes.

---

## 10. Validar que el proyecto compile

Antes de avisar que algo está listo, es recomendable correr:

```bash
npm run build
```

Este comando permite detectar errores que a veces no aparecen durante `npm run dev`.

Si el build termina correctamente, el frontend está en condiciones de integrarse o revisarse.

---

## 11. Errores comunes

### Error: `Could not read package.json`

Probablemente estás parado en la carpeta incorrecta.

#### Solución

Desde la raíz del repo:

```bash
cd frontend
npm install
npm run dev
```

El comando `npm run dev` debe ejecutarse dentro de `frontend`.

---

### Error: `Module not found`

Puede deberse a:

- Archivo inexistente.
- Carpeta mal escrita.
- Diferencia entre mayúsculas y minúsculas.
- Import incorrecto.

Ejemplo:

```txt
ReportsClient
reportsClient
```

En Windows puede funcionar aunque esté mal escrito, pero en Linux o en Vercel puede fallar si el nombre no coincide exactamente.

---

### Error: puerto `3000` ocupado

Si el puerto `3000` está ocupado, Next.js puede ofrecer otro puerto automáticamente, por ejemplo:

```txt
http://localhost:3001
```

Usar siempre la URL que indique la terminal.

---

### Pantalla en blanco

Revisar:

1. La terminal donde corre `npm run dev`.
2. La consola del navegador.
3. Que se esté accediendo a la URL correcta.
4. Que las dependencias hayan sido instaladas con `npm install`.

---

## 12. Notas para integración con backend

Cuando el backend tenga endpoints disponibles, el frontend debería consumirlos desde servicios o funciones separadas, no directamente desde los componentes visuales.

Una estructura recomendada para el futuro sería:

```txt
frontend/src/services/incidents.ts
```

Ahí se podrían centralizar funciones como:

```ts
getIncidents()
getIncidentById(id)
createIncident(payload)
updateIncidentStatus(id, payload)
```

Esto mantiene los componentes limpios y facilita cambiar datos mockeados por llamadas reales a la API.

---

## 13. Flujo recomendado para backend

1. Levantar el frontend con `npm run dev`.
2. Revisar el formulario de incidentes.
3. Identificar los campos necesarios.
4. Comparar esos campos con el modelo del backend.
5. Definir el contrato de datos entre frontend y backend.
6. Probar la respuesta del backend con Postman, Insomnia o Swagger.
7. Coordinar con frontend el endpoint final.

---

## 14. Resumen rápido de comandos

Desde la raíz del repo:

```bash
git checkout develop
git pull origin develop
cd frontend
npm install
npm run dev
```

Luego abrir en el navegador:

```txt
http://localhost:3000
```

Para validar build:

```bash
npm run build
```

---

## 15. Mensaje corto para compartir con el equipo

```md
Chicos, para probar el frontend de OpsCore no hay que abrir un index.html con Live Server porque el proyecto está hecho en Next.js.

Desde la raíz del repo:

```bash
git checkout develop
git pull origin develop
cd frontend
npm install
npm run dev
```

Después abren:

```txt
http://localhost:3000
```

Rutas útiles para revisar:

```txt
/incidents/new
/reports
/incidents/INC-001
```

El formulario todavía puede estar trabajando con datos mockeados, pero sirve para revisar campos, estructura del payload y preparar la integración con backend.
```

---

## Nota final

No conviene decir “testear en el HTML”, porque puede generar confusión.

La forma correcta sería decir:

> **Testear el frontend en el navegador.**

En Next.js no se trabaja abriendo un HTML suelto, sino levantando el servidor de desarrollo con `npm run dev`.
