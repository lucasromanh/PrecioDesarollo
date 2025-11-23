// Tipos para el cálculo de tarifas
export interface HourlyRateParams {
  role: string;
  seniority: string;
  country: string;
  currency: string;
  monthlyExpenses: number;
  profitMargin: number;
  billableHours: number;
}

export interface HourlyRateResult {
  minimumRate: number;
  recommendedMin: number;
  recommendedMax: number;
  explanation: string;
}

export interface ProjectEstimateParams {
  projectType: string;
  pages: number;
  complexity: number; // 1-3
  deadline: string;
  includesDesign: boolean;
  hourlyRate?: number;
}

export interface BackendEstimateParams {
  type: string;
  endpoints: number;
  integrations: string[];
  complexity: number; // 1-3
  hourlyRate?: number;
}

export interface AiEstimateParams {
  implementationType: string;
  users: number;
  needsTraining: boolean;
  hourlyRate?: number;
}

export interface EstimateResult {
  hours: number;
  minPrice: number;
  maxPrice: number;
  milestones: {
    name: string;
    percentage: number;
    amount: number;
  }[];
  explanation: string;
}

// Coeficientes por seniority
const seniorityMultipliers: Record<string, number> = {
  junior: 1,
  semisenior: 1.5,
  senior: 2.2,
};

// Coeficientes por rol
const roleMultipliers: Record<string, number> = {
  frontend: 1,
  backend: 1.1,
  fullstack: 1.3,
  devops: 1.4,
  data: 1.35,
  ia: 1.6,
};

// Tarifas base por país/región (USD/hora base)
const countryBaseRates: Record<string, number> = {
  argentina: 15,
  mexico: 18,
  colombia: 16,
  españa: 30,
  usa: 50,
  europa: 35,
  latam: 17,
};

// Convertir a otras monedas (simplificado)
const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  ARS: 850,
};

export function calculateHourlyRate(params: HourlyRateParams): HourlyRateResult {
  const {
    role,
    seniority,
    country,
    currency,
    monthlyExpenses,
    profitMargin,
    billableHours,
  } = params;

  // Calcular tarifa base por región
  const baseRate = countryBaseRates[country.toLowerCase()] || 20;

  // Aplicar multiplicadores
  const seniorityMult = seniorityMultipliers[seniority.toLowerCase()] || 1;
  const roleMult = roleMultipliers[role.toLowerCase()] || 1;

  // Tarifa calculada por mercado
  const marketRate = baseRate * seniorityMult * roleMult;

  // Calcular tarifa mínima basada en gastos
  const monthlyTarget = monthlyExpenses * (1 + profitMargin / 100);
  const expenseBasedRate = monthlyTarget / billableHours;

  // La tarifa mínima es la mayor entre el mercado y los gastos
  const minimumRate = Math.max(marketRate * 0.7, expenseBasedRate);
  const recommendedMin = marketRate;
  const recommendedMax = marketRate * 1.4;

  // Convertir a la moneda seleccionada
  const rate = currencyRates[currency] || 1;
  
  const explanation = `Para un ${role} ${seniority} en ${country}, considerando ${billableHours}h facturables/mes y gastos de ${currency} ${(monthlyExpenses * rate).toFixed(0)}, tu tarifa debe cubrir costos y generar un ${profitMargin}% de margen.`;

  return {
    minimumRate: Math.round(minimumRate * rate),
    recommendedMin: Math.round(recommendedMin * rate),
    recommendedMax: Math.round(recommendedMax * rate),
    explanation,
  };
}

export function estimateProjectHours(params: ProjectEstimateParams): EstimateResult {
  const { projectType, pages, complexity, deadline, includesDesign, hourlyRate = 50 } = params;

  let baseHours = 0;

  // Horas base por tipo de proyecto
  switch (projectType.toLowerCase()) {
    case 'landing':
      baseHours = 20;
      break;
    case 'corporativa':
      baseHours = 60;
      break;
    case 'ecommerce-basico':
      baseHours = 120;
      break;
    case 'ecommerce-avanzado':
      baseHours = 200;
      break;
    case 'wordpress':
      baseHours = 40;
      break;
    default:
      baseHours = 50;
  }

  // Ajustar por número de páginas
  baseHours += pages * 3;

  // Ajustar por complejidad (1-3)
  baseHours *= complexity;

  // Ajustar por deadline
  let deadlineMultiplier = 1;
  if (deadline === 'urgente') deadlineMultiplier = 1.3;
  if (deadline === 'flexible') deadlineMultiplier = 0.9;

  baseHours *= deadlineMultiplier;

  // Si incluye diseño UI/UX, agregar 30% más
  if (includesDesign) {
    baseHours *= 1.3;
  }

  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * hourlyRate * 0.9);
  const maxPrice = Math.round(totalHours * hourlyRate * 1.1);

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Adelanto', percentage: 30, amount: Math.round(minPrice * 0.3) },
      { name: 'Desarrollo', percentage: 40, amount: Math.round(minPrice * 0.4) },
      { name: 'Entrega', percentage: 30, amount: Math.round(minPrice * 0.3) },
    ],
    explanation: `Estimación para ${projectType} con ${pages} páginas, complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}, deadline ${deadline}${includesDesign ? ' incluyendo diseño UI/UX' : ''}.`,
  };
}

export function estimateBackendHours(params: BackendEstimateParams): EstimateResult {
  const { type, endpoints, integrations, complexity, hourlyRate = 55 } = params;

  let baseHours = 0;

  // Horas base por tipo
  switch (type.toLowerCase()) {
    case 'rest':
      baseHours = 40;
      break;
    case 'graphql':
      baseHours = 60;
      break;
    case 'microservicios':
      baseHours = 100;
      break;
    default:
      baseHours = 50;
  }

  // Horas por endpoint
  baseHours += endpoints * 4;

  // Horas por integraciones
  baseHours += integrations.length * 15;

  // Multiplicador de complejidad
  baseHours *= complexity;

  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * hourlyRate * 0.9);
  const maxPrice = Math.round(totalHours * hourlyRate * 1.1);

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Arquitectura', percentage: 20, amount: Math.round(minPrice * 0.2) },
      { name: 'Desarrollo', percentage: 50, amount: Math.round(minPrice * 0.5) },
      { name: 'Testing y Deploy', percentage: 30, amount: Math.round(minPrice * 0.3) },
    ],
    explanation: `API ${type} con ${endpoints} endpoints, ${integrations.length} integraciones externas, complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}.`,
  };
}

export function estimateAiProjectHours(params: AiEstimateParams): EstimateResult {
  const { implementationType, users, needsTraining, hourlyRate = 70 } = params;

  let baseHours = 0;

  // Horas base por tipo de implementación
  switch (implementationType.toLowerCase()) {
    case 'chatbot-faq':
      baseHours = 30;
      break;
    case 'asistente-web':
      baseHours = 60;
      break;
    case 'api-ia':
      baseHours = 80;
      break;
    case 'modelo-custom':
      baseHours = 150;
      break;
    default:
      baseHours = 50;
  }

  // Ajustar por volumen de usuarios
  if (users > 1000) baseHours *= 1.3;
  if (users > 10000) baseHours *= 1.5;

  // Si necesita entrenamiento
  if (needsTraining) {
    baseHours *= 1.5;
  }

  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * hourlyRate * 0.9);
  const maxPrice = Math.round(totalHours * hourlyRate * 1.2);

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Investigación', percentage: 25, amount: Math.round(minPrice * 0.25) },
      { name: 'Implementación', percentage: 50, amount: Math.round(minPrice * 0.5) },
      { name: 'Testing y Ajustes', percentage: 25, amount: Math.round(minPrice * 0.25) },
    ],
    explanation: `Proyecto de IA tipo ${implementationType}, ${users} usuarios estimados${needsTraining ? ', con entrenamiento de datos propios' : ''}.`,
  };
}
