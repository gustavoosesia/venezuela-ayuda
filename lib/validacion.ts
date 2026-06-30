// Números exceptuados de la validación venezolana, usados para pruebas internas.
const TELEFONOS_PRUEBA = ["+34613263163"];

// Formatos válidos: +58XXXXXXXXXX, 58XXXXXXXXXX o 0XXXXXXXXXX (local)
export function esTelefonoVenezolano(telefono: string): boolean {
  const limpio = (telefono || "").replace(/[\s\-()]/g, "");
  if (TELEFONOS_PRUEBA.includes(limpio)) return true;
  return /^(\+?58)\d{10}$/.test(limpio) || /^0\d{10}$/.test(limpio);
}
