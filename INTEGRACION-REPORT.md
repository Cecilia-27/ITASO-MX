# Informe de sincronización Desktop + Mobile — ITASO-MX

Fecha: 9 de octubre de 2026  
Alcance: **Desktop 1440 px preservado + adaptación Mobile 320–430 px**. La página `01 — DESKTOP 1440` del Figma actual se utilizó como referencia visual. El archivo conectado no contiene actualmente una página o frames visibles llamados `02 — MOBILE 390`; por ello la fase Mobile siguió la regla de contingencia aprobada: conservar componentes, jerarquía, colores y lenguaje visual de Desktop, usando los HTML/CSS/JavaScript existentes como fuente funcional.

## Desktop general

| Área | Estado | Trabajo realizado |
|---|---|---|
| Home / Explora | Completo | Hero, materiales, sección institucional, testimonios y CTAs sincronizados. Se incorporaron tres descargables reales en la sección de materiales y la fotografía real del equipo. |
| Catálogo de Juegos | Completo | Hero y composición alineados al Figma. Las tres tarjetas abren sus experiencias correctas; Lunch ya no apunta a `index.html`. |
| Recursos | Completo | Hero, jerarquía, filtros, búsqueda, biblioteca y CTAs sincronizados. Los archivos disponibles se muestran como recursos reales y los demás conservan el estado de prototipo. |
| Noticias | Completo | Hero con libro y composición editorial aprobada; las ocho fotografías reales se cargan antes de la captura. |
| Conoce ITASO | Completo | Hero, fotografía del equipo, misión, visión, principios, impacto y participación conservados; fotografía sin deformación. |
| Suscripción | Completo como prototipo | Hero, beneficios, planes, merch, promociones y FAQ conservados. Precios, convenios y beneficios comerciales continúan identificados como demostración. |
| Header global | Completo | Navegación unificada desde `script.js`, logo original sin filtros, estado activo por página, buscador y cuenta. |
| Footer global | Completo | Contenido y enlaces compartidos unificados desde `script.js`. |
| Sistema visual | Completo | Tipografía, botones, estados de foco/activo/deshabilitado y paletas específicas por sección alineados a los frames finales. |
| Ruta legacy | Corregido | `explora.html` es ahora sólo una redirección accesible a `index.html`; dejó de ser una segunda copia de la Home. |

Verificación visual realizada en navegador real a 1440 px: `index.html`, `juegos.html`, `recursos.html`, `noticias.html`, `conoce-itaso.html`, `suscripcion.html`, `iniciar-sesion.html`, `perfil.html` y los tres juegos. En las once páginas se comprobó ancho de documento igual al viewport, imágenes cargadas y ausencia de scroll horizontal.

## Juegos

### ¿Qué le mando de lunch?

- Flujo probado: portada → tiempo (5 min) → alimentos → opciones → detalle → volver.
- Selección múltiple probada con Zanahoria, Arroz y Pollo.
- El regreso desde resultados conserva el tiempo y las tres selecciones.
- “Guardar esta idea” muestra confirmación y el acceso “Volver a juegos” apunta al catálogo.
- Portada, lunchera, personajes, paleta morada, cards y botones sincronizados con Figma.

### ¿Cuánto le sirvo?

- Flujo probado: portada → rango de edad → referencias de manos → alimentos → plato → resultado.
- Se validaron los assets finales de especialista, mano y plato.
- El resultado ofrece regreso a Juegos y acceso al recurso de porciones.

### Detectives de la hidratación

- Flujo probado: portada → modalidad “juntos” → clasificación de cuatro bebidas → tres situaciones → selección de momentos → reto → caso resuelto.
- Se validaron detective, lupa, bebidas, escenarios, estados y cierre.
- El resultado ofrece regreso a Juegos y acceso a recursos de hidratación.

## Perfil y login

- `iniciar-sesion.html` mantiene email, contraseña, mostrar/ocultar, recordarme, recuperación, creación de cuenta y acceso sin cuenta.
- Se completó una sesión de prototipo con credenciales de prueba y el sistema cambió el CTA del header a “Mi cuenta”. No se agregó backend.
- `perfil.html` conserva avatar, nombre, rol, recursos, actividades y suscripción.
- El selector de personaje se probó abriendo el diálogo, seleccionando Papá, guardando, comprobando avatar y rol “Papá”, y restaurando después el estado Mamá.
- Guardar aplica el cambio; Cancelar y cerrar salen sin aplicar una selección nueva.
- El buscador global se probó abriendo el overlay, buscando “perfil” y navegando al resultado `perfil.html`.
- Menú y overlays conservan cierre con botón, fondo y Escape cuando ya estaba implementado.

## Recursos descargables

Se encontraron seis PDF reales en `assets/descargables/`. Todos se relacionaron con una tarjeta o CTA existente; no se inventaron archivos.

| Recurso | Archivo | Página | Estado |
|---|---|---|---|
| Tarjetas de conversación | `assets/descargables/CONVERSACION.pdf` | Recursos | Integrado |
| Guía de hidratación | `assets/descargables/HIDRATACION.pdf` | Recursos / Hidratación | Integrado |
| Mi semana de comidas | `assets/descargables/MI SEMANA DE COMIDAS.pdf` | Home / Recursos / Lunch | Integrado |
| Mi semana de hábitos | `assets/descargables/MI SEMANA DE HABITOS.pdf` | Recursos | Integrado |
| Guía de porciones | `assets/descargables/PORCIONES (1).pdf` | Home / Recursos / Porciones | Integrado |
| Detective ITASO | `assets/descargables/_DETECTIVE ITASO.pdf` | Home / Recursos / Hidratación | Integrado |

Los CTAs de archivo abren el PDF en una pestaña nueva con `rel="noopener"`. Las cards interactivas que no tienen un PDF equivalente conservan su flujo de prototipo y no simulan una descarga inexistente.

## Assets

- Se conservaron el logo multicolor original, fotografías, ilustraciones y SVG existentes; no se generaron ni recolorearon assets.
- Home utiliza `assets/img/Equipo ITASO.jpg` para la sección institucional.
- Noticias utiliza las fotografías editoriales reales y carga sus imágenes de forma anticipada para evitar capturas incompletas.
- Juegos utiliza los assets finales existentes: especialista/plato/mano en Porciones, mamá/niña con lupa en Hidratación y lunchera/personajes en Lunch.
- Los assets no usados no se eliminaron porque pueden pertenecer a estados, biblioteca visual o futuras actividades.

## Rutas corregidas

- Todas las referencias públicas de Inicio/Explora en `script.js` apuntan a `index.html`.
- El header, el menú móvil, el footer y el buscador compartidos navegan a los once HTML finales, no a rutas antiguas `#inicio`, `#juegos`, `#perfil`, etc.
- `juegos.html` y el catálogo dinámico apuntan a `que-le-mando-de-lunch.html`, `cuanto-le-sirvo.html` y `detectives-hidratacion.html`.
- Login conserva `returnTo` y regresa al HTML solicitado; cerrar sesión vuelve a `index.html`.
- Ninguna página pública enlaza `_backup_before_integration/`.
- Las páginas finales utilizan `styles.css?v=20261009-13` y `script.js?v=20261009-16` para invalidar versiones anteriores del navegador.

## Validación técnica

- `script.js` pasa la comprobación de sintaxis de Node.
- Las referencias locales `src`/`href` de los HTML finales se auditaron contra archivos reales.
- Los once documentos Desktop cargan su H1, header, footer e imágenes sin desbordamiento horizontal a 1440 px.
- Se probaron manualmente los flujos completos de Lunch, Porciones e Hidratación.
- El inicializador multipágina ahora activa la lógica correspondiente en cada HTML final; filtros, juegos, Perfil, Login, Recursos, Noticias y Suscripción ya no dependen de las plantillas retiradas de la versión SPA.
- Todas las categorías de Juegos, Recursos y Noticias se probaron en navegador y actualizan tarjetas, contador y estado seleccionado.
- Se probaron el buscador, el cambio de personaje y el inicio de sesión de prototipo.
- No se detectaron excepciones críticas de JavaScript ni recursos visuales rotos durante las pruebas.

## Mobile 390

- Se auditaron los once HTML finales en navegador real a **320, 375, 390 y 430 px**.
- En las 44 combinaciones página/ancho se obtuvo `document.documentElement.scrollWidth === document.documentElement.clientWidth`: no existe scroll horizontal global.
- El control visible más pequeño medido fue de 44 px de alto.
- Home, Catálogo de Juegos, Recursos, Noticias, Conoce ITASO, Suscripción, los tres juegos, Perfil y Login conservan lectura, imágenes y navegación sin escalar artificialmente Desktop.
- Los únicos desplazamientos horizontales conservados son locales e intencionales en chips, filtros, pestañas o carruseles.

## Header Mobile

- El header muestra logo, Buscar, acceso directo a Iniciar sesión/Mi cuenta y menú hamburguesa.
- Buscar, Cuenta y Menú miden 44 × 44 px; en 320 px el logo y los espacios se compactan sin desbordar.
- Menú probado: abrir, cerrar con Escape, cerrar con clic fuera y navegar a Juegos cerrando el panel.
- Buscador probado en 390 px: overlay de 352 px dentro del viewport, búsqueda “agua” y navegación al juego Detectives de la hidratación.

## Juegos Mobile

- **Lunch**: portada → tiempo → alimentos → tres opciones → detalle. La cuadrícula de alimentos permanece táctil y la selección de tres ingredientes se conserva después de volver al paso anterior.
- **Porciones**: portada → edad → cinco referencias de manos → tres grupos de plato → resultado. Los enlaces finales regresan a Juegos y al recurso de porciones.
- **Hidratación**: portada → modalidad → cuatro bebidas → tres situaciones → tres momentos → misión → caso resuelto. Los enlaces finales regresan a Juegos y al recurso de hidratación.
- Los tres resultados se alcanzaron en 390 px con ancho de documento igual al viewport y cero imágenes rotas.

## Perfil y Login Mobile

- El selector de personaje se presenta como diálogo de 352 px dentro del viewport de 390 px.
- Cancelar conserva a Mamá; guardar Papá actualiza avatar y rol; al terminar la prueba se restauró el estado Mamá.
- Login probado con email, contraseña, mostrar/ocultar, Recordarme y sesión de prototipo; el header cambió a “Mi cuenta”. Después se cerró la sesión de prueba y se restauró “Iniciar sesión”.
- Recuperación y registro abren diálogos de 352 px sin salir del viewport.
- El formulario vacío muestra mensajes accesibles en email, contraseña y estado general.

## Recursos Mobile

- Biblioteca en una columna, buscador, filtros y CTAs sin desbordamiento.
- La búsqueda “porciones” devuelve un recurso; filtros de Juegos y Noticias actualizan su estado seleccionado y contador sin recargar.
- Los accesos PDF visibles conservan un área táctil de 44 px y apertura en pestaña nueva con `rel="noopener"`.

## Descargables Mobile

| Recurso | Respuesta localhost | Tipo | Estado móvil |
|---|---:|---|---|
| Conversación | 200 | `application/pdf` | OK |
| Hidratación | 200 | `application/pdf` | OK |
| Mi semana de comidas | 200 | `application/pdf` | OK |
| Mi semana de hábitos | 200 | `application/pdf` | OK |
| Porciones | 200 | `application/pdf` | OK |
| Detective ITASO | 200 | `application/pdf` | OK |

No se modificaron sus rutas.

## Regresión Desktop

- Los cambios nuevos de layout están aislados en `@media (max-width: 767px)` y `@media (max-width: 359px)`.
- Se reabrieron los once HTML a 1440 px después de la adaptación: todos mantuvieron `scrollWidth === clientWidth`, header de 77 px, H1 de 72 px y cero imágenes rotas.
- Los flujos y la hoja JavaScript no se reescribieron; la adaptación se resolvió con CSS móvil y validación de las interacciones existentes.

## Pendientes

1. **Referencia Figma Mobile**: el archivo conectado no expone una página `02 — MOBILE 390`. La adaptación está validada funcional y responsive, pero una futura comparación pixel a pixel requiere que esos frames aparezcan en Figma.
2. **Backend**: login, creación/recuperación de cuenta, pagos, carrito y persistencia de cuenta siguen siendo demostraciones locales.
3. **Convenios comerciales**: precios, aliados, promociones y beneficios de Suscripción son contenido de prototipo; no representan convenios oficiales.
4. **Cards sin archivo fuente**: cuando no existe un PDF equivalente, se mantiene “Ver prototipo” o el estado informativo en vez de inventar una descarga.
5. **Redes sociales**: el footer conserva “próximamente” porque no existen destinos oficiales aprobados.
6. **Deuda CSS**: la hoja global mantiene capas históricas y varios `!important`; se añadió una capa Desktop acotada para sincronizar Figma sin reescribir ni arriesgar los flujos existentes.

## Bugs conocidos

- No quedan bugs críticos reproducibles en Desktop o Mobile dentro del alcance probado.
- Los nombres `assets/img/"Yo elijo ser".jpg` y `assets/img/Impulsan en México políticas .jpg` funcionan, pero las comillas/espacios son frágiles para una futura cadena de build; conviene normalizarlos en una tarea separada.
- Las tarjetas de merch de Suscripción tienen una animación de entrada breve; para una captura determinista se recomienda esperar aproximadamente un segundo después de cargar.

## Publicación

- Se añadió `.github/workflows/pages.yml` para publicar el sitio estático mediante GitHub Pages desde `main`.
- `.gitignore` excluye backups, `_build/`, `assets.zip`, `figma-preview.html` y archivos temporales.
- La carpeta todavía necesita vincularse a un repositorio remoto y autenticar GitHub antes del primer envío.

## Archivos modificados

- HTML: `index.html`, `juegos.html`, `recursos.html`, `noticias.html`, `conoce-itaso.html`, `suscripcion.html`, `iniciar-sesion.html`, `perfil.html`, `que-le-mando-de-lunch.html`, `cuanto-le-sirvo.html`, `detectives-hidratacion.html`, `explora.html`.
- Sistema: `styles.css`, `script.js`.
- Documentación: `README.md`, `INTEGRACION-REPORT.md`.

En la fase Mobile se modificó únicamente la capa responsive de `styles.css`, las referencias de versión en los once HTML finales y esta documentación; la lógica de `script.js` se conservó.
