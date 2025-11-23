import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Bot, Clock, DollarSign, Sparkles } from 'lucide-react';
import { estimateAiProjectHours } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';
import type { EstimateResult } from '@/lib/calculators';

export function AiChatbotEstimator() {
  const [implementationType, setImplementationType] = useState('chatbot-faq');
  const [users, setUsers] = useState(500);
  const [needsTraining, setNeedsTraining] = useState(false);
  const [monthlyTokens, setMonthlyTokens] = useState(1000000);
  const [aiProvider, setAiProvider] = useState('openai');
  const [currency, setCurrency] = useState('ARS');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleEstimate = () => {
    const res = estimateAiProjectHours({
      implementationType,
      users,
      needsTraining,
      monthlyTokens,
      aiProvider,
      currency,
    });
    setResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">🤖</span>
            Proyecto de IA / Chatbot
          </CardTitle>
          <CardDescription>Define las características de tu proyecto con IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="implementationType">Tipo de Implementación</Label>
            <Select
              id="implementationType"
              value={implementationType}
              onChange={(e) => setImplementationType(e.target.value)}
            >
              <option value="chatbot-faq">Chatbot Básico (FAQ)</option>
              <option value="asistente-web">Asistente Integrado a Web</option>
              <option value="api-ia">Integración con API de IA (OpenAI, etc.)</option>
              <option value="modelo-custom">Modelo Custom con Fine-tuning</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              {implementationType === 'asistente-web' && 'Incluye desarrollo web + integración IA'}
              {implementationType === 'api-ia' && 'Solo backend/API, sin interfaz'}
              {implementationType === 'modelo-custom' && 'Requiere dataset y entrenamiento'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="users">
              {implementationType === 'api-ia' ? 'Llamadas API Mensuales' : 'Volumen de Usuarios Estimado'}
            </Label>
            <Input
              id="users"
              type="number"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              min={1}
            />
            <p className="text-xs text-muted-foreground">
              {implementationType === 'api-ia' 
                ? 'Número de requests esperados al mes' 
                : 'Usuarios concurrentes o consultas mensuales'}
            </p>
          </div>

          {(implementationType === 'modelo-custom' || implementationType === 'asistente-web') && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="training"
                checked={needsTraining}
                onCheckedChange={(checked) => setNeedsTraining(checked as boolean)}
              />
              <Label htmlFor="training" className="cursor-pointer">
                {implementationType === 'modelo-custom' 
                  ? 'Fine-tuning con dataset propio' 
                  : 'Necesita entrenamiento con datos propios'}
              </Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="aiProvider">Proveedor de IA</Label>
            <Select
              id="aiProvider"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
            >
              <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              {implementationType !== 'asistente-web' && (
                <option value="local">Modelo Local (Llama, Mistral)</option>
              )}
            </Select>
            <p className="text-xs text-muted-foreground">
              {aiProvider === 'local' ? 'Requiere servidor GPU dedicado' : 'Costo por tokens consumidos'}
            </p>
          </div>

          {aiProvider !== 'local' && (
            <div className="space-y-2">
              <Label htmlFor="monthlyTokens">Tokens Mensuales Estimados</Label>
              <Select
                id="monthlyTokens"
                value={monthlyTokens.toString()}
                onChange={(e) => setMonthlyTokens(Number(e.target.value))}
              >
                {implementationType === 'chatbot-faq' ? (
                  <>
                    <option value="100000">100K tokens (~$0.1-0.2) - Uso ligero</option>
                    <option value="500000">500K tokens (~$0.5-1) - Uso moderado</option>
                    <option value="1000000">1M tokens (~$1-2) - Uso normal</option>
                  </>
                ) : implementationType === 'asistente-web' ? (
                  <>
                    <option value="1000000">1M tokens (~$1-2) - Tráfico bajo</option>
                    <option value="5000000">5M tokens (~$5-10) - Tráfico medio</option>
                    <option value="10000000">10M tokens (~$10-20) - Tráfico alto</option>
                  </>
                ) : (
                  <>
                    <option value="1000000">1M tokens (~$1-2)</option>
                    <option value="5000000">5M tokens (~$5-10)</option>
                    <option value="10000000">10M tokens (~$10-20)</option>
                    <option value="50000000">50M+ tokens (~$50-100)</option>
                  </>
                )}
              </Select>
              <p className="text-xs text-muted-foreground">
                {implementationType === 'asistente-web' 
                  ? 'Depende del tráfico web y duración de conversaciones'
                  : 'Depende del volumen de requests y longitud de respuestas'}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="ARS">🇦🇷 Pesos Argentinos (ARS)</option>
              <option value="USD">🇺🇸 Dólares (USD)</option>
              <option value="EUR">🇪🇺 Euros (EUR)</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              La tarifa se calcula automáticamente (IA es 40% más cara que desarrollo estándar)
            </p>
          </div>
          </div>

          <Button onClick={handleEstimate} className="w-full mt-6">
            <Bot className="mr-2 h-4 w-4" />
            Estimar Proyecto IA
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/50 bg-card hover:bg-[#222630] animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-5 w-5 text-primary animate-pulse" />
              Estimación Chatbot IA
            </CardTitle>
            <CardDescription>{result.explanation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-card/30 rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300">
                <p className="text-sm font-medium text-muted-foreground">Horas Estimadas</p>
                <p className="text-2xl font-bold">{result.hours}h</p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 shadow-lg shadow-primary/5">
                <p className="text-sm font-medium text-primary-foreground/80">Precio Estimado</p>
                <p className="text-2xl font-bold text-primary">ARS {result.minPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">hasta ARS {result.maxPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Fases del Proyecto</h4>
              {result.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-muted-foreground">{milestone.percentage}%</p>
                  </div>
                  <Badge variant="outline">ARS {milestone.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>

            {result.additionalCosts && result.additionalCosts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  Costos Operativos Mensuales
                </h4>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                  {result.additionalCosts.map((cost, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{cost.item}</p>
                        <p className="text-xs text-muted-foreground">{cost.description}</p>
                      </div>
                      <div className="text-right">
                        {cost.monthlyCost && (
                          <Badge variant="secondary" className="bg-amber-500/10">
                            {currency} {cost.monthlyCost.toLocaleString()}/mes
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      ⚠️ Estos costos son aproximados y pueden variar según el uso real
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Importante:</strong> Los proyectos de IA requieren iteraciones y ajustes constantes.
              </p>
              <p className="text-sm text-muted-foreground">
                🔧 Los costos operativos mensuales son esenciales para mantener el servicio funcionando.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <BudgetGenerator result={result} type="project" />
    </div>
  );
}
