"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Loader2, Lightbulb, Bug, MessageSquare, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const TIPOS = [
  { valor: "mejora", label: "Mejora de funcionalidad", icono: <Star size={16} />, color: "border-amber-300 bg-amber-50 text-amber-800" },
  { valor: "error", label: "Reporte de error", icono: <Bug size={16} />, color: "border-red-300 bg-red-50 text-red-800" },
  { valor: "sugerencia", label: "Nueva idea", icono: <Lightbulb size={16} />, color: "border-blue-300 bg-blue-50 text-blue-800" },
  { valor: "otro", label: "Otro comentario", icono: <MessageSquare size={16} />, color: "border-gray-300 bg-gray-50 text-gray-800" },
];

export default function SugerenciasPage() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    tipo: "",
    mensaje: "",
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/sugerencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al enviar");
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
          <div className="text-center max-w-sm">
            <CheckCircle className="text-green-500 mx-auto mb-5" size={56} />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Gracias por tu aporte!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu sugerencia fue recibida y la revisaremos para mejorar la plataforma.
              Juntos hacemos esto mejor.
            </p>
            <Link href="/" className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors inline-block">
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

      <div className="bg-purple-900 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Mejoras y Sugerencias</h1>
          <p className="text-purple-200">
            Esta plataforma es de todos. Tu opinión nos ayuda a mejorarla y a servir mejor
            a quienes más lo necesitan.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">¿Qué tipo de comentario es?</h2>
            <div className="grid grid-cols-2 gap-3">
              {TIPOS.map((t) => (
                <button key={t.valor} type="button"
                  onClick={() => setForm({ ...form, tipo: t.valor })}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors text-left
                    ${form.tipo === t.valor ? t.color + " border-current" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"}`}>
                  {t.icono}
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b">Tu mensaje</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre (opcional)
              </label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Tu nombre" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opcional, para darte seguimiento)
              </label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu sugerencia o comentario *
              </label>
              <textarea required value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Describe tu idea, el error que encontraste, o lo que crees que podría mejorar..."
                rows={5} className={inputClass} />
            </div>
          </section>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          <button type="submit" disabled={cargando || !form.tipo}
            className="w-full bg-purple-700 text-white py-4 rounded-full font-bold text-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {cargando ? <><Loader2 size={20} className="animate-spin" /> Enviando...</> : "Enviar sugerencia"}
          </button>
          {!form.tipo && <p className="text-xs text-gray-400 text-center mt-2">Selecciona un tipo de comentario</p>}
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center text-sm">
        <p>Venezuela Se Levanta · 2026</p>
      </footer>
    </div>
  );
}

const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
