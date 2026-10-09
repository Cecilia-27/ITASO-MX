# ITASO-MX — Guía de captura para Figma Code to Canvas

El sitio es multipágina: usa **Figma Code to Canvas / `generate_figma_design`** sobre cada URL del servidor local para conservar textos, vectores, imágenes y estructura como capas editables. No sustituir este flujo por screenshots rasterizados.

## Servidor

```bash
python3 -m http.server 8080   # http://localhost:8080/
```

## Páginas a capturar

| # | Página | URL | Viewports | Notas |
|---|---|---|---|---|
| 1 | Inicio | `index.html` | 1440×900 y 390×844 | Entrada oficial. Contenido "Explora" (hero, juegos, materiales, conoce, testimonios). |
| 2 | Juegos | `juegos.html` | 1440×900 y 390×844 | Catálogo general de los tres juegos. No contiene el flujo de Lunch. |
| 3 | ¿Qué le mando de lunch? | `que-le-mando-de-lunch.html` | 1440×900 y 390×844 | Juego funcional. Capturar portada, tiempo, alimentos, opciones y resultado/detalle. |
| 4 | ¿Cuánto le sirvo? | `cuanto-le-sirvo.html` | 1440×900 y 390×844 | Captura el estado inicial; los pasos del juego son un solo flujo. |
| 5 | Recursos | `recursos.html` | 1440×900 y 390×844 | Secciones: necesidades, destacado, biblioteca. |
| 6 | Noticias | `noticias.html` | 1440×900 y 390×844 | Incluye búsqueda y newsletter. |
| 7 | Conoce ITASO.MX | `conoce-itaso.html` | 1440×900 y 390×844 | Quiénes somos, qué hacemos, participa. |
| 8 | Mi perfil | `perfil.html` | 1440×900 y 390×844 | Cuenta demo "Laura"; pestañas de recursos/actividad/preferencias. |
| 9 | Iniciar sesión | `iniciar-sesion.html` | 1440×900 y 390×844 | Estado por defecto (formularios cerrados). |
| 10 | Suscripción | `suscripcion.html` | 1440×900 y 390×844 | Beneficios, planes, merch, promociones, FAQ. Ver nota de animación. |

## No capturar

- **`explora.html`**: es una redirección a `index.html` (página legacy). No aporta diseño propio.
- **`figma-preview.html`**: índice de captura; no forma parte del sitio.
- **`_backup_before_integration/`**: copia de seguridad, no es parte del sitio.

## Consideraciones

1. **Header por JavaScript**: la navegación se inyecta con `script.js`. Espera a que la página termine de cargar (o recaptura una segunda vez) antes de capturar; si el header sale vacío, la captura se hizo antes del render.
2. **Animación de merch en Suscripción**: las tarjetas de merch usan la animación de entrada `screen-in` (240 ms) y su fotograma puede variar entre capturas. Espera ~1 s tras cargar y, si comparas capturas, revisa la zona de merch (derecha, entre los bloques de beneficios y promociones).
3. **Estados interactivos** (opcionales, sólo si los necesitas en Figma):
   - Flujo de `que-le-mando-de-lunch.html`: portada → tiempo → alimentos → opciones → resultado/detalle.
   - Menú móvil abierto (390 px, botón de hamburguesa).
   - Diálogo de búsqueda (ícono de lupa en el header).
   - Login con sesión activa (cualquier email/contraseña en el prototipo) para ver "Mi cuenta" en el header.
   - Selector de personaje en `perfil.html` (botón "Cambiar personaje").
4. **Rutas relativas**: Code to Canvas debe cargar desde `http://localhost:8080/...`; no uses `file://`, porque el JS inyectado y las rutas pueden fallar.
5. **Nombres de página**: usa los títulos de la tabla para nombrar los frames en Figma (`01 Inicio`, `02 Juegos`, ...).
6. **Contenido dinámico**: noticias, recursos y el perfil usan datos demo cargados por JS; captura después de que terminen de renderizar (network idle + 1 s).

## Paleta y tipografía (para los estilos de Figma)

- Verde principal `#075C36` · Azul marca `#3EAFD7` · Azul profundo `#123F52` · Mostaza `#F4C62B` · Rosa `#EB7A8A` · Rojo editorial `#D7193F` / `#A80F2E` · Crema `#FCFAF5` · Texto `#20292D`.
- Tipografías: **Alegreya Sans** (títulos) y **Asap** (cuerpo), ambas en `assets/fonts/`.
- Radios: 30 / 22 / 16 px. Sombras suaves cálidas. Transición base 240 ms.
