# CI/CD con GitHub Actions y Hostinger

## Alcance y compatibilidad

El workflow `.github/workflows/ci-cd.yml` está preparado para **Hostinger Web
Premium, Business o Cloud con SSH/rsync y un directorio `public_html` dedicado al
frontend**. Se ha confirmado que hay shared hosting con SSH; las rutas reales y
los dominios deben configurarse antes del primer despliegue.
No requiere instalar Node.js ni ejecutar npm en Hostinger: GitHub compila y sube
los archivos estáticos.

Las rutas actuales de `src/app/app.routes.server.ts` usan `RenderMode.Client`.
El despliegue usa `--output-mode static`, manteniendo ese comportamiento; CI
también verifica el build normal de navegador y servidor. No se elimina la
infraestructura SSR. Si se añaden rutas `RenderMode.Server`, se necesitará un
destino Node.js y otro mecanismo de despliegue. Este workflow **no administra
Node.js Web Apps ni procesos Node/PM2 en VPS**, y no implementa SSR en el hosting.

Hostinger documenta [SSH/rsync para Web Premium, Business y Cloud](https://www.hostinger.com/support/which-file-transfer-and-server-access-options-are-supported-at-hostinger/),
el [uso de rsync y sus puertos](https://www.hostinger.com/support/how-to-use-rsync-to-sync-files-and-directories-at-hostinger/)
y un mecanismo separado para [Node.js Web Apps](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).
Angular explica la diferencia en [renderizado híbrido y salida estática](https://angular.dev/guide/ssr).

## Comportamiento

| Evento | Validaciones | Despliegue |
| --- | --- | --- |
| Pull request hacia `staging` o `produccion` | Scripts, tests Angular, build de producción | Ninguno |
| Push a `staging` | Las mismas validaciones | Automático, Environment `Staging` |
| Push a `produccion` | Las mismas validaciones | Automático, Environment `Produccion` |
| Ejecución manual | Las mismas validaciones | Solo si se elige una de esas dos ramas |

El nombre de rama es `produccion`, sin tilde. Un merge también produce un push.
Los despliegues de una misma rama se serializan; un nuevo push no interrumpe una
transferencia activa. GitHub puede sustituir ejecuciones pendientes por otras
más recientes. Cualquier fallo en tests, presupuesto del build, configuración,
transferencia o verificación marca la ejecución como fallida.

Se usa `npm ci` con Node 24 y el lockfile del repositorio. Los PR no acceden a los
secretos SSH. El job de despliegue recompila el mismo commit con las variables
del entorno seleccionado y conserva el artefacto preparado durante 14 días.
No se copia el `.env` local ni se publica código fuente, `node_modules` o el
servidor de desarrollo.

## Configurar GitHub

1. Subir el workflow y sus scripts al repositorio. Incluir también los cambios
   de configuración `.env.example` y generación de entorno de la tarea anterior.
2. En **Settings → Environments**, crear `Staging` y `Produccion`.
3. En cada Environment, configurar **Deployment branches and tags → Selected
   branches and tags**: permitir únicamente `staging` en `Staging` y
   `produccion` en `Produccion`.
4. No añadir revisores obligatorios ni temporizadores si se desea despliegue
   completamente automático.
5. Añadir las siguientes **Environment variables**, con valores distintos por
   entorno. No usar valores locales como fallback en producción.

| Variable | Valor / ejemplo |
| --- | --- |
| `BACKEND_URL` | URL HTTPS del backend WordPress del renderer, p. ej. `https://cms-staging.example.com` |
| `DEFAULT_LOCALE` | Locale del contenido, p. ej. `en-CA` o `es-ES` |
| `SITE_URL` | Origen público del frontend, p. ej. `https://staging.example.com`; sin subdirectorio |
| `SSH_HOST` | IP IPv4 o hostname de acceso SSH que proporciona hPanel |
| `SSH_PORT` | Puerto real de hPanel; normalmente `65002` en Web/Cloud |
| `SSH_USER` | Usuario SSH de Hostinger, p. ej. `u123456789` |
| `DEPLOY_PATH` | Ruta absoluta del document root, sin `/` final, p. ej. `/home/u123456789/domains/staging.example.com/public_html` |

El script también acepta rutas como
`/home/u123456789/domains/example.com/public_html/staging` si ese es el document
root real de un subdominio. No admite publicar la aplicación bajo una URL como
`https://example.com/staging/`: el frontend conserva su base `/`.

6. Añadir estos **Environment secrets** en cada Environment:

| Secret | Contenido |
| --- | --- |
| `SSH_PRIVATE_KEY` | Clave privada SSH completa, con saltos de línea, dedicada a CI y sin passphrase |
| `SSH_KNOWN_HOSTS` | Entrada OpenSSH de la clave del servidor, verificada por un canal de confianza |

`SSH_KNOWN_HOSTS` no es solo el fingerprint. Para un puerto distinto de 22, una
entrada tiene esta forma: `[host-o-ip]:65002 ssh-ed25519 AAAA...`. El hostname
debe coincidir con `SSH_HOST`. Obtenerla con `ssh-keyscan -p PUERTO HOST` y
comparar su fingerprint con el proporcionado por Hostinger/administración antes
de guardarla. El workflow exige `StrictHostKeyChecking yes`; no confía en una
clave obtenida automáticamente durante cada despliegue.

La dependencia `@headless-angular/renderer` proviene de otro repositorio GitHub.
El instalador convierte su URL SSH a HTTPS. Si ese repositorio es privado,
añadir **Settings → Secrets and variables → Actions → Repository secret**
`RENDERER_READ_TOKEN`: un token con acceso de lectura a Contents únicamente en
`jmgduarte1/wp-angular-renderer-module`. El `GITHUB_TOKEN` del frontend no concede
automáticamente acceso al otro repositorio. Si es público, no hace falta token.
Los PR de forks no reciben este secreto: una dependencia privada requiere un
flujo de contribución de confianza; no usar `pull_request_target` para ejecutar
código externo con credenciales.

GitHub documenta las [variables, secretos y restricciones por Environment](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
En repositorios privados, comprobar que el plan de GitHub admite Environments
y sus secretos. Como protección de las ramas, exigir el check
`Tests and production build` antes del merge.

## Preparar Hostinger una vez

1. Crear el dominio de producción y el subdominio/sitio de staging con document
   roots separados. Configurar DNS y certificados HTTPS válidos.
2. Activar SSH y registrar la clave pública correspondiente a `SSH_PRIVATE_KEY`.
   El usuario debe poder escribir en el document root y ejecutar `rsync`.
3. Confirmar que cada directorio está dedicado al frontend y no contiene
   WordPress, uploads ni otra aplicación. El workflow instala su propio
   `.htaccess`. Hospedar WordPress en otro document root/dominio.
4. En cada destino, crear el marcador `.portfolio-deploy-target`. Por ejemplo,
   después de comprobar la ruta real mediante SSH:

   ```bash
   cd /home/u123456789/domains/staging.example.com/public_html
   pwd
   touch .portfolio-deploy-target
   ```

   El despliegue falla si falta el marcador, el directorio no existe o encuentra
   `wp-config.php`. Esta preparación evita escribir accidentalmente en un sitio
   que ya tenga WordPress instalado.
5. Confirmar que `.htaccess`, `mod_rewrite` y `mod_headers` se aplican. Las rutas
   Angular sin archivo físico se sirven mediante `index.html`. Excluir HTML,
   `version.json` del caché de LiteSpeed/CDN si hay una capa
   adicional que ignore las cabeceras `no-store`.
6. Autorizar los dominios de frontend en CORS del backend y EmailMiddleware.
   Configurar Turnstile para esos dominios y su secreto correspondiente solo en
   EmailMiddleware. No se despliegan WordPress ni EmailMiddleware desde este repo.
7. Desactivar cualquier auto-deploy independiente de hPanel para estos mismos
   destinos, para que una publicación no se salte las validaciones de Actions.

## Primer despliegue, verificación y recuperación

Hacer un push a `staging` y revisar los dos jobs en la pestaña **Actions**. Una vez
validado staging, integrar los cambios en `produccion`.

El script sube assets/configuración primero, `index.html` después y `version.json`
al final. Comprueba por HTTPS que el dominio devuelve el SHA del commit y que
la portada responde correctamente. Esta comprobación no sustituye la prueba
manual de navegación, carga de contenido y contacto; no envía correos de prueba.

La transferencia no borra archivos remotos y conserva los assets con hash de
versiones anteriores para pestañas abiertas. No es una operación atómica para
el conjunto completo de archivos: si falla después de empezar a subir, puede
haber archivos actualizados. Reintentar la ejecución o revertir el commit y
desplegar de nuevo. Las variables del Environment se leen en cada ejecución:
si cambiaron, restaurar también los valores que se quieran recuperar.

También se conserva un artefacto con la salida exacta de cada build. No contiene
credenciales. Planificar la limpieza de assets antiguos por separado, verificando
qué versiones siguen siendo necesarias. Este workflow no purga automáticamente
el CDN ni implementa rollback automático.

## Validación local y bloqueo existente

```bash
npm run test:deployment
bash scripts/test-deploy-hostinger.sh
npm test -- --watch=false
npm run build
npm run build -- --output-mode static
```

Al implementar este workflow ya existía un fallo del presupuesto de estilos en
`src/app/app.scss`: aproximadamente 23,36 kB frente al máximo de 8 kB. **El pipeline
bloqueará el despliegue mientras ese build falle.** Resolver el tamaño del CSS o
revisar explícitamente su presupuesto como una decisión separada; el workflow
no omite esa validación ni amplía límites automáticamente.

Para probar `prepare-hostinger.mjs` manualmente se necesitan las variables
públicas anteriores y `GITHUB_SHA` (40 caracteres hexadecimales). Las credenciales
SSH solo hacen falta para la transferencia real.

## Datos pendientes del hosting

- Nombre exacto del plan y modalidad: Web/Cloud, Node.js Web Apps o VPS.
- Dominios HTTPS de staging y producción y sus document roots reales.
- Host, puerto, usuario SSH y clave pública/fingerprint del servidor.
- Confirmación de acceso SSH/rsync, permisos y directorios exclusivos del frontend.
- URLs HTTPS de WordPress y contacto por entorno, locales y claves públicas Turnstile.
- Confirmación de DNS, CORS y política de caché/CDN.

Guardar las claves privadas y tokens directamente en GitHub Secrets, no en la
documentación ni en mensajes del repositorio.
