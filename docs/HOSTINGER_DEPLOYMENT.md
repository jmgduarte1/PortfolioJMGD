# CI y despliegue en Hostinger Web Apps

## Flujo

El repositorio usa dos mecanismos complementarios:

- GitHub Actions ejecuta los tests y el build en pull requests y pushes a
  `staging` y `produccion`.
- Hostinger conecta cada Web App directamente con su rama de GitHub, ejecuta su
  propio build y despliega automáticamente cuando recibe un push.

Así, las variables de cada ambiente viven en Hostinger y están disponibles
durante `npm run build`. No hacen falta credenciales SSH ni variables de
despliegue en GitHub.

Como el despliegue automático de Hostinger y GitHub Actions se activan con el
mismo push, se deben proteger ambas ramas y exigir que el check
`Tests and production build` pase antes del merge. Los cambios deben llegar por
pull request para que el código desplegado ya haya sido validado.

## Crear las dos Web Apps

Crear dos aplicaciones Node.js en hPanel desde **Websites → Add website → Node.js
Web App** y conectar el mismo repositorio:

| Web App | Rama | Dominio |
| --- | --- | --- |
| Staging | `staging` | Subdominio de pruebas |
| Producción | `produccion` | Dominio público |

La aplicación usa Angular SSR sobre Express. Para que Hostinger ejecute el
servidor generado en lugar de tratar el proyecto como un frontend estático, usar
estas opciones en ambas aplicaciones:

| Opción | Valor |
| --- | --- |
| Framework | Other |
| Versión de Node.js | 22 o 24 |
| Directorio raíz | Raíz del repositorio |
| Package manager | npm |
| Directorio de salida | `dist/portfolio-jmgd` |
| Archivo de entrada | `server.js` |
| Despliegue automático | Activado |

Todas las rutas usan `RenderMode.Server`. Hostinger debe mantener un proceso
Node.js activo y dirigir las solicitudes al archivo de entrada. El servidor usa
el `PORT` entregado por la plataforma y, si no existe, escucha en el puerto 3000.

El preset `Other` permite declarar tanto el directorio de salida como el entry
file. Después de `ng build`, el script `postbuild` copia `server.js` a
`dist/portfolio-jmgd`. Hostinger publica el contenido completo de ese directorio:
el entry abre el puerto inmediatamente y delega las solicitudes a
`./server/server.mjs`, junto a los archivos estáticos de `./browser`.

La dependencia pública `@jmgduarte/wp-angular-renderer` se instala desde npm para que Hostinger
pueda instalarla sin una clave SSH adicional.

## Variables de entorno en Hostinger

En cada Web App, abrir **Environment variables** y crear:

| Variable | Ejemplo de staging | Ejemplo de producción |
| --- | --- | --- |
| `BACKEND_URL` | `https://cms-staging.example.com` | `https://cms.example.com` |
| `DEFAULT_LOCALE` | `en-CA` | `en-CA` |
| `NG_ALLOWED_HOSTS` | Dominio exacto de staging | `juanmanuelgomez.org,www.juanmanuelgomez.org` |
| `NG_TRUST_PROXY_HEADERS` | Ver valor debajo | Ver valor debajo |

`BACKEND_URL` debe ser una URL HTTP/HTTPS absoluta, sin usuario ni contraseña.
`DEFAULT_LOCALE` debe ser una etiqueta de idioma válida, como `en-CA`, `es-ES`
o `fr-CA`.

Usar este valor para `NG_TRUST_PROXY_HEADERS` en ambas aplicaciones:

```text
forwarded,x-forwarded-for,x-forwarded-host,x-forwarded-port,x-forwarded-proto,x-forwarded-prefix
```

`NG_ALLOWED_HOSTS` evita que Angular rechace el dominio durante SSR. No usar `*`.
Los proxy headers se confían porque la aplicación se ejecuta detrás del proxy
administrado de Hostinger.

`BACKEND_URL` y `DEFAULT_LOCALE` son configuración pública del frontend: el build
las incluye en los archivos que descarga el navegador. No guardar contraseñas,
tokens ni claves privadas en ellas.

Después de modificar un valor, aplicar los cambios y ejecutar un nuevo deploy.
La aplicación debe reconstruirse porque Angular incorpora ambos valores durante
el build.

## Configurar GitHub

No se requieren GitHub Environments, secretos SSH ni variables de hosting.

En **Settings → Branches**, proteger `staging` y `produccion`:

1. Exigir pull request antes del merge.
2. Exigir el check `Tests and production build`.
3. Bloquear pushes directos para quienes no deban saltarse el flujo.

El workflow se puede ejecutar manualmente para validar cualquier rama, pero un
deploy automático solo ocurre cuando Hostinger detecta un push en la rama que
tiene conectada.

## Primera verificación

1. Configurar primero la Web App de staging.
2. Hacer merge de un cambio hacia `staging` y comprobar GitHub Actions.
3. En hPanel, confirmar que la instalación, el build y el arranque terminaron.
4. Abrir el dominio y verificar contenido, navegación y rutas internas.
5. Repetir la configuración con la Web App de producción y la rama
   `produccion`.

Si el build falla, revisar los logs de build de Hostinger. Si compila pero no
abre, revisar los runtime logs y confirmar el directorio de salida, el archivo
de entrada y el puerto. También se deben autorizar ambos dominios y el servidor
de Hostinger en la configuración de acceso del backend WordPress.

## Datos necesarios del hosting

- Dominio de staging y dominio de producción.
- Acceso al repositorio de GitHub desde cada Web App.
- URL del backend WordPress para cada ambiente.
- Locale predeterminado para cada ambiente.
- DNS y certificados HTTPS activos.
- Confirmación de que WordPress permite solicitudes CORS desde ambos dominios.

No se necesitan host SSH, ruta `public_html`, clave privada ni `known_hosts` para
este flujo.
