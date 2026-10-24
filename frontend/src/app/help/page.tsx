"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import { SITE, mailtoUrl, whatsappUrl } from "@/lib/site";

interface Faq {
  q: string;
  a: string;
}

interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

const groups: FaqGroup[] = [
  {
    id: "cuenta",
    title: "Cuenta y acceso",
    items: [
      {
        q: "¿Necesito una cuenta para usar The Mirrow?",
        a: "Puedes explorar artistas y eventos sin registrarte. Necesitas una cuenta para reservar entradas, guardar tus datos y crear un perfil de artista.",
      },
      {
        q: "¿Cómo me registro?",
        a: "Pulsa en «Registrarse» y crea tu cuenta con tu correo y una contraseña, o entra directamente con tu cuenta de Google.",
      },
      {
        q: "He olvidado mi contraseña, ¿qué hago?",
        a: "Si te registraste con Google, entra con el botón de Google. Si usas correo y contraseña y no puedes acceder, escríbenos desde el correo de tu cuenta y te ayudamos a recuperarla.",
      },
      {
        q: "¿Cómo cambio mis datos, mi foto o mi contraseña?",
        a: "Desde Ajustes, una vez iniciada la sesión, puedes editar tu nombre, foto de perfil, contraseña y la apariencia de la web (tema oscuro, claro o gris).",
      },
      {
        q: "¿Cómo elimino mi cuenta?",
        a: "Escríbenos desde el correo asociado a tu cuenta pidiendo la baja y la gestionaremos, junto con la eliminación de tus datos según nuestra Política de Privacidad.",
      },
    ],
  },
  {
    id: "contratar",
    title: "Contratar artistas",
    items: [
      {
        q: "¿Cómo contrato a un artista?",
        a: "Busca en Explorar, entra en el perfil del artista que te interese y envía una solicitud de cotización con la fecha, el lugar y el tipo de evento. Te responderemos con disponibilidad y presupuesto.",
      },
      {
        q: "¿La solicitud de cotización me compromete a algo?",
        a: "No. Una solicitud es una petición de información y presupuesto. La contratación solo se cierra cuando confirmas por escrito las condiciones que te proponemos.",
      },
      {
        q: "¿Cuánto tardáis en responder?",
        a: "Respondemos en horario laboral lo antes posible. Si es urgente, escríbenos por WhatsApp indicando tu nombre y la fecha del evento.",
      },
      {
        q: "¿Podéis organizar el evento completo y no solo el artista?",
        a: "Sí. Además del booking ofrecemos producción y organización integral: sonido, iluminación, logística y coordinación. Cuéntanoslo en el formulario de contacto.",
      },
    ],
  },
  {
    id: "eventos",
    title: "Eventos y entradas",
    items: [
      {
        q: "¿Cómo reservo una entrada?",
        a: "Entra en Eventos, abre el evento y pulsa en reservar. Necesitas haber iniciado sesión.",
      },
      {
        q: "¿Cuántas reservas puedo hacer?",
        a: "En los eventos con reserva gratuita se admite una reserva por persona y evento, vinculada a tu cuenta.",
      },
      {
        q: "¿Cómo cancelo mi reserva si no puedo ir?",
        a: "Avísanos cuanto antes para liberar tu plaza y que otra persona pueda disfrutarla. Puedes escribirnos por email o WhatsApp.",
      },
      {
        q: "¿Qué pasa si el evento cambia o se cancela?",
        a: "Te lo comunicaremos a través de los datos de contacto de tu cuenta. Cada evento puede tener condiciones propias (edad mínima, horario de acceso, derecho de admisión) que se indican en su ficha.",
      },
    ],
  },
  {
    id: "artistas",
    title: "Artistas",
    items: [
      {
        q: "Soy artista, ¿cómo creo mi perfil?",
        a: "Regístrate en la plataforma y escríbenos desde el formulario de contacto con tu nombre artístico, disciplina, una breve descripción, fotos y enlaces a tu trabajo. Nuestro equipo revisa la información y publica tu perfil. Cuanto más completo esté, más fácil será que te contraten.",
      },
      {
        q: "¿Qué tipo de artistas pueden unirse?",
        a: "DJs, músicos, cantantes, artistas de artes escénicas y danza. Si tu disciplina no encaja exactamente, escríbenos y lo vemos.",
      },
      {
        q: "¿Cuesta algo tener un perfil?",
        a: "Crear tu perfil es gratuito. Si quieres funciones adicionales, puedes solicitar el plan Pro a través de contacto.",
      },
      {
        q: "¿Cómo recibo solicitudes de contratación?",
        a: "Cuando alguien solicita una cotización para ti, nuestro equipo la revisa y se pone en contacto contigo para confirmar disponibilidad y condiciones.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y Pro",
    items: [
      {
        q: "¿Cómo consigo el plan Pro?",
        a: "Pro se solicita a través de contacto. Escríbenos y te explicamos qué incluye y sus condiciones.",
      },
      {
        q: "¿Se me cobrará algo automáticamente?",
        a: "No. La plataforma no realiza cobros automáticos ni guarda datos de tarjetas. Cualquier pago se acuerda previamente contigo por escrito.",
      },
      {
        q: "¿Cómo se paga la contratación de un artista?",
        a: "La forma de pago se indica en la propuesta que te enviamos y solo se aplica cuando la confirmas.",
      },
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad",
    items: [
      {
        q: "¿Qué hacéis con mis datos?",
        a: "Solo los usamos para prestarte el servicio: gestionar tu cuenta, tus reservas y tus solicitudes. No los vendemos. Tienes todos los detalles en la Política de Privacidad.",
      },
      {
        q: "¿Usáis cookies de seguimiento?",
        a: "No. Solo usamos almacenamiento técnico necesario, como tu sesión y tu preferencia de tema. Consulta la Política de Cookies.",
      },
      {
        q: "¿Cómo ejerzo mis derechos de acceso, rectificación o supresión?",
        a: "Escríbenos por email desde el correo de tu cuenta indicando qué derecho quieres ejercer. Te responderemos en el plazo máximo de un mes.",
      },
    ],
  },
];

/** Lowercase and strip accents so "contrasena" matches "contraseña" */
function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((f) => normalize(`${f.q} ${f.a} ${g.title}`).includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const resultCount = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-10 md:space-y-12">
        <header className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
              Centro de Ayuda
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            ¿En qué te{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              ayudamos?
            </span>
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
            <label htmlFor="faq-search" className="sr-only">Buscar en la ayuda</label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca: reserva, contraseña, Pro..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl pl-12 pr-12 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Borrar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {query.trim() && (
            <p className="text-sm text-[var(--text-muted)]" aria-live="polite">
              {resultCount === 1 ? "1 resultado" : `${resultCount} resultados`}
            </p>
          )}
        </header>

        {!query.trim() && (
          <nav aria-label="Temas" className="flex flex-wrap justify-center gap-2">
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="px-4 py-2 rounded-full text-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-colors"
              >
                {g.title}
              </a>
            ))}
          </nav>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-8 text-center space-y-3">
            <p className="font-semibold">No encontramos nada para «{query}»</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Prueba con otras palabras o escríbenos directamente: estaremos encantados de ayudarte.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-24 space-y-3">
                <h2 className="text-xl md:text-2xl font-bold">{g.title}</h2>
                <div className="space-y-2">
                  {g.items.map((f) => {
                    const key = `${g.id}:${f.q}`;
                    const isOpen = open === key;
                    const panelId = `faq-${key.replace(/[^a-z0-9]/gi, "-")}`;
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <span>{f.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 shrink-0 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={panelId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="px-5 pb-5 text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="text-sm text-[var(--text-muted)] text-center">
          Más detalles en{" "}
          <Link href="/terminos" className="underline hover:text-[var(--text-secondary)]">Términos y Condiciones</Link>,{" "}
          <Link href="/privacidad" className="underline hover:text-[var(--text-secondary)]">Privacidad</Link> y{" "}
          <Link href="/cookies" className="underline hover:text-[var(--text-secondary)]">Cookies</Link>.
        </p>

        {/* Contact */}
        <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">¿No encuentras tu respuesta?</h2>
            <p className="text-[var(--text-secondary)]">{SITE.hours}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <a
              href={mailtoUrl("Ayuda")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 text-center hover:border-[var(--accent-primary)]/50 transition-colors"
            >
              <Mail className="w-6 h-6 text-[var(--accent-primary)]" />
              <span className="font-semibold">Email</span>
              <span className="text-xs text-[var(--text-muted)] break-all">{SITE.email}</span>
            </a>
            <a
              href={whatsappUrl("Hola, necesito ayuda con The Mirrow.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 text-center hover:border-emerald-500/50 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-emerald-500" />
              <span className="font-semibold">WhatsApp</span>
              <span className="text-xs text-[var(--text-muted)]">{SITE.phone}</span>
            </a>
            <Link
              href="/contact"
              className="flex flex-col items-center gap-2 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] p-5 text-center text-white transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
              <span className="font-semibold">Formulario de contacto</span>
              <span className="text-xs text-white/80">Te respondemos por email</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
