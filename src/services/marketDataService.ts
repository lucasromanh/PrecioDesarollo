// Servicio que simula datos de mercado
// En el futuro puede conectarse a APIs reales

export interface MarketRateData {
  role: string;
  seniority: string;
  country: string;
  currency: string;
  minRate: number;
  maxRate: number;
  avgRate: number;
}

// Datos mockeados de referencia del mercado
const mockMarketData: MarketRateData[] = [
  // Argentina - ARS
  { role: 'Frontend', seniority: 'Junior', country: 'Argentina', currency: 'ARS', minRate: 8000, maxRate: 15000, avgRate: 12000 },
  { role: 'Frontend', seniority: 'Semi-Senior', country: 'Argentina', currency: 'ARS', minRate: 15000, maxRate: 25000, avgRate: 20000 },
  { role: 'Frontend', seniority: 'Senior', country: 'Argentina', currency: 'ARS', minRate: 25000, maxRate: 40000, avgRate: 32000 },
  { role: 'Backend', seniority: 'Junior', country: 'Argentina', currency: 'ARS', minRate: 9000, maxRate: 16000, avgRate: 13000 },
  { role: 'Backend', seniority: 'Semi-Senior', country: 'Argentina', currency: 'ARS', minRate: 16000, maxRate: 28000, avgRate: 22000 },
  { role: 'Backend', seniority: 'Senior', country: 'Argentina', currency: 'ARS', minRate: 28000, maxRate: 45000, avgRate: 36000 },
  { role: 'Fullstack', seniority: 'Junior', country: 'Argentina', currency: 'ARS', minRate: 10000, maxRate: 18000, avgRate: 14000 },
  { role: 'Fullstack', seniority: 'Semi-Senior', country: 'Argentina', currency: 'ARS', minRate: 18000, maxRate: 30000, avgRate: 24000 },
  { role: 'Fullstack', seniority: 'Senior', country: 'Argentina', currency: 'ARS', minRate: 30000, maxRate: 50000, avgRate: 40000 },
  
  // USA - USD
  { role: 'Frontend', seniority: 'Junior', country: 'USA', currency: 'USD', minRate: 35, maxRate: 55, avgRate: 45 },
  { role: 'Frontend', seniority: 'Semi-Senior', country: 'USA', currency: 'USD', minRate: 55, maxRate: 85, avgRate: 70 },
  { role: 'Frontend', seniority: 'Senior', country: 'USA', currency: 'USD', minRate: 85, maxRate: 130, avgRate: 105 },
  { role: 'Backend', seniority: 'Junior', country: 'USA', currency: 'USD', minRate: 40, maxRate: 60, avgRate: 50 },
  { role: 'Backend', seniority: 'Semi-Senior', country: 'USA', currency: 'USD', minRate: 60, maxRate: 95, avgRate: 77 },
  { role: 'Backend', seniority: 'Senior', country: 'USA', currency: 'USD', minRate: 95, maxRate: 145, avgRate: 120 },
  { role: 'DevOps', seniority: 'Semi-Senior', country: 'USA', currency: 'USD', minRate: 70, maxRate: 105, avgRate: 87 },
  { role: 'DevOps', seniority: 'Senior', country: 'USA', currency: 'USD', minRate: 105, maxRate: 160, avgRate: 132 },
  { role: 'IA', seniority: 'Semi-Senior', country: 'USA', currency: 'USD', minRate: 80, maxRate: 120, avgRate: 100 },
  { role: 'IA', seniority: 'Senior', country: 'USA', currency: 'USD', minRate: 120, maxRate: 180, avgRate: 150 },

  // España - EUR
  { role: 'Frontend', seniority: 'Junior', country: 'España', currency: 'EUR', minRate: 25, maxRate: 40, avgRate: 32 },
  { role: 'Frontend', seniority: 'Semi-Senior', country: 'España', currency: 'EUR', minRate: 40, maxRate: 65, avgRate: 52 },
  { role: 'Frontend', seniority: 'Senior', country: 'España', currency: 'EUR', minRate: 65, maxRate: 95, avgRate: 80 },
  { role: 'Backend', seniority: 'Junior', country: 'España', currency: 'EUR', minRate: 28, maxRate: 45, avgRate: 36 },
  { role: 'Backend', seniority: 'Semi-Senior', country: 'España', currency: 'EUR', minRate: 45, maxRate: 70, avgRate: 57 },
  { role: 'Backend', seniority: 'Senior', country: 'España', currency: 'EUR', minRate: 70, maxRate: 105, avgRate: 87 },
  { role: 'Fullstack', seniority: 'Semi-Senior', country: 'España', currency: 'EUR', minRate: 50, maxRate: 75, avgRate: 62 },
  { role: 'Fullstack', seniority: 'Senior', country: 'España', currency: 'EUR', minRate: 75, maxRate: 110, avgRate: 92 },
];

export class MarketDataService {
  // Simula delay de API
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMarketRates(filters?: {
    role?: string;
    seniority?: string;
    country?: string;
  }): Promise<MarketRateData[]> {
    await this.delay(300); // Simular llamada a API

    let filtered = mockMarketData;

    if (filters?.role) {
      filtered = filtered.filter(d => d.role.toLowerCase() === filters.role?.toLowerCase());
    }
    if (filters?.seniority) {
      filtered = filtered.filter(d => d.seniority.toLowerCase() === filters.seniority?.toLowerCase());
    }
    if (filters?.country) {
      filtered = filtered.filter(d => d.country.toLowerCase() === filters.country?.toLowerCase());
    }

    return filtered;
  }

  async getAllMarketRates(): Promise<MarketRateData[]> {
    await this.delay(300);
    return mockMarketData;
  }

  async getRateByParams(role: string, seniority: string, country: string): Promise<MarketRateData | null> {
    await this.delay(200);
    
    const found = mockMarketData.find(
      d => 
        d.role.toLowerCase() === role.toLowerCase() &&
        d.seniority.toLowerCase() === seniority.toLowerCase() &&
        d.country.toLowerCase() === country.toLowerCase()
    );

    return found || null;
  }
}

export const marketDataService = new MarketDataService();
