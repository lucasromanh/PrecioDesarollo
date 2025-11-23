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
  needsDomain: boolean;
  needsHosting: boolean;
  needsDatabase: boolean;
  hostingType?: string; // 'shared' | 'vps' | 'cloud'
  currency?: string;
  hourlyRate?: number;
}

export interface MobileAppEstimateParams {
  platform: string; // 'ios' | 'android' | 'both'
  appType: string; // 'simple' | 'standard' | 'complex'
  features: string[];
  needsBackend: boolean;
  needsDesign: boolean;
  currency?: string;
}

export interface DesktopAppEstimateParams {
  platform: string; // 'windows' | 'mac' | 'linux' | 'cross-platform'
  appType: string; // 'simple' | 'standard' | 'complex'
  needsDatabase: boolean;
  needsInstaller: boolean;
  currency?: string;
}

export interface AutomationEstimateParams {
  scriptType: string; // 'web-scraping' | 'data-processing' | 'api-integration' | 'task-automation'
  complexity: number; // 1-3
  needsScheduling: boolean;
  needsDatabase: boolean;
  needsNotifications: boolean;
  currency?: string;
}

export interface BackendEstimateParams {
  type: string;
  endpoints: number;
  integrations: string[];
  complexity: number; // 1-3
  needsDatabase: boolean;
  databaseType?: string; // 'sql' | 'nosql' | 'both'
  needsAuth: boolean;
  needsFileStorage: boolean;
  currency?: string;
  hourlyRate?: number;
}

export interface AiEstimateParams {
  implementationType: string;
  users: number;
  needsTraining: boolean;
  monthlyTokens: number; // Tokens estimados por mes
  aiProvider: string; // 'openai' | 'anthropic' | 'local'
  currency?: string;
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
  additionalCosts: {
    item: string;
    monthlyCost?: number;
    oneTimeCost?: number;
    description: string;
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

// Tarifas base por país/región (USD/hora base para semi-senior)
const countryBaseRates: Record<string, number> = {
  argentina: 12,   // ~10k ARS/hora
  mexico: 15,
  colombia: 14,
  españa: 25,
  usa: 45,
  europa: 30,
  latam: 13,
};

// Convertir a otras monedas (simplificado)
const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  ARS: 850,
};

// Gastos mensuales estimados por país (en USD base, muy conservador)
const monthlyExpensesByCountry: Record<string, number> = {
  argentina: 300,  // ~255k ARS - gastos básicos freelancer Argentina
  mexico: 500,
  colombia: 400,
  españa: 1500,
  usa: 2500,
  europa: 1800,
  latam: 400,
};

// Ajuste de gastos por seniority
const expensesBySeniority: Record<string, number> = {
  junior: 0.6,      // -40% (vive con familia, menos gastos)
  semisenior: 1,    // Base
  senior: 1.8,      // +80% (familia, casa propia, etc.)
};

// Horas facturables por mes según seniority
const billableHoursBySeniority: Record<string, number> = {
  junior: 140,      // ~7h/día x 20 días
  semisenior: 160,  // ~8h/día x 20 días  
  senior: 160,      // ~8h/día x 20 días (misma capacidad pero cobra más)
};

// Función para calcular gastos mensuales según perfil
export function calculateMonthlyExpenses(
  country: string,
  seniority: string,
  currency: string
): number {
  const baseExpenses = monthlyExpensesByCountry[country.toLowerCase()] || 1000;
  const seniorityMult = expensesBySeniority[seniority.toLowerCase()] || 1;
  const expensesUSD = baseExpenses * seniorityMult;
  const rate = currencyRates[currency] || 1;
  return Math.round(expensesUSD * rate);
}

// Función para obtener horas facturables según seniority
export function getBillableHours(seniority: string): number {
  return billableHoursBySeniority[seniority.toLowerCase()] || 140;
}

// Función para calcular tarifa de mercado por defecto
export function getDefaultHourlyRate(currency: string = 'USD'): number {
  // Tarifa base para un desarrollador fullstack semi-senior en Latinoamérica
  const baseRate = 15; // USD/hora (~12,750 ARS/hora)
  const rate = currencyRates[currency] || 1;
  return Math.round(baseRate * rate);
}

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
  const { 
    projectType, pages, complexity, deadline, includesDesign,
    needsDomain, needsHosting, needsDatabase, hostingType = 'shared',
    currency = 'USD', hourlyRate 
  } = params;
  
  // Calcular tarifa por hora basada en el mercado si no se proporciona
  const calculatedRate = hourlyRate || getDefaultHourlyRate(currency);
  const rate = currencyRates[currency] || 1;

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
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.1);

  // Costos adicionales
  const additionalCosts = [];
  
  if (needsDomain) {
    additionalCosts.push({
      item: 'Dominio',
      oneTimeCost: Math.round(15 * rate),
      description: 'Registro anual de dominio .com'
    });
  }
  
  if (needsHosting) {
    const hostingCosts = {
      shared: 5,
      vps: 20,
      cloud: 50
    };
    additionalCosts.push({
      item: `Hosting ${hostingType}`,
      monthlyCost: Math.round((hostingCosts[hostingType as keyof typeof hostingCosts] || 5) * rate),
      description: 'Costo mensual de alojamiento web'
    });
  }
  
  if (needsDatabase) {
    additionalCosts.push({
      item: 'Base de Datos',
      monthlyCost: Math.round(10 * rate),
      description: 'Base de datos gestionada (ej: AWS RDS, MongoDB Atlas)'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Adelanto', percentage: 30, amount: Math.round(minPrice * 0.3) },
      { name: 'Desarrollo', percentage: 40, amount: Math.round(minPrice * 0.4) },
      { name: 'Entrega', percentage: 30, amount: Math.round(minPrice * 0.3) },
    ],
    additionalCosts,
    explanation: `Estimación para ${projectType} con ${pages} páginas, complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}, deadline ${deadline}${includesDesign ? ' incluyendo diseño UI/UX' : ''}. Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateBackendHours(params: BackendEstimateParams): EstimateResult {
  const { 
    type, endpoints, integrations, complexity,
    needsDatabase, databaseType = 'sql', needsAuth, needsFileStorage,
    currency = 'USD', hourlyRate 
  } = params;
  
  // Calcular tarifa por hora basada en el mercado (Backend es 10% más caro)
  const calculatedRate = hourlyRate || Math.round(getDefaultHourlyRate(currency) * 1.1);
  const rate = currencyRates[currency] || 1;

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
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.1);

  // Costos adicionales
  const additionalCosts = [];
  
  if (needsDatabase) {
    const dbCost = databaseType === 'nosql' ? 15 : databaseType === 'both' ? 25 : 10;
    additionalCosts.push({
      item: `Base de Datos ${databaseType.toUpperCase()}`,
      monthlyCost: Math.round(dbCost * rate),
      description: 'Servicio de base de datos gestionada'
    });
  }
  
  if (needsAuth) {
    additionalCosts.push({
      item: 'Servicio de Autenticación',
      monthlyCost: Math.round(10 * rate),
      description: 'Auth0, Firebase Auth o similar (hasta 7000 usuarios)'
    });
  }
  
  if (needsFileStorage) {
    additionalCosts.push({
      item: 'Almacenamiento de Archivos',
      monthlyCost: Math.round(15 * rate),
      description: 'AWS S3, Google Cloud Storage o similar (50GB)'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Arquitectura', percentage: 20, amount: Math.round(minPrice * 0.2) },
      { name: 'Desarrollo', percentage: 50, amount: Math.round(minPrice * 0.5) },
      { name: 'Testing y Deploy', percentage: 30, amount: Math.round(minPrice * 0.3) },
    ],
    additionalCosts,
    explanation: `Backend ${type} con ${endpoints} endpoints, ${integrations.length} integraciones y complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}. Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateAiProjectHours(params: AiEstimateParams): EstimateResult {
  const { 
    implementationType, users, needsTraining,
    monthlyTokens, aiProvider = 'openai',
    currency = 'USD', hourlyRate 
  } = params;
  
  // Calcular tarifa por hora basada en el mercado (IA es 40% más caro)
  const calculatedRate = hourlyRate || Math.round(getDefaultHourlyRate(currency) * 1.4);
  const rate = currencyRates[currency] || 1;

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
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.2);

  // Costos adicionales - Cálculo de tokens de IA
  const additionalCosts = [];
  
  // Costo de tokens según proveedor (precio por millón de tokens en USD)
  const tokenCosts = {
    openai: { input: 0.5, output: 1.5 }, // GPT-4o-mini
    anthropic: { input: 0.25, output: 1.25 }, // Claude Sonnet
    local: { input: 0, output: 0 }
  };
  
  const provider = aiProvider as keyof typeof tokenCosts;
  const tokensPerMonth = monthlyTokens / 1000000; // Convertir a millones
  const monthlyCost = tokensPerMonth * ((tokenCosts[provider]?.input + tokenCosts[provider]?.output) / 2);
  
  if (aiProvider !== 'local' && monthlyTokens > 0) {
    additionalCosts.push({
      item: `Tokens de IA (${aiProvider})`,
      monthlyCost: Math.round(monthlyCost * rate),
      description: `~${(monthlyTokens / 1000).toLocaleString()}K tokens/mes`
    });
  }
  
  // Hosting para el modelo
  if (aiProvider === 'local') {
    additionalCosts.push({
      item: 'Servidor GPU',
      monthlyCost: Math.round(150 * rate),
      description: 'VPS con GPU para modelo local'
    });
  } else {
    additionalCosts.push({
      item: 'Hosting Backend',
      monthlyCost: Math.round(20 * rate),
      description: 'Servidor para API y lógica de negocio'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Investigación', percentage: 25, amount: Math.round(minPrice * 0.25) },
      { name: 'Implementación', percentage: 50, amount: Math.round(minPrice * 0.5) },
      { name: 'Testing y Ajustes', percentage: 25, amount: Math.round(minPrice * 0.25) },
    ],
    additionalCosts,
    explanation: `Proyecto de IA tipo ${implementationType}, ${users} usuarios estimados${needsTraining ? ', con entrenamiento de datos propios' : ''}. Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateMobileApp(params: MobileAppEstimateParams): EstimateResult {
  const {
    platform, appType, features, needsBackend, needsDesign,
    currency = 'USD'
  } = params;

  const calculatedRate = getDefaultHourlyRate(currency) * 1.2; // Apps móviles 20% más caras
  const rate = currencyRates[currency] || 1;

  // Horas base por tipo
  const baseHoursByType = {
    simple: 80,
    standard: 160,
    complex: 300
  };
  
  let baseHours = baseHoursByType[appType as keyof typeof baseHoursByType] || 160;
  
  // Multiplicador por plataforma
  if (platform === 'both') {
    baseHours *= 1.7; // No es el doble porque hay código compartido
  }
  
  // Horas adicionales por features
  baseHours += features.length * 15;
  
  // Backend
  if (needsBackend) {
    baseHours *= 1.4;
  }
  
  // Diseño UI/UX
  if (needsDesign) {
    baseHours *= 1.3;
  }
  
  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.1);

  const additionalCosts = [];
  
  // Costos de publicación
  if (platform === 'ios' || platform === 'both') {
    additionalCosts.push({
      item: 'Apple Developer Program',
      oneTimeCost: Math.round(99 * rate),
      description: 'Cuenta anual para publicar en App Store'
    });
  }
  
  if (platform === 'android' || platform === 'both') {
    additionalCosts.push({
      item: 'Google Play Console',
      oneTimeCost: Math.round(25 * rate),
      description: 'Cuenta única para publicar en Play Store'
    });
  }
  
  if (needsBackend) {
    additionalCosts.push({
      item: 'Backend & Base de Datos',
      monthlyCost: Math.round(30 * rate),
      description: 'Servidor + BD para la app móvil'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Adelanto', percentage: 30, amount: Math.round(minPrice * 0.3) },
      { name: 'MVP/Beta', percentage: 40, amount: Math.round(minPrice * 0.4) },
      { name: 'Entrega Final', percentage: 30, amount: Math.round(minPrice * 0.3) },
    ],
    additionalCosts,
    explanation: `App móvil ${appType} para ${platform === 'both' ? 'iOS y Android' : platform}, ${features.length} features adicionales. Tarifa: ${currency} ${Math.round(calculatedRate).toLocaleString()}/hora.`,
  };
}

export function estimateDesktopApp(params: DesktopAppEstimateParams): EstimateResult {
  const {
    platform, appType, needsDatabase, needsInstaller,
    currency = 'USD'
  } = params;

  const calculatedRate = getDefaultHourlyRate(currency) * 1.15; // Desktop 15% más caro
  const rate = currencyRates[currency] || 1;

  const baseHoursByType = {
    simple: 60,
    standard: 120,
    complex: 240
  };
  
  let baseHours = baseHoursByType[appType as keyof typeof baseHoursByType] || 120;
  
  // Multiplicador por plataforma
  if (platform === 'cross-platform') {
    baseHours *= 1.1; // Electron, Tauri, etc.
  } else if (platform === 'mac') {
    baseHours *= 1.2; // Swift es más complejo
  }
  
  if (needsDatabase) {
    baseHours += 20;
  }
  
  if (needsInstaller) {
    baseHours += 10;
  }
  
  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.1);

  const additionalCosts = [];
  
  if (platform === 'mac' || platform === 'cross-platform') {
    additionalCosts.push({
      item: 'Apple Developer (Mac)',
      oneTimeCost: Math.round(99 * rate),
      description: 'Para firmar apps de macOS'
    });
  }
  
  if (platform === 'windows') {
    additionalCosts.push({
      item: 'Certificado Code Signing',
      oneTimeCost: Math.round(200 * rate),
      description: 'Para firmar ejecutables de Windows'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Adelanto', percentage: 30, amount: Math.round(minPrice * 0.3) },
      { name: 'Desarrollo', percentage: 50, amount: Math.round(minPrice * 0.5) },
      { name: 'Testing y Entrega', percentage: 20, amount: Math.round(minPrice * 0.2) },
    ],
    additionalCosts,
    explanation: `Aplicación de escritorio ${appType} para ${platform}. Tarifa: ${currency} ${Math.round(calculatedRate).toLocaleString()}/hora.`,
  };
}

export function estimateAutomation(params: AutomationEstimateParams): EstimateResult {
  const {
    scriptType, complexity, needsScheduling, needsDatabase, needsNotifications,
    currency = 'USD'
  } = params;

  const calculatedRate = getDefaultHourlyRate(currency) * 0.9; // Automatizaciones más económicas
  const rate = currencyRates[currency] || 1;

  const baseHoursByType = {
    'web-scraping': 15,
    'data-processing': 20,
    'api-integration': 25,
    'task-automation': 18
  };
  
  let baseHours = baseHoursByType[scriptType as keyof typeof baseHoursByType] || 20;
  
  baseHours *= complexity;
  
  if (needsScheduling) baseHours += 5;
  if (needsDatabase) baseHours += 10;
  if (needsNotifications) baseHours += 8;
  
  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.1);

  const additionalCosts = [];
  
  if (needsScheduling) {
    additionalCosts.push({
      item: 'Servidor para Cron Jobs',
      monthlyCost: Math.round(5 * rate),
      description: 'VPS básico para ejecutar tareas programadas'
    });
  }
  
  if (needsDatabase) {
    additionalCosts.push({
      item: 'Base de Datos',
      monthlyCost: Math.round(10 * rate),
      description: 'Para almacenar datos procesados'
    });
  }

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    milestones: [
      { name: 'Desarrollo', percentage: 60, amount: Math.round(minPrice * 0.6) },
      { name: 'Testing y Deploy', percentage: 40, amount: Math.round(minPrice * 0.4) },
    ],
    additionalCosts,
    explanation: `Script de ${scriptType} con complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}. Tarifa: ${currency} ${Math.round(calculatedRate).toLocaleString()}/hora.`,
  };
}
