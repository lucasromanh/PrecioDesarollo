import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { estimateProjectHours } from '@/lib/calculators';
import type { EstimateResult } from '@/lib/calculators';

export function ProjectEstimator() {
  const [projectType, setProjectType] = useState('landing');
  const [pages, setPages] = useState(5);
  const [complexity, setComplexity] = useState(2);
  const [deadline, setDeadline] = useState('normal');
  const [includesDesign, setIncludesDesign] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(15000);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleEstimate = () => {
    const res = estimateProjectHours({
      projectType,
      pages,
      complexity,
      deadline,
      includesDesign,
      hourlyRate,
    });
    setResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">🌐</span>
            Detalles del Proyecto
          </CardTitle>
          <CardDescription>Define las características de tu proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="projectType">Tipo de Proyecto</Label>
            <Select
              id="projectType"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="landing">Landing Page Simple</option>
              <option value="corporativa">Web Corporativa Personalizada</option>
              <option value="ecommerce-basico">E-commerce Básico</option>
              <option value="ecommerce-avanzado">E-commerce Avanzado</option>
              <option value="wordpress">WordPress Personalizado</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Número de Páginas/Secciones</Label>
            <Input
              id="pages"
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexity">Complejidad</Label>
            <Select
              id="complexity"
              value={complexity.toString()}
              onChange={(e) => setComplexity(Number(e.target.value))}
            >
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Select id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}>
              <option value="flexible">Flexible</option>
              <option value="normal">Normal (1-2 meses)</option>
              <option value="urgente">Urgente</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="design"
              checked={includesDesign}
              onCheckedChange={(checked) => setIncludesDesign(checked as boolean)}
            />
            <Label htmlFor="design" className="cursor-pointer">
              Incluye diseño UI/UX
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
              Usa la calculadora de tarifa por hora si no estás seguro
            </p>
          </div>
          </div>

          <Button onClick={handleEstimate} className="w-full mt-6">
            <Globe className="mr-2 h-4 w-4" />
            Estimar Proyecto
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/50 bg-card hover:bg-[#222630] animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
              Estimación del Proyecto
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
                <p className="text-2xl font-bold text-primary">
                  ARS {result.minPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  hasta ARS {result.maxPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-lg">📋</span>
                Propuesta de Hitos de Pago
              </h4>
              {result.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/50 hover:border-border transition-all duration-300"
                >
                  <div>
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-muted-foreground">{milestone.percentage}%</p>
                  </div>
                  <Badge variant="outline">ARS {milestone.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 Esta es una estimación base. Ajusta según reuniones con el cliente, revisiones y complejidad adicional.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
