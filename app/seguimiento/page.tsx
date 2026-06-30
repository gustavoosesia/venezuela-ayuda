"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Search, Clock, CheckCircle2, Hourglass } from "lucide-react";
import Navbar from "@/components/Navbar";

type Resultado = {
  estado: "pendiente" | "asignado" | "completado";
  tipo_ayuda: string;
  urgencia: "alta" | "media" | "baja";
  created_at: string;
  codigo_seguimiento: string;
  voluntario?: { nombre: string; telefono: string; profesion: string; foto_url?: string } | null;
};

function linkWhatsapp(telefono: string, mensaje: string): string {
  const digitos = (telefono || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

const ESTADO_INFO: Record<
  Resultado["estado"],
  { label: string; icon: typeof Clock; box: string; text: string }
> = {
  pendiente: {
    label: "En lista de espera",
    icon: Hourglass,
    box: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
  },
  asignado: {
    label: "Voluntario asignado",
    icon: CheckCircle2,
    box: "bg-green-50 border-green-200",
    text: "text-green-800",
  },
  completado: {
    label: "Caso completado",
    icon: CheckCircle2,
    box: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
  },
};

function SeguimientoForm() {
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const buscar = async (codigoBuscar: string) => {
    if (!codigoBuscar.trim()) return;
    setCargando(true);
    setError("");
    setResultado(null);
    try {
      const res = await fetch(`/api/necesidades/seguimiento?codigo=${encodeURIComponent(codigoBuscar.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No encontramos ningún caso con ese código");
      setResultado(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const codigoUrl = searchParams.get("codigo");
    if (codigoUrl) {
      setCodigo(codigoUrl);
      buscar(codigoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const info = resultado ? ESTADO_INFO[resultado.estado] : null;
  const Icono = info?.icon;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-red-800 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-red-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Seguimiento de tu Caso</h1>
          <p className="text-red-200">
            Ingresa el código que recibiste al solicitar ayuda para ver el estado de tu caso.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscar(codigo);
            }}
            className="flex gap-2 mb-2"
          >
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="VSL-XXXXXX"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow"
            />
            <button
              type="submit"
              disabled={cargando || !codigo.trim()}
              className="bg-red-700 text-white px-4 rounded-xl hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {cargando ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {resultado && info && Icono && (
            <div className={`mt-6 border rounded-2xl p-5 text-left ${info.box}`}>
              <p className={`font-semibold flex items-center gap-2 mb-1 ${info.text}`}>
                <Icono size={18} /> {info.label}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Solicitaste ayuda de <strong>{resultado.tipo_ayuda}</strong> el{" "}
                {new Date(resultado.created_at).toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })}.
              </p>

              {resultado.estado === "pendiente" && (
                <p className="text-amber-700 text-sm leading-relaxed">
                  Aún no hay un voluntario disponible para tu tipo de ayuda. En cuanto se asigne uno, te avisaremos por correo.
                </p>
              )}

              {resultado.estado !== "pendiente" && resultado.voluntario && (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3 flex items-center gap-3">
                    {resultado.voluntario.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resultado.voluntario.foto_url}
                        alt={resultado.voluntario.nombre}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : null}
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Voluntario asignado</p>
                      <p className="font-semibold text-gray-800">{resultado.voluntario.nombre}</p>
                      <p className="text-xs text-gray-500">{resultado.voluntario.profesion}</p>
                    </div>
                  </div>
                  {resultado.estado === "asignado" && (
                    <a
                      href={linkWhatsapp(
                        resultado.voluntario.telefono,
                        `Hola ${resultado.voluntario.nombre}, te escribo por mi caso ${resultado.codigo_seguimiento} de Venezuela Se Levanta. ⚠️ Recuerda: es una consulta gratuita, no compartas datos bancarios ni aceptes cobros.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:brightness-95 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all"
                    >
                      📱 Escribirle por WhatsApp
                    </a>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SeguimientoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>}>
      <SeguimientoForm />
    </Suspense>
  );
}
