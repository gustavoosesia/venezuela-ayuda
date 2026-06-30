"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Loader2, Share2, Copy, Check, UserPlus, ShieldCheck, Target, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PROFESIONES } from "@/lib/supabase";

const SITE_URL = "https://voluntariosve.org";
const SHARE_TEXT = "Me registré como voluntario para ayudar a Venezuela tras el terremoto. ¡Únete tú también si tienes una profesión u oficio que pueda ayudar! 🇻🇪❤️";

function BotonesCompartir() {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const redes = [
    {
      nombre: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + "\n" + SITE_URL)}`,
    },
    {
      nombre: "Twitter / X",
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`,
    },
    {
      nombre: "Facebook",
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`,
    },
    {
      nombre: "Telegram",
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
    },
  ];

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left">
      <div className="flex items-center gap-2 mb-3">
        <Share2 size={16} className="text-blue-600" />
        <p className="font-semibold text-gray-800 text-sm">Invita a más voluntarios</p>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Cuantos más seamos, más venezolanos podemos ayudar.
      </p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {redes.map((r) => (
          <a key={r.nombre} href={r.url} target="_blank" rel="noopener noreferrer"
            className={`${r.color} text-white text-xs font-medium py-2 px-3 rounded-lg text-center transition-colors`}>
            {r.nombre}
          </a>
        ))}
      </div>
      <button onClick={copiar}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-600 text-xs py-2 rounded-lg hover:bg-gray-50 transition-colors">
        {copiado ? <><Check size={12} className="text-green-500" /> ¡Enlace copiado!</> : <><Copy size={12} /> Copiar enlace</>}
      </button>
    </div>
  );
}

const PASOS = [
  {
    icono: UserPlus,
    titulo: "Te registras",
    texto: "Completa tus datos, profesión y cómo puedes ayudar.",
  },
  {
    icono: ShieldCheck,
    titulo: "Revisamos tu perfil",
    texto: "Un administrador valida tu registro antes de activarlo, por seguridad de quienes piden ayuda.",
  },
  {
    icono: Target,
    titulo: "Te asignamos casos",
    texto: "Según tu profesión, idioma y disponibilidad. Si tu oficio requiere presencia física (electricista, mecánico, etc.), solo recibirás casos en Venezuela si resides allí.",
  },
  {
    icono: Mail,
    titulo: "Te avisamos y coordinas",
    texto: "Recibes los datos de contacto por correo y puedes escribir directo por WhatsApp.",
  },
];

function ComoFunciona() {
  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PASOS.map((p, i) => (
            <div key={p.titulo} className="flex gap-3">
              <div className="shrink-0 bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                  <p.icono size={14} className="text-blue-600" /> {p.titulo}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const IDIOMAS = ["Español", "Inglés", "Portugués", "Francés", "Italiano", "Alemán", "Otro"];
const DISPONIBILIDADES = [
  "Fines de semana",
  "Tardes entre semana",
  "Mañanas entre semana",
  "Tiempo completo",
  "Según sea necesario",
];

export default function VoluntarioPage() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
    profesion: "",
    especialidad: "",
    idiomas: [] as string[],
    disponibilidad: "",
    experiencia: "",
    como_puede_ayudar: "",
  });

  const toggle = (lang: string) => {
    setForm((f) => ({
      ...f,
      idiomas: f.idiomas.includes(lang)
        ? f.idiomas.filter((l) => l !== lang)
        : [...f.idiomas, lang],
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/voluntarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al registrar");
      }
      setEnviado(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  if (enviado) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por unirte!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu registro fue exitoso. Por seguridad, un administrador revisará tu perfil antes
              de activarlo. En cuanto sea aprobado, podrás recibir casos. Eres parte del cambio
              que Venezuela necesita.
            </p>
            <div className="flex flex-col gap-4">
              <BotonesCompartir />
              <Link
                href="/"
                className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors"
              >
                Volver al inicio
              </Link>
              <Link href="/necesito-ayuda" className="text-blue-600 hover:underline text-sm">
                También conocer cómo pedir ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Regístrate como Voluntario</h1>
          <p className="text-blue-200">
            Tu conocimiento puede cambiar la vida de una familia venezolana. Es gratis, es voluntario, es poderoso.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 bg-gray-50">
        <ComoFunciona />
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Datos personales</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nombre completo *">
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: María García" className={inputClass} />
              </Field>
              <Field label="Email *">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com" className={inputClass} />
              </Field>
              <Field label="Teléfono / WhatsApp *">
                <input required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+34 600 000 000" className={inputClass} />
              </Field>
              <Field label="País de residencia *">
                <input required value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  placeholder="Ej: España, Colombia, EE.UU." className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Perfil profesional</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Field label="Profesión / Oficio *">
                <select required value={form.profesion} onChange={(e) => setForm({ ...form, profesion: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {PROFESIONES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Especialidad">
                <input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                  placeholder="Ej: Trauma, Estructuras, etc." className={inputClass} />
              </Field>
              <Field label="Años de experiencia">
                <select value={form.experiencia} onChange={(e) => setForm({ ...form, experiencia: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  <option>Menos de 1 año</option>
                  <option>1-3 años</option>
                  <option>3-5 años</option>
                  <option>5-10 años</option>
                  <option>Más de 10 años</option>
                </select>
              </Field>
              <Field label="Disponibilidad *">
                <select required value={form.disponibilidad} onChange={(e) => setForm({ ...form, disponibilidad: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {DISPONIBILIDADES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Idiomas que dominas *">
              <div className="flex flex-wrap gap-2 mt-1">
                {IDIOMAS.map((lang) => (
                  <button type="button" key={lang}
                    onClick={() => toggle(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                      ${form.idiomas.includes(lang)
                        ? "bg-blue-700 text-white border-blue-700"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </Field>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">¿Cómo puedes ayudar?</h2>
            <Field label="Describe brevemente cómo puedes contribuir *">
              <textarea required value={form.como_puede_ayudar}
                onChange={(e) => setForm({ ...form, como_puede_ayudar: e.target.value })}
                placeholder="Ej: Puedo ofrecer sesiones de terapia psicológica por videollamada, enfocadas en trauma post-desastre..."
                rows={4} className={inputClass} />
            </Field>
          </section>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={cargando || form.idiomas.length === 0}
            className="w-full bg-blue-700 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {cargando ? <><Loader2 size={20} className="animate-spin" /> Registrando...</> : "Registrarme como Voluntario"}
          </button>
          {form.idiomas.length === 0 && (
            <p className="text-xs text-red-500 text-center mt-2">Selecciona al menos un idioma</p>
          )}
          <p className="text-xs text-gray-400 text-center mt-3">
            Al registrarte aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-gray-600">Términos de Uso</Link>
            {" "}y{" "}
            <Link href="/privacidad" className="underline hover:text-gray-600">Política de Privacidad</Link>.
          </p>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";
