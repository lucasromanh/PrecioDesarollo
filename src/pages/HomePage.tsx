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
      <div className="my-12 relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
        {/* Cohete animado */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 text-6xl md:text-8xl animate-bounce">
          🚀
        </div>
        
        {/* Estrellas decorativas */}
        <div className="absolute top-1/4 left-10 text-2xl animate-pulse delay-100">✨</div>
        <div className="absolute top-1/3 right-20 text-xl animate-pulse delay-300">⭐</div>
        <div className="absolute bottom-1/4 left-20 text-3xl animate-pulse delay-500">💫</div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-4 animate-pulse">
            <span className="text-sm font-bold text-primary">PRÓXIMAMENTE</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Plan Premium
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            Personaliza tus presupuestos y lleva tu negocio al siguiente nivel
          </p>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 mb-6">
            <p className="text-muted-foreground mb-4">
              Estamos trabajando en un <strong className="text-primary text-xl">plan de suscripción mensual de solo USD $5</strong> que incluirá:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 group">
                <span className="text-2xl group-hover:scale-125 transition-transform">🎨</span>
                <div>
                  <strong className="text-foreground">Logo personalizado</strong>
                  <p className="text-sm text-muted-foreground">Tu marca en todos los presupuestos</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="text-2xl group-hover:scale-125 transition-transform">📝</span>
                <div>
                  <strong className="text-foreground">Datos de empresa</strong>
                  <p className="text-sm text-muted-foreground">Información personalizada</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="text-2xl group-hover:scale-125 transition-transform">🔢</span>
                <div>
                  <strong className="text-foreground">Numeración automática</strong>
                  <p className="text-sm text-muted-foreground">Facturas correlativas</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="text-2xl group-hover:scale-125 transition-transform">🎯</span>
                <div>
                  <strong className="text-foreground">Plantillas a medida</strong>
                  <p className="text-sm text-muted-foreground">Colores de tu marca</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-primary font-bold animate-pulse">
            ⚡ ¡Mantente atento! Próximamente disponible para suscripción
          </p>
        </div>
      </div>

      {/* How to Use */}
      <div className="my-12 space-y-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          Cómo usar la herramienta
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Línea conectora en desktop */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary/50 via-orange-500/50 to-primary/50"></div>
          
          {/* Paso 1 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <Card className="relative bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="text-6xl animate-bounce">🎯</div>
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg animate-pulse">
                      1
                    </div>
                  </div>
                </div>
                <CardTitle className="text-center text-xl">
                  Elige tu calculadora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Selecciona el tipo de proyecto que necesitas calcular desde las <strong className="text-primary">8 opciones disponibles</strong> arriba.
                </p>
                <div className="mt-4 flex justify-center gap-2 text-2xl">
                  <span className="animate-pulse delay-100">💼</span>
                  <span className="animate-pulse delay-200">🌐</span>
                  <span className="animate-pulse delay-300">📱</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paso 2 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <Card className="relative bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="text-6xl animate-pulse">✍️</div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg animate-pulse">
                      2
                    </div>
                  </div>
                </div>
                <CardTitle className="text-center text-xl">
                  Completa los datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Ingresa los detalles de tu proyecto y las características que necesitas implementar.
                </p>
                <div className="mt-4 flex justify-center gap-2 text-2xl">
                  <span className="animate-bounce delay-100">⚙️</span>
                  <span className="animate-bounce delay-300">🔧</span>
                  <span className="animate-bounce delay-500">⚡</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paso 3 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <Card className="relative bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="text-6xl animate-bounce">📄</div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg animate-pulse">
                      3
                    </div>
                  </div>
                </div>
                <CardTitle className="text-center text-xl">
                  Descarga tu presupuesto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Genera un <strong className="text-green-500">PDF profesional</strong> con el desglose completo de costos y tiempos del proyecto.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="text-4xl animate-pulse">✅</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Llamada a la acción */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border border-primary/20">
          <p className="text-lg font-semibold mb-2">
            <span className="text-3xl mr-2">⚡</span>
            ¡Es así de fácil!
          </p>
          <p className="text-muted-foreground">
            En menos de 5 minutos tendrás tu presupuesto profesional listo para enviar
          </p>
        </div>
      </div>

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
