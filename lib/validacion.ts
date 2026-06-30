// Formatos válidos: +58XXXXXXXXXX, 58XXXXXXXXXX o 0XXXXXXXXXX (local)
export function esTelefonoVenezolano(telefono: string): boolean {
  const limpio = (telefono || "").replace(/[\s\-()]/g, "");
  return /^(\+?58)\d{10}$/.test(limpio) || /^0\d{10}$/.test(limpio);
}
