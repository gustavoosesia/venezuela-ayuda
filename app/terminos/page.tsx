import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Términos de Uso - Venezuela Se Levanta",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TerminosPage() {
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
              <div className="bg-red-100 p-2 rounded-xl">
                <FileText size={22} className="text-red-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Términos de Uso</h1>
                <p className="text-gray-500 text-sm">Última actualización: junio de 2026</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Al usar Venezuela Se Levanta, ya sea para solicitar ayuda o para registrarte como voluntario,
              aceptas los siguientes términos.
            </p>

            <Section title="1. Qué es la plataforma">
              <p>Venezuela Se Levanta es un servicio gratuito sin fines de lucro que conecta a personas
              afectadas por el terremoto en Venezuela con voluntarios profesionales que ofrecen su tiempo y
              conocimiento de forma voluntaria.</p>
              <p>La plataforma actúa únicamente como intermediaria de contacto. No empleamos, supervisamos
              ni certificamos a los voluntarios, y no somos parte de la relación de ayuda que se establece
              entre el necesitado y el voluntario.</p>
            </Section>

            <Section title="2. El servicio es 100% gratuito">
              <p>Ningún voluntario de esta plataforma debe solicitarte dinero, transferencias, datos bancarios
              ni ningún tipo de pago. Si esto ocurre, repórtalo de inmediato desde la página de{" "}
                <Link href="/sugerencias" className="text-blue-600 underline">sugerencias y reportes</Link>.</p>
            </Section>

            <Section title="3. Responsabilidad de los voluntarios">
              <p>Al registrarte como voluntario, declaras que la información sobre tu profesión, experiencia
              y forma de ayudar es veraz. Los registros nuevos quedan sujetos a una revisión antes de poder
              recibir casos, como medida adicional de seguridad para las personas que solicitan ayuda.</p>
              <p>La plataforma no verifica títulos profesionales ni licencias. Si necesitas atención médica
              o psicológica de emergencia, contacta primero a los servicios de emergencia locales — esta
              plataforma es un apoyo complementario, no un sustituto de atención profesional certificada
              presencial.</p>
            </Section>

            <Section title="4. Uso aceptable">
              <p>No está permitido usar la plataforma para fines distintos a solicitar o brindar ayuda
              humanitaria voluntaria, ni para enviar información falsa, ofensiva o con intención de dañar
              a otra persona.</p>
            </Section>

            <Section title="5. Limitación de responsabilidad">
              <p>Hacemos nuestro mejor esfuerzo para conectar solicitudes con voluntarios calificados y
              disponibles, pero no garantizamos la disponibilidad inmediata de un voluntario para cada caso,
              ni la calidad o resultado de la ayuda brindada, ya que esta depende de cada voluntario de forma
              independiente.</p>
            </Section>

            <Section title="6. Privacidad">
              <p>El tratamiento de tus datos personales se rige por nuestra{" "}
                <Link href="/privacidad" className="text-blue-600 underline">Política de Privacidad</Link>.</p>
            </Section>

            <Section title="7. Cambios a estos términos">
              <p>Podemos actualizar estos términos a medida que la plataforma evolucione. El uso continuado
              del servicio después de un cambio implica la aceptación de los nuevos términos.</p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}
