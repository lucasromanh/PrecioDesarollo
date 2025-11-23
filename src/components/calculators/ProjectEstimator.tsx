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
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';
import type { EstimateResult } from '@/lib/calculators';

export function ProjectEstimator() {
  const [projectType, setProjectType] = useState('landing');
  const [pages, setPages] = useState(5);
  const [complexity, setComplexity] = useState(2);
  const [deadline, setDeadline] = useState('normal');
  const [includesDesign, setIncludesDesign] = useState(false);
  const [needsDomain, setNeedsDomain] = useState(true);
  const [needsHosting, setNeedsHosting] = useState(true);
  const [hostingType, setHostingType] = useState('shared');
  const [needsDatabase, setNeedsDatabase] = useState(false);
  const [currency, setCurrency] = useState('ARS');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleEstimate = () => {
    const res = estimateProjectHours({
      projectType,
      pages,
      complexity,
      deadline,
      includesDesign,
      needsDomain,
      needsHosting,
      hostingType,
      needsDatabase,
      currency,
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="domain"
              checked={needsDomain}
              onCheckedChange={(checked) => setNeedsDomain(checked as boolean)}
            />
            <Label htmlFor="domain" className="cursor-pointer">
              Necesita dominio
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hosting"
              checked={needsHosting}
              onCheckedChange={(checked) => setNeedsHosting(checked as boolean)}
            />
            <Label htmlFor="hosting" className="cursor-pointer">
              Necesita hosting
            </Label>
          </div>

          {needsHosting && (
            <div className="space-y-2">
              <Label htmlFor="hostingType">Tipo de Hosting</Label>
              <Select id="hostingType" value={hostingType} onChange={(e) => setHostingType(e.target.value)}>
                <option value="shared">Compartido (~$5/mes)</option>
                <option value="vps">VPS (~$20/mes)</option>
                <option value="cloud">Cloud (~$50/mes)</option>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="database"
              checked={needsDatabase}
              onCheckedChange={(checked) => setNeedsDatabase(checked as boolean)}
            />
            <Label htmlFor="database" className="cursor-pointer">
              Necesita base de datos
            </Label>
          </div>

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
              La tarifa por hora se calcula automáticamente según el mercado
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

            {result.additionalCosts && result.additionalCosts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  Costos Adicionales (No incluidos en el desarrollo)
                </h4>
                {result.additionalCosts.map((cost, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{cost.item}</p>
                      <p className="text-xs text-muted-foreground">{cost.description}</p>
                    </div>
                    <div className="text-right">
                      {cost.monthlyCost && (
                        <Badge variant="secondary" className="bg-amber-500/10">
                          {currency} {cost.monthlyCost.toLocaleString()}/mes
                        </Badge>
                      )}
                      {cost.oneTimeCost && (
                        <Badge variant="secondary" className="bg-green-500/10">
                          {currency} {cost.oneTimeCost.toLocaleString()} único
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

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

      <BudgetGenerator result={result} type="project" />
    </div>
  );
}
