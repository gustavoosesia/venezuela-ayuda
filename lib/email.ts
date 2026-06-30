import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend requiere dominio verificado para FROM personalizado.
// Mientras no tengas dominio verificado, usa "onboarding@resend.dev"
// Una vez que verifiques tu dominio en resend.com/domains, cámbialo a:
// "Venezuela Se Levanta <noreply@tudominio.com>"
const FROM = "Venezuela Se Levanta <noreply@voluntariosve.org>";
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://voluntariosve.org";

function linkWhatsapp(telefono: string, mensaje: string): string {
  const digitos = (telefono || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

const AVISO_SEGURIDAD = `
  <div style="background:#fef2f2;border:2px solid #fca5a5;border-radius:8px;padding:16px;margin:20px 0">
    <p style="margin:0 0 8px;font-weight:700;color:#991b1b;font-size:15px">🔒 AVISO DE SEGURIDAD IMPORTANTE</p>
    <p style="margin:0;color:#7f1d1d;font-size:13px;line-height:1.6">
      Este servicio es <strong>100% GRATUITO</strong>. Ningún voluntario de nuestra plataforma
      te pedirá dinero, transferencias, datos bancarios ni ningún tipo de pago.<br/><br/>
      Si alguien que dice ser voluntario te solicita algún pago o tus datos bancarios,
      <strong>no lo hagas</strong> y repórtalo inmediatamente respondiendo este correo
      o escribiéndonos a través de la plataforma.
    </p>
  </div>
`;

export async function enviarEmailAsignacion({
  nombreNecesitado,
  emailNecesitado,
  telefonoNecesitado,
  tipoAyuda,
  descripcion,
  codigoSeguimiento,
  voluntario,
}: {
  nombreNecesitado: string;
  emailNecesitado?: string;
  telefonoNecesitado: string;
  tipoAyuda: string;
  descripcion?: string;
  codigoSeguimiento: string;
  voluntario: {
    nombre: string;
    email: string;
    telefono: string;
    profesion: string;
    pais: string;
  };
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key_here") return;

  await resend.emails.send({
    from: FROM,
    to: voluntario.email,
    subject: `[${codigoSeguimiento}] Nuevo caso asignado — ${tipoAyuda}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#003893;padding:32px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">❤️ Tienes un caso asignado</h1>
          <p style="color:#93b4f0;margin:8px 0 0">Venezuela Se Levanta</p>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hola <strong>${voluntario.nombre}</strong>,</p>
          <p>Se te ha asignado un nuevo caso que necesita tu ayuda como <strong>${voluntario.profesion}</strong>.</p>
          <div style="background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0 0 4px;font-size:12px;color:#6b7280">Código de caso:</p>
            <p style="margin:0 0 12px;font-size:20px;font-weight:800;color:#1d4ed8;letter-spacing:2px">${codigoSeguimiento}</p>
            <p style="margin:0 0 8px;font-weight:600;color:#374151">Datos del necesitado:</p>
            <p style="margin:4px 0">👤 <strong>${nombreNecesitado}</strong></p>
            <p style="margin:4px 0">📞 ${telefonoNecesitado}</p>
            ${emailNecesitado ? `<p style="margin:4px 0">✉️ ${emailNecesitado}</p>` : ""}
            <p style="margin:4px 0">🆘 Necesita: ${tipoAyuda}</p>
            ${descripcion ? `<p style="margin:12px 0 0;padding-top:12px;border-top:1px solid #e5e7eb;color:#374151"><strong>Descripción de la situación:</strong><br/>${descripcion}</p>` : ""}
          </div>
          <div style="text-align:center;margin:20px 0">
            <a href="${linkWhatsapp(telefonoNecesitado, `Hola ${nombreNecesitado}, soy ${voluntario.nombre} de Venezuela Se Levanta. Voy a ayudarte con ${tipoAyuda}. ⚠️ Recuerda: es una consulta gratuita, no compartas datos bancarios ni aceptes cobros.`)}"
               style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:24px;font-size:14px">
              📱 Contactar por WhatsApp
            </a>
          </div>
          <p>Por favor, contáctale lo antes posible. Recuerda que tu ayuda es <strong>voluntaria y gratuita</strong>.</p>
          <p style="margin-top:24px;color:#6b7280;font-size:13px">
            Cuando termines, márcate disponible en:<br/>
            <a href="${SITE_URL}/voluntario/disponible" style="color:#2563eb">${SITE_URL}/voluntario/disponible</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
          <p style="color:#9ca3af;font-size:11px;text-align:center">
            ¿Ya no deseas recibir casos?
            <a href="${SITE_URL}/voluntario/baja" style="color:#9ca3af">Darse de baja</a>
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailAprobacionVoluntario({
  nombre,
  email,
}: {
  nombre: string;
  email: string;
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key_here") return;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "¡Tu registro fue aprobado! — Venezuela Se Levanta",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#003893;padding:32px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">✅ ¡Ya estás activo!</h1>
          <p style="color:#93b4f0;margin:8px 0 0">Venezuela Se Levanta</p>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Revisamos tu registro y ya está aprobado. A partir de ahora puedes recibir casos que coincidan con tu perfil.</p>
          <p>Te avisaremos por correo en cuanto tengas un caso asignado. ¡Gracias por sumarte!</p>
          <p style="margin-top:24px;color:#6b7280;font-size:13px">
            ¿Ya no deseas recibir casos? Puedes darte de baja en:<br/>
            <a href="${SITE_URL}/voluntario/baja" style="color:#2563eb">${SITE_URL}/voluntario/baja</a>
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailConfirmacionNecesidad({
  nombreNecesitado,
  emailNecesitado,
  tipoAyuda,
  codigoSeguimiento,
  voluntario,
  asignado,
}: {
  nombreNecesitado: string;
  emailNecesitado?: string;
  tipoAyuda: string;
  codigoSeguimiento: string;
  voluntario?: { nombre: string; email: string; telefono: string; profesion: string; pais: string; foto_url?: string } | null;
  asignado: boolean;
}) {
  if (!emailNecesitado) return;
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key_here") return;

  const cuerpoAsignado = voluntario
    ? `
      <p>¡Buenas noticias! Ya encontramos un voluntario para ayudarte.</p>
      <div style="background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0 0 8px;font-weight:600;color:#374151">Tu voluntario asignado:</p>
        ${voluntario.foto_url ? `<img src="${voluntario.foto_url}" alt="${voluntario.nombre}" width="64" height="64" style="border-radius:50%;object-fit:cover;display:block;margin:0 0 10px" />` : ""}
        <p style="margin:4px 0">👤 <strong>${voluntario.nombre}</strong></p>
        <p style="margin:4px 0">💼 ${voluntario.profesion} — ${voluntario.pais}</p>
        <p style="margin:4px 0">📞 ${voluntario.telefono}</p>
        <p style="margin:4px 0">✉️ ${voluntario.email}</p>
      </div>
      <div style="text-align:center;margin:20px 0">
        <a href="${linkWhatsapp(voluntario.telefono, `Hola ${voluntario.nombre}, soy ${nombreNecesitado}. Me asignaron contigo en Venezuela Se Levanta para ${tipoAyuda}. ⚠️ Recuerda: es una consulta gratuita, no compartas datos bancarios ni aceptes cobros.`)}"
           style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:24px;font-size:14px">
          📱 Escribirle por WhatsApp
        </a>
      </div>
      <p>Pronto recibirás contacto directo de su parte.</p>
    `
    : `<p>Tu solicitud quedó registrada. En cuanto haya un voluntario de <strong>${tipoAyuda}</strong> disponible, te avisaremos.</p>`;

  await resend.emails.send({
    from: FROM,
    to: emailNecesitado,
    subject: `[${codigoSeguimiento}] ${asignado ? "¡Voluntario asignado!" : "Solicitud recibida"} — Venezuela Se Levanta`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#7f1d1d;padding:32px 24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">❤️ Venezuela Se Levanta</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hola <strong>${nombreNecesitado}</strong>,</p>

          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin:0 0 16px">
            <p style="margin:0 0 2px;font-size:12px;color:#1e40af">Tu código de seguimiento:</p>
            <p style="margin:0;font-size:24px;font-weight:800;color:#1d4ed8;letter-spacing:3px">${codigoSeguimiento}</p>
            <p style="margin:4px 0 0;font-size:11px;color:#6b7280">Guárdalo para hacer seguimiento de tu caso</p>
          </div>

          ${asignado ? cuerpoAsignado : cuerpoAsignado}

          ${AVISO_SEGURIDAD}

          <p style="color:#6b7280;font-size:12px;margin-top:16px">
            Este servicio es 100% gratuito · <a href="${SITE_URL}" style="color:#2563eb">${SITE_URL}</a>
          </p>
        </div>
      </div>
    `,
  });
}
