import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FileText, Info } from "lucide-react";
import { SITE, mailtoUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones | The Mirrow",
  description:
    "Condiciones de uso de The Mirrow: registro, uso aceptable, solicitudes de cotización, reservas de entradas, perfiles de artistas y ley aplicable.",
};

const LAST_UPDATED = "23 de octubre de 2026";

const linkClass =
  "text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-hover)]";

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "objeto",
    title: "1. Objeto e identificación",
    body: (
      <>
        <p>
          Estos Términos y Condiciones regulan el acceso y uso de la plataforma {SITE.name} ({SITE.url}), un espacio para descubrir artistas (DJs, músicos, cantantes, artes escénicas y danza), solicitar presupuestos para contratarlos y reservar entradas para los eventos que organizamos.
        </p>
        <p>
          La plataforma es titularidad de [completar: razón social], con NIF/CIF [completar: NIF/CIF] y domicilio en [completar: domicilio social], {SITE.country}. Contacto:{" "}
          <a href={mailtoUrl("Términos y Condiciones")} className={linkClass}>
            {SITE.email}
          </a>
          .
        </p>
        <p>Al usar la plataforma aceptas estos términos. Si no estás de acuerdo, no la utilices.</p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "2. Registro y cuenta",
    body: (
      <ul>
        <li>Puedes navegar sin registrarte, pero algunas funciones (reservar entradas, crear un perfil de artista) requieren una cuenta.</li>
        <li>Debes tener al menos 14 años y facilitar datos veraces y actualizados. Si contratas servicios, debes ser mayor de edad.</li>
        <li>Puedes registrarte con correo y contraseña o con tu cuenta de Google.</li>
        <li>Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad que se realice con tu cuenta. Avísanos si detectas un uso no autorizado.</li>
        <li>Puedes solicitar la baja de tu cuenta en cualquier momento escribiéndonos.</li>
      </ul>
    ),
  },
  {
    id: "uso",
    title: "3. Uso aceptable",
    body: (
      <>
        <p>Te comprometes a no:</p>
        <ul>
          <li>Publicar contenido ilícito, ofensivo, discriminatorio, engañoso o que vulnere derechos de terceros.</li>
          <li>Suplantar a otra persona o artista, o crear perfiles falsos.</li>
          <li>Usar la plataforma para enviar spam o comunicaciones comerciales no solicitadas.</li>
          <li>Intentar acceder sin autorización a sistemas, cuentas o datos, o interferir en el funcionamiento del servicio.</li>
          <li>Extraer datos de forma masiva o automatizada sin nuestro permiso.</li>
        </ul>
        <p>Podremos suspender o cancelar cuentas que incumplan estas normas.</p>
      </>
    ),
  },
  {
    id: "cotizaciones",
    title: "4. Solicitudes de cotización",
    body: (
      <ul>
        <li>Las solicitudes que envías para contratar a un artista o producir un evento son peticiones de información y presupuesto.</li>
        <li>
          <strong>Una solicitud no constituye un contrato</strong> ni garantiza la disponibilidad del artista. La contratación solo existe cuando {SITE.name} (y, en su caso, el artista) confirma por escrito las condiciones: fecha, lugar, servicios, precio y forma de pago.
        </li>
        <li>Los precios orientativos que puedan mostrarse en la plataforma no son vinculantes hasta esa confirmación.</li>
        <li>Las condiciones de cancelación de cada contratación se indicarán en la propuesta que aceptes.</li>
      </ul>
    ),
  },
  {
    id: "entradas",
    title: "5. Reservas y entradas de eventos",
    body: (
      <ul>
        <li>Para los eventos con <strong>reserva gratuita</strong>, se admite una reserva por persona y evento, vinculada a tu cuenta. La reserva es personal e intransferible salvo que se indique lo contrario.</li>
        <li>El aforo es limitado: la reserva está sujeta a disponibilidad y puede requerir llegar antes de una hora determinada para mantener tu plaza.</li>
        <li>Cada evento puede tener sus propias condiciones (edad mínima, derecho de admisión, normas del recinto, horarios). Esas condiciones del organizador o del recinto se aplican además de estos términos.</li>
        <li>Si ya no puedes asistir, te pedimos que canceles tu reserva o nos avises para liberar la plaza.</li>
        <li>Si un evento se cancela o cambia de fecha, hora o lugar, te lo comunicaremos por los datos de contacto de tu cuenta. En eventos de pago, las condiciones de reembolso se indicarán en el propio evento.</li>
        <li>Podemos anular reservas que se hayan obtenido de forma fraudulenta o duplicada.</li>
      </ul>
    ),
  },
  {
    id: "artistas",
    title: "6. Perfiles de artistas y contenido",
    body: (
      <ul>
        <li>Si creas un perfil de artista, garantizas que la información es veraz y que tienes los derechos sobre las imágenes, audios, vídeos y textos que publicas.</li>
        <li>Conservas la titularidad de tu contenido. Nos concedes una licencia no exclusiva, gratuita y limitada a la duración de tu perfil para mostrarlo en la plataforma y en la promoción de {SITE.name} y de tu perfil.</li>
        <li>Podemos revisar, no publicar o retirar perfiles o contenidos que incumplan estos términos o que recibamos como denuncia fundada.</li>
        <li>Las funciones Pro se solicitan a través de contacto y se rigen por las condiciones que acordemos en cada caso.</li>
      </ul>
    ),
  },
  {
    id: "propiedad",
    title: "7. Propiedad intelectual",
    body: (
      <p>
        La marca {SITE.name}, el logotipo, el diseño de la plataforma y su código son titularidad de {SITE.name} o de sus licenciantes. No está permitido reproducirlos, distribuirlos o transformarlos sin autorización, salvo para el uso personal y no comercial de la plataforma. Los contenidos de artistas pertenecen a sus respectivos titulares.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    title: "8. Responsabilidad",
    body: (
      <ul>
        <li>Trabajamos para que la plataforma funcione de forma continua y segura, pero no podemos garantizar la ausencia total de interrupciones o errores.</li>
        <li>La información de los perfiles de artistas es facilitada por los propios artistas, que son responsables de su veracidad.</li>
        <li>No respondemos de los contenidos de sitios web de terceros enlazados desde la plataforma.</li>
        <li>Nada de lo dispuesto en estos términos limita los derechos que te reconoce la normativa de consumidores y usuarios.</li>
      </ul>
    ),
  },
  {
    id: "modificaciones",
    title: "9. Modificaciones",
    body: (
      <p>
        Podemos modificar estos términos para adaptarlos a cambios legales o del servicio. Publicaremos la versión actualizada en esta página con su fecha y, si los cambios son relevantes, te lo comunicaremos. El uso continuado de la plataforma tras la publicación implica la aceptación de los nuevos términos.
      </p>
    ),
  },
  {
    id: "ley",
    title: "10. Ley aplicable y jurisdicción",
    body: (
      <>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable; si eres consumidor, serán competentes los de tu domicilio.
        </p>
        <p>
          El tratamiento de tus datos personales se describe en nuestra{" "}
          <Link href="/privacidad" className={linkClass}>
            Política de Privacidad
          </Link>{" "}
          y el uso de almacenamiento local en la{" "}
          <Link href="/cookies" className={linkClass}>
            Política de Cookies
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <header className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] mb-4">
            <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Términos y{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Condiciones
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
