import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { marketDataService } from '@/services/marketDataService';
import type { MarketRateData } from '@/services/marketDataService';
import { TrendingUp, Loader2 } from 'lucide-react';

export function MarketReferencesPage() {
  const [marketData, setMarketData] = useState<MarketRateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await marketDataService.getAllMarketRates();
      setMarketData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const groupByCountry = () => {
    const grouped: Record<string, MarketRateData[]> = {};
    marketData.forEach((item) => {
      if (!grouped[item.country]) {
        grouped[item.country] = [];
      }
      grouped[item.country].push(item);
    });
    return grouped;
  };

  const groupedData = groupByCountry();

  return (
    <PageContainer
      title="Referencias de Mercado"
      description="Tarifas de referencia por rol, seniority y país (datos orientativos)"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:bg-blue-500/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <TrendingUp className="h-5 w-5 animate-pulse" />
                Sobre estos datos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Los valores mostrados son <strong>referencias orientativas</strong> basadas en promedios de mercado.
              </p>
              <p>
                En el futuro, esta sección se puede conectar a APIs externas de datos de salarios y tarifas reales
                (como Glassdoor, Payscale, encuestas de la industria, etc.).
              </p>
              <p>
                Por ahora, usa estos datos como punto de partida y ajusta según tu contexto específico.
              </p>
            </CardContent>
          </Card>

              {Object.entries(groupedData).map(([country, rates]) => (
            <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                {country}
                <Badge variant="outline" className="ml-2">{rates[0].currency}</Badge>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rates.map((rate, idx) => (
                  <Card key={idx} className="hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-xl">💼</span>
                        {rate.role}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{rate.seniority}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm text-muted-foreground">Mínimo</span>
                        <span className="font-semibold">
                          {rate.currency} {rate.minRate.toLocaleString()}/h
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-primary/10 border border-primary/30">
                        <span className="text-sm font-medium text-primary-foreground/80">Promedio</span>
                        <span className="font-bold text-primary">
                          {rate.currency} {rate.avgRate.toLocaleString()}/h
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm text-muted-foreground">Máximo</span>
                        <span className="font-semibold">
                          {rate.currency} {rate.maxRate.toLocaleString()}/h
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
