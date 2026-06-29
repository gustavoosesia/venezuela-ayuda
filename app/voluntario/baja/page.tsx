"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function BajaVoluntarioPage() {
  const [email, setEmail] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [paso, setPaso] = useState<"form" | "confirmar">("form");

  const handleConfirmar = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/voluntarios/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la baja");
      setNombre(data.nombre || "");
      setConfirmado(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-8">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        {confirmado ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Baja procesada
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              {nombre && <><strong>{nombre}</strong>, tu</>} cuenta ha sido desactivada. Ya no recibirás nuevas asignaciones de casos.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Si cambias de opinión, puedes volver a registrarte como voluntario en cualquier momento.
            </p>
            <Link
              href="/voluntario"
              className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Registrarme de nuevo
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Darse de baja</h1>
                <p className="text-gray-500 text-sm">Como voluntario de la plataforma</p>
              </div>
            </div>

            {paso === "form" ? (
              <>
                <p className="text-gray-600 text-sm mb-6">
                  Ingresa el email con el que te registraste como voluntario. Tu cuenta quedará desactivada y no recibirás más asignaciones.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu email de registro *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
                )}
                <button
                  onClick={() => {
                    if (!email) return setError("Ingresa tu email");
                    setError("");
                    setPaso("confirmar");
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  Continuar
                </button>
              </>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-800 text-sm font-medium mb-1">¿Estás seguro?</p>
                  <p className="text-amber-700 text-sm">
                    Se desactivará la cuenta asociada a <strong>{email}</strong>. Puedes volver a registrarte cuando quieras.
                  </p>
                </div>
                {error && (
                  <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaso("form")}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmar}
                    disabled={cargando}
                    className="flex-1 bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {cargando ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : "Confirmar baja"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
