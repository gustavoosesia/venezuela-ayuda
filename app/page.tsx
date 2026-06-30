import Link from "next/link";
import { Heart, HandHeart, Shield, Globe, ChevronRight, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";

const TIPOS_AYUDA = [
  { icono: "🧠", nombre: "Psicólogo/a",       slug: "Psicólogo/a" },
  { icono: "🏥", nombre: "Médico/a",           slug: "Médico/a" },
  { icono: "🦷", nombre: "Dentista",           slug: "Dentista" },
  { icono: "🏗️", nombre: "Ingeniero/a Civil", slug: "Ingeniero/a Civil" },
  { icono: "⚙️", nombre: "Mecánico/a",        slug: "Mecánico/a" },
  { icono: "🔌", nombre: "Electricista",       slug: "Electricista" },
  { icono: "🔧", nombre: "Plomero/a",          slug: "Plomero/a" },
  { icono: "⚖️", nombre: "Abogado/a",         slug: "Abogado/a" },
  { icono: "👩‍🏫", nombre: "Maestro/a",       slug: "Maestro/a" },
  { icono: "💊", nombre: "Farmacéutico/a",     slug: "Farmacéutico/a" },
  { icono: "🏠", nombre: "Arquitecto/a",       slug: "Arquitecto/a" },
  { icono: "💰", nombre: "Contador/a",         slug: "Contador/a" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── HERO — centrado en el necesitado ─────────────────── */}
      <section className="bg-red-700 text-white px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">

          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm mb-6">
            <Heart size={13} fill="currentColor" className="text-red-300" />
            Respuesta gratuita al terremoto en Venezuela
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
            ¿Necesitas ayuda?
          </h1>
          <p className="text-red-100 text-lg sm:text-xl max-w-xl mx-auto mb-3 leading-relaxed">
            Conectamos con profesionales voluntarios que pueden ayudarte <strong className="text-white">de forma completamente gratuita</strong>.
          </p>
          <p className="text-red-200 text-sm mb-10">
            Psicólogos, médicos, ingenieros, mecánicos y más — listos para apoyarte.
          </p>

          {/* CTA principal — enorme y urgente */}
          <Link
            href="/necesito-ayuda"
            className="inline-flex items-center justify-center gap-3 bg-white text-red-700 font-black text-xl px-10 py-5 rounded-2xl hover:bg-red-50 transition-colors shadow-lg shadow-red-900/30 mb-6"
          >
            <Phone size={22} />
            Pedir ayuda ahora
          </Link>

          <p className="text-red-200 text-xs">
            Sin costo · Sin registro previo · Respuesta inmediata
          </p>
        </div>
      </section>

      {/* ── GARANTÍA DE SEGURIDAD ────────────────────────────── */}
      <section className="bg-red-900 text-white px-4 py-5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left text-sm">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-400 shrink-0" />
            <span className="text-red-200">Servicio <strong className="text-white">100% gratuito</strong></span>
          </div>
          <div className="hidden sm:block text-red-700">|</div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-400 shrink-0" />
            <span className="text-red-200">Ningún voluntario te pedirá <strong className="text-white">dinero ni datos bancarios</strong></span>
          </div>
          <div className="hidden sm:block text-red-700">|</div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-green-400 shrink-0" />
            <span className="text-red-200">Voluntarios de <strong className="text-white">todo el mundo</strong></span>
          </div>
        </div>
      </section>

      {/* ── TIPOS DE AYUDA (acceso rápido) ───────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            ¿Qué tipo de ayuda necesitas?
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Selecciona y te llevamos directo al formulario
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {TIPOS_AYUDA.map((t) => (
              <Link
                key={t.slug}
                href={`/necesito-ayuda?tipo=${encodeURIComponent(t.slug)}`}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="text-3xl mb-2">{t.icono}</div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{t.nombre}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/necesito-ayuda"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Ver todos los tipos de ayuda <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA (para el necesitado) ───────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Así de simple es pedir ayuda
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">Sin burocracia, sin esperas largas</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", titulo: "Cuéntanos qué necesitas", desc: "Completa un formulario breve con tu nombre, teléfono y qué tipo de ayuda buscas. Solo toma 2 minutos.", color: "text-red-600 bg-red-50 border-red-100" },
              { n: "2", titulo: "Te asignamos un voluntario", desc: "Nuestro sistema busca automáticamente el profesional más adecuado y disponible para tu caso.", color: "text-amber-600 bg-amber-50 border-amber-100" },
              { n: "3", titulo: "Te contactan directamente", desc: "El voluntario se comunica contigo por teléfono o WhatsApp. Tú no tienes que hacer nada más.", color: "text-green-600 bg-green-50 border-green-100" },
            ].map((p) => (
              <div key={p.n} className={`rounded-2xl border-2 p-6 ${p.color.split(" ").slice(1).join(" ")}`}>
                <p className={`text-4xl font-black mb-3 ${p.color.split(" ")[0]}`}>{p.n}</p>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{p.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/necesito-ayuda"
              className="inline-flex items-center gap-2 bg-red-700 text-white font-bold px-8 py-4 rounded-full hover:bg-red-800 transition-colors text-lg"
            >
              Solicitar ayuda gratis
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEPARADOR — llamado al voluntario ────────────────── */}
      <section className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 rounded-2xl p-3">
              <HandHeart size={28} className="text-blue-950" />
            </div>
            <div>
              <p className="font-bold text-lg">¿Eres profesional y quieres ayudar?</p>
              <p className="text-blue-300 text-sm">
                Médicos, ingenieros, psicólogos, mecánicos y más — desde cualquier país.
              </p>
            </div>
          </div>
          <Link
            href="/voluntario"
            className="shrink-0 bg-amber-400 text-blue-950 font-bold px-6 py-3 rounded-full hover:bg-amber-300 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Unirme como voluntario
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p className="flex items-center justify-center gap-2">
          Hecho con <Heart size={14} fill="currentColor" className="text-red-500" /> para Venezuela · 2026
        </p>
        <p className="mt-2 text-gray-600">Una iniciativa de OseanInnova LLC</p>
        <p className="mt-2 text-gray-600">
          <Link href="/seguimiento" className="underline hover:text-gray-300 transition-colors">
            Seguimiento de caso
          </Link>
          {" · "}
          <Link href="/terminos" className="underline hover:text-gray-300 transition-colors">
            Términos de uso
          </Link>
          {" · "}
          <Link href="/privacidad" className="underline hover:text-gray-300 transition-colors">
            Privacidad
          </Link>
        </p>
        <p className="mt-2 text-gray-600">
          ¿Eres administrador?{" "}
          <Link href="/admin" className="underline hover:text-gray-300 transition-colors">
            Acceder al panel
          </Link>
        </p>
      </footer>
    </div>
  );
}
