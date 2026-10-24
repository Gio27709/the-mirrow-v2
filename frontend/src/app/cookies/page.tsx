import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cookie, Info } from "lucide-react";
import { SITE, mailtoUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Cookies | The Mirrow",
  description:
    "The Mirrow solo usa almacenamiento técnico necesario: sesión, preferencia de tema e inicio de sesión con Google. Sin cookies analíticas ni publicitarias.",
};

const LAST_UPDATED = "23 de octubre de 2026";

const linkClass =
  "text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-hover)]";

const storageRows = [
  {
    name: "Token de sesión",
    type: "localStorage",
    owner: SITE.name,
    purpose: "Mantener tu sesión iniciada mientras navegas.",
    duration: "Hasta que cierras sesión o lo borras.",
  },
  {
    name: "Preferencia de tema",
    type: "localStorage",
    owner: SITE.name,
    purpose: "Recordar si prefieres el tema oscuro, claro o gris.",
    duration: "Hasta que lo borras.",
  },
  {
    name: "Inicio de sesión con Google",
    type: "Cookies de terceros",
    owner: "Google",
    purpose: "Autenticarte cuando eliges iniciar sesión con Google y proteger el proceso frente a fraudes.",
    duration: "Según la política de Google.",
  },
  {
    name: "Alojamiento",
    type: "Técnico",
    owner: "Vercel",
    purpose: "Servir la web de forma segura y estable. No se usa para analítica ni publicidad.",
    duration: "Sesión o mínima necesaria.",
  },
];

const browsers = [
  { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647?hl=es" },
  { name: "Mozilla Firefox", url: "https://support.mozilla.org/es/kb/Borrar%20cookies" },
  { name: "Safari (macOS)", url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
  { name: "Safari (iPhone/iPad)", url: "https://support.apple.com/es-es/HT201265" },
  { name: "Microsoft Edge", url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
];

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "que-son",
    title: "1. Qué son las cookies y el almacenamiento local",
    body: (
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador. El almacenamiento local (<em>localStorage</em>) es una tecnología similar que permite a la web recordar información en tu dispositivo. Esta política explica qué usamos y por qué.
      </p>
    ),
  },
  {
    id: "que-usamos",
    title: "2. Qué usamos en The Mirrow",
    body: (
      <>
        <p>
          Solo utilizamos almacenamiento <strong>técnico y necesario</strong> para que la plataforma funcione. Por eso no te pedimos consentimiento para usarlo, conforme al artículo 22.2 de la Ley 34/2002 (LSSI).
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] px-3">
          <table className="min-w-[560px] w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-[var(--text-primary)] border-b border-[var(--border-medium)]">
                <th className="py-2 pr-3 font-semibold">Nombre</th>
                <th className="py-2 pr-3 font-semibold">Tipo</th>
                <th className="py-2 pr-3 font-semibold">Titular</th>
                <th className="py-2 pr-3 font-semibold">Finalidad</th>
                <th className="py-2 font-semibold">Duración</th>
              </tr>
            </thead>
            <tbody>
              {storageRows.map((r) => (
                <tr key={r.name} className="border-b border-[var(--border-subtle)] align-top">
                  <td className="py-3 pr-3 text-[var(--text-primary)] font-medium">{r.name}</td>
                  <td className="py-3 pr-3">{r.type}</td>
                  <td className="py-3 pr-3">{r.owner}</td>
                  <td className="py-3 pr-3">{r.purpose}</td>
                  <td className="py-3">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "no-usamos",
    title: "3. Lo que no usamos",
    body: (
      <ul>
        <li>No usamos cookies analíticas ni de medición de audiencia.</li>
        <li>No usamos cookies publicitarias ni de seguimiento entre sitios.</li>
        <li>No vendemos ni compartimos información de navegación con anunciantes.</li>
      </ul>
    ),
  },
  {
    id: "google",
    title: "4. Inicio de sesión con Google",
    body: (
      <p>
        Si eliges iniciar sesión con Google, Google puede instalar sus propias cookies para autenticarte y prevenir el fraude. Estas cookies las gestiona Google conforme a su{" "}
        <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer" className={linkClass}>
          política de cookies
        </a>
        . Si no usas esta opción, no se cargan.
      </p>
    ),
  },
  {
    id: "borrar",
    title: "5. Cómo borrarlas o bloquearlas",
    body: (
      <>
        <p>
          Puedes eliminar las cookies y el almacenamiento local desde la configuración de tu navegador, normalmente en el apartado de privacidad o «Borrar datos de navegación». Ten en cuenta que, si los borras, se cerrará tu sesión y se restablecerá el tema por defecto.
        </p>
        <ul>
          {browsers.map((b) => (
            <li key={b.name}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {b.name}
              </a>
            </li>
          ))}
        </ul>
        <p>
          También puedes cerrar sesión desde tu cuenta, lo que elimina el token de sesión de tu dispositivo.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "6. Cambios y contacto",
    body: (
      <p>
        Si en el futuro incorporamos cookies que requieran tu consentimiento (por ejemplo, analíticas), actualizaremos esta política y te pediremos permiso antes de usarlas. Para cualquier duda, escríbenos a{" "}
        <a href={mailtoUrl("Política de Cookies")} className={linkClass}>
          {SITE.email}
        </a>{" "}
        o consulta nuestra{" "}
        <Link href="/privacidad" className={linkClass}>
          Política de Privacidad
        </Link>
        .
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <header className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] mb-4">
            <Cookie className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Política de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Cookies
            </span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Última actualización: {LAST_UPDATED}</p>
        </header>

        <div className="flex gap-3 items-start rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 mb-8 text-sm text-[var(--text-secondary)]">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            Este texto es una base de trabajo y debe ser revisado por un asesor legal antes de considerarse definitivo.
          </p>
        </div>

        <nav
          aria-label="Índice"
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 md:p-6 mb-10"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Índice</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold mb-4">{s.title}</h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-[var(--text-primary)] [&_strong]:font-semibold">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
