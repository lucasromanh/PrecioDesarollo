import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Monitor } from 'lucide-react';
import { estimateDesktopApp, type DesktopAppEstimateParams, type EstimateResult } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';

export function DesktopAppEstimator() {
  const [platform, setPlatform] = useState<string>('cross-platform');
  const [appType, setAppType] = useState<string>('standard');
  const [needsDatabase, setNeedsDatabase] = useState(false);
  const [databaseHosting, setDatabaseHosting] = useState(false);
  const [needsInstaller, setNeedsInstaller] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'ARS'>('ARS');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const handleCalculate = () => {
    const params: DesktopAppEstimateParams = {
      platform,
      appType,
      needsDatabase,
      databaseHosting: needsDatabase ? databaseHosting : false,
      needsInstaller,
      currency
    };
    
    const estimate = estimateDesktopApp(params);
    setResult(estimate);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Monitor className="h-6 w-6 text-primary" />
            Estimador de Aplicación de Escritorio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="windows">Windows (C#, WPF)</option>
                <option value="mac">macOS (Swift)</option>
                <option value="linux">Linux (GTK, Qt)</option>
                <option value="cross-platform">Multiplataforma (Electron, Tauri)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                {platform === 'cross-platform' 
                  ? 'Una sola base de código para Windows, Mac y Linux' 
                  : platform === 'windows'
                  ? 'Aplicación nativa para Windows con .NET'
                  : platform === 'mac'
                  ? 'Aplicación nativa para macOS con Swift'
                  : 'Aplicación nativa para distribuciones Linux'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appType">Tipo de Aplicación</Label>
              <Select id="appType" value={appType} onChange={(e) => setAppType(e.target.value)}>
                <option value="simple">Simple (Herramienta básica, pocas funciones)</option>
                <option value="standard">Estándar (App de productividad, gestión)</option>
                <option value="complex">Compleja (Edición multimedia, CAD, etc.)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                {appType === 'simple' && 'Aplicación con funcionalidades básicas y UI simple'}
                {appType === 'standard' && 'Aplicación completa con múltiples funciones'}
                {appType === 'complex' && 'Aplicación avanzada con procesamiento intensivo'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                <option value="ARS">🇦🇷 Pesos Argentinos (ARS)</option>
                <option value="USD">🇺🇸 Dólares (USD)</option>
                <option value="EUR">🇪🇺 Euros (EUR)</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Características</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="database"
                    checked={needsDatabase}
                    onCheckedChange={(checked) => {
                      setNeedsDatabase(checked as boolean);
                      if (!checked) setDatabaseHosting(false);
                    }}
                  />
                  <Label htmlFor="database" className="cursor-pointer">
                    Integración con Base de Datos (SQLite, PostgreSQL)
                  </Label>
                </div>

                {needsDatabase && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Checkbox
                      id="dbHosting"
                      checked={databaseHosting}
                      onCheckedChange={(checked) => setDatabaseHosting(checked as boolean)}
                    />
                    <Label htmlFor="dbHosting" className="cursor-pointer">
                      Incluir Alojamiento Remoto de Base de Datos
                    </Label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="installer"
                    checked={needsInstaller}
                    onCheckedChange={(checked) => setNeedsInstaller(checked as boolean)}
                  />
                  <Label htmlFor="installer" className="cursor-pointer">
                    Creación de Instalador Profesional
                  </Label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button 
                onClick={handleCalculate}
                className="w-full"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calcular Estimación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && <BudgetGenerator result={result} type="project" />}
    </div>
  );
}
