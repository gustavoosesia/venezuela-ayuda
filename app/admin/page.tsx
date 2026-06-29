"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, HandHeart, Clock, CheckCircle, RefreshCw,
  AlertTriangle, Zap, CircleCheck, LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { Voluntario, Necesidad } from "@/lib/supabase";

type Tab = "necesidades" | "voluntarios";

const urgenciaColor: Record<string, string> = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-amber-100 text-amber-700 border-amber-200",
  baja: "bg-green-100 text-green-700 border-green-200",
};
const estadoNecColor: Record<string, string> = {
  pendiente: "bg-gray-100 text-gray-600",
  asignado: "bg-blue-100 text-blue-700",
  completado: "bg-green-100 text-green-700",
};
const estadoVolColor: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  ocupado: "bg-amber-100 text-amber-700",
  inactivo: "bg-gray-100 text-gray-500",
};

// ── Subcomponentes ────────────────────────────────────────────

function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <AlertTriangle size={32} className="mx-auto mb-3 text-gray-300" />
      <p>{mensaje}</p>
    </div>
  );
}

function NecesidadesList({
  necesidades,
  filtroEstado,
  onCompletar,
}: {
  necesidades: Necesidad[];
  filtroEstado: string;
  onCompletar: (id: string) => void;
}) {
  const filtradas =
    filtroEstado === "todos"
      ? necesidades
      : necesidades.filter((n) => n.estado === filtroEstado);

  if (filtradas.length === 0) {
    const msg =
      filtroEstado === "todos"
        ? "No hay solicitudes registradas aún."
        : `No hay solicitudes en estado "${filtroEstado}" aún.`;
    return <EmptyState mensaje={msg} />;
  }

  return (
    <div className="space-y-3 pb-12">
      {filtradas.map((n) => (
        <div
          key={n.id}
          className={`bg-white rounded-xl border p-5 shadow-sm ${
            n.urgencia === "alta" && n.estado === "pendiente"
              ? "border-red-200"
              : "border-gray-100"
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-3 justify-between items-start">
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${urgenciaColor[n.urgencia]}`}>
                {n.urgencia === "alta" ? "🔴" : n.urgencia === "media" ? "🟡" : "🟢"} Urgencia {n.urgencia}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoNecColor[n.estado]}`}>
                {n.estado}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                {n.tipo_ayuda}
              </span>
            </div>
            {n.estado === "asignado" && (
              <button
                onClick={() => onCompletar(n.id!)}
                className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full transition-colors"
              >
                <CircleCheck size={12} />
                Marcar completado
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-900">{n.nombre}</p>
              <p className="text-sm text-gray-500">📍 {n.ubicacion}</p>
              <p className="text-sm text-gray-500">📞 {n.telefono}</p>
              {n.descripcion && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{n.descripcion}</p>
              )}
            </div>
            {n.voluntario ? (
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <p className="text-xs font-semibold text-green-700 mb-1">✅ Voluntario asignado</p>
                <p className="text-sm font-medium text-gray-900">{n.voluntario.nombre}</p>
                <p className="text-xs text-gray-500">{n.voluntario.profesion} · {n.voluntario.pais}</p>
                <p className="text-xs text-gray-500">{n.voluntario.email}</p>
                <p className="text-xs text-gray-500">{n.voluntario.telefono}</p>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <p className="text-xs font-semibold text-amber-700 mb-1">⏳ Sin voluntario aún</p>
                <p className="text-xs text-amber-600">
                  Usa &ldquo;Reasignar pendientes&rdquo; cuando haya voluntarios disponibles.
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {n.created_at && new Date(n.created_at).toLocaleString("es-VE")}
          </p>
        </div>
      ))}
    </div>
  );
}

function VoluntariosList({ voluntarios }: { voluntarios: Voluntario[] }) {
  if (voluntarios.length === 0) return <EmptyState mensaje="No hay voluntarios registrados aún." />;

  return (
    <div className="space-y-3 pb-12">
      {voluntarios.map((v) => (
        <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoVolColor[v.estado]}`}>
              {v.estado === "disponible" ? "🟢" : v.estado === "ocupado" ? "🟡" : "⚫"} {v.estado}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {v.profesion}
            </span>
            {v.idiomas?.map((l) => (
              <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{l}</span>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <p className="font-semibold text-gray-900">{v.nombre}</p>
              <p className="text-sm text-gray-500">🌍 {v.pais}</p>
              <p className="text-sm text-gray-500">📞 {v.telefono}</p>
              <p className="text-sm text-gray-500">✉️ {v.email}</p>
            </div>
            <div>
              {v.especialidad && <p className="text-sm text-gray-600">Especialidad: {v.especialidad}</p>}
              {v.disponibilidad && <p className="text-sm text-gray-600">Disponibilidad: {v.disponibilidad}</p>}
              {v.experiencia && <p className="text-sm text-gray-600">Experiencia: {v.experiencia}</p>}
            </div>
          </div>
          {v.como_puede_ayudar && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed italic">
              &ldquo;{v.como_puede_ayudar}&rdquo;
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            {v.created_at && new Date(v.created_at).toLocaleString("es-VE")}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("necesidades");
  const [filtroEstado, setFiltroEstado] = useState<string>("pendiente");
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [reasignando, setReasignando] = useState(false);
  const [mensajeReasign, setMensajeReasign] = useState("");
  const router = useRouter();

  const cerrarSesion = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const cargar = async () => {
    setCargando(true);
    const [rN, rV] = await Promise.all([
      fetch("/api/necesidades").then((r) => r.json()),
      fetch("/api/voluntarios").then((r) => r.json()),
    ]);
    setNecesidades(rN.data || []);
    setVoluntarios(rV.data || []);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const reasignarPendientes = async () => {
    setReasignando(true);
    setMensajeReasign("");
    const res = await fetch("/api/asignar", { method: "POST" });
    const json = await res.json();
    setMensajeReasign(`${json.asignados} asignado(s) · ${json.sinVoluntario} sin voluntario disponible`);
    setReasignando(false);
    cargar();
  };

  const completarCaso = async (id: string) => {
    await fetch(`/api/necesidades/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "completado" }),
    });
    cargar();
  };

  const stats = {
    totalVoluntarios: voluntarios.length,
    disponibles: voluntarios.filter((v) => v.estado === "disponible").length,
    pendientes: necesidades.filter((n) => n.estado === "pendiente").length,
    asignados: necesidades.filter((n) => n.estado === "asignado").length,
    completados: necesidades.filter((n) => n.estado === "completado").length,
  };

  const FILTROS = [
    { valor: "pendiente",  label: "Pendientes",  badge: stats.pendientes,      color: "bg-amber-100 text-amber-800 border-amber-300" },
    { valor: "asignado",   label: "Asignados",   badge: stats.asignados,       color: "bg-blue-100 text-blue-800 border-blue-300" },
    { valor: "completado", label: "Completados", badge: stats.completados,     color: "bg-green-100 text-green-800 border-green-300" },
    { valor: "todos",      label: "Todos",       badge: necesidades.length,    color: "bg-gray-100 text-gray-700 border-gray-300" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Panel de Administración</h1>
            <p className="text-gray-400 text-sm">Gestión de voluntarios y solicitudes de ayuda</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={reasignarPendientes}
                disabled={reasignando}
                className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-full transition-colors disabled:opacity-60"
              >
                <Zap size={14} className={reasignando ? "animate-pulse" : ""} />
                {reasignando ? "Reasignando..." : "Reasignar pendientes"}
              </button>
              <button
                onClick={cargar}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-gray-600 px-4 py-2 rounded-full transition-colors"
              >
                <RefreshCw size={14} className={cargando ? "animate-spin" : ""} />
                Actualizar
              </button>
              <button
                onClick={cerrarSesion}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-4 py-2 rounded-full transition-colors"
              >
                <LogOut size={14} />
                Salir
              </button>
            </div>
            {mensajeReasign && <p className="text-xs text-amber-300">{mensajeReasign}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total voluntarios", valor: stats.totalVoluntarios, icono: <HandHeart size={16} />, color: "text-blue-600" },
            { label: "Disponibles",       valor: stats.disponibles,      icono: <CheckCircle size={16} />, color: "text-green-600" },
            { label: "Pendientes",        valor: stats.pendientes,       icono: <Clock size={16} />,       color: "text-amber-600" },
            { label: "Asignados",         valor: stats.asignados,        icono: <Users size={16} />,       color: "text-purple-600" },
            { label: "Completados",       valor: stats.completados,      icono: <CircleCheck size={16} />, color: "text-teal-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`flex items-center gap-1.5 mb-2 ${s.color}`}>
                {s.icono}
                <span className="text-xs font-medium text-gray-500">{s.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.valor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Filtros */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
          <div className="flex gap-1 bg-gray-200 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTab("necesidades")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "necesidades" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              Solicitudes de ayuda
              {stats.pendientes > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pendientes}</span>
              )}
            </button>
            <button
              onClick={() => setTab("voluntarios")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "voluntarios" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              Voluntarios
            </button>
          </div>

          {tab === "necesidades" && (
            <div className="flex gap-2 flex-wrap">
              {FILTROS.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => setFiltroEstado(f.valor)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${filtroEstado === f.valor
                      ? `${f.color} ring-2 ring-offset-1 ring-current`
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}
                >
                  {f.label}
                  <span className={`px-1.5 py-0.5 rounded-full font-bold ${filtroEstado === f.valor ? "bg-white/60" : "bg-gray-100"}`}>
                    {f.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {cargando ? (
          <div className="text-center py-16 text-gray-400">
            <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
            Cargando datos...
          </div>
        ) : tab === "necesidades" ? (
          <NecesidadesList
            necesidades={necesidades}
            filtroEstado={filtroEstado}
            onCompletar={completarCaso}
          />
        ) : (
          <VoluntariosList voluntarios={voluntarios} />
        )}
      </div>
    </div>
  );
}
