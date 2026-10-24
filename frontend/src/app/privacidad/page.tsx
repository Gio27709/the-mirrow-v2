import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import { SITE, mailtoUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidad | The Mirrow",
  description:
    "Cómo The Mirrow trata tus datos personales conforme al RGPD y la LOPDGDD: qué datos recogemos, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
};

const LAST_UPDATED = "23 de octubre de 2026";

const linkClass =
  "text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-hover)]";

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    body: (
      <>
        <p>El responsable del tratamiento de tus datos personales es:</p>
        <ul>
          <li>
            <strong>Titular:</strong> {SITE.legalName} — [completar: razón social o nombre del titular]
          </li>
          <li>
            <strong>NIF/CIF:</strong> [completar: NIF/CIF]
          </li>
          <li>
            <strong>Domicilio:</strong> [completar: domicilio social], {SITE.country}
          </li>
          <li>
            <strong>Correo electrónico:</strong>{" "}
            <a href={mailtoUrl("Privacidad")} className={linkClass}>
              {SITE.email}
            </a>
          </li>
          <li>
            <strong>Teléfono:</strong> {SITE.phone}
          </li>
        </ul>
        <p>
          [completar: si se designa un Delegado de Protección de Datos (DPD), indicar aquí sus datos de contacto.]
        </p>
      </>
    ),
  },
  {
    id: "datos",
    title: "2. Qué datos recogemos",
    body: (
      <>
        <p>Solo tratamos los datos que nos facilitas directamente o que se generan al usar la plataforma:</p>
        <ul>
          <li>
            <strong>Datos de cuenta:</strong> nombre, nombre de usuario, correo electrónico, contraseña (almacenada cifrada), foto de perfil y, si eres artista, la información de tu perfil público (nombre artístico, categoría, descripción, imágenes, ubicación y enlaces).
          </li>
          <li>
            <strong>Formularios de contacto y solicitudes de cotización:</strong> nombre, correo electrónico, teléfono, tipo de consulta y el contenido de tu mensaje (por ejemplo, fecha, lugar y características del evento).
          </li>
          <li>
            <strong>Lista de espera:</strong> correo electrónico y, en su caso, nombre, para avisarte cuando una funcionalidad o evento esté disponible.
          </li>
          <li>
            <strong>Newsletter:</strong> correo electrónico, si te suscribes voluntariamente.
          </li>
          <li>
            <strong>Reservas de entradas:</strong> los datos de tu cuenta asociados a la reserva, el evento reservado y la fecha de la reserva.
          </li>
          <li>
            <strong>Inicio de sesión con Google:</strong> si eliges esta opción, Google nos facilita tu nombre, tu correo electrónico, si está verificado y tu foto de perfil. No recibimos tu contraseña de Google.
          </li>
          <li>
            <strong>Datos técnicos:</strong> información mínima necesaria para el funcionamiento y la seguridad del servicio, como registros del servidor (dirección IP, fecha y hora de acceso) generados por nuestro proveedor de alojamiento.
          </li>
        </ul>
        <p>
          No recogemos categorías especiales de datos ni datos de menores de 14 años de forma consciente. Si eres menor de esa edad, no debes registrarte.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "3. Para qué usamos tus datos",
    body: (
      <ul>
        <li>Crear y gestionar tu cuenta y permitirte iniciar sesión.</li>
        <li>Publicar y mostrar tu perfil de artista, si lo creas.</li>
        <li>Responder a tus consultas y gestionar las solicitudes de cotización para contratar artistas o producir eventos.</li>
        <li>Gestionar tus reservas de entradas y comunicarte cambios relevantes sobre el evento.</li>
        <li>Avisarte cuando estés en la lista de espera de algo que te interesa.</li>
        <li>Enviarte la newsletter con novedades, eventos y artistas, si te has suscrito.</li>
        <li>Garantizar la seguridad de la plataforma y prevenir usos fraudulentos o abusivos.</li>
        <li>Cumplir las obligaciones legales que nos sean aplicables.</li>
      </ul>
    ),
  },
  {
    id: "base-legal",
    title: "4. Base legal del tratamiento",
    body: (
      <ul>
        <li>
          <strong>Ejecución de un contrato o medidas precontractuales</strong> (art. 6.1.b RGPD): gestión de tu cuenta, de tu perfil, de las reservas y de las solicitudes de cotización.
        </li>
        <li>
          <strong>Consentimiento</strong> (art. 6.1.a RGPD): newsletter, lista de espera, formularios de contacto e inicio de sesión con Google. Puedes retirar tu consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento previo.
        </li>
        <li>
          <strong>Interés legítimo</strong> (art. 6.1.f RGPD): seguridad de la plataforma y prevención del fraude.
        </li>
        <li>
          <strong>Obligación legal</strong> (art. 6.1.c RGPD): conservación de información exigida por la normativa fiscal o mercantil cuando exista una relación comercial.
        </li>
      </ul>
    ),
  },
  {
    id: "conservacion",
    title: "5. Cuánto tiempo conservamos tus datos",
    body: (
      <ul>
        <li>
          <strong>Cuenta y perfil:</strong> mientras mantengas tu cuenta activa. Si la eliminas, borraremos o anonimizaremos tus datos salvo los que debamos conservar por obligación legal.
        </li>
        <li>
          <strong>Consultas y cotizaciones:</strong> el tiempo necesario para atenderlas y, si no se formaliza ninguna contratación, un máximo de [completar: plazo, p. ej. 12 meses].
        </li>
        <li>
          <strong>Reservas de entradas:</strong> hasta la celebración del evento y el periodo posterior necesario para atender incidencias.
        </li>
        <li>
          <strong>Newsletter y lista de espera:</strong> hasta que te des de baja o retires tu consentimiento.
        </li>
        <li>
          <strong>Datos con relevancia fiscal o contractual:</strong> durante los plazos de prescripción legal aplicables.
        </li>
      </ul>
    ),
  },
  {
    id: "destinatarios",
    title: "6. Destinatarios y encargados del tratamiento",
    body: (
      <>
        <p>
          No vendemos ni cedemos tus datos a terceros con fines comerciales. Para prestar el servicio contamos con proveedores que actúan como encargados del tratamiento, con los que tenemos suscritos los correspondientes acuerdos:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong>: base de datos y almacenamiento de archivos (por ejemplo, imágenes de perfiles y eventos).
          </li>
          <li>
            <strong>Vercel</strong>: alojamiento y entrega de la aplicación web.
          </li>
          <li>
            <strong>Google</strong>: servicio de inicio de sesión con Google, solo si eliges utilizarlo.
          </li>
        </ul>
        <p>
          Cuando solicitas una cotización para contratar a un artista, podemos compartir con ese artista la información necesaria del evento para preparar la propuesta. También podremos comunicar datos a autoridades públicas cuando exista una obligación legal.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "7. Transferencias internacionales",
    body: (
      <p>
        Algunos de nuestros proveedores (Supabase, Vercel y Google) pueden tratar datos fuera del Espacio Económico Europeo, en particular en Estados Unidos. En esos casos, las transferencias se amparan en la decisión de adecuación del Marco de Privacidad de Datos UE-EE. UU. para las entidades adheridas y/o en las cláusulas contractuales tipo aprobadas por la Comisión Europea, junto con las garantías adicionales que resulten necesarias. [completar: confirmar la región de alojamiento configurada en Supabase y Vercel.]
      </p>
    ),
  },
  {
    id: "derechos",
    title: "8. Tus derechos",
    body: (
      <>
        <p>En cualquier momento puedes ejercer los siguientes derechos:</p>
        <ul>
          <li><strong>Acceso:</strong> saber qué datos tuyos tratamos.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> pedir que eliminemos tus datos cuando ya no sean necesarios.</li>
          <li><strong>Oposición:</strong> oponerte a determinados tratamientos, como los basados en interés legítimo.</li>
          <li><strong>Limitación:</strong> solicitar que restrinjamos temporalmente el tratamiento.</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
        </ul>
        <p>
          Para ejercerlos, escríbenos a{" "}
          <a href={mailtoUrl("Ejercicio de derechos RGPD")} className={linkClass}>
            {SITE.email}
          </a>{" "}
          indicando el derecho que quieres ejercer y desde el correo asociado a tu cuenta. Si tenemos dudas razonables sobre tu identidad, podremos pedirte información adicional para verificarla. Te responderemos en el plazo máximo de un mes.
        </p>
        <p>
          También puedes modificar gran parte de tus datos directamente desde la sección{" "}
          <Link href="/settings" className={linkClass}>
            Ajustes
          </Link>{" "}
          de tu cuenta.
        </p>
      </>
    ),
  },
  {
    id: "aepd",
    title: "9. Reclamaciones ante la AEPD",
    body: (
      <p>
        Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) a través de su sede electrónica en{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className={linkClass}>
          www.aepd.es
        </a>
        . Te agradeceremos que antes nos escribas para intentar resolverlo.
      </p>
    ),
  },
  {
    id: "seguridad",
    title: "10. Seguridad y cambios en esta política",
    body: (
      <>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos, como el cifrado de contraseñas y las conexiones seguras (HTTPS).
        </p>
        <p>
          Podemos actualizar esta política para adaptarla a cambios legales o del servicio. Publicaremos la nueva versión en esta página con su fecha de actualización y, si los cambios son relevantes, te lo comunicaremos. Consulta también nuestra{" "}
          <Link href="/cookies" className={linkClass}>
            Política de Cookies
          </Link>{" "}
          y los{" "}
          <Link href="/terminos" className={linkClass}>
            Términos y Condiciones
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <header className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] mb-4">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Política de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Privacidad
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

        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          En {SITE.name} nos tomamos en serio tu privacidad. Esta política explica cómo tratamos tus datos personales de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
        </p>

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
