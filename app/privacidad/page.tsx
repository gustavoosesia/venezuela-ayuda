import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Política de Privacidad - Venezuela Se Levanta",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-8">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-xl">
                <ShieldCheck size={22} className="text-blue-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Política de Privacidad</h1>
                <p className="text-gray-500 text-sm">Última actualización: junio de 2026</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Venezuela Se Levanta ("la plataforma"), una iniciativa operada por OseanInnova LLC, conecta a
              personas afectadas por el terremoto en Venezuela con voluntarios profesionales que ofrecen
              ayuda gratuita. Esta página explica qué datos recopilamos, para qué los usamos y qué derechos
              tienes sobre ellos.
            </p>

            <Section title="1. Qué datos recopilamos">
              <p><strong>Si solicitas ayuda:</strong> nombre, teléfono, email (opcional), ubicación, tipo de ayuda
              que necesitas, nivel de urgencia y la descripción de tu situación que escribes en el formulario.</p>
              <p><strong>Si te registras como voluntario:</strong> nombre, email, teléfono, país, profesión,
              especialidad, idiomas, disponibilidad, experiencia, la descripción de cómo puedes ayudar y,
              de forma opcional, una foto de perfil que se muestra a la persona que solicita ayuda.</p>
              <p>No solicitamos ni almacenamos datos bancarios, de pago, ni documentos de identidad.</p>
            </Section>

            <Section title="2. Para qué usamos estos datos">
              <p>Exclusivamente para conectar solicitudes de ayuda con el voluntario más adecuado disponible,
              notificar por correo electrónico cuando hay una asignación, y permitir el seguimiento de tu caso
              mediante el código que se te entrega.</p>
              <p>No usamos tus datos con fines publicitarios ni los vendemos ni compartimos con terceros
              ajenos a la operación de la plataforma.</p>
            </Section>

            <Section title="3. Con quién se comparten">
              <p>Cuando se asigna un caso, el necesitado y el voluntario reciben mutuamente su nombre, teléfono
              y email (y, si aplica, la descripción de la situación) para poder coordinar la ayuda directamente.
              Esto es necesario para que el servicio funcione.</p>
              <p>Usamos proveedores externos para operar la plataforma: Supabase (almacenamiento de base de
              datos), Resend (envío de correos) y Vercel (hosting). Estos proveedores procesan los datos
              únicamente como parte de la infraestructura técnica, no los usan con fines propios.</p>
            </Section>

            <Section title="4. Cuánto tiempo conservamos los datos">
              <p>Conservamos los datos mientras sean necesarios para gestionar el caso y para fines de
              trazabilidad de la operación (por ejemplo, evitar asignaciones duplicadas o medir el impacto
              del servicio). Puedes solicitar la eliminación de tus datos en cualquier momento — ver sección 6.</p>
            </Section>

            <Section title="5. Seguridad">
              <p>Tomamos medidas razonables para proteger tu información, pero ningún sistema es 100% seguro.
              Te pedimos no compartir información sensible adicional (como contraseñas o datos bancarios) a
              través de los formularios de la plataforma.</p>
            </Section>

            <Section title="6. Tus derechos">
              <p>Puedes solicitar acceder, corregir o eliminar tus datos, o darte de baja como voluntario en
              cualquier momento desde{" "}
                <Link href="/voluntario/baja" className="text-blue-600 underline">esta página</Link>.
              Para cualquier otra solicitud relacionada con tus datos, o para reportar un mal uso de tu
              información, escríbenos a través de la página de{" "}
                <Link href="/sugerencias" className="text-blue-600 underline">sugerencias y reportes</Link>.
              </p>
            </Section>

            <Section title="7. Cambios a esta política">
              <p>Podemos actualizar esta política a medida que la plataforma evolucione. Si los cambios son
              significativos, lo indicaremos en esta misma página.</p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}
