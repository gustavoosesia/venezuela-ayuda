import { NextRequest } from "next/server";

// Limitador en memoria por instancia serverless. No es distribuido (cada
// instancia de Vercel tiene su propio contador), pero frena scripts básicos
// que golpean el mismo endpoint repetidamente sin pasar por un CDN/proxy nuevo.
const intentos = new Map<string, number[]>();

const VENTANA_MS = 60_000;
const MAX_INTENTOS = 3;

export function obtenerIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "desconocida";
}

export function rateLimitExcedido(ip: string): boolean {
  const ahora = Date.now();
  const previos = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  intentos.set(ip, previos);
  return previos.length > MAX_INTENTOS;
}

// Campo honeypot: si viene relleno, es casi seguro un bot rellenando todos los inputs.
export function esHoneypot(body: Record<string, unknown>): boolean {
  return !!body.sitio_web;
}
