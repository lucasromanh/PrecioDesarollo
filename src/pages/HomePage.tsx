import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export function HomePage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="text-center space-y-6 md:space-y-8 py-16 md:py-24 lg:py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <span className="text-sm font-medium text-primary">✨ Herramienta gratuita para freelancers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-4 leading-tight">
          ¿Cuánto deberías cobrar como{' '}
          <span className="text-primary">
            desarrollador
          </span>
          ?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
          Calcula tu tarifa por hora y estima precios para proyectos web, APIs, backends y proyectos de IA. 
          Herramienta profesional para desarrolladores freelance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-4">
          <Link to="/calculators" className="group w-full sm:w-auto">
            <Button size="lg" className="w-full text-base px-8 py-6 bg-primary hover:bg-[#E65A2F] shadow-[0_4px_16px_var(--shadow)] transition-all duration-300">
              <Calculator className="mr-2 h-5 w-5" />
              Calcular por Hora
            </Button>
          </Link>
          <Link to="/calculators" className="group w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-base px-8 py-6 border-2 border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300">
              <TrendingUp className="mr-2 h-5 w-5" />
              Estimar Proyecto
            </Button>
          </Link>
        </div>
      </div>

      {/* Calculadoras Disponibles */}
      <div className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Calculadoras Disponibles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Herramientas especializadas para cada tipo de proyecto. Genera presupuestos profesionales en PDF.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <Link to="/calculators?tab=hourly">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">💼</div>
                <CardTitle className="text-lg font-semibold">Tarifa por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calcula tu tarifa según rol, seniority, país y gastos mensuales.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=web">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">🌐</div>
                <CardTitle className="text-lg font-semibold">Proyecto Web</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Landing, corporativa, e-commerce, WordPress y más.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=backend">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">⚙️</div>
                <CardTitle className="text-lg font-semibold">Backend/APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  REST API, GraphQL, microservicios y más.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=ai">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">🤖</div>
                <CardTitle className="text-lg font-semibold">IA/Chatbots</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chatbots, asistentes con IA, RAG y automatización.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=mobile">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">📱</div>
                <CardTitle className="text-lg font-semibold">App Móvil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  iOS, Android o multiplataforma con React Native/Flutter.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=game">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">🎮</div>
                <CardTitle className="text-lg font-semibold">Videojuegos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Casual, arcade, puzzle para web, móvil o desktop.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=business">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">🏢</div>
                <CardTitle className="text-lg font-semibold">Sistemas de Negocio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CRM, inventario, inmobiliario, POS, ERP con geolocalización.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/calculators?tab=desktop">
            <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)] cursor-pointer h-full">
              <CardHeader>
                <div className="text-4xl mb-3">💻</div>
                <CardTitle className="text-lg font-semibold">App Escritorio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Windows, macOS, Linux o multiplataforma con Electron.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-12 md:py-16">
        <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)]">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold">Descarga PDF Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Genera presupuestos profesionales con desglose detallado, términos y condiciones. Descárgalos en PDF listo para enviar a tus clientes.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)]">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">Cálculos Precisos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Estimaciones basadas en tarifas reales del mercado argentino e internacional. Rangos mínimos y máximos para cada proyecto.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:bg-[#222630] transition-all duration-300 border-border/50 shadow-[0_4px_16px_var(--shadow)]">
          <CardHeader>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">Referencias de Mercado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Consulta tarifas de referencia por rol, seniority y país para posicionarte mejor en el mercado freelance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximamente - Suscripción */}
      <Card className="my-12 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            Próximamente: Plan Premium
          </CardTitle>
          <CardDescription className="text-base">Personaliza tus presupuestos y lleva tu negocio al siguiente nivel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Estamos trabajando en un <strong>plan de suscripción mensual de solo USD $5</strong> que incluirá:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Logo de tu empresa</strong> en todos los presupuestos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Datos de tu empresa</strong> personalizados (nombre, email, teléfono, dirección)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Numeración automática de facturas</strong> para cada presupuesto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Plantillas personalizadas</strong> con colores de tu marca</span>
            </li>
          </ul>
          <p className="text-sm text-primary font-semibold pt-2">
            ¡Mantente atento! Próximamente podrás suscribirte y profesionalizar aún más tus presupuestos.
          </p>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className="my-12 border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-2xl">Cómo usar esta herramienta</CardTitle>
          <CardDescription>Sigue estos pasos para obtener estimaciones precisas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg">Calcula tu tarifa por hora</h3>
              <p className="text-muted-foreground">
                Ingresa tus datos personales: rol, seniority, ubicación y gastos. La herramienta te dará un rango recomendado.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg">Usa esa tarifa para estimar proyectos</h3>
              <p className="text-muted-foreground">
                Define las características del proyecto (tipo, complejidad, deadline) y obtén una estimación de horas y precio.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ajusta según tu contexto</h3>
              <p className="text-muted-foreground">
                Las estimaciones son orientativas. Considera tu experiencia, portfolio, demanda y especificidades del cliente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <AlertCircle className="h-5 w-5 animate-pulse" />
            Aviso Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Estas son estimaciones orientativas</strong> y deben ser ajustadas a tu realidad específica:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Tu experiencia y portfolio único</li>
            <li>Demanda del mercado en tu región</li>
            <li>Complejidad real del proyecto tras análisis con el cliente</li>
            <li>Costos adicionales (impuestos, herramientas, infraestructura)</li>
          </ul>
          <p className="pt-2">
            Esta herramienta <strong>NO constituye asesoramiento legal, fiscal ni financiero</strong>. Es una guía para desarrolladores freelance.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
