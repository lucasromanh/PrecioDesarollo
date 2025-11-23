import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';
import { calculateHourlyRate, calculateMonthlyExpenses, getBillableHours } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';
import type { HourlyRateResult } from '@/lib/calculators';

export function HourlyRateCalculator() {
  const [role, setRole] = useState('frontend');
  const [seniority, setSeniority] = useState('semisenior');
  const [country, setCountry] = useState('argentina');
  const [currency, setCurrency] = useState('ARS');
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [profitMargin, setProfitMargin] = useState(30);
  const [billableHours, setBillableHours] = useState(0);
  const [result, setResult] = useState<HourlyRateResult | null>(null);

  // Calcular automáticamente gastos y horas cuando cambian país, seniority o moneda
  useEffect(() => {
    const expenses = calculateMonthlyExpenses(country, seniority, currency);
    const hours = getBillableHours(seniority);
    setMonthlyExpenses(expenses);
    setBillableHours(hours);
  }, [country, seniority, currency]);

  const handleCalculate = () => {
    const res = calculateHourlyRate({
      role,
      seniority,
      country,
      currency,
      monthlyExpenses,
      profitMargin,
      billableHours,
    });
    setResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-xl md:text-2xl">💼</span>
            Parámetros de Cálculo
          </CardTitle>
          <CardDescription>Ingresa tus datos para calcular tu tarifa por hora</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
              <option value="devops">DevOps</option>
              <option value="data">Data</option>
              <option value="ia">IA</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniority">Seniority</Label>
            <Select id="seniority" value={seniority} onChange={(e) => setSeniority(e.target.value)}>
              <option value="junior">Junior</option>
              <option value="semisenior">Semi-Senior</option>
              <option value="senior">Senior</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País / Región</Label>
            <Select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="argentina">Argentina</option>
              <option value="mexico">México</option>
              <option value="colombia">Colombia</option>
              <option value="españa">España</option>
              <option value="usa">USA</option>
              <option value="latam">LATAM (general)</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="ARS">ARS (Peso Argentino)</option>
              <option value="USD">USD (Dólar)</option>
              <option value="EUR">EUR (Euro)</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses">Gastos mensuales estimados ({currency})</Label>
            <Input
              id="expenses"
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Calculado automáticamente según tu región y seniority
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billable">Horas facturables por mes</Label>
            <Input
              id="billable"
              type="number"
              value={billableHours}
              onChange={(e) => setBillableHours(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Sugerido para {seniority}: {getBillableHours(seniority)}h/mes
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Margen de beneficio (%)</Label>
            <Input
              id="margin"
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
            />
          </div>
          </div>

          <Button onClick={handleCalculate} className="w-full mt-6">
            <DollarSign className="mr-2 h-4 w-4" />
            Calcular Tarifa
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/50 bg-card hover:bg-[#222630] animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
              Tu Tarifa Sugerida
            </CardTitle>
            <CardDescription>{result.explanation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 md:p-4 bg-card/30 rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">Tarifa Mínima</p>
                  <p className="text-xl md:text-2xl font-bold">{currency} {result.minimumRate.toLocaleString()}</p>
                </div>
                <Badge variant="secondary">Por hora</Badge>
              </div>

              <div className="flex items-center justify-between p-3 md:p-4 bg-primary/5 rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 shadow-lg shadow-primary/5">
                <div>
                  <p className="text-xs md:text-sm font-medium text-primary-foreground/80">Rango Recomendado</p>
                  <p className="text-lg md:text-2xl font-bold text-primary">
                    {currency} {result.recommendedMin.toLocaleString()} - {result.recommendedMax.toLocaleString()}
                  </p>
                </div>
                <Badge variant="default" className="shadow-md">Ideal</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Consejo:</strong> Comienza con el rango recomendado y ajusta según tu experiencia, portfolio y demanda del mercado.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <BudgetGenerator result={result} type="hourly" />
    </div>
  );
}
