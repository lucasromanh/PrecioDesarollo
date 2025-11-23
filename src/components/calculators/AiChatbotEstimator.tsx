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
import type { EstimateResult } from '@/lib/calculators';

export function AiChatbotEstimator() {
  const [implementationType, setImplementationType] = useState('chatbot-faq');
  const [users, setUsers] = useState(500);
  const [needsTraining, setNeedsTraining] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(25000);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleEstimate = () => {
    const res = estimateAiProjectHours({
      implementationType,
      users,
      needsTraining,
      hourlyRate,
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="users">Volumen de Usuarios Estimado</Label>
            <Input
              id="users"
              type="number"
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              min={1}
            />
            <p className="text-xs text-muted-foreground">
              Usuarios concurrentes o consultas mensuales esperadas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="training"
              checked={needsTraining}
              onCheckedChange={(checked) => setNeedsTraining(checked as boolean)}
            />
            <Label htmlFor="training" className="cursor-pointer">
              Necesita entrenamiento con datos propios
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Tu Tarifa por Hora (ARS)</Label>
            <Input
              id="hourlyRate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Proyectos de IA suelen tener tarifas más altas
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

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Importante:</strong> Los proyectos de IA requieren iteraciones y ajustes constantes.
              </p>
              <p className="text-sm text-muted-foreground">
                🔧 Considera costos adicionales de infraestructura, APIs de terceros (OpenAI, etc.) y mantenimiento continuo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
