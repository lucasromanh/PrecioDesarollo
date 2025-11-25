import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Code, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <PageContainer
      title="Acerca de PreciosDesarrollo"
      description="Herramienta gratuita para desarrolladores freelance"
    >
      <div className="space-y-4 md:space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Code className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              ¿Qué es PreciosDesarrollo?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>PreciosDesarrollo</strong> es una herramienta web gratuita diseñada para ayudar a
              desarrolladores freelance, consultores independientes y equipos pequeños a calcular tarifas por hora
              y estimar precios para proyectos de desarrollo de software.
            </p>
            <p>
              La aplicación te permite calcular tu tarifa por hora considerando tu rol (Frontend, Backend, Fullstack,
              DevOps, Data, IA), seniority (Junior, Semi-Senior, Senior), ubicación, gastos mensuales y margen de
              beneficio deseado.
            </p>
            <p>
              Además, puedes estimar horas y precios para diferentes tipos de proyectos:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Webs (landing pages, corporativas, e-commerce, WordPress)</li>
              <li>APIs y backends (REST, GraphQL, microservicios)</li>
              <li>Proyectos de IA (chatbots, asistentes, integraciones con APIs de IA)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-500 animate-pulse" />
              Propósito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Muchos desarrolladores, especialmente al iniciar como freelancers, no saben cuánto cobrar. Esta
              herramienta busca ofrecer una <strong>guía orientativa</strong> basada en promedios de mercado y buenas
              prácticas de la industria.
            </p>
            <p>
              El objetivo es que puedas posicionarte de manera justa en el mercado, cubrir tus costos, generar un
              margen de beneficio razonable y valorar adecuadamente tu trabajo.
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 hover:bg-yellow-500/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400 text-xl">
              <AlertCircle className="h-6 w-6 animate-pulse" />
              Avisos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">📊 Solo Estimaciones</h4>
              <p>
                Los cálculos y estimaciones son <strong>orientativos</strong>. Cada proyecto y contexto es único.
                Debes ajustar los valores según tu experiencia, portfolio, complejidad real del proyecto y condiciones
                específicas de tu mercado.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">⚖️ No es Asesoramiento Legal ni Financiero</h4>
              <p>
                Esta herramienta <strong>NO constituye asesoramiento legal, fiscal, contable ni financiero</strong>.
                Es simplemente una guía para desarrolladores. Consulta con profesionales especializados para temas
                legales, impuestos y finanzas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">🔮 Datos Mockeados</h4>
              <p>
                Actualmente, los datos de referencia de mercado son <strong>simulados</strong> con valores aproximados.
                En el futuro, la app puede conectarse a APIs externas de datos reales de salarios y tarifas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">🚀 Mejoras Futuras</h4>
              <p>
                Esta es la versión inicial. Está preparada para escalar con nuevas funcionalidades como:
                conexión a APIs de mercado, guardado de cálculos, generación de propuestas en PDF, histórico de
                proyectos, y más.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all duration-300 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">👨‍💻</span>
              Desarrollador
            </CardTitle>
            <CardDescription>Creado por un desarrollador, para desarrolladores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Lucas Roman</h3>
                <p className="text-sm text-primary font-medium">Software Developer</p>
                <p className="text-muted-foreground">
                  Desarrollador freelance especializado en soluciones web modernas, APIs y sistemas empresariales.
                  Apasionado por crear herramientas que ayuden a otros desarrolladores a crecer profesionalmente.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href="mailto:lucas@saltacoders.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    lucas@saltacoders.com
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>¿Necesitas un presupuesto personalizado o ayuda con tu proyecto?</strong> No dudes en contactarme.
                También estoy disponible para colaboraciones y desarrollo de nuevas features para esta herramienta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
