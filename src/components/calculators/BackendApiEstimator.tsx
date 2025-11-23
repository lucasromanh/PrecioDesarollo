import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Server, Clock, DollarSign } from 'lucide-react';
import { estimateBackendHours } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';
import type { EstimateResult } from '@/lib/calculators';

export function BackendApiEstimator() {
  const [type, setType] = useState('rest');
  const [endpoints, setEndpoints] = useState(10);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(2);
  const [needsDatabase, setNeedsDatabase] = useState(true);
  const [databaseType, setDatabaseType] = useState('sql');
  const [needsAuth, setNeedsAuth] = useState(false);
  const [needsFileStorage, setNeedsFileStorage] = useState(false);
  const [currency, setCurrency] = useState('ARS');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const availableIntegrations = [
    'Pagos (Stripe, MercadoPago)',
    'Autenticación (OAuth, JWT)',
    'Email (SendGrid, AWS SES)',
    'Storage (S3, Cloud)',
    'Analytics',
    'Terceros (APIs externas)',
  ];

  const toggleIntegration = (integration: string) => {
    setIntegrations((prev) =>
      prev.includes(integration)
        ? prev.filter((i) => i !== integration)
        : [...prev, integration]
    );
  };

  const handleEstimate = () => {
    const res = estimateBackendHours({
      type,
      endpoints,
      integrations,
      complexity,
      needsDatabase,
      databaseType,
      needsAuth,
      needsFileStorage,
      currency,
    });
    setResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">⚙️</span>
            API / Backend
          </CardTitle>
          <CardDescription>Define las características de tu API o servicio backend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Backend</Label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="rest">API REST</option>
              <option value="graphql">GraphQL</option>
              <option value="microservicios">Microservicios</option>
              <option value="script-python">Script Python / Automatización</option>
            </Select>
          </div>

          {type !== 'script-python' && (
            <div className="space-y-2">
              <Label htmlFor="endpoints">Número de Endpoints</Label>
              <Input
                id="endpoints"
                type="number"
                value={endpoints}
                onChange={(e) => setEndpoints(Number(e.target.value))}
                min={1}
              />
            </div>
          )}

          {type !== 'script-python' && (
            <div className="space-y-2">
              <Label>Integraciones Externas</Label>
              <div className="space-y-2">
                {availableIntegrations.map((integration) => (
                  <div key={integration} className="flex items-center space-x-2">
                    <Checkbox
                      id={integration}
                      checked={integrations.includes(integration)}
                      onCheckedChange={() => toggleIntegration(integration)}
                    />
                    <Label htmlFor={integration} className="cursor-pointer text-sm">
                      {integration}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="complexity">
              {type === 'script-python' ? 'Complejidad del Script' : 'Complejidad de Lógica de Negocio'}
            </Label>
            <Select
              id="complexity"
              value={complexity.toString()}
              onChange={(e) => setComplexity(Number(e.target.value))}
            >
              {type === 'script-python' ? (
                <>
                  <option value="1">Baja (Script simple)</option>
                  <option value="2">Media (Lógica moderada)</option>
                  <option value="3">Alta (Procesamiento complejo)</option>
                </>
              ) : (
                <>
                  <option value="1">Baja (CRUD simple)</option>
                  <option value="2">Media (Lógica moderada)</option>
                  <option value="3">Alta (Lógica compleja)</option>
                </>
              )}
            </Select>
          </div>

          {type === 'script-python' ? (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="database"
                  checked={needsDatabase}
                  onCheckedChange={(checked) => setNeedsDatabase(checked as boolean)}
                />
                <Label htmlFor="database" className="cursor-pointer">
                  Requiere base de datos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheduling"
                  checked={needsAuth}
                  onCheckedChange={(checked) => setNeedsAuth(checked as boolean)}
                />
                <Label htmlFor="scheduling" className="cursor-pointer">
                  Tareas programadas (Cron)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={needsFileStorage}
                  onCheckedChange={(checked) => setNeedsFileStorage(checked as boolean)}
                />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Sistema de notificaciones
                </Label>
              </div>
            </>
          ) : (
            <>
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

              {needsDatabase && (
                <div className="space-y-2">
                  <Label htmlFor="databaseType">Tipo de Base de Datos</Label>
                  <Select id="databaseType" value={databaseType} onChange={(e) => setDatabaseType(e.target.value)}>
                    <option value="sql">SQL (PostgreSQL, MySQL)</option>
                    <option value="nosql">NoSQL (MongoDB, Firebase)</option>
                    <option value="both">Ambas (SQL + NoSQL)</option>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auth"
                  checked={needsAuth}
                  onCheckedChange={(checked) => setNeedsAuth(checked as boolean)}
                />
                <Label htmlFor="auth" className="cursor-pointer">
                  Sistema de autenticación
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filestorage"
                  checked={needsFileStorage}
                  onCheckedChange={(checked) => setNeedsFileStorage(checked as boolean)}
                />
                <Label htmlFor="filestorage" className="cursor-pointer">
                  Almacenamiento de archivos
                </Label>
              </div>
            </>
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
              La tarifa por hora se calcula automáticamente según el mercado
            </p>
          </div>
          </div>

          <Button onClick={handleEstimate} className="w-full mt-6">
            <Server className="mr-2 h-4 w-4" />
            Estimar Backend/API
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/50 bg-card hover:bg-[#222630] animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-5 w-5 text-primary animate-pulse" />
              Estimación Backend/API
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
                  Costos Adicionales Mensuales
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
              <h4 className="font-semibold text-sm">Hitos de Desarrollo</h4>
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

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 Considera tiempo adicional para documentación, testing exhaustivo y posible escalabilidad futura.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <BudgetGenerator result={result} type="project" />
    </div>
  );
}
