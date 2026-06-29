"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DisponiblePage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/voluntarios/disponible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al actualizar");
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
            <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Listo, gracias!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu estado quedó marcado como <strong>disponible</strong>. Si hay casos
              pendientes que coincidan con tu perfil, serás asignado automáticamente.
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

      <div className="bg-green-800 text-white py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-green-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Estoy disponible de nuevo</h1>
          <p className="text-green-200">
            ¿Terminaste de atender tu caso anterior? Márcate disponible para recibir nuevas asignaciones.
          </p>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-lg">
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Ingresa el correo con el que te registraste como voluntario. El sistema te marcará disponible
            y buscará automáticamente si hay casos pendientes para tu perfil.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu email de registro *
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={cargando}
            className="w-full bg-green-700 text-white py-3 rounded-full font-bold hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {cargando ? <><Loader2 size={18} className="animate-spin" /> Actualizando...</> : "Marcarme como disponible"}
          </button>
        </form>
      </main>
    </div>
  );
}
