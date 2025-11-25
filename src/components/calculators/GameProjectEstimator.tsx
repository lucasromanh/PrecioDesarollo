import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Gamepad2 } from 'lucide-react';
import { estimateGameProject, type GameProjectParams, type EstimateResult } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';

export function GameProjectEstimator() {
  const [platform, setPlatform] = useState<'web-pwa' | 'mobile' | 'desktop' | 'console'>('web-pwa');
  const [gameType, setGameType] = useState<'casual' | 'arcade' | 'puzzle' | 'adventure' | 'multiplayer'>('casual');
  const [complexity, setComplexity] = useState<1 | 2 | 3>(2);
  const [mobileTarget, setMobileTarget] = useState<'ios' | 'android' | 'both'>('both');
  const [needsMultiplayer, setNeedsMultiplayer] = useState(false);
  const [needsBackend, setNeedsBackend] = useState(false);
  const [needsIAP, setNeedsIAP] = useState(false);
  const [needsAds, setNeedsAds] = useState(false);
  const [needsLeaderboards, setNeedsLeaderboards] = useState(false);
  const [needs3D, setNeeds3D] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'ARS'>('ARS');
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleCalculate = () => {
    const params: GameProjectParams = {
      platform,
      gameType,
      complexity,
      mobileTarget: platform === 'mobile' ? mobileTarget : undefined,
      needsMultiplayer,
      needsBackend,
      needsIAP,
      needsAds,
      needsLeaderboards,
      needs3D,
      currency,
      hourlyRate
    };
    
    const estimate = estimateGameProject(params);
    setResult(estimate);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">🎮</span>
            Estimador de Videojuegos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                <option value="web-pwa">Web/PWA (HTML5, Canvas, WebGL)</option>
                <option value="mobile">Móvil (iOS/Android)</option>
                <option value="desktop">Desktop (Windows/Mac/Linux)</option>
                <option value="console">Consolas (Unity/Unreal)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                {platform === 'web-pwa' && 'Juego que funciona en navegador y se puede instalar como app'}
                {platform === 'mobile' && 'Juego nativo para dispositivos móviles'}
                {platform === 'desktop' && 'Juego ejecutable para computadoras'}
                {platform === 'console' && 'Juego para PlayStation, Xbox, Nintendo Switch'}
              </p>
            </div>

            {platform === 'mobile' && (
              <div className="space-y-2">
                <Label htmlFor="mobileTarget">Plataformas Móviles</Label>
                <Select id="mobileTarget" value={mobileTarget} onChange={(e) => setMobileTarget(e.target.value as any)}>
                  <option value="ios">Solo iOS (App Store)</option>
                  <option value="android">Solo Android (Google Play)</option>
                  <option value="both">iOS + Android (Ambas tiendas)</option>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="gameType">Tipo de Juego</Label>
              <Select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value as any)}>
                <option value="casual">Casual (Juego simple, sesiones cortas)</option>
                <option value="arcade">Arcade (Acción rápida, puntajes)</option>
                <option value="puzzle">Puzzle (Rompecabezas, lógica)</option>
                <option value="adventure">Aventura (Historia, niveles complejos)</option>
                <option value="multiplayer">Multijugador (PvP, cooperativo)</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complejidad del Juego</Label>
              <Select id="complexity" value={complexity.toString()} onChange={(e) => setComplexity(Number(e.target.value) as 1 | 2 | 3)}>
                <option value="1">Baja (Mecánicas simples, pocos niveles)</option>
                <option value="2">Media (Múltiples mecánicas, 20-50 niveles)</option>
                <option value="3">Alta (Mecánicas complejas, 50+ niveles, físicas)</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Características del Juego</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="3d"
                    checked={needs3D}
                    onCheckedChange={(checked) => setNeeds3D(checked as boolean)}
                  />
                  <Label htmlFor="3d" className="cursor-pointer">
                    Gráficos 3D (Unity/Unreal/Three.js)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiplayer"
                    checked={needsMultiplayer}
                    onCheckedChange={(checked) => setNeedsMultiplayer(checked as boolean)}
                  />
                  <Label htmlFor="multiplayer" className="cursor-pointer">
                    Modo Multijugador Online
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backend"
                    checked={needsBackend}
                    onCheckedChange={(checked) => setNeedsBackend(checked as boolean)}
                  />
                  <Label htmlFor="backend" className="cursor-pointer">
                    Backend (Guardar progreso, cuentas de usuario)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="leaderboards"
                    checked={needsLeaderboards}
                    onCheckedChange={(checked) => setNeedsLeaderboards(checked as boolean)}
                  />
                  <Label htmlFor="leaderboards" className="cursor-pointer">
                    Tablas de Clasificación (Leaderboards)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="iap"
                    checked={needsIAP}
                    onCheckedChange={(checked) => setNeedsIAP(checked as boolean)}
                  />
                  <Label htmlFor="iap" className="cursor-pointer">
                    Compras In-App (Monedas, power-ups, etc.)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ads"
                    checked={needsAds}
                    onCheckedChange={(checked) => setNeedsAds(checked as boolean)}
                  />
                  <Label htmlFor="ads" className="cursor-pointer">
                    Monetización con Anuncios (AdMob, Unity Ads)
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
