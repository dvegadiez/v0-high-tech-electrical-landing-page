# Variables de entorno — Instrucciones

Este archivo explica cómo configurar la clave de la API de Resend para desarrollo local y producción (Vercel).

1) Local (desarrollo)
- Crea o edita el archivo `.env.local` en la raíz del proyecto.
- Añade la variable `RESEND_API_KEY` con el valor que te proporcionó Resend.

Ejemplo (`.env.local`):

```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
```

- No subas `.env.local` al repositorio. Por defecto ya está incluido en `.gitignore`.
- Reinicia el servidor de desarrollo después de cambiar las variables:

```powershell
bun run dev
# o
next dev
```

2) En Vercel (producción / previews)
- Abre el proyecto en el dashboard de Vercel.
- Ve a Settings → Environment Variables.
- Añade la variable:
  - Name: `RESEND_API_KEY`
  - Value: `re_XXXXXXXXXXXXXXXXXXXXXXXX`
  - Environment: `Production` (y `Preview`/`Development` si deseas que esté disponible allí también).
- Guarda y redeploya el proyecto.

3) Verificar que funciona
- Localmente, con el servidor en `http://localhost:3000`, prueba el endpoint `/api/contact` con `curl` o enviando el formulario desde la web. Ejemplo con `curl`:

```powershell
curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"you@example.com\",\"message\":\"Hola\"}"
```

- Respuestas esperadas:
  - `{ "ok": true }` si el envío tuvo éxito.
  - Un JSON con `error` y código HTTP 4xx/5xx si algo falló.

4) Buenas prácticas
- Nunca incluyas claves privadas en commits públicos.
- Usa `.env.example` para compartir nombres de variables sin exponer secretos.
- En producción usa las variables de entorno del proveedor (Vercel), no archivos.

Si quieres, puedo:
- Pegar la clave de forma segura si me autorizas (necesitaría token/credenciales, no recomendado aquí), o
- Mostrarte capturas paso a paso para agregar la variable en la interfaz de Vercel.
