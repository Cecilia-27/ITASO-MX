"use strict";

const STORAGE_KEYS = {
  profile: "itasoCaregiverProfile",
  avatar: "caregiverAvatar",
  savedResources: "itasoSavedResources",
  recentActivities: "itasoRecentActivities",
  subscription: "itasoSubscription"
};

const SITE_ROUTES = {
  inicio: "index.html",
  juegos: "juegos.html",
  recursos: "recursos.html",
  noticias: "noticias.html",
  conoce: "conoce-itaso.html",
  perfil: "perfil.html",
  login: "iniciar-sesion.html",
  suscripcion: "suscripcion.html",
  lunch: "que-le-mando-de-lunch.html",
  cuanto: "cuanto-le-sirvo.html",
  detectives: "detectives-hidratacion.html"
};

function readStoredJson(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function isPrototypeLoggedIn() {
  try {
    return window.sessionStorage.getItem("isLoggedIn") === "true";
  } catch {
    return false;
  }
}

function protectProfileRoute() {
  if (document.body.dataset.page !== "profile") return true;
  document.body.classList.add("is-authorized");
  return true;
}

function getStoredAvatarId() {
  const allowed = ["mama", "papa", "abuela", "otro"];
  try {
    const directAvatar = window.localStorage.getItem(STORAGE_KEYS.avatar);
    if (allowed.includes(directAvatar)) return directAvatar;
    const storedProfile = readStoredJson(STORAGE_KEYS.profile, null);
    return allowed.includes(storedProfile?.avatar) ? storedProfile.avatar : null;
  } catch {
    return null;
  }
}

function headerAvatarMarkup(avatar) {
  if (!avatar) return "";
  const image = avatar === "otro" ? "mama" : avatar;
  return `<span class="account-mini-avatar" aria-hidden="true"><img src="assets/characters/${image}.svg" alt=""></span>`;
}

function interfaceIcon(name) {
  const icons = {
    search: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>',
    user: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.5"></circle><path d="M5.5 20c.5-4.2 2.7-6.3 6.5-6.3s6 2.1 6.5 6.3"></path></svg>',
    instagram: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="5"></rect><circle cx="12" cy="12" r="3.5"></circle><path d="M17.5 6.7h.01"></path></svg>',
    facebook: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 20v-7h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6H18V3.8c-.5-.1-1.4-.2-2.5-.2-2.5 0-4.1 1.5-4.1 4.2V10H9v3h2.4v7"></path></svg>',
    youtube: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="6" width="18" height="12" rx="4"></rect><path d="m10 9 5 3-5 3Z"></path></svg>',
    grid: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="6" height="6" rx="1.5"></rect><rect x="14" y="4" width="6" height="6" rx="1.5"></rect><rect x="4" y="14" width="6" height="6" rx="1.5"></rect><rect x="14" y="14" width="6" height="6" rx="1.5"></rect></svg>',
    vegetables: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 8c-3.8 0-6 2.2-6 5.7C6 17.5 8.2 20 12 20s6-2.5 6-6.3C18 10.2 15.8 8 12 8Z"></path><path d="M12 8c0-2.6 1.5-4.1 4.2-4.4M12 8C10.7 5.8 8.9 5 6.7 5"></path></svg>',
    fruit: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 8c-4-2.2-7 .6-7 5 0 4.7 2.7 7 7 7s7-2.3 7-7c0-4.4-3-7.2-7-5Z"></path><path d="M12 8c.1-2.7 1.7-4.2 4.5-4.5M12 7c-1.4-2-3.2-2.7-5.2-2"></path></svg>',
    grains: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21V5M12 8c-2.7 0-4.4-1.2-5.2-3.5M12 12c-2.7 0-4.6-1.2-5.6-3.4M12 16c-2.8 0-4.8-1.1-6-3.2M12 8c2.7 0 4.4-1.2 5.2-3.5M12 12c2.7 0 4.6-1.2 5.6-3.4M12 16c2.8 0 4.8-1.1 6-3.2"></path></svg>',
    protein: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.5 16.5c-2.8-2.8-2.8-7.2 0-10s7.2-2.8 10 0 2.8 7.2 0 10-7.2 2.8-10 0Z"></path><path d="m8.5 16.5-3.8 3.8M4.7 20.3l-1-1M6.2 18.8l-1-1"></path></svg>',
    dairy: '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 4h8l2 4v12H6V8l2-4Z"></path><path d="M6 8h12M9 4v4"></path></svg>'
  };
  return icons[name] || "";
}

let menuButton = null;
let mobileMenu = null;

function renderSharedChrome() {
  const currentPage = document.body.dataset.page || "";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  const activeAttributes = (page) => currentPage === page ? ' active" aria-current="page"' : '"';
  const isLoggedIn = isPrototypeLoggedIn();
  const storedAvatar = getStoredAvatarId();

  const desktopAccount = isLoggedIn ? `
    <a class="login-button account-button${currentPage === "profile" ? " is-current" : ""}" href="perfil.html"${currentPage === "profile" ? ' aria-current="page"' : ""}>
      ${headerAvatarMarkup(storedAvatar)} Mi cuenta
    </a>
  ` : `
    <a class="login-button${currentPage === "login" ? " is-current" : ""}" href="iniciar-sesion.html"${currentPage === "login" ? ' aria-current="page"' : ""}>
      ${interfaceIcon("user")} Iniciar sesión
    </a>
  `;

  const mobileAccount = isLoggedIn
    ? '<button class="nav-link mobile-logout-button" type="button" data-action="request-logout">Cerrar sesión</button>'
    : `<a class="nav-link${activeAttributes("login")} href="iniciar-sesion.html">${interfaceIcon("user")} Iniciar sesión</a>`;

  if (header) {
    header.innerHTML = `
      <div class="header-inner">
        <a class="brand-link" href="index.html" aria-label="ITASO-MX, ir al inicio">
          <img class="brand-logo" src="assets/LOGO ITASO.jpg" alt="ITASO MX">
        </a>

        <nav class="desktop-nav" aria-label="Navegación principal">
          <a class="nav-link nav-explora${activeAttributes("explora")} href="index.html">Explora</a>
          <a class="nav-link nav-juegos${activeAttributes("juegos")} href="juegos.html">Juegos</a>
          <a class="nav-link nav-recursos${activeAttributes("recursos")} href="recursos.html">Recursos</a>
          <a class="nav-link nav-noticias${activeAttributes("news")} href="noticias.html">Noticias</a>
          <a class="nav-link nav-conoce${activeAttributes("conoce")} href="conoce-itaso.html">Conoce ITASO.MX</a>
          <a class="nav-link nav-perfil${activeAttributes("profile")} href="perfil.html">Mi perfil</a>
          <a class="nav-link subscription-nav-link${activeAttributes("subscription")} href="suscripcion.html"><span aria-hidden="true">✦</span> Suscripción</a>
        </nav>

        <div class="header-actions">
          <button class="icon-button" type="button" data-action="search" aria-label="Buscar">
            ${interfaceIcon("search")}
          </button>
          ${desktopAccount}
          <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <nav class="mobile-menu" id="mobile-menu" aria-label="Menú móvil" hidden>
        <a class="nav-link nav-explora${activeAttributes("explora")} href="index.html">Explora</a>
        <a class="nav-link nav-juegos${activeAttributes("juegos")} href="juegos.html">Juegos</a>
        <a class="nav-link nav-recursos${activeAttributes("recursos")} href="recursos.html">Recursos</a>
        <a class="nav-link nav-noticias${activeAttributes("news")} href="noticias.html">Noticias</a>
        <a class="nav-link nav-conoce${activeAttributes("conoce")} href="conoce-itaso.html">Conoce ITASO.MX</a>
        <a class="nav-link subscription-mobile-link${activeAttributes("subscription")} href="suscripcion.html">Suscripción <small>NUEVO</small></a>
        <a class="nav-link nav-perfil${activeAttributes("profile")} href="perfil.html">${interfaceIcon("user")} Mi perfil</a>
        ${mobileAccount}
      </nav>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="site-container footer-grid">
        <div class="footer-brand">
          <a href="index.html" aria-label="ITASO-MX, ir al inicio">
            <img src="assets/logo-itaso.svg" alt="ITASO MX">
          </a>
          <p>Herramientas claras para acompañar hábitos saludables en familia.</p>
        </div>

        <nav class="footer-column" aria-labelledby="footer-contacto">
          <h2 id="footer-contacto">Contacto</h2>
          <ul><li>Alimentación</li><li>Hidratación</li><li>Movimiento</li><li>Descanso</li></ul>
        </nav>

        <nav class="footer-column" aria-labelledby="footer-recursos">
          <h2 id="footer-recursos">Recursos</h2>
          <ul>
            <li><a href="recursos.html#descargables">Material descargable</a></li>
            <li><button type="button" data-action="unavailable" data-label="Preguntas frecuentes">Preguntas frecuentes</button></li>
            <li><a href="noticias.html">Noticias</a></li>
            <li><a href="suscripcion.html">Suscripción</a></li>
          </ul>
        </nav>

        <nav class="footer-column" aria-labelledby="footer-conoce">
          <h2 id="footer-conoce">Conoce ITASO</h2>
          <ul>
            <li><a href="conoce-itaso.html#quienes-somos">Quiénes somos</a></li>
            <li><a href="conoce-itaso.html#que-hacemos">Nuestro impacto</a></li>
            <li><a href="conoce-itaso.html#participa">Contacto</a></li>
          </ul>
        </nav>

        <div class="footer-connect">
          <h2>Síguenos</h2>
          <div class="social-list" aria-label="Redes sociales próximamente">
            <span aria-hidden="true">${interfaceIcon("instagram")}</span><span aria-hidden="true">${interfaceIcon("facebook")}</span><span aria-hidden="true">${interfaceIcon("youtube")}</span>
          </div>
          <form class="newsletter-form" data-newsletter-form>
            <label for="newsletter-email">Suscríbete a nuestro boletín</label>
            <div>
              <input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Tu correo electrónico" required>
              <button type="submit" aria-label="Suscribirme al boletín">→</button>
            </div>
          </form>
        </div>
      </div>
      <div class="site-container footer-bottom">© 2026 ITASO-MX®. Todos los derechos reservados.</div>
    `;
  }

  if ((isLoggedIn || currentPage === "profile") && !document.querySelector("#logout-dialog")) {
    document.body.insertAdjacentHTML("beforeend", `
      <dialog class="auth-dialog logout-dialog" id="logout-dialog" aria-labelledby="logout-title">
        <div class="auth-dialog-card logout-dialog-card">
          <button class="dialog-close" type="button" data-dialog-close aria-label="Cerrar confirmación">×</button>
          <span class="section-kicker">TU CUENTA</span>
          <h2 id="logout-title">¿Quieres cerrar sesión?</h2>
          <p>Podrás seguir explorando ITASO y volver a iniciar sesión cuando quieras.</p>
          <div class="logout-dialog-actions">
            <button class="button button-secondary" type="button" data-dialog-close>Cancelar</button>
            <button class="button button-primary logout-confirm" type="button" data-action="confirm-logout">Cerrar sesión</button>
          </div>
        </div>
      </dialog>
    `);
  }

  menuButton = document.querySelector(".menu-button");
  mobileMenu = document.querySelector("#mobile-menu");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (menuButton.getAttribute("aria-expanded") === "true") closeMobileMenu({ restoreFocus: true });
      else openMobileMenu();
    });
  }
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("¡Gracias! Tu correo quedó registrado en este prototipo.");
      event.currentTarget.reset();
    });
  });
}

if (protectProfileRoute()) renderSharedChrome();

const foods = [
  { id: "zanahoria", name: "Zanahoria", category: "Verduras", asset: "assets/foods/zanahoria.svg" },
  { id: "lechuga", name: "Lechuga", category: "Verduras", asset: "assets/foods/lechuga.svg" },
  { id: "jitomate", name: "Jitomate", category: "Verduras", asset: "assets/foods/jitomate.svg" },
  { id: "pepino", name: "Pepino", category: "Verduras", asset: "assets/foods/pepino.svg" },
  { id: "brocoli", name: "Brócoli", category: "Verduras", asset: "assets/foods/brocoli.svg" },
  { id: "manzana", name: "Manzana", category: "Frutas", asset: "assets/foods/manzana.svg" },
  { id: "platano", name: "Plátano", category: "Frutas", asset: "assets/foods/platano.svg" },
  { id: "fresa", name: "Fresa", category: "Frutas", asset: "assets/foods/fresa.svg" },
  { id: "uvas", name: "Uvas", category: "Frutas", asset: "assets/foods/uvas.svg" },
  { id: "mandarina", name: "Mandarina", category: "Frutas", asset: "assets/foods/mandarina.svg" },
  { id: "arroz", name: "Arroz", category: "Cereales", asset: "assets/foods/arroz-blanco.svg" },
  { id: "tortilla", name: "Tortilla", category: "Cereales", asset: "assets/foods/tortillas.svg" },
  { id: "pan", name: "Pan", category: "Cereales", asset: "assets/foods/pan-integral.svg" },
  { id: "pasta", name: "Pasta", category: "Cereales", asset: "assets/foods/pasta.svg" },
  { id: "avena", name: "Avena", category: "Cereales", asset: "assets/foods/avena.svg" },
  { id: "pollo", name: "Pollo", category: "Proteínas", asset: "assets/foods/pollo.svg" },
  { id: "huevo", name: "Huevo", category: "Proteínas", asset: "assets/foods/huevo.svg" },
  { id: "atun", name: "Atún", category: "Proteínas", asset: "assets/foods/atun.svg" },
  { id: "frijoles", name: "Frijoles", category: "Proteínas", asset: "assets/foods/frijol.svg" },
  { id: "queso", name: "Queso", category: "Lácteos", asset: "assets/foods/queso.svg" },
  { id: "leche", name: "Leche", category: "Lácteos", asset: "assets/foods/leche.svg" },
  { id: "yogur", name: "Yogur", category: "Lácteos", asset: "assets/foods/yogur bebible.svg" }
];

const categories = [
  { name: "Todos", icon: interfaceIcon("grid") },
  { name: "Verduras", icon: interfaceIcon("vegetables") },
  { name: "Frutas", icon: interfaceIcon("fruit") },
  { name: "Cereales", icon: interfaceIcon("grains") },
  { name: "Proteínas", icon: interfaceIcon("protein") },
  { name: "Lácteos", icon: interfaceIcon("dairy") }
];

const lunchTemplates = [
  {
    id: "quesadilla-frijol",
    name: "Quesadilla de frijoles con queso",
    main: "Quesadilla de frijoles con queso",
    side: "Uvas",
    drink: "Agua simple",
    time: 5,
    timeLabel: "5 min",
    ingredients: ["tortilla", "frijoles", "queso", "uvas"],
    box: "assets/lunchboxes/amarilla.svg"
  },
  {
    id: "torta-pollo",
    name: "Mini torta de pollo",
    main: "Mini torta de pollo",
    side: "Pepino",
    drink: "Agua de jamaica sin azúcar",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["pan", "pollo", "lechuga", "jitomate", "pepino"],
    box: "assets/lunchboxes/rosa.svg"
  },
  {
    id: "sincronizada-pollo",
    name: "Sincronizada de pollo y queso",
    main: "Sincronizada de pollo y queso",
    side: "Manzana",
    drink: "Leche",
    time: 15,
    timeLabel: "10–15 min",
    ingredients: ["tortilla", "pollo", "queso", "manzana", "leche"],
    box: "assets/lunchboxes/azul.svg"
  },
  {
    id: "rollitos-huevo",
    name: "Rollitos de huevo y lechuga",
    main: "Rollitos de tortilla con huevo",
    side: "Mandarina",
    drink: "Agua simple",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["tortilla", "huevo", "lechuga", "mandarina"],
    box: "assets/lunchboxes/amarilla.svg"
  },
  {
    id: "sandwich-pollo",
    name: "Sándwich de pollo crujiente",
    main: "Sándwich de pollo y verduras",
    side: "Manzana",
    drink: "Agua simple",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["pan", "pollo", "lechuga", "jitomate", "manzana"],
    box: "assets/lunchboxes/azul.svg"
  },
  {
    id: "arroz-pollo",
    name: "Arroz con pollo y verduras",
    main: "Tazón de arroz con pollo",
    side: "Pepino y jitomate",
    drink: "Agua simple",
    time: 15,
    timeLabel: "10–15 min",
    ingredients: ["arroz", "pollo", "pepino", "jitomate"],
    box: "assets/lunchboxes/rosa.svg"
  },
  {
    id: "avena-yogur",
    name: "Vasito de avena, yogur y fruta",
    main: "Avena con yogur",
    side: "Fresa y plátano",
    drink: "Agua simple",
    time: 5,
    timeLabel: "5 min",
    ingredients: ["avena", "yogur", "fresa", "platano"],
    box: "assets/lunchboxes/amarilla.svg"
  },
  {
    id: "taquitos-frijol",
    name: "Taquitos suaves de frijol",
    main: "Tacos de frijol con lechuga",
    side: "Mandarina",
    drink: "Agua simple",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["tortilla", "frijoles", "lechuga", "mandarina"],
    box: "assets/lunchboxes/rosa.svg"
  },
  {
    id: "pasta-atun",
    name: "Ensalada de pasta con atún",
    main: "Pasta con atún y verduras",
    side: "Uvas",
    drink: "Agua simple",
    time: 25,
    timeLabel: "20–25 min",
    ingredients: ["pasta", "atun", "jitomate", "brocoli", "uvas"],
    box: "assets/lunchboxes/azul.svg"
  },
  {
    id: "pan-huevo",
    name: "Pan con huevo y jitomate",
    main: "Pan tostado con huevo",
    side: "Fresas",
    drink: "Leche",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["pan", "huevo", "jitomate", "fresa", "leche"],
    box: "assets/lunchboxes/amarilla.svg"
  },
  {
    id: "arroz-huevo",
    name: "Arroz con huevo y brócoli",
    main: "Tazón de arroz con huevo",
    side: "Brócoli suave",
    drink: "Agua simple",
    time: 15,
    timeLabel: "15 min",
    ingredients: ["arroz", "huevo", "brocoli"],
    box: "assets/lunchboxes/rosa.svg"
  },
  {
    id: "quesadilla-pollo",
    name: "Quesadilla de pollo",
    main: "Quesadilla con pollo y queso",
    side: "Pepino",
    drink: "Agua simple",
    time: 10,
    timeLabel: "10 min",
    ingredients: ["tortilla", "pollo", "queso", "pepino"],
    box: "assets/lunchboxes/azul.svg"
  }
];

const optionLabels = [
  { kicker: "Opción 1", label: "Rápida y sencilla", className: "card-yellow" },
  { kicker: "Opción 2", label: "Con lo que tienes", className: "card-pink" },
  { kicker: "Opción 3", label: "Para variar", className: "card-blue" }
];

function storedResourceIds() {
  const resources = readStoredJson(STORAGE_KEYS.savedResources, []);
  return Array.isArray(resources) ? resources.map((resource) => resource?.id).filter(Boolean) : [];
}

const state = {
  screen: "intro",
  step: 0,
  time: null,
  category: "Todos",
  selectedFoods: new Set(),
  preference: "",
  lunchOptions: [],
  selectedLunch: null,
  savedIdeas: new Set(storedResourceIds()),
  generation: 0
};

let screens = null;
let foodGrid = null;
let selectedList = null;
let selectedCount = null;
let foodsCount = null;
let categoryFilters = null;
let preferenceInput = null;
let timeNext = null;
let generateButton = null;
let lunchResults = null;
let detailChoice = null;
let saveIdeaButton = null;
const searchDialog = document.querySelector("#search-dialog");
const toast = document.querySelector("#toast");
let toastTimer;

function normalizeText(value = "") {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const siteSearchEntries = [
  { title: "Inicio · Explora", description: "Bienestar, hábitos y contenidos destacados", href: "index.html", keywords: "inicio explora home bienestar familia" },
  { title: "Juegos", description: "Catálogo de experiencias interactivas", href: "juegos.html", keywords: "juegos actividades experiencias" },
  { title: "¿Qué le mando de lunch?", description: "Ideas de lunch con lo disponible en casa", href: "que-le-mando-de-lunch.html", keywords: "lunch alimentos comida escuela" },
  { title: "¿Cuánto le sirvo?", description: "Guía visual de porciones", href: "cuanto-le-sirvo.html", keywords: "porciones manos plato alimentos" },
  { title: "Detectives de la hidratación", description: "Actividad familiar sobre bebidas e hidratación", href: "detectives-hidratacion.html", keywords: "agua bebidas hidratacion detectives" },
  { title: "Recursos", description: "Guías, actividades y descargables", href: "recursos.html", keywords: "recursos pdf guias descargables materiales" },
  { title: "Noticias", description: "Novedades e información confiable", href: "noticias.html", keywords: "noticias articulos investigacion" },
  { title: "Conoce ITASO.MX", description: "Misión, equipo e impacto", href: "conoce-itaso.html", keywords: "conoce itaso equipo mision vision" },
  { title: "Mi perfil", description: "Recursos guardados y actividades", href: "perfil.html", keywords: "perfil cuenta avatar personaje guardados" },
  { title: "Suscripción", description: "Planes y beneficios del prototipo", href: "suscripcion.html", keywords: "suscripcion planes beneficios merch" }
];

function matchingSiteSearchEntries(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return siteSearchEntries.slice(0, 5);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return siteSearchEntries.filter((entry) => {
    const haystack = normalizeText(`${entry.title} ${entry.description} ${entry.keywords}`);
    return terms.every((term) => haystack.includes(term));
  });
}

function initSiteSearch() {
  if (!searchDialog) return;
  const input = searchDialog.querySelector("#site-search");
  const row = searchDialog.querySelector(".search-row");
  if (!input || !row) return;

  const results = document.createElement("div");
  results.className = "site-search-results";
  results.setAttribute("role", "list");
  results.setAttribute("aria-live", "polite");
  row.insertAdjacentElement("afterend", results);

  const render = () => {
    const matches = matchingSiteSearchEntries(input.value).slice(0, 6);
    results.innerHTML = matches.length
      ? matches.map((entry) => `
          <a href="${escapeHtml(entry.href)}" role="listitem">
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.description)}</span>
          </a>
        `).join("")
      : '<p class="site-search-empty">No encontramos una coincidencia. Prueba con “juegos”, “recursos” o “perfil”.</p>';
  };

  input.addEventListener("input", render);
  searchDialog.addEventListener("click", (event) => {
    if (event.target === searchDialog) searchDialog.close("close");
  });
  render();
}

function getFood(id) {
  return foods.find((food) => food.id === id);
}

function foodVisual(food, className = "") {
  if (!food) return `<span class="food-fallback ${className}" aria-hidden="true">✦</span>`;
  if (food.asset) return `<img class="${className}" src="${food.asset}" alt="">`;
  return `<span class="food-fallback ${className}" aria-hidden="true">${food.emoji || "✦"}</span>`;
}

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function goToStep(screenName, options = {}) {
  if (!screens[screenName]) return;
  Object.entries(screens).forEach(([name, screen]) => {
    const isActive = name === screenName;
    screen.hidden = !isActive;
    screen.classList.toggle("is-active", isActive);
  });

  state.screen = screenName;
  state.step = screenName === "time" ? 1 : screenName === "foods" ? 2 : screenName === "results" || screenName === "detail" ? 3 : 0;

  if (!options.keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = screens[screenName].querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    window.setTimeout(() => heading.focus({ preventScroll: true }), 120);
  }
}

function selectTime(time) {
  state.time = Number(time);
  document.querySelectorAll(".time-card").forEach((card) => {
    const selected = Number(card.dataset.time) === state.time;
    card.setAttribute("aria-checked", String(selected));
  });
  timeNext.disabled = false;
}

function renderCategories() {
  categoryFilters.innerHTML = categories.map((category) => `
    <button class="category-button" type="button" data-category="${category.name}" aria-pressed="${state.category === category.name}">
      <span aria-hidden="true">${category.icon}</span> ${category.name}
    </button>
  `).join("");
}

function filterFoods(category) {
  state.category = category;
  renderCategories();
  renderFoods();
}

function renderFoods() {
  const visibleFoods = state.category === "Todos"
    ? foods
    : foods.filter((food) => food.category === state.category);

  foodsCount.textContent = `${visibleFoods.length} alimento${visibleFoods.length === 1 ? "" : "s"} en ${state.category.toLocaleLowerCase("es-MX")}`;
  foodGrid.innerHTML = visibleFoods.map((food) => {
    const selected = state.selectedFoods.has(food.id);
    return `
      <button class="food-card" type="button" data-food="${food.id}" aria-pressed="${selected}" aria-label="${selected ? "Quitar" : "Seleccionar"} ${food.name}">
        <span class="food-check" aria-hidden="true">✓</span>
        ${foodVisual(food)}
        <span>${food.name}</span>
      </button>
    `;
  }).join("");
}

function toggleFood(foodId) {
  if (!getFood(foodId)) return;
  if (state.selectedFoods.has(foodId)) {
    state.selectedFoods.delete(foodId);
  } else {
    state.selectedFoods.add(foodId);
  }
  renderFoods();
  renderSelectedFoods();
}

function renderSelectedFoods() {
  const selected = [...state.selectedFoods].map(getFood).filter(Boolean);
  selectedCount.textContent = String(selected.length);
  generateButton.disabled = selected.length === 0;

  if (!selected.length) {
    selectedList.innerHTML = '<p class="empty-selection">Elige al menos un alimento para comenzar.</p>';
    return;
  }

  selectedList.innerHTML = selected.map((food) => `
    <div class="selected-chip">
      ${foodVisual(food)}
      <span>${food.name}</span>
      <button class="remove-food" type="button" data-remove-food="${food.id}" aria-label="Quitar ${food.name}">×</button>
    </div>
  `).join("");
}

function renderPreferenceOptions() {
  const activePreferences = new Set(
    state.preference
      .split(",")
      .map(normalizeText)
      .filter(Boolean)
  );

  document.querySelectorAll("[data-preference]").forEach((button) => {
    const value = normalizeText(button.dataset.preference);
    const selected = value === "ninguno" ? activePreferences.size === 0 : activePreferences.has(value);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function togglePreference(value) {
  const normalizedValue = normalizeText(value);
  const activePreferences = new Set(
    state.preference
      .split(",")
      .map(normalizeText)
      .filter(Boolean)
  );

  if (normalizedValue === "ninguno") {
    activePreferences.clear();
  } else if (activePreferences.has(normalizedValue)) {
    activePreferences.delete(normalizedValue);
  } else {
    activePreferences.add(normalizedValue);
  }

  state.preference = [...activePreferences].join(", ");
  preferenceInput.value = state.preference;
  renderPreferenceOptions();
}

function isRejected(foodId) {
  const preference = normalizeText(state.preference);
  if (!preference) return false;
  const food = getFood(foodId);
  if (!food) return false;
  const foodName = normalizeText(food.name);
  const category = normalizeText(food.category);
  const singularCategory = category.replace(/s$/, "");
  return preference.includes(foodName) || preference.includes(category) || preference.includes(singularCategory);
}

function timeScore(lunch) {
  if (state.time === 5) return lunch.time <= 5 ? 18 : -Math.max(5, lunch.time - 5);
  if (state.time === 15) return lunch.time <= 15 ? 13 : -5;
  return lunch.time >= 15 ? 10 : 6;
}

function scoreLunch(lunch, index) {
  const available = lunch.ingredients.filter((id) => state.selectedFoods.has(id) && !isRejected(id));
  const missing = lunch.ingredients.filter((id) => !state.selectedFoods.has(id));
  const rotation = (index + state.generation) % lunchTemplates.length;
  return timeScore(lunch) + (available.length * 8) - (missing.length * 1.5) + (rotation * 0.02);
}

function generateLunchOptions() {
  state.preference = preferenceInput.value.trim();
  const allowed = lunchTemplates.filter((lunch) => !lunch.ingredients.some(isRejected));
  const fallbackPool = allowed.length >= 3 ? allowed : lunchTemplates;
  const ranked = fallbackPool
    .map((lunch, index) => ({ lunch, score: scoreLunch(lunch, index) }))
    .sort((a, b) => b.score - a.score || a.lunch.time - b.lunch.time);

  if (!ranked.length) {
    showToast("Prueba escribir una preferencia más específica para encontrar opciones.");
    return [];
  }

  const offset = state.generation % Math.min(4, ranked.length);
  const rotated = [...ranked.slice(offset), ...ranked.slice(0, offset)];
  state.lunchOptions = rotated.slice(0, 3).map(({ lunch }) => lunch);
  renderLunchOptions();
  goToStep("results");
  return state.lunchOptions;
}

function availabilityFor(lunch) {
  const available = lunch.ingredients.filter((id) => state.selectedFoods.has(id) && !isRejected(id));
  const missing = lunch.ingredients.filter((id) => !state.selectedFoods.has(id) || isRejected(id));
  return { available, missing };
}

function ingredientNames(ids) {
  return ids.map((id) => getFood(id)?.name || id).join(", ");
}

function renderLunchOptions() {
  const timeText = state.time === 5 ? "5 minutos" : state.time === 15 ? "10 a 15 minutos" : "un poco más de tiempo";
  document.querySelector("#results-subtitle").textContent = `Con lo que tienes y ${timeText}, puedes preparar:`;

  lunchResults.innerHTML = state.lunchOptions.map((lunch, index) => {
    const label = optionLabels[index];
    const { available, missing } = availabilityFor(lunch);
    const note = missing.length
      ? `Puedes sustituir ${ingredientNames(missing)} por algo similar que ya tengas.`
      : `Tienes todos los ingredientes base seleccionados para esta idea.`;
    const ingredientChips = lunch.ingredients.map((id) => {
      const food = getFood(id);
      const selected = available.includes(id);
      return `<span class="meta-pill" title="${selected ? "Lo tienes" : "Por complementar"}">${selected ? "✓" : "+"} ${food?.name || id}</span>`;
    }).join("");
    const miniFoods = lunch.ingredients.slice(0, 3).map((id) => foodVisual(getFood(id))).join("");

    return `
      <article class="lunch-card ${label.className}">
        <div class="lunch-card-top">
          <div>
            <span class="option-kicker">${label.kicker}</span>
            <h3>${label.label}</h3>
          </div>
          <div class="lunch-illustration" aria-hidden="true">
            <img src="${lunch.box}" alt="">
            <div class="lunch-food-mini">${miniFoods}</div>
          </div>
        </div>
        <div class="lunch-card-body">
          <div class="lunch-components">
            <p><strong>Principal</strong><span>${lunch.main}</span></p>
            <p><strong>Guarnición</strong><span>${lunch.side}</span></p>
            <p><strong>Bebida</strong><span>${lunch.drink}</span></p>
          </div>
          <div class="lunch-meta">
            <span class="meta-pill"><span aria-hidden="true">◷</span> ${lunch.timeLabel}</span>
            ${ingredientChips}
          </div>
          <p class="availability-note">${note}</p>
          <button class="lunch-detail-button" type="button" data-lunch="${lunch.id}" aria-label="Consultar detalles de ${lunch.name}">
            Consultar esta opción <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function openLunchDetail(lunchId) {
  const lunch = lunchTemplates.find((item) => item.id === lunchId);
  if (!lunch) return;
  state.selectedLunch = lunch;
  const { available, missing } = availabilityFor(lunch);
  const substitution = missing.length
    ? `<strong>Para completarlo:</strong> si tienes disponible ${ingredientNames(missing)}, agrégalo; si no, puedes sustituirlo por una opción similar que tu familia ya acepte.`
    : `<strong>¡Buena coincidencia!</strong> Los ingredientes base aparecen entre los alimentos que seleccionaste.`;

  detailChoice.innerHTML = `
    <div class="choice-visual"><img src="${lunch.box}" alt="Lunchera para ${lunch.name}"></div>
    <div class="choice-content">
      <span>TU ELECCIÓN · ${lunch.timeLabel}</span>
      <h3>${lunch.name}</h3>
      <div class="choice-parts">
        <div class="choice-part"><span>Principal</span><strong>${lunch.main}</strong></div>
        <div class="choice-part"><span>Guarnición</span><strong>${lunch.side}</strong></div>
        <div class="choice-part"><span>Bebida</span><strong>${lunch.drink}</strong></div>
      </div>
      <p class="detail-substitution">${substitution}</p>
      <p class="detail-availability"><strong>Ya tienes:</strong> ${available.length ? ingredientNames(available) : "una base para comenzar"}.</p>
    </div>
  `;

  const saved = state.savedIdeas.has(lunch.id);
  saveIdeaButton.textContent = saved ? "✓ Idea guardada" : "Guardar esta idea";
  rememberRecentActivity({
    id: `lunch-${lunch.id}`,
    title: lunch.name,
    status: "Actividad consultada",
    href: "que-le-mando-de-lunch.html"
  });
  goToStep("detail");
}

function saveCurrentIdea() {
  if (!state.selectedLunch) return;
  state.savedIdeas.add(state.selectedLunch.id);
  const savedResources = readStoredJson(STORAGE_KEYS.savedResources, []);
  const resources = Array.isArray(savedResources) ? savedResources : [];
  const resource = {
    id: state.selectedLunch.id,
    title: state.selectedLunch.name,
    eyebrow: "Idea de lunch guardada",
    href: "que-le-mando-de-lunch.html",
    image: state.selectedLunch.box
  };
  const nextResources = [resource, ...resources.filter((item) => item?.id !== resource.id)].slice(0, 12);
  writeStoredJson(STORAGE_KEYS.savedResources, nextResources);
  saveIdeaButton.textContent = "✓ Idea guardada";
  showToast("✓ Idea guardada en Mi perfil");
}

function rememberRecentActivity(activity) {
  const stored = readStoredJson(STORAGE_KEYS.recentActivities, []);
  const activities = Array.isArray(stored) ? stored : [];
  const nextActivities = [
    { ...activity, updatedAt: new Date().toISOString() },
    ...activities.filter((item) => item?.id !== activity.id)
  ].slice(0, 8);
  writeStoredJson(STORAGE_KEYS.recentActivities, nextActivities);
}

function resetExperience() {
  state.screen = "intro";
  state.step = 0;
  state.time = null;
  state.category = "Todos";
  state.selectedFoods.clear();
  state.preference = "";
  state.lunchOptions = [];
  state.selectedLunch = null;
  state.generation = 0;
  preferenceInput.value = "";
  document.querySelectorAll(".time-card").forEach((card) => card.setAttribute("aria-checked", "false"));
  timeNext.disabled = true;
  renderCategories();
  renderFoods();
  renderSelectedFoods();
  renderPreferenceOptions();
  closeMobileMenu();
  goToStep("intro");
}

function openMobileMenu() {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.hidden = false;
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Cerrar menú");
  mobileMenu.querySelector("a, button")?.focus();
}

function closeMobileMenu({ restoreFocus = false } = {}) {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  if (restoreFocus) menuButton.focus();
}

function closeAccountMenus() {
  document.querySelectorAll("[data-account-menu], [data-mobile-account-menu]").forEach((menu) => {
    menu.hidden = true;
  });
  document.querySelectorAll('[data-action="account"]').forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function toggleAccountMenu(source) {
  const isMobile = Boolean(source?.closest(".mobile-menu"));
  const menu = document.querySelector(isMobile ? "[data-mobile-account-menu]" : "[data-account-menu]");
  if (!menu) return;
  const willOpen = menu.hidden;
  closeAccountMenus();
  menu.hidden = !willOpen;
  source.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) menu.querySelector("button")?.focus();
}

function openDialog(dialogId) {
  const dialog = document.querySelector(dialogId);
  if (!dialog?.showModal) return;
  closeMobileMenu();
  dialog.showModal();
  window.setTimeout(() => dialog.querySelector("input")?.focus(), 50);
}

function logOut() {
  try {
    window.sessionStorage.removeItem("isLoggedIn");
  } catch {
    // The prototype still returns to the public experience if storage is unavailable.
  }
  navigateTo("#inicio");
}

function requestLogOut() {
  closeMobileMenu();
  closeAccountMenus();
  const dialog = document.querySelector("#logout-dialog");
  if (!dialog?.showModal) return;
  dialog.showModal();
  window.setTimeout(() => dialog.querySelector("[data-dialog-close]")?.focus(), 50);
}

function handleAction(action, source) {
  switch (action) {
    case "home":
    case "reset":
      resetExperience();
      break;
    case "start":
      goToStep("time");
      break;
    case "back-intro":
      goToStep("intro");
      break;
    case "next-foods":
      if (state.time) goToStep("foods");
      break;
    case "back-time":
      goToStep("time");
      break;
    case "generate":
      if (state.selectedFoods.size) generateLunchOptions();
      break;
    case "back-foods":
      goToStep("foods");
      break;
    case "regenerate":
      state.generation += 1;
      generateLunchOptions();
      showToast("Mostramos una combinación nueva con tus selecciones.");
      break;
    case "back-results":
      goToStep("results");
      break;
    case "save":
      saveCurrentIdea();
      break;
    case "search":
      if (document.body.dataset.page === "news") {
        closeMobileMenu();
        const newsSearch = document.querySelector("#news-search");
        newsSearch?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => newsSearch?.focus(), 120);
      } else {
        searchDialog?.showModal();
        window.setTimeout(() => document.querySelector("#site-search")?.focus(), 50);
      }
      break;
    case "open-recovery":
      openDialog("#recovery-dialog");
      break;
    case "open-registration":
      openDialog("#registration-dialog");
      break;
    case "prototype-google":
      showToast("El acceso con Google estará disponible próximamente.");
      break;
    case "account":
      toggleAccountMenu(source);
      break;
    case "logout":
    case "request-logout":
      requestLogOut();
      break;
    case "confirm-logout":
      logOut();
      break;
    case "unavailable":
      closeMobileMenu();
      closeAccountMenus();
      showToast(`${source?.dataset.label || "Esta sección"} estará disponible próximamente.`);
      break;
    default:
      break;
  }
}

document.addEventListener("click", (event) => {
  const dialogClose = event.target.closest("[data-dialog-close]");
  if (dialogClose) dialogClose.closest("dialog")?.close();

  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);

  if (event.target.closest(".mobile-menu a")) closeMobileMenu();

  if (
    menuButton?.getAttribute("aria-expanded") === "true" &&
    !event.target.closest(".mobile-menu") &&
    !event.target.closest(".menu-button")
  ) {
    closeMobileMenu();
  }

  if (!event.target.closest(".account-control") && !event.target.closest(".account-mobile-button") && !event.target.closest("[data-mobile-account-menu]")) {
    closeAccountMenus();
  }

  const timeCard = event.target.closest("[data-time]");
  if (timeCard) selectTime(timeCard.dataset.time);

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) filterFoods(categoryButton.dataset.category);

  const foodButton = event.target.closest("[data-food]");
  if (foodButton) toggleFood(foodButton.dataset.food);

  const removeButton = event.target.closest("[data-remove-food]");
  if (removeButton) toggleFood(removeButton.dataset.removeFood);

  const preferenceButton = event.target.closest("[data-preference]");
  if (preferenceButton) togglePreference(preferenceButton.dataset.preference);

  const lunchButton = event.target.closest("[data-lunch]");
  if (lunchButton) openLunchDetail(lunchButton.dataset.lunch);

});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    event.preventDefault();
    closeMobileMenu({ restoreFocus: true });
  }
  if (event.key === "Escape") closeAccountMenus();
});

initSiteSearch();

searchDialog?.addEventListener("close", () => {
  if (searchDialog.returnValue === "search") {
    const query = document.querySelector("#site-search").value.trim();
    const destination = matchingSiteSearchEntries(query)[0];
    if (query && destination) navigateTo(destination.href);
    else showToast(query ? `No encontramos resultados para “${query}”.` : "Escribe una palabra para buscar.");
  }
});

function initTestimonialCarousel() {
  const track = document.querySelector("[data-testimonial-track]");
  if (!track) return;
  const cards = [...track.querySelectorAll(".testimonial-card")];
  const dots = [...document.querySelectorAll("[data-carousel-dot]")];
  const previous = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  let current = 0;
  let scrollFrame;

  function setCurrent(index, { move = true } = {}) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === current;
      dot.classList.toggle("is-current", isCurrent);
      if (isCurrent) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (move) cards[current].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  previous?.addEventListener("click", () => setCurrent((current - 1 + cards.length) % cards.length));
  next?.addEventListener("click", () => setCurrent((current + 1) % cards.length));
  dots.forEach((dot) => dot.addEventListener("click", () => setCurrent(Number(dot.dataset.carouselDot))));

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setCurrent((current - 1 + cards.length) % cards.length);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setCurrent((current + 1) % cards.length);
    }
  });

  track.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const nearest = cards.reduce((bestIndex, card, index) => {
        const bestDistance = Math.abs(cards[bestIndex].offsetLeft - track.scrollLeft);
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
        return distance < bestDistance ? index : bestIndex;
      }, 0);
      setCurrent(nearest, { move: false });
    });
  }, { passive: true });
}

function setLoginFieldState(input, errorElement, message = "") {
  if (!input || !errorElement) return;
  const hasValue = input.value.length > 0;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && hasValue);
  errorElement.textContent = message;
}

function initLoginPage() {
  const form = document.querySelector("#login-form");
  if (!form) return;

  const requestedReturn = new URLSearchParams(window.location.search).get("returnTo");
  const loginDestination = safeLocalHref(requestedReturn, "#inicio");

  const email = form.querySelector("#login-email");
  const password = form.querySelector("#login-password");
  const emailError = form.querySelector("#login-email-error");
  const passwordError = form.querySelector("#login-password-error");
  const passwordToggle = form.querySelector("[data-password-toggle]");
  const submitButton = form.querySelector(".login-submit");
  const submitLabel = form.querySelector("[data-login-button-label]");
  const feedback = form.querySelector("#login-feedback");

  function validateEmail() {
    const value = email.value.trim();
    const message = !value
      ? "Ingresa tu correo electrónico."
      : email.validity.typeMismatch
        ? "Revisa que el correo tenga un formato válido."
        : "";
    setLoginFieldState(email, emailError, message);
    return !message;
  }

  function validatePassword() {
    const message = password.value.length ? "" : "Ingresa tu contraseña.";
    setLoginFieldState(password, passwordError, message);
    return !message;
  }

  passwordToggle?.addEventListener("click", () => {
    const isVisible = password.type === "text";
    password.type = isVisible ? "password" : "text";
    const label = isVisible ? "Mostrar contraseña" : "Ocultar contraseña";
    passwordToggle.setAttribute("aria-label", label);
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    passwordToggle.title = label;
    password.focus();
  });

  email.addEventListener("blur", validateEmail);
  password.addEventListener("blur", validatePassword);
  email.addEventListener("input", () => {
    if (email.getAttribute("aria-invalid") === "true") validateEmail();
  });
  password.addEventListener("input", () => {
    if (password.getAttribute("aria-invalid") === "true") validatePassword();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.className = "login-feedback";
    feedback.textContent = "";

    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    if (!emailIsValid || !passwordIsValid) {
      feedback.textContent = "Revisa los campos señalados para continuar.";
      (emailIsValid ? password : email).focus();
      return;
    }

    form.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
    submitLabel.textContent = "Iniciando sesión…";
    feedback.textContent = "Estamos verificando los datos del prototipo.";

    window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("isLoggedIn", "true");
      } catch {
        // No se guardan credenciales; la navegación continúa aunque el navegador bloquee storage.
      }

      password.value = "";
      feedback.className = "login-feedback is-success";
      feedback.innerHTML = "<strong>¡Bienvenido de nuevo!</strong><span>Estamos preparando tu espacio en ITASO.</span>";
      submitLabel.textContent = "Sesión iniciada";

      window.setTimeout(() => navigateTo(loginDestination), 700);
    }, 700);
  });

  const recoveryForm = document.querySelector("#recovery-form");
  recoveryForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const recoveryEmail = recoveryForm.querySelector('input[type="email"]');
    const status = recoveryForm.querySelector("[data-dialog-status]");
    if (!recoveryEmail.value.trim() || !recoveryEmail.checkValidity()) {
      status.textContent = "Ingresa un correo electrónico con formato válido.";
      status.classList.remove("is-success");
      recoveryEmail.focus();
      return;
    }
    status.textContent = "Esta función estará disponible próximamente.";
    status.classList.add("is-success");
  });

  const registrationForm = document.querySelector("#registration-form");
  registrationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = registrationForm.querySelector("[data-dialog-status]");
    const firstInvalid = [...registrationForm.querySelectorAll("input[required]")].find((input) => !input.checkValidity());
    if (firstInvalid) {
      status.textContent = "Completa nombre, correo y contraseña para continuar.";
      status.classList.remove("is-success");
      firstInvalid.focus();
      return;
    }
    registrationForm.querySelector('input[type="password"]').value = "";
    status.textContent = "La creación de cuentas estará disponible próximamente.";
    status.classList.add("is-success");
  });

  document.querySelectorAll(".auth-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

const defaultCaregiverProfile = {
  name: "Laura",
  caregiverType: "Mamá",
  avatar: "mama",
  ageRange: "9-12",
  interests: ["Lunch", "Porciones", "Alimentación variada"]
};

const validAvatarIds = ["mama", "papa", "abuela", "otro"];
const validAgeRanges = ["6-8", "9-12", "13+"];
const ageRangeLabels = {
  "6-8": "6–8 años",
  "9-12": "9–12 años",
  "13+": "13+ años"
};
const avatarDescriptions = {
  mama: "Personaje mamá ITASO",
  papa: "Personaje papá ITASO",
  abuela: "Personaje abuela ITASO",
  otro: "Grupo de personas cuidadoras ITASO"
};
const avatarCaregiverLabels = {
  mama: "Mamá",
  papa: "Papá",
  abuela: "Abuela",
  otro: "Otra persona cuidadora"
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const LEGACY_PAGE_KEYS = {
  index: "inicio",
  explora: "inicio",
  juegos: "juegos",
  recursos: "recursos",
  noticias: "noticias",
  "conoce-itaso": "conoce",
  perfil: "perfil",
  "iniciar-sesion": "login",
  suscripcion: "suscripcion",
  "que-le-mando-de-lunch": "lunch",
  "cuanto-le-sirvo": "cuanto",
  "detectives-hidratacion": "detectives"
};

function safeLocalHref(value, fallback = "index.html") {
  const fallbackRoute = typeof fallback === "string" ? fallback.match(/^#([a-z0-9-]+)$/i) : null;
  const safeFallback = fallbackRoute ? (SITE_ROUTES[fallbackRoute[1].toLowerCase()] || fallback) : fallback;
  if (typeof value !== "string") return safeFallback;
  const route = value.match(/^#([a-z0-9-]+)$/i);
  if (route) {
    return SITE_ROUTES[route[1].toLowerCase()] || value;
  }
  const localPage = value.match(/^([a-z0-9-]+\.html)(\?[^#]*)?(#[a-z0-9-]+)?$/i);
  if (localPage && Object.hasOwn(LEGACY_PAGE_KEYS, localPage[1].slice(0, -5).toLowerCase())) return value;
  return safeFallback;
}

function safeExternalHref(value, fallback = "noticias.html") {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : fallback;
  } catch {
    return fallback;
  }
}

const SUBSCRIPTION_PLAN_DETAILS = {
  essential: {
    name: "ITASO Esencial",
    prices: { monthly: "$XX MXN / mes", annual: "$XXX MXN / año" }
  },
  community: {
    name: "ITASO Comunidad",
    prices: { monthly: "$XX MXN / mes", annual: "$XXX MXN / año" }
  }
};

const SUBSCRIPTION_BILLING_LABELS = { monthly: "Mensual", annual: "Anual" };
const SUBSCRIPTION_METHOD_LABELS = { card: "Tarjeta", paypal: "PayPal", transfer: "Transferencia" };

function getStoredSubscription() {
  const stored = readStoredJson(STORAGE_KEYS.subscription, null);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return null;
  const planId = Object.hasOwn(SUBSCRIPTION_PLAN_DETAILS, stored.planId) ? stored.planId : null;
  const billingId = Object.hasOwn(SUBSCRIPTION_BILLING_LABELS, stored.billingId) ? stored.billingId : null;
  const methodId = Object.hasOwn(SUBSCRIPTION_METHOD_LABELS, stored.methodId) ? stored.methodId : null;
  if (!planId || !billingId || !methodId) return null;
  return {
    planId,
    plan: SUBSCRIPTION_PLAN_DETAILS[planId].name,
    billingId,
    billing: SUBSCRIPTION_BILLING_LABELS[billingId],
    methodId,
    method: SUBSCRIPTION_METHOD_LABELS[methodId],
    status: stored.status === "active" ? "active" : "cancelled"
  };
}

function loadCaregiverProfile() {
  const stored = readStoredJson(STORAGE_KEYS.profile, {});
  const profile = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  let storedAvatar = null;
  try {
    storedAvatar = window.localStorage.getItem(STORAGE_KEYS.avatar);
  } catch {
    storedAvatar = null;
  }

  const interests = Array.isArray(profile.interests)
    ? profile.interests.filter((interest) => typeof interest === "string").slice(0, 6)
    : defaultCaregiverProfile.interests;

  return {
    name: typeof profile.name === "string" && profile.name.trim() ? profile.name.trim().slice(0, 40) : defaultCaregiverProfile.name,
    caregiverType: typeof profile.caregiverType === "string" && profile.caregiverType.trim() ? profile.caregiverType : defaultCaregiverProfile.caregiverType,
    avatar: validAvatarIds.includes(storedAvatar) ? storedAvatar : validAvatarIds.includes(profile.avatar) ? profile.avatar : defaultCaregiverProfile.avatar,
    ageRange: validAgeRanges.includes(profile.ageRange) ? profile.ageRange : defaultCaregiverProfile.ageRange,
    interests
  };
}

function saveCaregiverProfile(profile) {
  writeStoredJson(STORAGE_KEYS.profile, profile);
  try {
    window.localStorage.setItem(STORAGE_KEYS.avatar, profile.avatar);
  } catch {
    // The interface still updates during this visit if storage is unavailable.
  }
}

function avatarMarkup(avatar) {
  if (avatar === "otro") {
    return `
      <span class="avatar-other-art" role="img" aria-label="${avatarDescriptions.otro}">
        <img src="assets/characters/mama.svg" alt="">
        <img src="assets/characters/papa.svg" alt="">
      </span>
    `;
  }
  return `<img src="assets/characters/${avatar}.svg" alt="${avatarDescriptions[avatar]}">`;
}

function demoSavedResources() {
  return [
    {
      id: "demo-lunch",
      title: "¿Qué le mando de lunch?",
      eyebrow: "Idea guardada · ejemplo",
      href: "que-le-mando-de-lunch.html",
      image: "assets/lunchboxes/amarilla.svg"
    },
    {
      id: "demo-portions",
      kind: "interactive",
      title: "¿Cuánto le sirvo?",
      eyebrow: "Interactivo · guía visual",
      href: "cuanto-le-sirvo.html",
      image: "assets/hands/mano abierta.svg"
    },
    {
      id: "demo-material",
      title: "Ideas para variar el lunch",
      eyebrow: "Material descargable · ejemplo",
      href: "recursos.html#descargables",
      symbol: "↓"
    }
  ];
}

function demoRecentActivities() {
  return [
    { id: "demo-activity-lunch", title: "¿Qué le mando de lunch?", status: "Última actividad · Paso completado", href: "que-le-mando-de-lunch.html" },
    { id: "demo-activity-portions", title: "¿Cuánto le sirvo?", status: "Interactivo disponible", href: "cuanto-le-sirvo.html" },
    { id: "demo-activity-detectives", title: "Detectives de la hidratación", status: "Investigación disponible", href: "detectives-hidratacion.html" }
  ];
}

function renderProfileResources(container) {
  if (!container) return;
  const stored = readStoredJson(STORAGE_KEYS.savedResources, null);
  const resources = stored === null ? demoSavedResources() : Array.isArray(stored) ? stored : [];
  if (!resources.length) {
    container.innerHTML = `
      <div class="profile-empty-state">
        <span aria-hidden="true">♡</span>
        <h3>Todavía no tienes recursos guardados</h3>
        <p>Explora ITASO y guarda las ideas que quieras consultar más adelante.</p>
        <a class="button button-primary" href="recursos.html">Explorar recursos <span aria-hidden="true">→</span></a>
      </div>
    `;
    return;
  }

  container.innerHTML = resources.map((resource) => {
    const title = escapeHtml(resource?.title || "Recurso ITASO");
    const eyebrow = escapeHtml(resource?.eyebrow || "Recurso guardado");
    const isNews = resource?.kind === "news";
    const href = isNews ? safeExternalHref(resource?.href) : safeLocalHref(resource?.href, "#inicio");
    const externalAttributes = isNews ? ' target="_blank" rel="noopener noreferrer"' : "";
    const image = typeof resource?.image === "string" && resource.image.startsWith("assets/")
      ? `<img src="${escapeHtml(resource.image)}" alt="">`
      : `<span aria-hidden="true">${escapeHtml(resource?.symbol || "✦")}</span>`;
    const cta = isNews ? "Leer noticia" : resource?.kind === "interactive" ? "Abrir interactivo" : resource?.id === "demo-material" ? "Ver material" : resource?.id === "demo-portions" ? "Abrir recurso" : "Ver recurso";
    return `
      <article class="profile-resource-card">
        <div class="profile-card-visual">${image}</div>
        <div class="profile-card-copy">
          <small>${eyebrow}</small>
          <h3>${title}</h3>
          <a class="profile-card-link" href="${escapeHtml(href)}"${externalAttributes}>${cta} <span aria-hidden="true">→</span></a>
        </div>
      </article>
    `;
  }).join("");
}

function renderProfileActivities(container) {
  if (!container) return;
  const stored = readStoredJson(STORAGE_KEYS.recentActivities, null);
  const activities = stored === null ? demoRecentActivities() : Array.isArray(stored) ? stored : [];
  if (!activities.length) {
    container.innerHTML = `
      <div class="profile-empty-state">
        <span aria-hidden="true">◷</span>
        <h3>Aún no hay actividad reciente</h3>
        <p>Cuando consultes un juego o recurso, podrás retomarlo desde aquí.</p>
        <a class="button button-primary" href="juegos.html">Descubrir juegos <span aria-hidden="true">→</span></a>
      </div>
    `;
    return;
  }

  container.innerHTML = activities.map((activity, index) => `
    <article class="profile-activity-card">
      <div class="profile-card-copy">
        <small>${escapeHtml(activity?.status || "Actividad reciente")}</small>
        <h3>${escapeHtml(activity?.title || "Actividad ITASO")}</h3>
        <a class="profile-card-link" href="${safeLocalHref(activity?.href, "#juegos")}">${index === 0 ? "Continuar" : "Volver a ver"} <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `).join("");
}

function initProfilePage() {
  if (document.body.dataset.page !== "profile" || !document.body.classList.contains("is-authorized")) return;

  let profile = loadCaregiverProfile();
  if (readStoredJson(STORAGE_KEYS.profile, null) === null) saveCaregiverProfile(profile);
  const avatarMount = document.querySelector("[data-profile-avatar]");
  const avatarDialog = document.querySelector("#avatar-dialog");
  const editDialog = document.querySelector("#edit-profile-dialog");
  const cancelSubscriptionDialog = document.querySelector("#subscription-cancel-dialog");
  const subscriptionMount = document.querySelector("[data-profile-subscription]");
  const avatarForm = document.querySelector("#avatar-form");
  const profileForm = document.querySelector("#profile-form");
  const accountNav = document.querySelector("#profile-account-nav");
  const drawerBackdrop = document.querySelector(".profile-drawer-backdrop");
  const menuTrigger = document.querySelector("[data-profile-menu-open]");
  const tabs = [...document.querySelectorAll("[data-profile-tab]")];
  const panels = [...document.querySelectorAll("[data-profile-panel]")];

  function renderProfileSubscription() {
    if (!subscriptionMount) return;
    const subscription = getStoredSubscription();

    if (!subscription || subscription.status !== "active") {
      subscriptionMount.innerHTML = `
        <div>
          <span class="section-kicker">MI SUSCRIPCIÓN</span>
          <h2 id="profile-subscription-title">Aún no tienes un plan activo</h2>
          <p>Compara los planes de prototipo y conoce los beneficios que ITASO está preparando.</p>
        </div>
        <div class="profile-subscription-status is-inactive"><span aria-hidden="true">○</span> Sin plan activo</div>
        <div class="profile-subscription-actions">
          <a class="button button-primary" href="suscripcion.html#planes">Conocer los planes <span aria-hidden="true">→</span></a>
        </div>
      `;
      return;
    }

    subscriptionMount.innerHTML = `
      <div>
        <span class="section-kicker">MI SUSCRIPCIÓN</span>
        <h2 id="profile-subscription-title">${escapeHtml(subscription.plan)}</h2>
        <p>${escapeHtml(subscription.billing)} · Método seleccionado: ${escapeHtml(subscription.method)}. No se guardaron datos bancarios.</p>
      </div>
      <div class="profile-subscription-status"><span aria-hidden="true">✓</span> Activa · simulación</div>
      <div class="profile-subscription-actions">
        <a class="button button-secondary" href="suscripcion.html#beneficios">Ver beneficios</a>
        <a class="button button-secondary" href="suscripcion.html#planes">Cambiar plan</a>
        <a class="button button-secondary" href="suscripcion.html#pago">Método de pago</a>
        <button class="button button-secondary cancel-subscription-button" type="button" data-cancel-subscription>Cancelar suscripción</button>
      </div>
    `;
  }

  function renderProfile() {
    document.querySelectorAll("[data-profile-name], [data-profile-card-name], [data-profile-menu-name]").forEach((element) => {
      element.textContent = profile.name;
    });
    document.querySelector("[data-profile-caregiver]").textContent = profile.caregiverType;
    document.querySelector("[data-profile-type]").textContent = "Persona cuidadora";
    document.querySelector("[data-profile-age]").textContent = ageRangeLabels[profile.ageRange] || ageRangeLabels[defaultCaregiverProfile.ageRange];
    document.querySelector("[data-profile-interest-summary]").textContent = profile.interests.length
      ? profile.interests.join(", ")
      : "Sin intereses seleccionados";

    avatarMount.className = `profile-avatar profile-avatar-${profile.avatar}`;
    avatarMount.innerHTML = avatarMarkup(profile.avatar);

    const chips = document.querySelector("[data-interest-chips]");
    chips.innerHTML = profile.interests.length
      ? profile.interests.map((interest) => `<span class="interest-chip">${escapeHtml(interest)}</span>`).join("")
      : `<p class="empty-interests">Aún no has seleccionado intereses. Puedes agregarlos cuando quieras.</p>`;
  }

  function selectTab(tabName, { focus = false } = {}) {
    const targetTab = tabs.find((tab) => tab.dataset.profileTab === tabName) || tabs[0];
    tabs.forEach((tab) => {
      const selected = tab === targetTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.profilePanel !== targetTab.dataset.profileTab;
    });
    if (focus) targetTab.focus();
  }

  function openDrawer() {
    accountNav.classList.add("is-open");
    accountNav.setAttribute("aria-hidden", "false");
    menuTrigger.setAttribute("aria-expanded", "true");
    drawerBackdrop.hidden = false;
    document.body.classList.add("profile-menu-open");
    window.setTimeout(() => accountNav.querySelector("[data-profile-menu-close]")?.focus(), 50);
  }

  function closeDrawer({ restoreFocus = false } = {}) {
    accountNav.classList.remove("is-open");
    accountNav.setAttribute("aria-hidden", window.matchMedia("(min-width: 900px)").matches ? "false" : "true");
    menuTrigger.setAttribute("aria-expanded", "false");
    drawerBackdrop.hidden = true;
    document.body.classList.remove("profile-menu-open");
    if (restoreFocus) menuTrigger.focus();
  }

  function populateProfileForm() {
    profileForm.elements.name.value = profile.name;
    profileForm.elements.caregiverType.value = profile.caregiverType;
    profileForm.elements.ageRange.value = profile.ageRange;
    [...profileForm.querySelectorAll('input[name="interests"]')].forEach((checkbox) => {
      checkbox.checked = profile.interests.includes(checkbox.value);
    });
    profileForm.querySelector("[data-profile-form-status]").textContent = "";
  }

  menuTrigger?.addEventListener("click", openDrawer);
  document.querySelectorAll("[data-profile-menu-close]").forEach((button) => {
    button.addEventListener("click", () => closeDrawer({ restoreFocus: button !== drawerBackdrop }));
  });

  document.querySelector("[data-profile-subscription-link]")?.addEventListener("click", () => {
    closeDrawer();
  });

  document.querySelectorAll("[data-profile-tab-target]").forEach((button) => {
    button.addEventListener("click", () => {
      selectTab(button.dataset.profileTabTarget, { focus: true });
      closeDrawer();
      document.querySelector(".profile-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.profileTab));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      selectTab(tabs[nextIndex].dataset.profileTab, { focus: true });
    });
  });

  document.querySelectorAll("[data-avatar-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = avatarForm.querySelector(`input[value="${profile.avatar}"]`);
      if (selected) selected.checked = true;
      avatarDialog.showModal();
      window.setTimeout(() => selected?.focus(), 50);
    });
  });

  document.querySelectorAll("[data-profile-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      populateProfileForm();
      editDialog.showModal();
      window.setTimeout(() => profileForm.elements.name.focus(), 50);
    });
  });

  avatarForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = new FormData(avatarForm).get("avatar");
    if (!validAvatarIds.includes(selected)) return;
    profile = { ...profile, avatar: selected, caregiverType: avatarCaregiverLabels[selected] };
    saveCaregiverProfile(profile);
    renderProfile();
    avatarDialog.close();
    showToast("✓ Personaje actualizado");
  });

  profileForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    const name = String(formData.get("name") || "").trim();
    const status = profileForm.querySelector("[data-profile-form-status]");
    if (!name) {
      status.textContent = "Escribe un nombre para guardar los cambios.";
      profileForm.elements.name.focus();
      return;
    }
    profile = {
      ...profile,
      name: name.slice(0, 40),
      caregiverType: String(formData.get("caregiverType")),
      ageRange: validAgeRanges.includes(formData.get("ageRange")) ? formData.get("ageRange") : defaultCaregiverProfile.ageRange,
      interests: formData.getAll("interests").map(String).slice(0, 6)
    };
    saveCaregiverProfile(profile);
    renderProfile();
    editDialog.close();
    showToast(profile.interests.length ? "✓ Perfil y preferencias guardados" : "✓ Perfil actualizado");
  });

  subscriptionMount?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-cancel-subscription]")) return;
    cancelSubscriptionDialog?.showModal();
    window.setTimeout(() => cancelSubscriptionDialog?.querySelector("[data-confirm-cancel-subscription]")?.focus(), 50);
  });

  cancelSubscriptionDialog?.querySelector("[data-confirm-cancel-subscription]")?.addEventListener("click", () => {
    const subscription = getStoredSubscription();
    if (subscription) writeStoredJson(STORAGE_KEYS.subscription, { ...subscription, status: "cancelled" });
    cancelSubscriptionDialog.close();
    renderProfileSubscription();
    showToast("Suscripción de prototipo cancelada");
  });

  [avatarDialog, editDialog, cancelSubscriptionDialog].forEach((dialog) => {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && accountNav.classList.contains("is-open")) closeDrawer({ restoreFocus: true });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 900px)").matches) {
      accountNav.setAttribute("aria-hidden", "false");
      drawerBackdrop.hidden = true;
      document.body.classList.remove("profile-menu-open");
    } else if (!accountNav.classList.contains("is-open")) {
      accountNav.setAttribute("aria-hidden", "true");
    }
  });

  renderProfile();
  renderProfileSubscription();
  renderProfileResources(document.querySelector("[data-saved-resources]"));
  renderProfileActivities(document.querySelector("[data-recent-activities]"));
  selectTab("resources");
  accountNav.setAttribute("aria-hidden", window.matchMedia("(min-width: 900px)").matches ? "false" : "true");

  if (window.location.hash === "#personaje") {
    window.setTimeout(() => document.querySelector("[data-avatar-dialog-open]")?.click(), 120);
  }
  if (window.location.hash === "#profile-subscription") {
    window.setTimeout(() => subscriptionMount?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }
}

const newsArticles = [
  {
    id: "yo-elijo-ser-2026",
    title: "Secretaría de Salud presenta “Yo Elijo Ser”, para promover la alimentación saludable y la actividad física",
    category: "Eventos",
    source: "Secretaría de Salud",
    date: "1 de octubre de 2026",
    dateTime: "2026-10-01",
    summary: "La campaña presenta mensajes para niñas, niños, adolescentes y personas adultas, y reconoce a las personas cuidadoras como acompañantes de estos hábitos.",
    url: "https://www.gob.mx/salud/prensa/268-secretaria-de-salud-presenta-yo-elijo-ser-para-promover-la-alimentacion-saludable-y-la-actividad-fisica?idiom=es",
    tags: ["alimentación", "movimiento", "actividad física", "personas cuidadoras", "hábitos"],
    art: {
      photo: 'assets/img/"Yo elijo ser".jpg',
      tone: "orange",
      main: "assets/characters/especialista.svg",
      secondary: "assets/characters/nino.svg",
      alt: "Imagen institucional de la campaña Yo Elijo Ser",
      symbol: "✦"
    }
  },
  {
    id: "lineamientos-escuelas-ops-2026",
    title: "La OPS y la OEA presentan nuevos lineamientos para promover la alimentación saludable y la actividad física en las escuelas",
    category: "Investigación",
    source: "OPS/OMS y OEA",
    date: "10 de julio de 2026",
    dateTime: "2026-07-10",
    summary: "La guía reúne evidencia y orientaciones para que los entornos escolares faciliten una alimentación saludable y más actividad física.",
    url: "https://www.paho.org/es/noticias/10-7-2026-ops-oea-presentan-nuevos-lineamientos-para-promover-alimentacion-saludable",
    tags: ["escuela", "alimentación", "movimiento", "actividad física", "evidencia"],
    art: {
      photo: "assets/img/La OPS y la OEA.webp",
      tone: "blue",
      main: "assets/characters/nino.svg",
      secondary: "assets/foods/brocoli.svg",
      alt: "Imagen institucional de la OPS y la OEA que acompaña los lineamientos para escuelas",
      symbol: "↗"
    }
  },
  {
    id: "golpe-calor-2026",
    title: "Secretaría de Salud llama a tomar precauciones para prevenir golpe de calor por altas temperaturas",
    category: "Vida cotidiana",
    source: "Secretaría de Salud",
    date: "14 de mayo de 2026",
    dateTime: "2026-05-14",
    summary: "La Secretaría de Salud recuerda mantener una hidratación constante, limitar la exposición prolongada al sol y prestar especial atención a niñas y niños.",
    url: "https://www.gob.mx/salud/prensa/107-secretaria-de-salud-llama-a-tomar-precauciones-para-prevenir-golpe-de-calor-por-altas-temperaturas?idiom=es",
    tags: ["hidratación", "agua", "calor", "vida cotidiana", "prevención"],
    art: {
      photo: null,
      tone: "pink",
      main: "assets/characters/nino.svg",
      secondary: "assets/foods/pepino.svg",
      alt: "Marcador editorial para la noticia sobre prevención del golpe de calor",
      symbol: "◉"
    }
  },
  {
    id: "politicas-multisectoriales-2026",
    title: "Impulsan en México políticas con enfoque multisectorial para reducir obesidad infantil y adolescente",
    category: "Comunidad",
    source: "Secretaría de Salud e INSP",
    date: "27 de marzo de 2026",
    dateTime: "2026-03-27",
    summary: "La estrategia integra acciones fiscales, comerciales, educativas y de salud para facilitar decisiones saludables desde los primeros años de vida.",
    url: "https://www.gob.mx/salud/prensa/051-impulsan-en-mexico-politicas-con-enfoque-multisectorial-para-reducir-obesidad-infantil-y-adolescente?idiom=es-MX",
    tags: ["comunidad", "entornos saludables", "alimentación", "políticas públicas", "escuela"],
    art: {
      photo: "assets/img/Impulsan en México políticas .jpg",
      tone: "lavender",
      main: "assets/characters/especialista.svg",
      secondary: "assets/foods/manzana.svg",
      alt: "Imagen institucional sobre políticas para reducir la obesidad infantil y adolescente en México",
      symbol: "●"
    }
  },
  {
    id: "oms-alimentacion-escuelas-2026",
    title: "La OMS exhorta a las escuelas de todo el mundo a promover una alimentación saludable entre la población infantil",
    category: "Alimentación",
    source: "OPS/OMS",
    date: "28 de enero de 2026",
    dateTime: "2026-01-28",
    summary: "La nueva directriz propone que los alimentos y bebidas disponibles en la escuela sean saludables y que existan apoyos para elegirlos.",
    url: "https://www.paho.org/es/noticias/28-1-2026-oms-exhorta-escuelas-todo-mundo-promover-alimentacion-saludable-entre-poblacion",
    tags: ["alimentación", "escuela", "lunch", "bebidas", "entornos saludables"],
    art: {
      photo: "assets/img/La OMS exhorta a las escuelas de todo el mundo.avif",
      tone: "yellow",
      main: "assets/characters/nino.svg",
      secondary: "assets/foods/manzana.svg",
      alt: "Imagen institucional que acompaña la noticia de la OMS sobre alimentación saludable en escuelas",
      symbol: "+"
    }
  },
  {
    id: "guias-alimentarias-2026",
    title: "Guías Alimentarias Saludables y Sostenibles impulsan en niñas, niños y adolescentes mejores hábitos alimenticios",
    category: "Alimentación",
    source: "Secretaría de Salud e INSP",
    date: "7 de enero de 2026",
    dateTime: "2026-01-07",
    summary: "Las guías ofrecen recomendaciones para toda la población, con atención especial a niñas, niños en edad escolar y adolescentes.",
    url: "https://www.gob.mx/salud/prensa/003-guias-alimentarias-saludables-y-sostenibles-impulsan-en-ninas-ninos-y-adolescentes-mejores-habitos-alimenticios?idiom=es-MX",
    tags: ["alimentación variada", "porciones", "guías", "familias", "sostenibilidad"],
    art: {
      photo: "assets/img/Guías Alimentarias Saludables y Sostenibles.jpeg",
      tone: "green",
      main: "assets/characters/abuela.svg",
      secondary: "assets/foods/brocoli.svg",
      alt: "Imagen institucional de las Guías Alimentarias Saludables y Sostenibles",
      symbol: "✓"
    }
  },
  {
    id: "rutinas-infancia-2025",
    title: "La importancia de las rutinas y los hábitos para niñas y niños",
    category: "Vida cotidiana",
    source: "UNICEF Uruguay",
    date: "2 de diciembre de 2025",
    dateTime: "2025-12-02",
    summary: "Ideas sencillas para organizar horarios de comida, juego, estudio y descanso con constancia, afecto y flexibilidad para cada familia.",
    url: "https://www.unicef.org/uruguay/crianza/etapa-escolar/La-importancia-de-las-rutinas-y-los-habitos-para-ninas-y-ninos",
    tags: ["descanso", "sueño", "rutinas", "crianza", "acompañamiento"],
    art: {
      photo: "assets/img/La importancia de las rutinas.webp",
      tone: "pink",
      main: "assets/characters/papa.svg",
      secondary: "assets/characters/nino.svg",
      alt: "Fotografía que acompaña el contenido de UNICEF sobre rutinas y hábitos en la infancia",
      symbol: "☾"
    }
  },
  {
    id: "informe-nutricion-unicef-2025",
    title: "El índice mundial de obesidad supera por primera vez al de bajo peso entre los niños y niñas en edad escolar y adolescentes – UNICEF",
    category: "Investigación",
    source: "UNICEF México",
    date: "10 de septiembre de 2025",
    dateTime: "2025-09-10",
    summary: "El informe reúne datos de más de 190 países y explica por qué la alimentación infantil también depende de los entornos, la disponibilidad y la publicidad.",
    url: "https://www.unicef.org/mexico/comunicados-prensa/el-indice-mundial-de-obesidad-supera-por-primera-vez-al-de-bajo-peso-entre-los",
    tags: ["investigación", "evidencia", "alimentación", "publicidad", "entornos saludables"],
    art: {
      photo: "assets/img/El índice mundial de obesidad.webp",
      tone: "blue",
      main: "assets/characters/especialista.svg",
      secondary: "assets/foods/manzana.svg",
      alt: "Imagen de UNICEF que acompaña el informe mundial sobre nutrición infantil",
      symbol: "▥"
    }
  },
  {
    id: "recetario-escuelas-2025",
    title: "Recetario saludable para escuelas primarias",
    category: "Recursos",
    source: "UNICEF México e INSP",
    date: "marzo de 2025",
    dateTime: "2025-03-01",
    summary: "El material reúne preparaciones con ingredientes frescos, locales y nutritivos, creadas a partir de investigación con escuelas y familias mexicanas.",
    url: "https://www.unicef.org/mexico/media/8631/file/RECETARIO%20ESCUELAS_UNICEF%20INSP%202025.pdf.pdf",
    tags: ["recetario", "refrigerio", "lunch", "porciones", "alimentación variada", "familias"],
    art: {
      photo: "assets/img/Recetario saludable para escuelas primarias.png",
      tone: "green",
      main: "assets/lunchboxes/amarilla.svg",
      secondary: "assets/foods/zanahoria.svg",
      alt: "Portada del recetario saludable para escuelas primarias",
      symbol: "↓"
    }
  }
];

function newsCategoryClass(category) {
  return `category-${normalizeText(category).replace(/\s+/g, "-")}`;
}

function savedNewsResourceIds() {
  const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
  if (!Array.isArray(stored)) return new Set();
  return new Set(stored.filter((item) => item?.kind === "news").map((item) => item.id));
}

function renderNewsVisual(article) {
  const art = article.art;
  if (art.photo) {
    return `
      <div class="news-card-visual news-card-photo-wrap">
        <img class="news-card-photo" src="${escapeHtml(encodeURI(art.photo))}" alt="${escapeHtml(art.alt)}" loading="eager">
      </div>
    `;
  }
  return `
    <div class="news-card-visual news-card-photo-fallback visual-${escapeHtml(art.tone)}" role="img" aria-label="${escapeHtml(art.alt)}">
      <svg class="news-fallback-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M18 8h28a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8Z"></path><path d="M20 23h24M20 32h24M20 41h15"></path></svg>
      <span>Imagen institucional no disponible</span>
    </div>
  `;
}

function renderNewsSaveButton(article) {
  const saved = savedNewsResourceIds().has(`news-${article.id}`);
  return `
    <button class="news-save-button${saved ? " is-saved" : ""}" type="button" data-save-news="${escapeHtml(article.id)}" aria-pressed="${saved}" aria-label="${saved ? "Quitar de guardados" : "Guardar"}: ${escapeHtml(article.title)}">
      <span aria-hidden="true">${saved ? "♥" : "♡"}</span> ${saved ? "Guardado" : "Guardar"}
    </button>
  `;
}

function renderNewsCard(article, variant = "regular") {
  const categoryClass = newsCategoryClass(article.category);
  return `
    <article class="news-card news-card-${variant} ${categoryClass}">
      ${renderNewsVisual(article)}
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="news-category-badge">${escapeHtml(article.category)}</span>
          <time datetime="${escapeHtml(article.dateTime)}">${escapeHtml(article.date)}</time>
        </div>
        <h3>${escapeHtml(article.title)}</h3>
        <p class="news-card-summary">${escapeHtml(article.summary)}</p>
        <p class="news-card-source"><span>Fuente:</span> ${escapeHtml(article.source)}</p>
        <div class="news-card-actions">
          <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" aria-label="Leer en ${escapeHtml(article.source)}: ${escapeHtml(article.title)}">Leer más <span aria-hidden="true">→</span></a>
          ${renderNewsSaveButton(article)}
        </div>
      </div>
    </article>
  `;
}

function recommendationScore(article, interests) {
  const interestTerms = {
    lunch: ["lunch", "refrigerio", "escuela"],
    porciones: ["porciones", "recetario", "guias"],
    "alimentacion variada": ["alimentacion", "recetario", "familias"],
    hidratacion: ["hidratacion", "agua", "calor"],
    movimiento: ["movimiento", "actividad fisica"],
    descanso: ["descanso", "sueno", "rutinas"]
  };
  const haystack = normalizeText([article.title, article.category, ...article.tags].join(" "));
  return interests.reduce((score, interest) => {
    const normalizedInterest = normalizeText(interest);
    const terms = interestTerms[normalizedInterest] || [normalizedInterest];
    return score + terms.reduce((termScore, term) => termScore + (haystack.includes(term) ? 1 : 0), 0);
  }, 0);
}

function recommendationsFor(profile) {
  return newsArticles
    .slice(3)
    .map((article) => ({ article, score: recommendationScore(article, profile.interests) }))
    .sort((a, b) => b.score - a.score || b.article.dateTime.localeCompare(a.article.dateTime))
    .slice(0, 3)
    .map(({ article }) => article);
}

function renderNewsPersonalSection() {
  const intro = document.querySelector("[data-news-personal-intro]");
  const mount = document.querySelector("[data-news-personal]");
  if (!intro || !mount) return new Set();

  const loggedIn = isPrototypeLoggedIn();
  const storedProfile = readStoredJson(STORAGE_KEYS.profile, null);
  const hasProfile = storedProfile && typeof storedProfile === "object" && !Array.isArray(storedProfile);
  const profile = loadCaregiverProfile();
  const avatar = getStoredAvatarId();
  const hasPreferences = loggedIn && hasProfile && profile.interests.length > 0;

  if (hasPreferences) {
    const recommendations = recommendationsFor(profile);
    intro.innerHTML = `
      <div class="news-personal-heading">
        ${avatar ? `<div class="news-personal-avatar">${avatarMarkup(avatar)}</div>` : '<div class="news-personal-placeholder" aria-hidden="true">✦</div>'}
        <div>
          <span class="section-kicker">SELECCIONADO PARA TU PERFIL</span>
          <h2 id="personal-news-title">Para ti</h2>
          <p><strong>Hola, ${escapeHtml(profile.name)}</strong> Contenido relacionado con los temas que elegiste en tu perfil.</p>
        </div>
      </div>
      ${avatar ? "" : `
        <div class="news-avatar-prompt">
          <div><strong>Personaliza tu espacio en ITASO</strong><span>Elige el personaje que te representa y lo verás cada vez que vuelvas.</span></div>
          <a class="button button-secondary" href="#personaje">Elegir personaje <span aria-hidden="true">→</span></a>
        </div>
      `}
    `;
    mount.innerHTML = recommendations.map((article) => renderNewsCard(article, "personal")).join("");
    return new Set(recommendations.map((article) => article.id));
  }

  const profilePrompt = loggedIn ? `
    <div class="news-avatar-prompt">
      <div><strong>Personaliza tu espacio en ITASO</strong><span>Elige tu personaje y tus temas de interés para recibir recomendaciones sencillas.</span></div>
      <a class="button button-secondary" href="#personaje">Elegir personaje <span aria-hidden="true">→</span></a>
    </div>
  ` : "";
  intro.innerHTML = `
    <div class="news-personal-heading explore-topics-heading">
      <div class="news-personal-placeholder" aria-hidden="true">⌁</div>
      <div>
        <span class="section-kicker">DESCUBRE ALGO NUEVO</span>
        <h2 id="personal-news-title">Explora otros temas</h2>
        <p>Consulta contenidos variados sin necesidad de iniciar sesión.</p>
      </div>
    </div>
    ${profilePrompt}
  `;
  mount.innerHTML = `
    <div class="news-topic-links" aria-label="Explorar categorías">
      <button type="button" data-personal-topic="Alimentación"><span aria-hidden="true">●</span> Alimentación</button>
      <button type="button" data-personal-topic="Vida cotidiana"><span aria-hidden="true">●</span> Vida cotidiana</button>
      <button type="button" data-personal-topic="Investigación"><span aria-hidden="true">●</span> Investigación</button>
      <button type="button" data-personal-topic="Recursos"><span aria-hidden="true">●</span> Recursos</button>
    </div>
  `;
  return new Set();
}

function initNewsPage() {
  if (document.body.dataset.page !== "news") return;

  const searchInput = document.querySelector("[data-news-search]");
  const clearSearch = document.querySelector("[data-clear-news-search]");
  const editorialMount = document.querySelector("[data-news-editorial]");
  const moreMount = document.querySelector("[data-more-news]");
  const emptyState = document.querySelector("[data-news-empty]");
  const resultStatus = document.querySelector("[data-news-results-status]");
  const featuredSection = document.querySelector(".news-featured-section");
  const moreSection = document.querySelector(".more-news-section");
  const saveDialog = document.querySelector("#news-save-dialog");
  const recommendedIds = renderNewsPersonalSection();
  let activeCategory = "Todas";
  let query = "";

  function filteredArticles() {
    return newsArticles.filter((article) => {
      const categoryMatches = activeCategory === "Todas" || article.category === activeCategory;
      const searchText = normalizeText([article.title, article.category, article.source, ...article.tags].join(" "));
      return categoryMatches && (!query || searchText.includes(normalizeText(query)));
    });
  }

  function renderResults() {
    const visible = filteredArticles();
    const isUnfiltered = activeCategory === "Todas" && !query;
    const countLabel = `${visible.length} noticia${visible.length === 1 ? "" : "s"}`;
    resultStatus.textContent = query
      ? `${countLabel} para “${query}”${activeCategory === "Todas" ? "" : ` en ${activeCategory}`}.`
      : `${countLabel} ${activeCategory === "Todas" ? "disponibles" : `en ${activeCategory}`}.`;
    clearSearch.hidden = !query;

    document.querySelectorAll("[data-news-filter]").forEach((button) => {
      const selected = button.dataset.newsFilter === activeCategory;
      button.setAttribute("aria-pressed", String(selected));
    });

    if (!visible.length) {
      editorialMount.hidden = true;
      emptyState.hidden = false;
      moreSection.hidden = true;
      return;
    }

    editorialMount.hidden = false;
    emptyState.hidden = true;
    const editorialArticles = visible.slice(0, 3);
    editorialMount.innerHTML = editorialArticles.map((article, index) => renderNewsCard(article, index === 0 ? "featured" : "secondary")).join("");

    const remaining = visible.slice(3).filter((article) => !isUnfiltered || !recommendedIds.has(article.id));
    moreMount.innerHTML = remaining.map((article) => renderNewsCard(article, "regular")).join("");
    moreSection.hidden = remaining.length === 0;
    featuredSection.classList.toggle("has-fewer-stories", editorialArticles.length < 3);
  }

  function chooseCategory(category, { moveFocus = false } = {}) {
    activeCategory = category;
    renderResults();
    if (moveFocus) {
      featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const firstHeading = document.querySelector(".news-card h3");
        firstHeading?.setAttribute("tabindex", "-1");
        firstHeading?.focus({ preventScroll: true });
      }, 250);
    }
  }

  document.querySelectorAll("[data-news-filter]").forEach((button) => {
    button.addEventListener("click", () => chooseCategory(button.dataset.newsFilter));
  });

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim();
    renderResults();
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    renderResults();
    searchInput.focus();
  });

  document.querySelector("[data-show-all-news]")?.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    activeCategory = "Todas";
    renderResults();
    document.querySelector('[data-news-filter="Todas"]')?.focus();
  });

  document.querySelector("[data-news-personal]")?.addEventListener("click", (event) => {
    const topic = event.target.closest("[data-personal-topic]");
    if (!topic) return;
    chooseCategory(topic.dataset.personalTopic, { moveFocus: true });
  });

  document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-news]");
    if (!saveButton) return;
    const article = newsArticles.find((item) => item.id === saveButton.dataset.saveNews);
    if (!article) return;

    if (!isPrototypeLoggedIn()) {
      saveDialog?.showModal();
      window.setTimeout(() => saveDialog?.querySelector("a")?.focus(), 50);
      return;
    }

    const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
    const resources = Array.isArray(stored) ? stored : [];
    const resourceId = `news-${article.id}`;
    const alreadySaved = resources.some((resource) => resource?.id === resourceId);
    const resource = {
      id: resourceId,
      kind: "news",
      title: article.title,
      eyebrow: `Noticia guardada · ${article.source}`,
      href: article.url,
      image: article.art.main
    };
    const nextResources = alreadySaved
      ? resources.filter((item) => item?.id !== resourceId)
      : [resource, ...resources.filter((item) => item?.id !== resourceId)].slice(0, 24);

    if (!writeStoredJson(STORAGE_KEYS.savedResources, nextResources)) {
      showToast("No pudimos guardar la noticia en este navegador.");
      return;
    }

    document.querySelectorAll(`[data-save-news="${article.id}"]`).forEach((button) => {
      button.classList.toggle("is-saved", !alreadySaved);
      button.setAttribute("aria-pressed", String(!alreadySaved));
      button.setAttribute("aria-label", `${alreadySaved ? "Guardar" : "Quitar de guardados"}: ${article.title}`);
      button.innerHTML = `<span aria-hidden="true">${alreadySaved ? "♡" : "♥"}</span> ${alreadySaved ? "Guardar" : "Guardado"}`;
    });
    showToast(alreadySaved ? "Noticia eliminada de Mi perfil" : "✓ Noticia guardada");
  });

  saveDialog?.addEventListener("click", (event) => {
    if (event.target === saveDialog) saveDialog.close();
  });

  const newsletterForm = document.querySelector("[data-news-page-newsletter]");
  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterForm.elements.email;
    const status = newsletterForm.querySelector("[role='status']");
    status.classList.remove("is-success");
    if (!email.value.trim() || !email.checkValidity()) {
      status.textContent = "Escribe un correo electrónico con formato válido.";
      email.setAttribute("aria-invalid", "true");
      email.focus();
      return;
    }
    email.removeAttribute("aria-invalid");
    status.classList.add("is-success");
    status.textContent = "¡Gracias! Tu correo quedó registrado en este prototipo.";
    newsletterForm.reset();
  });

  renderResults();
}

const resourcesCatalog = [
  {
    id: "lunch-ideas",
    title: "Ideas para el lunch",
    audiences: ["caregiver"],
    type: "guide",
    typeLabel: "Guía",
    topics: ["alimentacion", "lunch", "habitos"],
    tags: ["escuela", "rutina", "variedad"],
    description: "Alternativas sencillas para variar lo que lleva a la escuela.",
    image: "assets/lunchboxes/amarilla.svg",
    symbol: "✓"
  },
  {
    id: "portions-guide",
    title: "¿Cuánto le sirvo?",
    audiences: ["caregiver"],
    type: "interactive",
    typeLabel: "Interactivo",
    topics: ["alimentacion", "porciones"],
    tags: ["guia visual", "manos", "acompanamiento"],
    description: "Guía visual para comprender porciones utilizando las manos como referencia.",
    image: "assets/hands/mano abierta.svg",
    symbol: "◒",
    href: "cuanto-le-sirvo.html",
    available: true,
    kind: "interactive",
    downloadHref: "assets/descargables/PORCIONES (1).pdf"
  },
  {
    id: "lunch-builder",
    title: "¿Qué le mando de lunch?",
    audiences: ["caregiver", "family"],
    type: "interactive",
    typeLabel: "Interactivo",
    topics: ["alimentacion", "lunch", "habitos"],
    tags: ["tiempo", "alimentos disponibles", "escuela"],
    description: "Explora combinaciones según el tiempo y los alimentos disponibles.",
    image: "assets/lunchboxes/azul.svg",
    symbol: "✦",
    href: "que-le-mando-de-lunch.html",
    available: true,
    kind: "interactive"
  },
  {
    id: "new-foods",
    title: "¿Qué hago si no le gusta algo?",
    audiences: ["caregiver"],
    type: "guide",
    typeLabel: "Guía práctica",
    topics: ["alimentacion", "habitos"],
    tags: ["presentacion", "preferencias", "sustituciones"],
    description: "Ideas para sustituir o presentar alimentos de otras maneras.",
    image: "assets/foods/brocoli.svg",
    symbol: "↻"
  },
  {
    id: "easy-swaps",
    title: "Sustituciones fáciles",
    audiences: ["caregiver"],
    type: "guide",
    typeLabel: "Checklist",
    topics: ["alimentacion", "habitos"],
    tags: ["alternativas", "preparaciones", "casa"],
    description: "Alternativas para adaptar preparaciones con lo disponible en casa.",
    image: "assets/foods/zanahoria.svg",
    symbol: "☑"
  },
  {
    id: "weekly-plan",
    title: "Organiza nuestra semana",
    audiences: ["caregiver", "family"],
    type: "planner",
    typeLabel: "Planeador",
    topics: ["alimentacion", "habitos", "lunch"],
    tags: ["semana", "organizacion", "familia"],
    description: "Un apoyo visual para anticipar algunas decisiones de alimentación.",
    image: "assets/foods/fresa.svg",
    symbol: "□"
  },
  {
    id: "daily-water",
    title: "Hidratación cotidiana",
    audiences: ["caregiver", "family"],
    type: "guide",
    typeLabel: "Guía",
    topics: ["hidratacion", "habitos"],
    tags: ["agua", "bebidas", "rutina"],
    description: "Ideas para acompañar el consumo de agua dentro de la rutina.",
    image: "assets/foods/pepino.svg",
    symbol: "◌",
    downloadHref: "assets/descargables/HIDRATACION.pdf"
  },
  {
    id: "read-labels",
    title: "Leer etiquetas",
    audiences: ["caregiver"],
    type: "guide",
    typeLabel: "Guía",
    topics: ["alimentacion", "habitos"],
    tags: ["productos empacados", "observar", "informacion"],
    description: "Material sencillo para comenzar a observar productos empacados.",
    image: "assets/foods/avena.svg",
    symbol: "⌕"
  },
  {
    id: "label-detectives",
    title: "Detectives de etiquetas",
    audiences: ["teacher"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "habitos"],
    tags: ["aula", "comparar", "productos"],
    description: "Dinámica para observar y comparar productos cotidianos.",
    image: "assets/foods/avena.svg",
    symbol: "⌕"
  },
  {
    id: "talk-without-stigma",
    title: "Hablar de alimentación sin estigmatizar",
    audiences: ["teacher"],
    type: "guide",
    typeLabel: "Guía",
    topics: ["alimentacion", "habitos"],
    tags: ["bienestar", "respeto", "lenguaje"],
    description: "Ideas para abordar estos temas desde el bienestar y el respeto.",
    image: "assets/characters/especialista.svg",
    symbol: "♡"
  },
  {
    id: "class-lunch",
    title: "Construyamos un lunch",
    audiences: ["teacher"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "lunch"],
    tags: ["grupo", "componentes", "escuela"],
    description: "Actividad grupal para reconocer los componentes de un lunch.",
    image: "assets/lunchboxes/rosa.svg",
    symbol: "+"
  },
  {
    id: "active-breaks",
    title: "Pausas activas",
    audiences: ["teacher"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["movimiento", "habitos"],
    tags: ["jornada escolar", "aula", "participacion"],
    description: "Actividades breves para incorporar movimiento durante la jornada escolar.",
    image: "assets/characters/nino.svg",
    symbol: "↗"
  },
  {
    id: "conversation-cards",
    title: "Tarjetas de conversación",
    audiences: ["teacher", "family"],
    type: "pdf",
    typeLabel: "Descargable",
    topics: ["habitos", "alimentacion"],
    tags: ["preguntas", "conversacion", "aula"],
    description: "Preguntas para iniciar conversaciones sobre hábitos cotidianos.",
    image: "assets/foods/manzana.svg",
    symbol: "▤"
  },
  {
    id: "balanced-plate-class",
    title: "Plato equilibrado",
    audiences: ["teacher"],
    type: "pdf",
    typeLabel: "PDF / impresión",
    topics: ["alimentacion", "porciones"],
    tags: ["material visual", "salon", "apoyo"],
    description: "Material visual de apoyo para utilizar dentro del salón.",
    image: "assets/foods/jitomate.svg",
    symbol: "◉"
  },
  {
    id: "school-family",
    title: "Escuela + familia",
    audiences: ["teacher", "caregiver"],
    type: "guide",
    typeLabel: "Guía",
    topics: ["habitos", "alimentacion"],
    tags: ["casa", "escuela", "acompanar"],
    description: "Ideas para reforzar en casa lo que se trabaja en clase.",
    image: "assets/characters/mama.svg",
    symbol: "+"
  },
  {
    id: "detectives-itaso",
    title: "Detectives ITASO",
    audiences: ["family"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "habitos"],
    tags: ["observar", "conversar", "participar"],
    description: "Una misión compartida para observar información en productos cotidianos.",
    image: "assets/foods/avena.svg",
    symbol: "⌕",
    downloadHref: "assets/descargables/_DETECTIVE ITASO.pdf"
  },
  {
    id: "prepare-together",
    title: "Preparemos algo juntos",
    audiences: ["family"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "habitos"],
    tags: ["preparar", "cocina", "acompanamiento"],
    description: "Una propuesta para conversar y participar durante una preparación sencilla.",
    image: "assets/foods/zanahoria.svg",
    symbol: "✦"
  },
  {
    id: "explore-fridge",
    title: "Explora tu refrigerador",
    audiences: ["family"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "habitos"],
    tags: ["casa", "observar", "alimentos"],
    description: "Actividad para reconocer juntos lo disponible en casa.",
    image: "assets/foods/lechuga.svg",
    symbol: "⌂"
  },
  {
    id: "food-groups",
    title: "Reconoce los grupos de alimentos",
    audiences: ["family"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion"],
    tags: ["clasificar", "conversar", "aprender"],
    description: "Una actividad visual para observar semejanzas y diferencias.",
    image: "assets/foods/brocoli.svg",
    symbol: "●"
  },
  {
    id: "swap-game",
    title: "Juego de sustituciones",
    audiences: ["family"],
    type: "activity",
    typeLabel: "Actividad",
    topics: ["alimentacion", "habitos"],
    tags: ["alternativas", "juego", "casa"],
    description: "Explora distintas posibilidades con lo que ya tienen disponible.",
    image: "assets/foods/fresa.svg",
    symbol: "↻"
  },
  {
    id: "habit-week",
    title: "Mi semana de hábitos",
    audiences: ["family"],
    type: "planner",
    typeLabel: "Planeador",
    topics: ["habitos", "movimiento", "descanso", "hidratacion"],
    tags: ["semana", "familia", "rutina"],
    description: "Un espacio para conversar sobre pequeñas acciones de la semana.",
    image: "assets/characters/nino.svg",
    symbol: "□",
    downloadHref: "assets/descargables/MI SEMANA DE HABITOS.pdf"
  },
  {
    id: "pdf-lunch-guide",
    title: "Guía de lunches",
    audiences: ["caregiver"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "lunch"],
    tags: ["ideas practicas", "escuela", "variedad"],
    description: "Ideas prácticas para variar el lunch.",
    image: "assets/lunchboxes/amarilla.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/MI SEMANA DE COMIDAS.pdf"
  },
  {
    id: "pdf-portions",
    title: "Guía visual de porciones",
    audiences: ["caregiver"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "porciones"],
    tags: ["guia visual", "familia"],
    description: "Propuesta visual para acompañar conversaciones sobre porciones.",
    image: "assets/foods/manzana.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/PORCIONES (1).pdf"
  },
  {
    id: "pdf-recipe-book",
    title: "Mini recetario",
    audiences: ["caregiver", "family"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "lunch"],
    tags: ["preparaciones", "ideas", "familia"],
    description: "Un conjunto de ideas para preparar y adaptar en familia.",
    image: "assets/foods/jitomate.svg",
    symbol: "↓",
    downloadFeature: true
  },
  {
    id: "pdf-swaps",
    title: "Lista de sustituciones",
    audiences: ["caregiver"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "habitos"],
    tags: ["alternativas", "lista", "casa"],
    description: "Una referencia para adaptar ideas con lo disponible en casa.",
    image: "assets/foods/zanahoria.svg",
    symbol: "↓",
    downloadFeature: true
  },
  {
    id: "pdf-weekly-planner",
    title: "Planeador semanal",
    audiences: ["caregiver", "family"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "habitos", "lunch"],
    tags: ["organizacion", "semana", "rutina"],
    description: "Formato visual para anticipar algunas decisiones de la semana.",
    image: "assets/foods/fresa.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/MI SEMANA DE COMIDAS.pdf"
  },
  {
    id: "pdf-conversation-cards",
    title: "Tarjetas de conversación",
    audiences: ["teacher", "family"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["habitos", "alimentacion"],
    tags: ["preguntas", "dialogo", "aula"],
    description: "Preguntas para abrir conversaciones respetuosas sobre hábitos.",
    image: "assets/characters/especialista.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/CONVERSACION.pdf"
  },
  {
    id: "pdf-balanced-plate",
    title: "Plato equilibrado",
    audiences: ["teacher", "family"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "porciones"],
    tags: ["material visual", "imprimir", "aula"],
    description: "Propuesta de apoyo visual para conversar en casa o en el salón.",
    image: "assets/foods/brocoli.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/PORCIONES (1).pdf"
  },
  {
    id: "pdf-detectives",
    title: "Actividad Detectives ITASO",
    audiences: ["teacher", "family"],
    type: "pdf",
    typeLabel: "PDF",
    topics: ["alimentacion", "habitos"],
    tags: ["observar", "actividad", "productos"],
    description: "Hoja de actividad para acompañar una misión de observación.",
    image: "assets/foods/avena.svg",
    symbol: "↓",
    downloadFeature: true,
    downloadHref: "assets/descargables/_DETECTIVE ITASO.pdf"
  }
];

const resourceAudienceLabels = {
  caregiver: "Personas cuidadoras",
  teacher: "Docentes",
  family: "En familia"
};

function resourceTypeClass(type) {
  return `type-${["guide", "activity", "interactive", "pdf", "planner"].includes(type) ? type : "guide"}`;
}

function savedResourceCatalogIds() {
  const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
  if (!Array.isArray(stored)) return new Set();
  return new Set(stored.map((item) => item?.id).filter((id) => typeof id === "string" && id.startsWith("resource-")));
}

function renderResourceSaveButton(resource) {
  const storageId = `resource-${resource.id}`;
  const saved = savedResourceCatalogIds().has(storageId);
  return `
    <button class="resource-save-button${saved ? " is-saved" : ""}" type="button" data-save-resource="${escapeHtml(resource.id)}" aria-pressed="${saved}" aria-label="${saved ? "Quitar de guardados" : "Guardar"}: ${escapeHtml(resource.title)}">
      <span aria-hidden="true">${saved ? "♥" : "♡"}</span> ${saved ? "Guardado" : "Guardar"}
    </button>
  `;
}

function renderResourcePrimaryAction(resource, label) {
  if (resource.available && resource.href) {
    return `<a class="resource-card-link" href="${escapeHtml(safeLocalHref(resource.href, "#biblioteca"))}">${escapeHtml(label || (resource.kind === "interactive" ? "Abrir interactivo" : "Ver recurso"))} <span aria-hidden="true">→</span></a>`;
  }
  if (resource.downloadHref) {
    return `<a class="resource-card-link" href="${escapeHtml(resource.downloadHref)}" target="_blank" rel="noopener">${escapeHtml(label || "Abrir PDF")} <span aria-hidden="true">↓</span></a>`;
  }
  return `<button class="resource-card-link" type="button" data-preview-resource="${escapeHtml(resource.id)}">${escapeHtml(label || "Ver prototipo")} <span aria-hidden="true">→</span></button>`;
}

function renderResourceDownloadAction(resource) {
  if (!(resource.available && resource.href && resource.downloadHref)) return "";
  return `<a class="resource-download-link" href="${escapeHtml(resource.downloadHref)}" target="_blank" rel="noopener">PDF <span aria-hidden="true">↓</span></a>`;
}

function renderResourceVisual(resource, className = "") {
  return `
    <div class="resource-card-visual ${resourceTypeClass(resource.type)} ${className}">
      <span class="resource-visual-symbol" aria-hidden="true">${escapeHtml(resource.symbol || "✦")}</span>
      <img src="${escapeHtml(resource.image)}" alt="">
    </div>
  `;
}

function renderCaregiverResource(resource, index) {
  const actionLabel = resource.available ? "Abrir interactivo" : resource.downloadHref ? "Abrir PDF" : resource.type === "interactive" ? "Conocer propuesta" : "Ver prototipo";
  return `
    <article class="caregiver-resource-card caregiver-card-${(index % 4) + 1}">
      ${renderResourceVisual(resource)}
      <div class="resource-card-copy">
        <span class="resource-type-badge ${resourceTypeClass(resource.type)}">${escapeHtml(resource.typeLabel)}</span>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
        <div class="resource-card-status">${resource.available || resource.downloadHref ? "Disponible ahora" : "Vista de prototipo"}</div>
        <div class="resource-card-actions">
          ${renderResourcePrimaryAction(resource, actionLabel)}
          ${renderResourceDownloadAction(resource)}
          ${renderResourceSaveButton(resource)}
        </div>
      </div>
    </article>
  `;
}

function renderTeacherResource(resource) {
  return `
    <article class="teacher-resource-card">
      <div class="teacher-resource-symbol ${resourceTypeClass(resource.type)}" aria-hidden="true">${escapeHtml(resource.symbol || "✦")}</div>
      <div>
        <span class="resource-type-badge ${resourceTypeClass(resource.type)}">${escapeHtml(resource.typeLabel)}</span>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
        <div class="resource-card-actions">
          ${renderResourcePrimaryAction(resource)}
          ${renderResourceDownloadAction(resource)}
          ${renderResourceSaveButton(resource)}
        </div>
      </div>
    </article>
  `;
}

function renderFamilyResource(resource, index) {
  return `
    <article class="family-resource-card family-card-${(index % 3) + 1}">
      <span class="family-resource-number" aria-hidden="true">0${index + 1}</span>
      <span class="resource-type-badge ${resourceTypeClass(resource.type)}">${escapeHtml(resource.typeLabel)}</span>
      <h3>${escapeHtml(resource.title)}</h3>
      <p>${escapeHtml(resource.description)}</p>
      <div class="resource-card-actions">
        ${renderResourcePrimaryAction(resource)}
        ${renderResourceDownloadAction(resource)}
        ${renderResourceSaveButton(resource)}
      </div>
    </article>
  `;
}

function renderDownloadResource(resource) {
  const isAvailable = Boolean(resource.downloadHref);
  return `
    <article class="download-resource-card">
      ${renderResourceVisual(resource, "download-resource-cover")}
      <div class="download-resource-copy">
        <span class="resource-type-badge type-pdf">PDF · ${isAvailable ? "DISPONIBLE" : "PRÓXIMAMENTE"}</span>
        <h3>${escapeHtml(resource.title)}</h3>
        <p class="download-resource-audience">${escapeHtml(resource.audiences.map((audience) => resourceAudienceLabels[audience]).join(" · "))}</p>
        <p>${escapeHtml(resource.description)}</p>
        <div class="resource-card-actions download-actions">
          ${renderResourcePrimaryAction(resource, isAvailable ? "Abrir PDF" : "Ver prototipo")}
          ${isAvailable ? "" : '<span class="download-unavailable" aria-label="Descarga todavía no disponible">Descargar ↓ <small>Próximamente</small></span>'}
        </div>
        ${renderResourceSaveButton(resource)}
      </div>
    </article>
  `;
}

function renderLibraryResource(resource) {
  const audiences = resource.audiences.map((audience) => resourceAudienceLabels[audience]).join(" · ");
  return `
    <article class="resource-library-card">
      ${renderResourceVisual(resource)}
      <div class="resource-card-copy">
        <div class="resource-library-meta">
          <span class="resource-type-badge ${resourceTypeClass(resource.type)}">${escapeHtml(resource.typeLabel)}</span>
          <span>${escapeHtml(audiences)}</span>
        </div>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description)}</p>
        <div class="resource-card-actions">
          ${renderResourcePrimaryAction(resource)}
          ${renderResourceDownloadAction(resource)}
          ${renderResourceSaveButton(resource)}
        </div>
      </div>
    </article>
  `;
}

function initResourcesPage() {
  if (document.body.dataset.page !== "recursos") return;

  const libraryMount = document.querySelector("[data-resource-results]");
  const searchInput = document.querySelector("[data-resource-search]");
  const clearSearch = document.querySelector("[data-clear-resource-search]");
  const audienceSelect = document.querySelector("[data-resource-audience]");
  const typeSelect = document.querySelector("[data-resource-type]");
  const emptyState = document.querySelector("[data-resource-empty]");
  const resultsStatus = document.querySelector("[data-resource-results-status]");
  const saveDialog = document.querySelector("#resource-save-dialog");
  const previewDialog = document.querySelector("#resource-preview-dialog");
  const previewContent = document.querySelector("[data-resource-preview-content]");
  let activeTopic = "all";

  const essentialResourceIds = [
    "lunch-ideas",
    "portions-guide",
    "new-foods",
    "daily-water",
    "read-labels",
    "label-detectives",
    "talk-without-stigma",
    "active-breaks",
    "detectives-itaso",
    "habit-week",
    "pdf-lunch-guide",
    "pdf-weekly-planner",
    "pdf-conversation-cards"
  ];
  const libraryResources = essentialResourceIds
    .map((id) => resourcesCatalog.find((resource) => resource.id === id))
    .filter(Boolean);

  function filteredResources() {
    const query = normalizeText(searchInput.value);
    const audience = audienceSelect.value;
    const type = typeSelect.value;
    return libraryResources.filter((resource) => {
      const matchesAudience = audience === "all" || resource.audiences.includes(audience);
      const matchesType = type === "all" || resource.type === type;
      const matchesTopic = activeTopic === "all" || resource.topics.includes(activeTopic);
      const haystack = normalizeText([
        resource.title,
        resource.description,
        resource.typeLabel,
        ...resource.audiences.map((item) => resourceAudienceLabels[item]),
        ...resource.topics,
        ...resource.tags
      ].join(" "));
      return matchesAudience && matchesType && matchesTopic && (!query || haystack.includes(query));
    });
  }

  function renderLibrary() {
    const visible = filteredResources();
    const query = searchInput.value.trim();
    libraryMount.innerHTML = visible.map(renderLibraryResource).join("");
    libraryMount.hidden = visible.length === 0;
    emptyState.hidden = visible.length !== 0;
    clearSearch.hidden = !query;
    resultsStatus.textContent = `${visible.length} recurso${visible.length === 1 ? "" : "s"}${query ? ` para “${query}”` : visible.length === 1 ? " disponible" : " disponibles"}.`;
    document.querySelectorAll("[data-resource-topic]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.resourceTopic === activeTopic));
    });
  }

  function resetFilters({ focus = false } = {}) {
    searchInput.value = "";
    audienceSelect.value = "all";
    typeSelect.value = "all";
    activeTopic = "all";
    renderLibrary();
    if (focus) searchInput.focus();
  }

  function updateSavedButtons(resourceId, saved) {
    document.querySelectorAll(`[data-save-resource="${resourceId}"]`).forEach((button) => {
      const resource = resourcesCatalog.find((item) => item.id === resourceId);
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", `${saved ? "Quitar de guardados" : "Guardar"}: ${resource?.title || "recurso"}`);
      button.innerHTML = `<span aria-hidden="true">${saved ? "♥" : "♡"}</span> ${saved ? "Guardado" : "Guardar"}`;
    });
  }

  function toggleSavedResource(resource) {
    if (!isPrototypeLoggedIn()) {
      saveDialog?.showModal();
      window.setTimeout(() => saveDialog?.querySelector("a")?.focus(), 50);
      return;
    }
    const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
    const savedResources = Array.isArray(stored) ? stored : [];
    const storageId = `resource-${resource.id}`;
    const alreadySaved = savedResources.some((item) => item?.id === storageId);
    const profileResource = {
      id: storageId,
      kind: resource.kind || "resource",
      title: resource.title,
      eyebrow: `${resource.typeLabel} · ${resource.available ? "Disponible" : "Vista de prototipo"}`,
      href: resource.available && resource.href ? resource.href : "#biblioteca",
      image: resource.image,
      symbol: resource.symbol
    };
    const next = alreadySaved
      ? savedResources.filter((item) => item?.id !== storageId)
      : [profileResource, ...savedResources.filter((item) => item?.id !== storageId)].slice(0, 24);
    if (!writeStoredJson(STORAGE_KEYS.savedResources, next)) {
      showToast("No pudimos guardar el recurso en este navegador.");
      return;
    }
    updateSavedButtons(resource.id, !alreadySaved);
    showToast(alreadySaved ? "Recurso eliminado de Mi perfil" : "✓ Recurso guardado");
  }

  function openResourcePreview(resource) {
    if (!previewDialog || !previewContent) return;
    const audience = resource.audiences.map((item) => resourceAudienceLabels[item]).join(" · ");
    previewContent.innerHTML = `
      <span class="resource-type-badge ${resourceTypeClass(resource.type)}">${escapeHtml(resource.typeLabel)}</span>
      <h2 id="resource-preview-title">${escapeHtml(resource.title)}</h2>
      <p>${escapeHtml(resource.description)}</p>
      <p class="resource-preview-audience"><strong>Dirigido a:</strong> ${escapeHtml(audience)}</p>
      <div class="resource-preview-notice">
        <span aria-hidden="true">◷</span>
        <div><strong>Vista de prototipo</strong><p>${resource.type === "pdf" ? "Este material todavía no cuenta con un archivo PDF publicado." : "Este recurso todavía no cuenta con una vista completa publicada."} Lo mostramos como propuesta para que puedas conocer la biblioteca sin llevarte a un enlace roto.</p></div>
      </div>
    `;
    previewDialog.showModal();
    window.setTimeout(() => previewDialog.querySelector("[data-dialog-close]")?.focus(), 50);
    showToast("Este recurso todavía está en preparación.");
  }

  searchInput.addEventListener("input", renderLibrary);
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    renderLibrary();
    searchInput.focus();
  });
  audienceSelect.addEventListener("change", () => {
    renderLibrary();
    showToast("Filtros actualizados.");
  });
  typeSelect.addEventListener("change", () => {
    renderLibrary();
    showToast("Filtros actualizados.");
  });
  document.querySelectorAll("[data-resource-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTopic = button.dataset.resourceTopic;
      renderLibrary();
      showToast("Filtros actualizados.");
    });
  });
  document.querySelector("[data-reset-resource-filters]")?.addEventListener("click", () => resetFilters({ focus: true }));

  document.querySelectorAll("[data-resource-shortcut]").forEach((link) => {
    link.addEventListener("click", () => {
      searchInput.value = "";
      audienceSelect.value = link.dataset.resourceShortcut;
      typeSelect.value = "all";
      activeTopic = "all";
      renderLibrary();
      showToast(`Mostramos recursos para ${link.querySelector("strong")?.textContent || "este público"}.`);
    });
  });

  document.querySelectorAll("[data-resource-format-shortcut]").forEach((link) => {
    link.addEventListener("click", () => {
      searchInput.value = "";
      audienceSelect.value = "all";
      typeSelect.value = link.dataset.resourceFormatShortcut;
      activeTopic = "all";
      renderLibrary();
      showToast("Mostramos los materiales descargables.");
    });
  });

  document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-resource]");
    if (saveButton) {
      const resource = resourcesCatalog.find((item) => item.id === saveButton.dataset.saveResource);
      if (resource) toggleSavedResource(resource);
      return;
    }
    const previewButton = event.target.closest("[data-preview-resource]");
    if (previewButton) {
      const resource = resourcesCatalog.find((item) => item.id === previewButton.dataset.previewResource);
      if (resource) openResourcePreview(resource);
    }
  });

  [saveDialog, previewDialog].forEach((dialog) => {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  if (window.location.hash === "#descargables") typeSelect.value = "pdf";
  if (window.location.hash === "#porciones") activeTopic = "porciones";
  if (window.location.hash === "#hidratacion") activeTopic = "hidratacion";
  renderLibrary();
}

function initPortionGame() {
  if (!document.body.classList.contains("portion-page")) return;

  const views = [...document.querySelectorAll("[data-portion-view]")];
  const ageNext = document.querySelector("#portion-age-next");
  const selectedAge = document.querySelector("#portion-selected-age");
  const groupTabs = document.querySelector("[data-portion-group-tabs]");
  const handDetail = document.querySelector("[data-portion-hand-detail]");
  const plateTabs = document.querySelector("[data-portion-plate-tabs]");
  const plateExamples = document.querySelector("[data-portion-plate-examples]");
  const plateFoods = document.querySelector("[data-portion-plate-foods]");
  const saveDialog = document.querySelector("#portion-save-dialog");
  const portionState = {
    view: "intro",
    age: null,
    group: "vegetables",
    plateGroup: "vegetables",
    plateFoods: {
      vegetables: "brocoli",
      cereals: "tortillas",
      proteins: "pollo"
    },
    explored: new Set()
  };

  const portionFoods = {
    zanahoria: { name: "Zanahoria", asset: "assets/foods/zanahoria.svg" },
    pepino: { name: "Pepino", asset: "assets/foods/pepino.svg" },
    brocoli: { name: "Brócoli", asset: "assets/foods/brocoli.svg" },
    pollo: { name: "Pollo", asset: "assets/foods/pollo.svg" },
    huevo: { name: "Huevo", asset: "assets/foods/huevo.svg" },
    frijol: { name: "Frijoles", asset: "assets/foods/frijol.svg" },
    tortillas: { name: "Tortilla", asset: "assets/foods/tortillas.svg" },
    arroz: { name: "Arroz", asset: "assets/foods/arroz-blanco.svg" },
    pasta: { name: "Pasta", asset: "assets/foods/pasta.svg" },
    manzana: { name: "Manzana", asset: "assets/foods/manzana.svg" },
    uvas: { name: "Uvas", asset: "assets/foods/uvas.svg" },
    fresa: { name: "Fresa", asset: "assets/foods/fresa.svg" }
  };

  const groups = [
    {
      id: "vegetables",
      label: "Verduras",
      reference: "Mano abierta",
      hand: "assets/hands/mano abierta.svg",
      tone: "blue",
      foods: ["brocoli", "zanahoria", "pepino"],
      copy: "La mano abierta puede ayudarte a observar visualmente este grupo en una comida."
    },
    {
      id: "proteins",
      label: "Proteínas",
      reference: "Palma",
      hand: "assets/hands/palma.svg",
      tone: "orange",
      foods: ["pollo", "huevo", "frijol"],
      copy: "La palma puede servir como una referencia visual al conversar sobre este grupo."
    },
    {
      id: "cereals",
      label: "Cereales",
      reference: "Puño",
      hand: "assets/hands/puño.svg",
      tone: "yellow",
      foods: ["tortillas", "arroz", "pasta"],
      copy: "El puño puede ayudarte a visualizar este grupo sin medir cada alimento."
    },
    {
      id: "fruits",
      label: "Frutas",
      reference: "Manos en forma de copa",
      hand: "assets/hands/mano en copa.svg",
      tone: "coral",
      foods: ["manzana", "uvas", "fresa"],
      copy: "Las manos en forma de copa ofrecen una referencia visual fácil de recordar."
    },
    {
      id: "fats",
      label: "Grasas saludables",
      reference: "Pulgar",
      hand: "assets/hands/pulgar.svg",
      tone: "lavender",
      foods: [],
      copy: "El pulgar funciona como referencia visual. Puedes adaptar las preparaciones a lo disponible en casa."
    }
  ];

  const plateGroupIds = ["vegetables", "cereals", "proteins"];
  const groupById = (id) => groups.find((group) => group.id === id) || groups[0];

  function foodExamplesMarkup(foodIds) {
    if (!foodIds.length) {
      return `<p class="portion-no-food-art">La ilustración de este ejemplo estará disponible próximamente. Por ahora, conserva el pulgar como referencia visual.</p>`;
    }
    return foodIds.map((id) => {
      const food = portionFoods[id];
      return `<div class="portion-food-example"><img src="${food.asset}" alt="${food.name} ilustrado"><span>${food.name}</span></div>`;
    }).join("");
  }

  function showView(name) {
    portionState.view = name;
    views.forEach((view) => {
      const active = view.dataset.portionView === name;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
    document.querySelector(`[data-portion-view="${name}"] h1, [data-portion-view="${name}"] h2`)?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function renderAge() {
    document.querySelectorAll("[data-portion-age]").forEach((button) => {
      const active = button.dataset.portionAge === portionState.age;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-checked", String(active));
    });
    ageNext.disabled = !portionState.age;
    selectedAge.textContent = portionState.age ? `Guía seleccionada: ${portionState.age}` : "";
  }

  function renderGroupTabs() {
    groupTabs.innerHTML = groups.map((group) => {
      const active = group.id === portionState.group;
      const explored = portionState.explored.has(group.id);
      return `
        <button class="portion-group-tab tone-${group.tone}${active ? " is-selected" : ""}" type="button" data-portion-group="${group.id}" aria-pressed="${active}">
          <span class="portion-group-visited" aria-hidden="true">${explored ? "✓" : ""}</span>
          <img src="${group.hand}" alt="">
          <strong>${group.label}</strong>
          <small>${group.reference}</small>
        </button>
      `;
    }).join("");
  }

  function renderHandDetail() {
    const group = groupById(portionState.group);
    handDetail.className = `portion-hand-detail tone-${group.tone}`;
    handDetail.innerHTML = `
      <div class="portion-hand-visual">
        <span aria-hidden="true"></span>
        <img src="${group.hand}" alt="${group.reference} ilustrada como referencia para ${group.label.toLowerCase()}">
      </div>
      <div class="portion-hand-copy">
        <span class="portion-detail-kicker">${group.label.toUpperCase()}</span>
        <h3>${group.reference}</h3>
        <p>${group.copy}</p>
        <div class="portion-examples-heading"><strong>Algunos ejemplos</strong><span>Ilustraciones ITASO</span></div>
        <div class="portion-food-examples">${foodExamplesMarkup(group.foods)}</div>
      </div>
    `;
  }

  function selectGroup(id) {
    portionState.group = id;
    portionState.explored.add(id);
    renderGroupTabs();
    renderHandDetail();
  }

  function renderPlate() {
    plateTabs.innerHTML = plateGroupIds.map((id) => {
      const group = groupById(id);
      const active = id === portionState.plateGroup;
      return `<button class="tone-${group.tone}${active ? " is-selected" : ""}" type="button" data-plate-group="${id}" aria-pressed="${active}">${group.label}</button>`;
    }).join("");
    const group = groupById(portionState.plateGroup);
    plateFoods.innerHTML = plateGroupIds.map((id) => {
      const selectedFood = portionFoods[portionState.plateFoods[id]];
      return `
        <span class="portion-plate-food-zone zone-${id}${id === portionState.plateGroup ? " is-active" : ""}">
          <img src="${selectedFood.asset}" alt="">
        </span>
      `;
    }).join("");
    plateExamples.className = `portion-plate-examples tone-${group.tone}`;
    plateExamples.innerHTML = `
      <span>${group.label.toUpperCase()}</span>
      <h4>Un ejemplo podría incluir</h4>
      <p class="portion-plate-instruction">Toca un ejemplo para verlo dentro del plato.</p>
      <div class="portion-food-examples portion-plate-food-choices">
        ${group.foods.map((id) => {
          const food = portionFoods[id];
          const selected = portionState.plateFoods[group.id] === id;
          return `
            <button class="portion-food-example${selected ? " is-selected" : ""}" type="button" data-portion-plate-food="${id}" aria-pressed="${selected}">
              <i class="portion-food-check" aria-hidden="true">✓</i>
              <img src="${food.asset}" alt="">
              <span>${food.name}</span>
            </button>
          `;
        }).join("")}
      </div>
      <p>Es una posibilidad visual, no una única combinación correcta.</p>
    `;
  }

  function isPortionGuideSaved() {
    const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
    return Array.isArray(stored) && stored.some((item) => item?.id === "interactive-portions");
  }

  function syncSaveButton() {
    const saved = isPortionGuideSaved();
    const button = document.querySelector("[data-save-portion-guide]");
    if (!button) return;
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.innerHTML = `${saved ? "♥ Guardado" : "♡ Guardar esta guía"}`;
  }

  function togglePortionGuide() {
    if (!isPrototypeLoggedIn()) {
      saveDialog?.showModal();
      window.setTimeout(() => saveDialog?.querySelector("a")?.focus(), 50);
      return;
    }
    const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
    const resources = Array.isArray(stored) ? stored : [];
    const alreadySaved = resources.some((item) => item?.id === "interactive-portions");
    const guide = {
      id: "interactive-portions",
      kind: "interactive",
      title: "¿Cuánto le sirvo?",
      eyebrow: "INTERACTIVO · Guía visual de porciones",
      href: "cuanto-le-sirvo.html",
      image: "assets/hands/mano abierta.svg"
    };
    const next = alreadySaved
      ? resources.filter((item) => item?.id !== guide.id)
      : [guide, ...resources.filter((item) => item?.id !== guide.id)].slice(0, 24);
    if (!writeStoredJson(STORAGE_KEYS.savedResources, next)) {
      showToast("No pudimos guardar la guía en este navegador.");
      return;
    }
    syncSaveButton();
    showToast(alreadySaved ? "Guía eliminada de Mi perfil" : "✓ Guía guardada");
  }

  function registerCompletion() {
    const stored = readStoredJson(STORAGE_KEYS.recentActivities, []);
    const activities = Array.isArray(stored) ? stored : [];
    const activity = {
      id: "activity-portions",
      title: "¿Cuánto le sirvo?",
      status: "Interactivo completado",
      href: "cuanto-le-sirvo.html"
    };
    writeStoredJson(STORAGE_KEYS.recentActivities, [activity, ...activities.filter((item) => item?.id !== activity.id)].slice(0, 12));
  }

  document.addEventListener("click", (event) => {
    const ageButton = event.target.closest("[data-portion-age]");
    if (ageButton) {
      portionState.age = ageButton.dataset.portionAge;
      renderAge();
      return;
    }
    const groupButton = event.target.closest("[data-portion-group]");
    if (groupButton) {
      selectGroup(groupButton.dataset.portionGroup);
      return;
    }
    const plateButton = event.target.closest("[data-plate-group]");
    if (plateButton) {
      portionState.plateGroup = plateButton.dataset.plateGroup;
      renderPlate();
      return;
    }
    const plateFoodButton = event.target.closest("[data-portion-plate-food]");
    if (plateFoodButton) {
      const group = groupById(portionState.plateGroup);
      const foodId = plateFoodButton.dataset.portionPlateFood;
      if (group.foods.includes(foodId)) {
        portionState.plateFoods[group.id] = foodId;
        renderPlate();
      }
      return;
    }
    if (event.target.closest("[data-save-portion-guide]")) {
      togglePortionGuide();
      return;
    }
    const actionButton = event.target.closest("[data-portion-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.portionAction;
    if (action === "start") showView("age");
    if (action === "back-intro") showView("intro");
    if (action === "back-age") showView("age");
    if (action === "next-hands" && portionState.age) {
      selectGroup(portionState.group);
      renderAge();
      showView("hands");
    }
    if (action === "back-hands") showView("hands");
    if (action === "next-plate") {
      renderPlate();
      showView("plate");
    }
    if (action === "finish") {
      registerCompletion();
      syncSaveButton();
      showView("complete");
    }
  });

  saveDialog?.addEventListener("click", (event) => {
    if (event.target === saveDialog) saveDialog.close();
  });
  renderAge();
  renderGroupTabs();
  renderHandDetail();
  renderPlate();
  syncSaveButton();
}

function initGamesCatalog() {
  if (!document.body.classList.contains("games-page")) return;
  const buttons = [...document.querySelectorAll("[data-game-filter]")];
  const cards = [...document.querySelectorAll("[data-game-card]")];
  const status = document.querySelector("[data-games-filter-status]");
  const empty = document.querySelector("[data-games-empty]");

  function applyFilter(filter = "todos") {
    let visible = 0;
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gameFilter === filter)));
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const show = filter === "todos" || tags.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (status) status.textContent = `${visible} ${visible === 1 ? "experiencia disponible" : "experiencias disponibles"}`;
    if (empty) empty.hidden = visible !== 0;
  }

  buttons.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.gameFilter)));
  document.querySelector("[data-game-filter-reset]")?.addEventListener("click", () => {
    applyFilter("todos");
    buttons[0]?.focus();
  });
  applyFilter("todos");
}

function initHydrationGame() {
  if (!document.body.classList.contains("hydration-page")) return;

  const root = document.querySelector(".hydration-main");
  const views = [...document.querySelectorAll("[data-hydration-view]")];
  const modeNext = document.querySelector("#hydration-mode-next");
  const classifyNext = document.querySelector("#hydration-classify-next");
  const casesNext = document.querySelector("#hydration-cases-next");
  const momentsNext = document.querySelector("#hydration-moments-next");
  const missionsNext = document.querySelector("#hydration-missions-next");
  const beverageList = document.querySelector("[data-hydration-beverages]");
  const clueCard = document.querySelector("[data-hydration-clue]");
  const caseCounter = document.querySelector("[data-hydration-case-counter]");
  const feedback = document.querySelector("[data-hydration-feedback]");
  const situation = document.querySelector("[data-hydration-situation]");
  const momentMessage = document.querySelector("[data-hydration-moment-message]");
  const missionMessage = document.querySelector("[data-hydration-mission-message]");
  const saveDialog = document.querySelector("#hydration-save-dialog");

  const beverages = [
    {
      id: "water",
      name: "Agua simple",
      asset: "assets/foods/agua simple.svg",
      expected: "hydrate",
      observation: "Puede ser la opción principal para acompañar la hidratación durante el día.",
      caregiver: "Tener agua disponible y visible puede hacer más fácil recordarla.",
      feedback: "El agua simple puede acompañar distintos momentos del día."
    },
    {
      id: "milk",
      name: "Leche",
      asset: "assets/foods/leche.svg",
      expected: "sometimes",
      observation: "Además de aportar líquido, cumple una función distinta al agua y puede formar parte de algunas comidas.",
      caregiver: "No es necesario presentar todas las bebidas como equivalentes: el agua puede seguir siendo la referencia principal para la sed cotidiana.",
      feedback: "La leche puede formar parte de ciertos momentos; no necesita sustituir al agua durante todo el día."
    },
    {
      id: "juice",
      name: "Jugo empacado",
      asset: "assets/foods/jugo naranja.svg",
      expected: "limit",
      observation: "Puede contener azúcares y no necesita ser la primera opción cada vez que aparece la sed.",
      caregiver: "Comparar opciones y frecuencia ayuda a conversar sin convertir una bebida en premio o castigo.",
      feedback: "Puede consumirse ocasionalmente; para la sed cotidiana conviene mantener agua disponible."
    },
    {
      id: "soda",
      name: "Refresco",
      asset: "assets/foods/refresco.svg",
      expected: "limit",
      observation: "Es una bebida azucarada que conviene observar y reservar para ocasiones específicas.",
      caregiver: "Hablar de frecuencia y contexto suele ser más útil que usar etiquetas como “malo” o “prohibido”.",
      feedback: "Puede reservarse para ocasiones específicas mientras el agua permanece accesible."
    }
  ];

  const jarLabels = {
    hydrate: "Para hidratarme",
    sometimes: "Para disfrutar algunas veces",
    limit: "Para limitar o consumir ocasionalmente"
  };

  const cases = [
    {
      label: "CASO A · DESPUÉS DE JUGAR",
      title: "Mateo termina de jugar y tiene sed. ¿Qué podrían ofrecer primero?",
      helper: "Piensen en una opción sencilla para responder a la sed después del movimiento.",
      expected: "water",
      choices: [
        { id: "soda", name: "Refresco", asset: "assets/foods/refresco.svg" },
        { id: "water", name: "Agua simple", asset: "assets/foods/agua simple.svg" },
        { id: "juice", name: "Jugo", asset: "assets/foods/jugo naranja.svg" }
      ],
      success: "El agua simple puede ser una primera opción práctica después de jugar.",
      review: "Observen la sed y recuerden que tener agua disponible puede facilitar la elección."
    },
    {
      label: "CASO B · DURANTE LA COMIDA",
      title: "Van a sentarse a comer. ¿Qué bebida podrían dejar disponible en la mesa?",
      helper: "No buscan una comida perfecta, sino una opción cotidiana y fácil de repetir.",
      expected: "water",
      choices: [
        { id: "flavored", name: "Bebida saborizada", asset: "assets/foods/agua de sabor embotellada.svg" },
        { id: "water", name: "Agua simple", asset: "assets/foods/vaso simple.svg" },
        { id: "juice", name: "Jugo empacado", asset: "assets/foods/jugo naranja.svg" }
      ],
      success: "Poner agua en la mesa puede convertirla en una opción visible y accesible.",
      review: "Prueben observar qué opción puede estar disponible con más frecuencia durante las comidas."
    },
    {
      label: "CASO C · VAMOS A SALIR",
      title: "Van a salir de casa. ¿Qué podrían preparar para tener agua disponible?",
      helper: "Elijan una opción que puedan llevar y volver a usar durante el trayecto.",
      expected: "bottle",
      choices: [
        { id: "bottle", name: "Botella de agua", asset: "assets/foods/agua simple.svg" },
        { id: "soda", name: "Refresco", asset: "assets/foods/refresco.svg" },
        { id: "flavored", name: "Bebida saborizada", asset: "assets/foods/agua de sabor embotellada.svg" }
      ],
      success: "Preparar una botella antes de salir puede ayudar a que el agua esté a la mano.",
      review: "Una pequeña preparación antes de salir puede facilitar que tengan agua disponible."
    }
  ];

  const state = {
    view: "intro",
    mode: null,
    beverage: beverages[0].id,
    classifications: {},
    caseIndex: 0,
    caseAnswers: {},
    moments: new Set(),
    missions: new Set()
  };

  const beverageById = (id) => beverages.find((item) => item.id === id) || beverages[0];

  function showView(name) {
    state.view = name;
    views.forEach((view) => {
      const active = view.dataset.hydrationView === name;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });
    const heading = document.querySelector(`[data-hydration-view="${name}"] h1, [data-hydration-view="${name}"] h2`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.setTimeout(() => heading?.focus({ preventScroll: true }), 90);
  }

  function renderMode() {
    root.dataset.hydrationModeActive = state.mode || "";
    document.querySelectorAll("[data-hydration-mode]").forEach((button) => {
      const active = button.dataset.hydrationMode === state.mode;
      button.setAttribute("aria-checked", String(active));
    });
    modeNext.disabled = !state.mode;
  }

  function renderBeverages() {
    beverageList.innerHTML = beverages.map((beverage, index) => {
      const current = beverage.id === state.beverage;
      const classified = Object.hasOwn(state.classifications, beverage.id);
      return `
        <button class="hydration-beverage-tab${current ? " is-current" : ""}${classified ? " is-classified" : ""}" type="button" data-hydration-beverage="${beverage.id}" aria-pressed="${current}" draggable="true">
          <i aria-hidden="true">✓</i>
          <img src="${beverage.asset}" alt="">
          <strong>${beverage.name}</strong>
          <span class="sr-only">Caso ${index + 1} de ${beverages.length}${classified ? ", clasificado" : ""}</span>
        </button>
      `;
    }).join("");
    const currentIndex = beverages.findIndex((item) => item.id === state.beverage);
    caseCounter.textContent = `Caso ${currentIndex + 1} de ${beverages.length} · ${Object.keys(state.classifications).length} investigadas`;
    renderClue();
    bindBeverageDrag();
  }

  function renderClue() {
    const beverage = beverageById(state.beverage);
    clueCard.innerHTML = `
      <div class="hydration-clue-visual">
        <img src="${beverage.asset}" alt="${beverage.name} ilustrada" draggable="true" data-hydration-drag-beverage="${beverage.id}">
      </div>
      <span>PISTA ENCONTRADA</span>
      <h3>${beverage.name}</h3>
      <p>${beverage.observation}</p>
      <p class="hydration-caregiver-tip"><strong>Para personas cuidadoras:</strong> ${beverage.caregiver}</p>
    `;
    document.querySelectorAll("[data-hydration-jar]").forEach((jar) => {
      jar.classList.toggle("is-current", state.classifications[beverage.id] === jar.dataset.hydrationJar);
    });
    clueCard.querySelector("[data-hydration-drag-beverage]")?.addEventListener("dragstart", handleDragStart);
  }

  function selectBeverage(id) {
    if (!beverages.some((item) => item.id === id)) return;
    state.beverage = id;
    feedback.hidden = true;
    renderBeverages();
  }

  function classifyBeverage(jarId, beverageId = state.beverage) {
    if (!Object.hasOwn(jarLabels, jarId)) return;
    state.beverage = beverageId;
    const beverage = beverageById(beverageId);
    state.classifications[beverageId] = jarId;
    const matches = beverage.expected === jarId;
    feedback.hidden = false;
    feedback.classList.toggle("is-review", !matches);
    feedback.innerHTML = `
      <strong>${matches ? "¡Buena pista!" : "Observemos un poco más"}</strong>
      <p>${beverage.feedback} Nuestra pista la ubica en “${jarLabels[beverage.expected]}”.</p>
    `;
    classifyNext.disabled = Object.keys(state.classifications).length < beverages.length;
    renderBeverages();
  }

  function handleDragStart(event) {
    const source = event.currentTarget;
    const id = source.dataset.hydrationBeverage || source.dataset.hydrationDragBeverage;
    if (!id) return;
    state.beverage = id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    source.classList.add("is-dragging");
    window.setTimeout(() => source.classList.remove("is-dragging"), 0);
  }

  function bindBeverageDrag() {
    beverageList.querySelectorAll("[data-hydration-beverage]").forEach((button) => {
      button.addEventListener("dragstart", handleDragStart);
    });
  }

  function renderSituation() {
    const item = cases[state.caseIndex];
    const answer = state.caseAnswers[state.caseIndex];
    situation.innerHTML = `
      <span class="hydration-situation-label">${item.label}</span>
      <h3>${item.title}</h3>
      <p>${item.helper}</p>
      <div class="hydration-case-options" role="group" aria-label="Opciones para ${item.label.toLowerCase()}">
        ${item.choices.map((choice) => `
          <button class="hydration-case-option" type="button" data-hydration-case-choice="${choice.id}" aria-pressed="${answer === choice.id}">
            <img src="${choice.asset}" alt="">
            <strong>${choice.name}</strong>
          </button>
        `).join("")}
      </div>
      ${answer ? `<div class="hydration-case-feedback" role="status"><strong>${answer === item.expected ? "¡Buena pista!" : "Observemos otra pista"}</strong><p>${answer === item.expected ? item.success : item.review}</p></div>` : ""}
      <div class="hydration-case-navigation">
        <button type="button" data-hydration-case-nav="previous" ${state.caseIndex === 0 ? "disabled" : ""}>← Caso anterior</button>
        <span>Caso ${state.caseIndex + 1} de ${cases.length}</span>
        <button type="button" data-hydration-case-nav="next" ${state.caseIndex === cases.length - 1 ? "disabled" : ""}>Siguiente caso →</button>
      </div>
    `;
    casesNext.disabled = Object.keys(state.caseAnswers).length < cases.length;
  }

  function renderMoments() {
    document.querySelectorAll("[data-hydration-moment]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.moments.has(button.dataset.hydrationMoment)));
    });
    const ready = state.moments.size >= 3;
    momentsNext.disabled = !ready;
    momentMessage.classList.toggle("is-ready", ready);
    momentMessage.textContent = ready
      ? `¡Ya encontraron ${state.moments.size} oportunidades para recordar el agua!`
      : `Selecciona ${3 - state.moments.size} ${3 - state.moments.size === 1 ? "momento más" : "momentos más"}.`;
  }

  function toggleMoment(id) {
    if (state.moments.has(id)) state.moments.delete(id);
    else state.moments.add(id);
    renderMoments();
  }

  function renderMissions() {
    document.querySelectorAll("[data-hydration-mission]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.missions.has(button.dataset.hydrationMission)));
    });
    const ready = state.missions.size >= 1;
    missionsNext.disabled = !ready;
    missionMessage.classList.toggle("is-ready", ready);
    missionMessage.textContent = ready
      ? `${state.missions.size} ${state.missions.size === 1 ? "misión elegida" : "misiones elegidas"}. Pueden resolver el caso.`
      : "Elijan una o dos misiones.";
  }

  function toggleMission(id) {
    if (state.missions.has(id)) state.missions.delete(id);
    else if (state.missions.size < 2) state.missions.add(id);
    else {
      missionMessage.textContent = "Ya eligieron dos misiones. Quiten una para cambiarla.";
      showToast("Pueden elegir un máximo de dos misiones.");
      return;
    }
    renderMissions();
  }

  function isHydrationSaved() {
    const resources = readStoredJson(STORAGE_KEYS.savedResources, []);
    return Array.isArray(resources) && resources.some((item) => item?.id === "interactive-hydration");
  }

  function syncHydrationSave() {
    const button = document.querySelector("[data-save-hydration]");
    if (!button) return;
    const saved = isHydrationSaved();
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.textContent = saved ? "♥ Actividad guardada" : "♡ Guardar actividad";
  }

  function toggleHydrationSave() {
    if (!isPrototypeLoggedIn()) {
      saveDialog?.showModal();
      window.setTimeout(() => saveDialog?.querySelector("a")?.focus(), 50);
      return;
    }
    const stored = readStoredJson(STORAGE_KEYS.savedResources, []);
    const resources = Array.isArray(stored) ? stored : [];
    const alreadySaved = resources.some((item) => item?.id === "interactive-hydration");
    const activity = {
      id: "interactive-hydration",
      kind: "interactive",
      title: "Detectives de la hidratación",
      eyebrow: "INTERACTIVO · Cuidador + niña o niño",
      href: "detectives-hidratacion.html",
      image: "assets/jarrones/jarron azul.svg"
    };
    const next = alreadySaved
      ? resources.filter((item) => item?.id !== activity.id)
      : [activity, ...resources.filter((item) => item?.id !== activity.id)].slice(0, 24);
    if (!writeStoredJson(STORAGE_KEYS.savedResources, next)) {
      showToast("No pudimos guardar la actividad en este navegador.");
      return;
    }
    syncHydrationSave();
    showToast(alreadySaved ? "Actividad eliminada de Mi perfil" : "✓ Actividad guardada en Mi perfil");
  }

  function registerHydrationCompletion() {
    const stored = readStoredJson(STORAGE_KEYS.recentActivities, []);
    const activities = Array.isArray(stored) ? stored : [];
    const activity = {
      id: "activity-hydration",
      title: "Detectives de la hidratación",
      status: "Caso resuelto · Misión familiar elegida",
      href: "detectives-hidratacion.html"
    };
    writeStoredJson(STORAGE_KEYS.recentActivities, [activity, ...activities.filter((item) => item?.id !== activity.id)].slice(0, 12));
  }

  function resetHydration() {
    state.mode = null;
    state.beverage = beverages[0].id;
    state.classifications = {};
    state.caseIndex = 0;
    state.caseAnswers = {};
    state.moments.clear();
    state.missions.clear();
    feedback.hidden = true;
    renderMode();
    renderBeverages();
    renderSituation();
    renderMoments();
    renderMissions();
    showView("intro");
  }

  document.querySelectorAll("[data-hydration-jar]").forEach((jar) => {
    jar.addEventListener("dragover", (event) => {
      event.preventDefault();
      jar.classList.add("is-drag-over");
      event.dataTransfer.dropEffect = "move";
    });
    jar.addEventListener("dragleave", () => jar.classList.remove("is-drag-over"));
    jar.addEventListener("drop", (event) => {
      event.preventDefault();
      jar.classList.remove("is-drag-over");
      const beverageId = event.dataTransfer.getData("text/plain") || state.beverage;
      classifyBeverage(jar.dataset.hydrationJar, beverageId);
    });
  });

  document.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-hydration-mode]");
    if (mode) {
      state.mode = mode.dataset.hydrationMode;
      renderMode();
      return;
    }
    const beverage = event.target.closest("[data-hydration-beverage]");
    if (beverage) {
      selectBeverage(beverage.dataset.hydrationBeverage);
      return;
    }
    const jar = event.target.closest("[data-hydration-jar]");
    if (jar) {
      classifyBeverage(jar.dataset.hydrationJar);
      return;
    }
    const caseChoice = event.target.closest("[data-hydration-case-choice]");
    if (caseChoice) {
      state.caseAnswers[state.caseIndex] = caseChoice.dataset.hydrationCaseChoice;
      renderSituation();
      return;
    }
    const caseNav = event.target.closest("[data-hydration-case-nav]");
    if (caseNav) {
      state.caseIndex += caseNav.dataset.hydrationCaseNav === "next" ? 1 : -1;
      state.caseIndex = Math.max(0, Math.min(cases.length - 1, state.caseIndex));
      renderSituation();
      situation.focus?.({ preventScroll: true });
      return;
    }
    const moment = event.target.closest("[data-hydration-moment]");
    if (moment) {
      toggleMoment(moment.dataset.hydrationMoment);
      return;
    }
    const mission = event.target.closest("[data-hydration-mission]");
    if (mission) {
      toggleMission(mission.dataset.hydrationMission);
      return;
    }
    if (event.target.closest("[data-save-hydration]")) {
      toggleHydrationSave();
      return;
    }
    const action = event.target.closest("[data-hydration-action]")?.dataset.hydrationAction;
    if (!action) return;
    if (action === "start") showView("mode");
    if (action === "back-intro") showView("intro");
    if (action === "next-classify" && state.mode) showView("classify");
    if (action === "back-mode") showView("mode");
    if (action === "next-cases" && Object.keys(state.classifications).length === beverages.length) showView("cases");
    if (action === "back-classify") showView("classify");
    if (action === "next-moments" && Object.keys(state.caseAnswers).length === cases.length) showView("moments");
    if (action === "back-cases") showView("cases");
    if (action === "next-missions" && state.moments.size >= 3) showView("missions");
    if (action === "back-moments") showView("moments");
    if (action === "finish" && state.missions.size >= 1) {
      registerHydrationCompletion();
      syncHydrationSave();
      showView("complete");
    }
    if (action === "restart") resetHydration();
  });

  saveDialog?.addEventListener("click", (event) => {
    if (event.target === saveDialog) saveDialog.close();
  });

  renderMode();
  renderBeverages();
  renderSituation();
  renderMoments();
  renderMissions();
  syncHydrationSave();
}

function initSubscriptionPage() {
  if (document.body.dataset.page !== "subscription") return;

  const storedSubscription = getStoredSubscription();
  const state = {
    plan: storedSubscription?.planId || "community",
    billing: storedSubscription?.billingId || "monthly",
    method: storedSubscription?.methodId || "card",
    merchIndex: 0
  };
  const billingButtons = [...document.querySelectorAll("[data-billing]")];
  const planCards = [...document.querySelectorAll("[data-plan-card]")];
  const planButtons = [...document.querySelectorAll("[data-select-plan]")];
  const paymentForm = document.querySelector("#subscription-payment-form");
  const paymentPanels = [...document.querySelectorAll("[data-payment-panel]")];
  const paymentRadios = [...document.querySelectorAll('input[name="paymentMethod"]')];
  const cardInputs = [...document.querySelectorAll('[data-payment-panel="card"] input')];
  const review = document.querySelector("[data-subscription-review]");
  const success = document.querySelector("[data-subscription-success]");
  const paymentStatus = document.querySelector("[data-payment-status]");
  const merchProducts = [...document.querySelectorAll("[data-merch-product]")];
  const merchDots = document.querySelector("[data-merch-dots]");
  const merchDialog = document.querySelector("#merch-dialog");
  const annualNote = document.querySelector("[data-annual-note]");

  function currentPlan() {
    return SUBSCRIPTION_PLAN_DETAILS[state.plan] || SUBSCRIPTION_PLAN_DETAILS.community;
  }

  function currentPrice() {
    return currentPlan().prices[state.billing];
  }

  function hideConfirmation() {
    if (review) review.hidden = true;
    if (success) success.hidden = true;
  }

  function renderSelection() {
    billingButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.billing === state.billing));
    });
    if (annualNote) annualNote.hidden = state.billing !== "annual";

    document.querySelectorAll("[data-plan-price]").forEach((element) => {
      const plan = SUBSCRIPTION_PLAN_DETAILS[element.dataset.planPrice];
      if (!plan) return;
      const suffix = state.billing === "annual" ? "/ año" : "/ mes";
      const amount = plan.prices[state.billing].replace(` ${suffix}`, "");
      element.innerHTML = `${amount} <span>${suffix}</span>`;
    });

    planCards.forEach((card) => card.classList.toggle("is-selected", card.dataset.planCard === state.plan));
    planButtons.forEach((button) => {
      const selected = button.dataset.selectPlan === state.plan;
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = selected
        ? `${state.plan === "community" ? "Comunidad" : "Esencial"} seleccionado ✓`
        : `Elegir ${button.dataset.selectPlan === "community" ? "Comunidad" : "Esencial"}`;
    });

    document.querySelector("[data-selected-plan-name]").textContent = currentPlan().name;
    document.querySelector("[data-selected-plan-billing]").textContent = `${SUBSCRIPTION_BILLING_LABELS[state.billing]} · ${currentPrice()}`;
  }

  function renderPaymentMethod() {
    paymentRadios.forEach((radio) => {
      radio.checked = radio.value === state.method;
    });
    paymentPanels.forEach((panel) => {
      panel.hidden = panel.dataset.paymentPanel !== state.method;
    });
    cardInputs.forEach((input) => {
      input.disabled = state.method !== "card";
    });
    if (paymentStatus) paymentStatus.textContent = "";
  }

  function renderMerch() {
    if (!merchProducts.length) return;
    state.merchIndex = (state.merchIndex + merchProducts.length) % merchProducts.length;
    merchProducts.forEach((product, index) => product.classList.toggle("is-current", index === state.merchIndex));
    if (merchDots) {
      merchDots.innerHTML = merchProducts.map((product, index) => `
        <button type="button" data-merch-dot="${index}" aria-label="Mostrar ${escapeHtml(product.querySelector("h3")?.textContent || `producto ${index + 1}`)}" aria-pressed="${index === state.merchIndex}"></button>
      `).join("");
    }
  }

  function showReview() {
    document.querySelector("[data-review-plan]").textContent = currentPlan().name;
    document.querySelector("[data-review-billing]").textContent = SUBSCRIPTION_BILLING_LABELS[state.billing];
    document.querySelector("[data-review-price]").textContent = currentPrice();
    document.querySelector("[data-review-method]").textContent = SUBSCRIPTION_METHOD_LABELS[state.method];
    cardInputs.forEach((input) => { input.value = ""; });
    if (success) success.hidden = true;
    if (review) {
      review.hidden = false;
      review.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => review.querySelector("[data-confirm-subscription]")?.focus({ preventScroll: true }), 320);
    }
    if (paymentStatus) paymentStatus.textContent = "Resumen preparado. No conservamos la información bancaria escrita.";
  }

  billingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!Object.hasOwn(SUBSCRIPTION_BILLING_LABELS, button.dataset.billing)) return;
      state.billing = button.dataset.billing;
      hideConfirmation();
      renderSelection();
    });
  });

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!Object.hasOwn(SUBSCRIPTION_PLAN_DETAILS, button.dataset.selectPlan)) return;
      state.plan = button.dataset.selectPlan;
      hideConfirmation();
      renderSelection();
      document.querySelector("#pago")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked || !Object.hasOwn(SUBSCRIPTION_METHOD_LABELS, radio.value)) return;
      state.method = radio.value;
      hideConfirmation();
      renderPaymentMethod();
    });
  });

  paymentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.method === "card") {
      const invalidInput = cardInputs.find((input) => !input.checkValidity());
      if (invalidInput) {
        paymentStatus.textContent = "Completa los campos de la tarjeta con el formato indicado para continuar con la simulación.";
        invalidInput.reportValidity();
        invalidInput.focus();
        return;
      }
    }
    showReview();
  });

  document.querySelector("[data-edit-payment]")?.addEventListener("click", () => {
    if (review) review.hidden = true;
    paymentForm?.querySelector('input[name="paymentMethod"]:checked')?.focus();
    paymentForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelector("[data-confirm-subscription]")?.addEventListener("click", () => {
    const subscription = {
      planId: state.plan,
      billingId: state.billing,
      methodId: state.method,
      status: "active"
    };
    if (!writeStoredJson(STORAGE_KEYS.subscription, subscription)) {
      showToast("No pudimos registrar la simulación en este navegador.");
      return;
    }
    cardInputs.forEach((input) => { input.value = ""; });
    if (review) review.hidden = true;
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    showToast("✓ Suscripción de prototipo registrada");
  });

  document.querySelector("[data-merch-prev]")?.addEventListener("click", () => {
    state.merchIndex -= 1;
    renderMerch();
  });
  document.querySelector("[data-merch-next]")?.addEventListener("click", () => {
    state.merchIndex += 1;
    renderMerch();
  });
  merchDots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-merch-dot]");
    if (!button) return;
    state.merchIndex = Number(button.dataset.merchDot);
    renderMerch();
  });

  document.querySelector("[data-open-merch]")?.addEventListener("click", () => {
    merchDialog?.showModal();
    window.setTimeout(() => merchDialog?.querySelector("[data-dialog-close]")?.focus(), 50);
  });
  merchDialog?.addEventListener("click", (event) => {
    if (event.target === merchDialog) merchDialog.close();
  });

  document.querySelector("[data-toggle-promotions]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const extra = document.querySelector("[data-extra-promotion]");
    const willExpand = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(willExpand));
    if (extra) extra.hidden = !willExpand;
    button.innerHTML = willExpand
      ? 'Mostrar menos <span aria-hidden="true">↑</span>'
      : 'Ver todos los beneficios <span aria-hidden="true">→</span>';
  });

  document.querySelectorAll("[data-faq-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll("[data-faq-toggle]").forEach((otherButton) => {
        const answer = document.querySelector(`#${otherButton.getAttribute("aria-controls")}`);
        otherButton.setAttribute("aria-expanded", "false");
        if (answer) answer.hidden = true;
      });
      button.setAttribute("aria-expanded", String(willOpen));
      const answer = document.querySelector(`#${button.getAttribute("aria-controls")}`);
      if (answer) answer.hidden = !willOpen;
    });
  });

  renderSelection();
  renderPaymentMethod();
  renderMerch();
}

function registerWebMCPTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const foodIds = foods.map((food) => food.id);

  Promise.resolve(context.registerTool({
    name: "configure_lunch_builder",
    title: "Preparar opciones de lunch",
    description: "Configura el tiempo, los alimentos disponibles y una preferencia opcional; después muestra tres opciones de lunch en la interfaz.",
    inputSchema: {
      type: "object",
      properties: {
        time: { type: "integer", enum: [5, 15, 30] },
        foods: { type: "array", minItems: 1, uniqueItems: true, items: { type: "string", enum: foodIds } },
        preference: { type: "string", maxLength: 120 }
      },
      required: ["time", "foods"],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || ![5, 15, 30].includes(input.time) || !Array.isArray(input.foods) || !input.foods.length || input.foods.some((id) => !foodIds.includes(id))) {
        throw new Error("Selecciona un tiempo válido y al menos un alimento reconocido.");
      }
      state.selectedFoods = new Set(input.foods);
      selectTime(input.time);
      state.preference = typeof input.preference === "string" ? input.preference.trim().slice(0, 120) : "";
      preferenceInput.value = state.preference;
      renderPreferenceOptions();
      renderSelectedFoods();
      renderFoods();
      const options = generateLunchOptions();
      return { screen: state.screen, options: options.map((lunch) => lunch.name) };
    }
  }, { signal: lifecycle.signal })).catch(() => {});

  Promise.resolve(context.registerTool({
    name: "reset_lunch_builder",
    title: "Reiniciar juego de lunch",
    description: "Borra las selecciones actuales y vuelve a la pantalla inicial.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute() {
      resetExperience();
      return { screen: state.screen, reset: true };
    }
  }, { signal: lifecycle.signal })).catch(() => {});

  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
}

function initPageTransitions() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("page-is-entering");
  window.setTimeout(() => document.body.classList.remove("page-is-entering"), reducedMotion ? 0 : 240);

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.target === "_blank") return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || !destination.pathname.toLowerCase().endsWith(".html")) return;
    if (destination.pathname === window.location.pathname && destination.hash) return;
    if (reducedMotion) return;

    event.preventDefault();
    document.body.classList.add("page-is-leaving");
    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 180);
  });
}

function initLunchGame() {
  if (!document.querySelector("#screen-intro")) return;
  screens = {
    intro: document.querySelector("#screen-intro"),
    time: document.querySelector("#screen-time"),
    foods: document.querySelector("#screen-foods"),
    results: document.querySelector("#screen-results"),
    detail: document.querySelector("#screen-detail")
  };
  foodGrid = document.querySelector("#food-grid");
  selectedList = document.querySelector("#selected-list");
  selectedCount = document.querySelector("#selected-count");
  foodsCount = document.querySelector("#foods-count");
  categoryFilters = document.querySelector("#category-filters");
  preferenceInput = document.querySelector("#preference");
  timeNext = document.querySelector("#time-next");
  generateButton = document.querySelector("#generate-button");
  lunchResults = document.querySelector("#lunch-results");
  detailChoice = document.querySelector("#detail-choice");
  saveIdeaButton = document.querySelector("#save-idea");
  if (preferenceInput) {
    preferenceInput.addEventListener("input", () => {
      state.preference = preferenceInput.value;
    });
  }
  renderCategories();
  renderFoods();
  renderSelectedFoods();
  renderPreferenceOptions();
  registerWebMCPTools();
}

const PAGE_INITS = {
  inicio: () => initTestimonialCarousel(),
  juegos: () => initGamesCatalog(),
  lunch: () => initLunchGame(),
  detectives: () => initHydrationGame(),
  cuanto: () => initPortionGame(),
  recursos: () => initResourcesPage(),
  noticias: () => initNewsPage(),
  conoce: () => {},
  perfil: () => initProfilePage(),
  login: () => initLoginPage(),
  suscripcion: () => initSubscriptionPage()
};

let currentRouteKey = null;
const routeInstances = new Map();
const routeInitialized = new Set();

function routeTemplate(key) {
  return document.querySelector(`template[data-key="${key}"]`);
}

function applyRoute(key, scrollId) {
  const tpl = routeTemplate(key) || routeTemplate("inicio");
  if (!tpl) return;
  const data = tpl.dataset;
  const changed = key !== currentRouteKey;
  if (changed) {
    document.body.className = data.bodyClass;
    document.body.dataset.page = data.pageAttr;
    if (data.pageAttr === "profile") protectProfileRoute();
    let instance = routeInstances.get(key);
    if (!instance) {
      const fragment = document.importNode(tpl.content, true);
      instance = Array.from(fragment.childNodes);
      routeInstances.set(key, instance);
    }
    document.getElementById("page-slot").replaceChildren(...instance);
    currentRouteKey = key;
    const icon = document.querySelector('link[rel="icon"]');
    if (icon && data.favicon) icon.setAttribute("href", data.favicon);
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme && data.theme) theme.setAttribute("content", data.theme);
    if (data.title) document.title = data.title;
    renderSharedChrome();
    if (!routeInitialized.has(key)) {
      routeInitialized.add(key);
      (PAGE_INITS[key] || (() => {}))();
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("page-is-entering");
      window.setTimeout(() => document.body.classList.remove("page-is-entering"), 240);
    }
  }
  if (scrollId) {
    const target = document.getElementById(scrollId);
    if (target) target.scrollIntoView({ block: "start" });
  } else if (changed) {
    window.scrollTo(0, 0);
  }
}

function resolveRouteFromHash() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "inicio") return { key: "inicio", id: null };
  if (Object.hasOwn(PAGE_INITS, raw)) return { key: raw, id: null };
  if (document.getElementById(raw)) return { key: currentRouteKey || "inicio", id: raw };
  const templates = document.querySelectorAll("template[data-key]");
  for (const tpl of templates) {
    try {
      if (tpl.content.querySelector("#" + CSS.escape(raw))) return { key: tpl.dataset.key, id: raw };
    } catch {
      // Hash no válido como selector; se ignora y se mantiene la página actual.
    }
  }
  return { key: currentRouteKey || "inicio", id: null };
}

function onRouteChange() {
  const { key, id } = resolveRouteFromHash();
  applyRoute(key, id);
}

function navigateTo(destination) {
  const resolved = safeLocalHref(destination, "index.html");
  if (/^[a-z0-9-]+\.html(?:\?[^#]*)?(?:#[a-z0-9-]+)?$/i.test(resolved)) {
    window.location.href = resolved;
    return;
  }
  const hash = typeof resolved === "string" ? resolved : "#inicio";
  const target = hash.startsWith("#") ? hash : "#" + hash;
  const current = window.location.hash || "#inicio";
  if (current === target) onRouteChange();
  else window.location.hash = target;
}

function bootRouter() {
  if (!document.querySelector("template[data-key]")) {
    const standaloneRoute = document.querySelector("#screen-intro") ? "lunch"
      : document.body.classList.contains("portion-page") ? "cuanto"
      : document.body.classList.contains("hydration-page") ? "detectives"
      : document.body.classList.contains("games-page") ? "juegos"
      : document.body.classList.contains("resources-page") ? "recursos"
      : document.body.classList.contains("news-page") ? "noticias"
      : document.body.classList.contains("about-page") ? "conoce"
      : document.body.classList.contains("profile-page") ? "perfil"
      : document.body.classList.contains("login-page") ? "login"
      : document.body.classList.contains("subscription-page") ? "suscripcion"
      : "inicio";
    currentRouteKey = standaloneRoute;
    routeInitialized.add(standaloneRoute);
    (PAGE_INITS[standaloneRoute] || (() => {}))();
    return;
  }
  onRouteChange();
  window.addEventListener("hashchange", onRouteChange);
}

initPageTransitions();
bootRouter();
