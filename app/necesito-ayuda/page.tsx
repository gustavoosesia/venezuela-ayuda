"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Loader2, AlertTriangle, ShieldAlert, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

const TIPOS_AYUDA = [
  "Psicólogo/a",
  "Médico/a",
  "Enfermero/a",
  "Dentista",
  "Trabajador/a Social",
  "Ingeniero/a Civil",
  "Ingeniero/a Eléctrico",
  "Mecánico/a",
  "Arquitecto/a",
  "Abogado/a",
  "Contador/a",
  "Maestro/a",
  "Nutricionista",
  "Farmacéutico/a",
  "Plomero/a",
  "Electricista",
  "Otro",
];

type ResultadoEnvio = {
  asignado: boolean;
  codigoSeguimiento: string;
  voluntario?: { nombre: string; telefono: string };
} | null;

function linkWhatsapp(telefono: string, mensaje: string): string {
  const digitos = (telefono || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

function NecesitoAyudaForm() {
  const searchParams = useSearchParams();
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<ResultadoEnvio>(null);
  const [copiado, setCopiado] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ubicacion: "",
    tipo_ayuda: "",
    descripcion: "",
    urgencia: "media" as "alta" | "media" | "baja",
  });

  // Pre-selecciona el tipo de ayuda si viene de la landing
  useEffect(() => {
    const tipo = searchParams.get("tipo");
    if (tipo) setForm((f) => ({ ...f, tipo_ayuda: tipo }));
  }, [searchParams]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/necesidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al registrar");
      setResultado({ asignado: json.asignado, codigoSeguimiento: json.codigoSeguimiento, voluntario: json.voluntario });
      setEnviado(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  const copiarCodigo = () => {
    if (!resultado?.codigoSeguimiento) return;
    navigator.clipboard.writeText(resultado.codigoSeguimiento);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (enviado) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={56} />
              <h1 className="text-2xl font-bold text-gray-900">Solicitud recibida</h1>
            </div>

            {/* Código de seguimiento */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-4 text-center">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Tu código de seguimiento</p>
              <p className="text-3xl font-black text-blue-800 tracking-widest mb-2">
                {resultado?.codigoSeguimiento}
              </p>
              <button
                onClick={copiarCodigo}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-300 px-3 py-1.5 rounded-full transition-colors"
              >
                {copiado ? <><Check size={12} /> ¡Copiado!</> : <><Copy size={12} /> Copiar código</>}
              </button>
              <p className="text-xs text-blue-500 mt-2">
                {form.email ? "También lo recibirás por correo." : "Guárdalo — lo necesitarás para hacer seguimiento."}
              </p>
            </div>

            {/* Estado de asignación */}
            {resultado?.asignado ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4 text-left">
                <p className="text-green-800 font-semibold mb-1">✅ ¡Encontramos un voluntario!</p>
                <p className="text-green-700 text-sm leading-relaxed">
                  Ya te asignamos un profesional disponible. Pronto te contactará directamente
                  por el teléfono que nos indicaste.
                </p>
                {resultado.voluntario && (
                  <a
                    href={linkWhatsapp(
                      resultado.voluntario.telefono,
                      `Hola ${resultado.voluntario.nombre}, soy ${form.nombre}. Me asignaron contigo en Venezuela Se Levanta para ${form.tipo_ayuda}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 bg-[#25D366] hover:brightness-95 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all"
                  >
                    📱 Escribirle por WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4 text-left">
                <p className="text-amber-800 font-semibold mb-1">⏳ En lista de espera</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Aún no hay voluntarios disponibles para ese tipo de ayuda, pero tu solicitud
                  quedó registrada. En cuanto llegue un profesional adecuado, te avisaremos.
                </p>
              </div>
            )}

            {/* Aviso de seguridad */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-red-800 text-sm mb-2">AVISO DE SEGURIDAD IMPORTANTE</p>
                  <p className="text-red-700 text-xs leading-relaxed">
                    Este servicio es <strong>100% GRATUITO</strong>. Ningún voluntario de esta
                    plataforma te pedirá dinero, transferencias, datos bancarios ni ningún tipo de pago.
                  </p>
                  <p className="text-red-700 text-xs leading-relaxed mt-2">
                    Si alguien que dice ser voluntario te solicita algún pago,{" "}
                    <strong>no lo realices</strong> y repórtalo en{" "}
                    <Link href="/sugerencias" className="underline font-semibold">esta página</Link>.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="block w-full text-center bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-red-800 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-red-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Solicitar Ayuda</h1>
          <p className="text-red-200">
            Cuéntanos qué necesitas. Conectaremos tu caso con un voluntario calificado lo antes posible.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3 text-sm text-blue-800">
            <AlertTriangle size={18} className="shrink-0 mt-0.5 text-blue-600" />
            <span>
              Si es una emergencia médica urgente, llama primero a los servicios de emergencia locales.
              Esta plataforma es para apoyo complementario.
            </span>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Tus datos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nombre *">
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre" className={inputClass} />
              </Field>
              <Field label="Email (para recibir datos del voluntario)">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com" className={inputClass} />
              </Field>
              <Field label="Teléfono / WhatsApp *">
                <input required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+58 412 000 0000" className={inputClass} />
              </Field>
              <Field label="Ubicación (estado/ciudad) *">
                <input required value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                  placeholder="Ej: Caracas, Miranda" className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">¿Qué tipo de ayuda necesitas?</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Field label="Tipo de ayuda *">
                <select required value={form.tipo_ayuda} onChange={(e) => setForm({ ...form, tipo_ayuda: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {TIPOS_AYUDA.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Nivel de urgencia *">
                <select required value={form.urgencia}
                  onChange={(e) => setForm({ ...form, urgencia: e.target.value as "alta" | "media" | "baja" })}
                  className={inputClass}>
                  <option value="alta">Alta — Necesito ayuda urgente</option>
                  <option value="media">Media — En los próximos días</option>
                  <option value="baja">Baja — Cuando haya disponibilidad</option>
                </select>
              </Field>
            </div>
            <Field label="Describe tu situación *">
              <textarea required value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Cuéntanos brevemente qué pasó y qué tipo de ayuda necesitas. Más detalle nos permite asignarte el voluntario más adecuado."
                rows={5} className={inputClass} />
            </Field>
          </section>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={cargando}
            className="w-full bg-red-700 text-white py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {cargando ? <><Loader2 size={20} className="animate-spin" /> Enviando solicitud...</> : "Enviar mi solicitud de ayuda"}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Al enviar aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-gray-600">Términos de Uso</Link>
            {" "}y{" "}
            <Link href="/privacidad" className="underline hover:text-gray-600">Política de Privacidad</Link>.
          </p>
        </form>
      </main>
    </div>
  );
}

export default function NecesitoAyudaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>}>
      <NecesitoAyudaForm />
    </Suspense>
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
  "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow";
