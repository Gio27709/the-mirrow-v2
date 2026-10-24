# Plan de mejoras — The Mirrow

Auditoría del 2026-10-23: capturas reales (escritorio 1440px y móvil 390px) de 13 páginas en producción, más revisión de código de frontend, admin y backend.

Estado: ⬜ pendiente · 🟡 en curso · ✅ hecho

---

## Fase 1 — Seguridad crítica del backend ✅
- `/admin/stats` y `PUT /admin/users/{id}` devuelven `hashed_password` → usar `UserResponse`.
- CORS `allow_origins=["*"]` con credenciales → solo el dominio del frontend + localhost.
- Un admin puede crear "owners" o degradar/borrar otros admins → solo el owner gestiona admins.
- ⚠️ PENDIENTE (verificar en Vercel): `SECRET_KEY` con valor por defecto público → confirmar que está definida en el proyecto the-mirrow-api y luego volverla obligatoria.
- Login con Google no verifica `email_verified`.
- `passlib` + `bcrypt` sin fijar (bcrypt ≥5 rompe login) → fijar `bcrypt==4.0.1`.

## Fase 2 — Base visual (CSS) ✅
Causa raíz de muchos bugs visuales: estilos sin `@layer` en `globals.css` le ganan a Tailwind v4.
- `.mobile-scroll-x` → carruseles de móvil visibles en escritorio (**evento gigante y repetido, artistas repetidos**).
- Reset de `button` y `a` → botones sin fondo/color ("Comenzar ahora", filtros, "Ver Detalles", "Guardar Cambios"…).
- `.glass-card`, `:focus-visible` → bordes y anillos de foco incorrectos.
- Variables sin definir: `--foreground`, `--background`, `--accent-primary`, `--accent-hover`, `--border-hover`.
- `bg-pure-black` no existe en Tailwind v4 (el `tailwind.config.ts` se ignora).
- `noise.svg` externo devuelve 402 → servirlo local.

## Fase 3 — Página de inicio ✅
- CTA del hero y "Comenzar ahora" no navegan.
- "Próximos Eventos" muestra eventos pasados y no ordena por fecha.
- Sección vacía si fallan categorías; espaciador de pruebas; peticiones duplicadas a `/hero-content`.
- ⬜ (movido a pendientes menores) Carrusel de categorías: sin flechas en escritorio y ancho no recalculado.

## Fase 4 — Formularios que no funcionan en producción ✅
- `/registro` y la subida de imágenes del admin (Portada) apuntan a `localhost:8000`.
- Ajustes: "Guardar" no guarda (envía datos en la URL) y además vacía los campos.
- Login ignora `?redirect=`; enlace `/forgot-password` roto.
- Errores del backend se ven como "[object Object]" o en inglés.
- Modal de cotización no envía el artista ni la fecha, y falla en silencio.

## Fase 5 — Navegación y layout ⬜
- Sidebar muestra "GiovanyDev / Admin" a cualquier visitante.
- Botones fijos (volver/compartir) quedan debajo del sidebar o encima del header.
- Header móvil se desborda a 375px; BottomNav sin "Eventos" y "Ajustes" manda al login.
- Modal por debajo del sidebar/bottom-nav (z-index).
- Cada página se monta dos veces (llamadas dobles a la API, saltos de layout).
- Sesión: consulta `/users/me` cada 5 s y cierra sesión ante cualquier error de red.

## Fase 6 — Contenido y coherencia ⬜
- Datos de contacto contradictorios (.com vs .com.es, +34 vs +58) → una sola fuente.
- Footer: redes, Carreras/Prensa/Blog, Privacidad/Términos/Cookies apuntan a `#`.
- Botones falsos: campana con punto rojo fijo, buscadores, newsletter, "Mejorar a Pro", idioma.
- Páginas "Próximamente" (Compañía, Ayuda) enlazadas desde el menú.
- Datos engañosos: rating 5.0 y "verificado" por defecto, precio siempre en USD.
- Textos en inglés mezclados ("Searching talents…", "Loading…", "Dark/Light").

## Fase 7 — Eventos, categorías y perfiles ⬜
- `/eventos`: el filtro activo no se distingue; "Cartelera" queda vacía si solo hay el evento destacado.
- Categorías: gradientes dinámicos no se generan; grid de 2 columnas apretado en móvil; error = 404.
- Tras reservar entrada, se envía al usuario a una pestaña donde no ve su ticket.
- Textos blancos fijos invisibles en modo claro.

## Fase 8 — Panel de administración ⬜
- Vercel rechaza subidas >4.5 MB (la UI promete videos de 50 MB) → subida directa a Supabase.
- No se ven categorías/slides inactivos; "Quitar banner" no se guarda.
- Sin estado "guardando" (doble clic = duplicados), sin confirmación al borrar, errores genéricos.
- Tablas y botones de hover inutilizables en móvil.
- Tickets: no hay forma de listarlos, validarlos ni cancelarlos.

## Fase 9 — Robustez del backend ⬜
- Conexiones a Supabase desde serverless → `NullPool`.
- `create_all` y seed en cada arranque en frío → script aparte.
- Fijar todas las versiones de `requirements.txt` (ya rompió una vez).
- Borrar usuario/evento con relaciones → error 500 (cascadas).
- Archivos huérfanos en Storage; `/docs` público; `/events` sin barra (redirección extra).

## Fase 10 — SEO, rendimiento y mantenimiento ⬜
- Títulos y descripciones por página (eventos, artistas, categorías), `sitemap` y `robots`.
- Imágenes de ~800 KB sin optimizar (~3 MB al cargar la portada).
- Rutas inexistentes responden 200 en lugar de 404.
- Mantener Supabase activo (ping programado) para que no se pause.
