# ITASO-MX — Sitio estático multipágina

Sitio institucional y de prototipo de ITASO-MX: recursos, juegos, noticias, perfil y suscripción. HTML + CSS + JavaScript vanilla, sin frameworks y sin paso de build.

## Cómo ejecutarlo

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/
```

Cualquier servidor estático funciona (GitHub Pages, Netlify, Vercel). Todas las rutas son relativas, así que también funciona desde una subcarpeta.

## Estructura

```
index.html            Entrada oficial (homepage, contenido "Explora")
explora.html          Redirección a index.html (legacy)
juegos.html           Catálogo general de juegos
que-le-mando-de-lunch.html  Juego interactivo para armar un lunch
cuanto-le-sirvo.html  Juego interactivo de porciones
detectives-hidratacion.html  Juego interactivo de hidratación
recursos.html         Biblioteca de recursos y descargables
noticias.html         Noticias que inspiran
conoce-itaso.html     Quiénes somos / impacto / participa
perfil.html           Mi perfil (prototipo con cuenta demo)
iniciar-sesion.html   Acceso y registro (prototipo)
suscripcion.html      Planes, beneficios, merch y pago (demo)
styles.css            Hoja de estilos global única (~12.5k líneas)
script.js             Lógica de todas las páginas (~3.4k líneas)
assets/               Imágenes, ilustraciones SVG y fuentes
_backup_before_integration/  Copia completa previa a la integración
```

## Arquitectura

- **Header y footer compartidos**: cada página declara `<header data-site-header>` y `<footer data-site-footer>`; `script.js` (`renderSharedChrome`) los inyecta al cargar. La navegación vive en un solo lugar.
- **Página activa**: el `<body>` lleva `data-page="explora|juegos|recursos|news|conoce|profile|login|subscription"` y el header resalta el ítem correspondiente.
- **Rutas**: siempre relativas (`index.html`, `assets/...`). Nunca rutas absolutas ni `file://`.
- **Cache-busting**: `styles.css?v=20261009-13` y `script.js?v=20261009-16` en las páginas finales. Si editas CSS/JS, sube la versión.
- **Favicons**: SVG inline (data URI) por página, no hay carpeta `favicon/`.
- **Estados demo**: sesión, perfil ("Laura"), recursos guardados y carrito se simulan con `localStorage`/`sessionStorage`.

## Páginas y navegación

| Página | Archivo | `data-page` | Ítem activo |
|---|---|---|---|
| Inicio / Explora | `index.html` | explora | Explora |
| Juegos | `juegos.html` | juegos | Juegos |
| ¿Qué le mando de lunch? | `que-le-mando-de-lunch.html` | juegos | Juegos |
| ¿Cuánto le sirvo? | `cuanto-le-sirvo.html` | juegos | Juegos |
| Detectives de la hidratación | `detectives-hidratacion.html` | juegos | Juegos |
| Recursos | `recursos.html` | recursos | Recursos |
| Noticias | `noticias.html` | news | Noticias |
| Conoce ITASO.MX | `conoce-itaso.html` | conoce | Conoce ITASO.MX |
| Mi perfil | `perfil.html` | profile | Mi perfil |
| Iniciar sesión | `iniciar-sesion.html` | login | (botón de cuenta) |
| Suscripción | `suscripcion.html` | subscription | Suscripción |

## Assets

- `assets/foods/`, `assets/characters/`, `assets/hands/`, `assets/plate/`, `assets/lunchboxes/`, `assets/jarrones/`: ilustraciones de los juegos y secciones.
- `assets/img/`: fotografías editoriales (noticias, conoce, perfil).
- `assets/fonts/`: Alegreya Sans y Asap (declaradas en `styles.css`).
- `assets/LOGO ITASO.jpg` (header) y `assets/logo-itaso.svg` (footer): logos oficiales multicolor, sin filtros ni recoloreación.
- `assets/Paleta Cromatica.ai` y `assets/hands.zip`: material de diseño, no se sirven al navegador.

## Despliegue

No hay un paso de build local. El flujo `.github/workflows/pages.yml` publica automáticamente los HTML finales, `styles.css`, `script.js` y `assets/` en GitHub Pages al enviar cambios a `main`. La publicación excluye copias de seguridad, archivos de Figma y herramientas locales mediante `.gitignore` y una carpeta temporal de despliegue.

Para activarlo por primera vez:

1. Crear o vincular un repositorio de GitHub.
2. En **Settings → Pages**, elegir **GitHub Actions** como fuente.
3. Enviar la rama `main`; el enlace público aparecerá en la ejecución `Publicar ITASO-MX en GitHub Pages`.

Ver `INTEGRACION-REPORT.md` para el detalle de la integración y los puntos abiertos.

## Responsive

- Desktop aprobado: 1440 px.
- Mobile validado: 320, 375, 390 y 430 px.
- Los ajustes móviles viven en la hoja global dentro de breakpoints de hasta 767 px; no se utiliza `zoom`, `transform: scale()` ni una segunda hoja móvil.
- El header móvil mantiene logo, búsqueda, cuenta y menú. Los tres juegos, Perfil, Login, filtros y descargables conservan su funcionamiento táctil.
- El Figma conectado no contiene actualmente una página visible `02 — MOBILE 390`; la adaptación utiliza el sistema visual Desktop aprobado como contingencia y queda lista para una comparación pixel a pixel cuando esos frames estén disponibles.

## Verificación

```bash
python3 -m http.server 8080        # terminal 1
# terminal 2: crawleo de enlaces + capturas 1440/390 con Playwright
```

Comprobaciones de la sincronización: referencias locales válidas, anclas principales existentes, sin scroll horizontal a 1440/320/375/390/430 px, flujos completos de los tres juegos, login de prototipo, buscador, selector de personaje y seis descargables reales validados.
