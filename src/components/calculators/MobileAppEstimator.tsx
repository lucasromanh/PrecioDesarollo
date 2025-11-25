import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Smartphone } from 'lucide-react';
import { estimateMobileApp, type MobileAppEstimateParams, type EstimateResult } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';

export function MobileAppEstimator() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'both'>('both');
  const [screens, setScreens] = useState(10);
  const [complexity, setComplexity] = useState<1 | 2 | 3>(2);
  const [needsBackend, setNeedsBackend] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [needsPayments, setNeedsPayments] = useState(false);
  const [needsPushNotifications, setNeedsPushNotifications] = useState(false);
  const [needsDesign, setNeedsDesign] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'ARS'>('ARS');
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleCalculate = () => {
    const params: MobileAppEstimateParams = {
      platform,
      screens,
      complexity,
      needsBackend,
      needsAuth,
      needsPayments,
      needsPushNotifications,
      needsDesign,
      currency,
      hourlyRate
    };
    
    const estimate = estimateMobileApp(params);
    setResult(estimate);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">📱</span>
            Estimador de App Móvil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                <option value="ios">iOS (Swift/SwiftUI)</option>
                <option value="android">Android (Kotlin/Jetpack Compose)</option>
                <option value="both">Multiplataforma (React Native/Flutter)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                {platform === 'both' 
                  ? 'React Native o Flutter permiten compartir código entre plataformas' 
                  : platform === 'ios'
                  ? 'Desarrollo nativo para iPhone y iPad'
                  : 'Desarrollo nativo para dispositivos Android'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="screens">Número de Pantallas</Label>
              <Input
                id="screens"
                type="number"
                value={screens}
                onChange={(e) => setScreens(Number(e.target.value))}
                min={3}
              />
              <p className="text-xs text-muted-foreground">
                Pantallas principales de la app (login, home, perfil, listados, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complejidad por Pantalla</Label>
              <Select id="complexity" value={complexity.toString()} onChange={(e) => setComplexity(Number(e.target.value) as 1 | 2 | 3)}>
                <option value="1">Baja (Pantallas estáticas, poco interactivas)</option>
                <option value="2">Media (Formularios, listas, navegación)</option>
                <option value="3">Alta (Animaciones complejas, mapas, cámara)</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Funcionalidades</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backend"
                    checked={needsBackend}
                    onCheckedChange={(checked) => setNeedsBackend(checked as boolean)}
                  />
                  <Label htmlFor="backend" className="cursor-pointer">
                    Backend + Base de Datos
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auth"
                    checked={needsAuth}
                    onCheckedChange={(checked) => setNeedsAuth(checked as boolean)}
                  />
                  <Label htmlFor="auth" className="cursor-pointer">
                    Sistema de Autenticación (Login/Registro)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payments"
                checked={needsPayments}
                onCheckedChange={(checked) => setNeedsPayments(checked as boolean)}
              />
              <Label htmlFor="payments" className="cursor-pointer">
                Pasarela de Pagos (Stripe, MercadoPago)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                    id="push"
                    checked={needsPushNotifications}
                    onCheckedChange={(checked) => setNeedsPushNotifications(checked as boolean)}
                  />
                  <Label htmlFor="push" className="cursor-pointer">
                    Notificaciones Push
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="design"
                    checked={needsDesign}
                    onCheckedChange={(checked) => setNeedsDesign(checked as boolean)}
                  />
                  <Label htmlFor="design" className="cursor-pointer">
                    Diseño UI/UX Personalizado
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                <option value="USD">USD (Dólares)</option>
                <option value="EUR">EUR (Euros)</option>
                <option value="ARS">ARS (Pesos Argentinos)</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Tarifa por Hora (Opcional)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate || ''}
                onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Usa tarifa de mercado"
              />
              <p className="text-xs text-muted-foreground">
                Dejar vacío para usar tarifa automática
              </p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calcular Estimación
          </button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-border/50 bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <span>💰</span>
                Estimación del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Horas Estimadas</p>
                <p className="text-4xl font-bold text-primary">{result.hours}h</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Precio Mínimo</p>
                  <p className="text-2xl font-bold">{currency} ${result.minPrice.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Precio Máximo</p>
                  <p className="text-2xl font-bold">{currency} ${result.maxPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Hitos del Proyecto:</p>
                {result.milestones.map((milestone, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="text-sm">{milestone.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{currency} ${milestone.amount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-2">({milestone.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>

              {result.additionalCosts && result.additionalCosts.length > 0 && (
                <div className="space-y-2 p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    💰 Costos Adicionales:
                  </p>
                  {result.additionalCosts.map((cost, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <span className="font-medium">{cost.item}</span>
                        {cost.monthlyCost && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Mensual</span>}
                        <p className="text-xs text-muted-foreground mt-1">{cost.description}</p>
                      </div>
                      <span className="font-semibold ml-2">
                        {currency} ${(cost.oneTimeCost || cost.monthlyCost || 0).toLocaleString()}
                        {cost.monthlyCost && '/mes'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>
            </CardContent>
          </Card>

          <BudgetGenerator result={result} type="project" />
        </>
      )}
    </div>
  );
}
