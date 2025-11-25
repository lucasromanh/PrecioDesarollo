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
  // Información detallada para el presupuesto
  role?: string;
  seniority?: string;
  country?: string;
  monthlyExpenses?: number;
  workingHours?: number;
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
  platform: 'ios' | 'android' | 'both';
  screens: number;
  complexity: 1 | 2 | 3;
  needsBackend: boolean;
  needsAuth: boolean;
  needsPayments: boolean;
  needsPushNotifications: boolean;
  needsDesign: boolean;
  currency?: string;
  hourlyRate?: number;
}

export interface DesktopAppEstimateParams {
  platform: string; // 'windows' | 'mac' | 'linux' | 'cross-platform'
  appType: string; // 'simple' | 'standard' | 'complex'
  needsDatabase: boolean;
  databaseHosting?: boolean; // Alojamiento de base de datos
  needsInstaller: boolean;
  currency?: string;
}

export interface BusinessSystemParams {
  systemType: string; // 'inventory' | 'crm' | 'real-estate' | 'pos' | 'erp'
  users: number;
  modules: string[]; // Módulos específicos del sistema
  complexity: 1 | 2 | 3;
  needsReports: boolean;
  needsMobile: boolean;
  needsAPI: boolean;
  needsGeolocation?: boolean; // Para bienes raíces
  databaseHosting: boolean;
  currency?: string;
  hourlyRate?: number;
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

export interface GameProjectParams {
  platform: 'web-pwa' | 'mobile' | 'desktop' | 'console';
  gameType: 'casual' | 'arcade' | 'puzzle' | 'adventure' | 'multiplayer';
  complexity: 1 | 2 | 3;
  mobileTarget?: 'ios' | 'android' | 'both';
  needsMultiplayer: boolean;
  needsBackend: boolean;
  needsIAP: boolean; // In-App Purchases
  needsAds: boolean;
  needsLeaderboards: boolean;
  needs3D: boolean;
  currency?: string;
  hourlyRate?: number;
}

export interface EstimateResult {
  hours: number;
  minPrice: number;
  maxPrice: number;
  projectType?: string; // Identificador del tipo de proyecto
  projectDetails?: string; // Detalles específicos (plataforma, tipo, etc.)
  milestones: {
    name: string;
    percentage: number;
    amount: number;
    description?: string;
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
    // Información adicional para el presupuesto
    role,
    seniority,
    country,
    monthlyExpenses: Math.round(monthlyExpenses * rate),
    workingHours: billableHours,
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
      description: 'Registro anual (renovación anual a cargo del cliente)'
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
      description: 'Pago mensual recurrente (a cargo del cliente)'
    });
  }
  
  if (needsDatabase) {
    additionalCosts.push({
      item: 'Base de Datos',
      monthlyCost: Math.round(10 * rate),
      description: 'Servicio mensual gestionado (a cargo del cliente)'
    });
  }

  const projectTypeText = projectType === 'landing' ? 'Landing Page' :
                          projectType === 'corporate' ? 'Sitio Corporativo' :
                          projectType === 'ecommerce' ? 'E-commerce' :
                          projectType === 'blog' ? 'Blog' : 'Aplicación Web';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'web',
    projectDetails: projectTypeText,
    milestones: [
      { 
        name: 'Fase 1: Planificación y Diseño', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: 'Wireframes, diseño UI/UX, arquitectura del sitio, prototipo inicial'
      },
      { 
        name: 'Fase 2: Desarrollo Frontend', 
        percentage: 40, 
        amount: Math.round(minPrice * 0.4),
        description: 'Maquetación HTML/CSS, implementación de componentes, responsive design, integraciones'
      },
      { 
        name: 'Fase 3: Testing y Despliegue', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: 'Pruebas de funcionalidad, optimización, configuración de hosting, lanzamiento'
      },
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
      description: 'Pago mensual del servicio gestionado (a cargo del cliente)'
    });
  }
  
  if (needsAuth) {
    additionalCosts.push({
      item: 'Servicio de Autenticación',
      monthlyCost: Math.round(10 * rate),
      description: 'Costo mensual (a cargo del cliente) - Auth0/Firebase hasta 7K usuarios'
    });
  }
  
  if (needsFileStorage) {
    additionalCosts.push({
      item: 'Almacenamiento de Archivos',
      monthlyCost: Math.round(15 * rate),
      description: 'Pago mensual (a cargo del cliente) - S3/Cloud Storage ~50GB'
    });
  }

  const typeText = type === 'rest' || type === 'api-rest' ? 'API REST' :
                   type === 'graphql' ? 'GraphQL' :
                   type === 'microservicios' ? 'Microservicios' :
                   type === 'script-python' ? 'Script Python / Automatización' :
                   type === 'websocket' ? 'WebSocket' : 'Script/Automatización';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'backend',
    projectDetails: typeText,
    milestones: [
      { 
        name: 'Fase 1: Arquitectura y Diseño', 
        percentage: 20, 
        amount: Math.round(minPrice * 0.2),
        description: 'Diseño de base de datos, arquitectura del sistema, documentación de API, elección de tecnologías'
      },
      { 
        name: 'Fase 2: Desarrollo de Endpoints', 
        percentage: 50, 
        amount: Math.round(minPrice * 0.5),
        description: `Implementación de ${endpoints} endpoints, integración con servicios externos, autenticación, validación de datos`
      },
      { 
        name: 'Fase 3: Testing y Despliegue', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: 'Pruebas unitarias e integración, documentación final, configuración de servidor, CI/CD'
      },
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
      description: `~${(monthlyTokens / 1000).toLocaleString()}K tokens/mes - Costo mensual a cargo del cliente`
    });
  }
  
  // Hosting para el modelo
  if (aiProvider === 'local') {
    additionalCosts.push({
      item: 'Servidor GPU',
      monthlyCost: Math.round(150 * rate),
      description: 'Pago mensual VPS con GPU (a cargo del cliente)'
    });
  } else {
    additionalCosts.push({
      item: 'Hosting Backend',
      monthlyCost: Math.round(20 * rate),
      description: 'Pago mensual del servidor (a cargo del cliente)'
    });
  }

  const implementationText = implementationType === 'chatbot-faq' ? 'Chatbot Básico (FAQ)' :
                             implementationType === 'asistente-web' ? 'Asistente Integrado a Web' :
                             implementationType === 'api-ia' ? 'Integración con API de IA' :
                             'Modelo Custom con Fine-tuning';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'ai',
    projectDetails: implementationText,
    milestones: [
      { 
        name: 'Fase 1: Investigación y Configuración', 
        percentage: 25, 
        amount: Math.round(minPrice * 0.25),
        description: 'Análisis de requisitos, selección de modelo IA, configuración de APIs, preparación de datasets'
      },
      { 
        name: 'Fase 2: Desarrollo e Integración', 
        percentage: 50, 
        amount: Math.round(minPrice * 0.5),
        description: `Implementación del chatbot/IA, integración con ${aiProvider}, entrenamiento del modelo, desarrollo de interfaz`
      },
      { 
        name: 'Fase 3: Testing y Optimización', 
        percentage: 25, 
        amount: Math.round(minPrice * 0.25),
        description: 'Pruebas de precisión, ajuste de prompts, optimización de respuestas, documentación'
      },
    ],
    additionalCosts,
    explanation: `Proyecto de IA tipo ${implementationType}, ${users} usuarios estimados${needsTraining ? ', con entrenamiento de datos propios' : ''}. Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateMobileApp(params: MobileAppEstimateParams): EstimateResult {
  const {
    platform,
    screens,
    complexity,
    needsBackend,
    needsAuth,
    needsPayments,
    needsPushNotifications,
    needsDesign,
    currency = 'USD',
    hourlyRate
  } = params;

  // Calcular tarifa (apps móviles 20% más caras)
  const calculatedRate = hourlyRate || Math.round(getDefaultHourlyRate(currency) * 1.2);
  const rate = currencyRates[currency] || 1;

  // Horas base por pantalla
  const hoursPerScreen = complexity * 4; // 4-12 horas por pantalla según complejidad
  let baseHours = screens * hoursPerScreen;
  
  // Setup inicial del proyecto
  baseHours += 20;
  
  // Multiplicador por plataforma
  if (platform === 'both') {
    baseHours *= 1.6; // React Native/Flutter reduce duplicación
  }
  
  // Funcionalidades adicionales
  if (needsBackend) {
    baseHours += 40; // API, base de datos
  }
  
  if (needsAuth) {
    baseHours += 20; // Sistema de login/registro
  }
  
  if (needsPayments) {
    baseHours += 30; // Integración de pagos
  }
  
  if (needsPushNotifications) {
    baseHours += 15; // Firebase/OneSignal
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
      description: 'Suscripción anual (renovación a cargo del cliente)'
    });
  }
  
  if (platform === 'android' || platform === 'both') {
    additionalCosts.push({
      item: 'Google Play Console',
      oneTimeCost: Math.round(25 * rate),
      description: 'Pago único (a cargo del cliente)'
    });
  }
  
  if (needsBackend) {
    additionalCosts.push({
      item: 'Backend & Base de Datos',
      monthlyCost: Math.round(30 * rate),
      description: 'Pago mensual del servidor + BD (a cargo del cliente)'
    });
  }

  const platformText = platform === 'both' ? 'Multiplataforma (React Native/Flutter)' : 
                       platform === 'ios' ? 'iOS (Swift/SwiftUI)' : 'Android (Kotlin)';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'mobile',
    projectDetails: platformText,
    milestones: [
      { 
        name: 'Fase 1: Diseño y Prototipo', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: `Diseño UI/UX de ${screens} pantallas, arquitectura de la app, flujo de navegación, wireframes`
      },
      { 
        name: 'Fase 2: Desarrollo MVP', 
        percentage: 40, 
        amount: Math.round(minPrice * 0.4),
        description: `Implementación de funcionalidades core, integración de servicios${needsAuth ? ', sistema de autenticación' : ''}${needsPayments ? ', pasarela de pagos' : ''}, testing interno`
      },
      { 
        name: 'Fase 3: Finalización y Publicación', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: 'Pulido final, optimización de rendimiento, pruebas en dispositivos reales, publicación en stores'
      },
    ],
    additionalCosts,
    explanation: `App móvil con ${screens} pantallas para ${platform === 'both' ? 'iOS y Android' : platform.toUpperCase()}, complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}${needsBackend ? ', con backend' : ''}${needsAuth ? ', con autenticación' : ''}. Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateDesktopApp(params: DesktopAppEstimateParams): EstimateResult {
  const {
    platform, appType, needsDatabase, databaseHosting = false, needsInstaller,
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

  const additionalCosts: { item: string; monthlyCost?: number; oneTimeCost?: number; description: string }[] = [];
  
  // Alojamiento de base de datos si lo necesita
  if (needsDatabase && databaseHosting) {
    additionalCosts.push({
      item: 'Alojamiento de Base de Datos',
      monthlyCost: Math.round(50 * rate),
      description: 'Servidor de base de datos remoto con backups automáticos'
    });
  }
  
  if (platform === 'mac' || platform === 'cross-platform') {
    additionalCosts.push({
      item: 'Apple Developer (Mac)',
      oneTimeCost: Math.round(99 * rate),
      description: 'Suscripción anual para firmar apps (a cargo del cliente)'
    });
  }
  
  if (platform === 'windows') {
    additionalCosts.push({
      item: 'Certificado Code Signing',
      oneTimeCost: Math.round(200 * rate),
      description: 'Pago anual para firmar ejecutables (a cargo del cliente)'
    });
  }

  const platformText = platform === 'windows' ? 'Windows' :
                       platform === 'mac' ? 'macOS' :
                       platform === 'linux' ? 'Linux' : 'Multiplataforma';
  const appTypeText = appType === 'simple' ? 'Aplicación Simple' :
                      appType === 'standard' ? 'Aplicación Estándar' : 'Aplicación Compleja';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'desktop',
    projectDetails: `${appTypeText} - ${platformText}`,
    milestones: [
      { 
        name: 'Fase 1: Diseño y Arquitectura', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: `Diseño de interfaz nativa, arquitectura para ${platform}, configuración de entorno de desarrollo`
      },
      { 
        name: 'Fase 2: Desarrollo de Funcionalidades', 
        percentage: 50, 
        amount: Math.round(minPrice * 0.5),
        description: `Implementación de ${appType}${needsDatabase ? ', integración con base de datos' : ''}, manejo de archivos, UI/UX nativa`
      },
      { 
        name: 'Fase 3: Testing y Empaquetado', 
        percentage: 20, 
        amount: Math.round(minPrice * 0.2),
        description: `Pruebas en diferentes versiones del SO, creación de instalador${needsInstaller ? '' : ' (si aplica)'}, firma de aplicación`
      },
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
      description: 'Pago mensual VPS (a cargo del cliente)'
    });
  }
  
  if (needsDatabase) {
    additionalCosts.push({
      item: 'Base de Datos',
      monthlyCost: Math.round(10 * rate),
      description: 'Pago mensual servicio gestionado (a cargo del cliente)'
    });
  }

  const scriptTypeText = scriptType === 'web-scraping' ? 'Web Scraping' :
                         scriptType === 'data-processing' ? 'Procesamiento de Datos' :
                         scriptType === 'api-integration' ? 'Integración con APIs' : 'Automatización de Tareas';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'automation',
    projectDetails: scriptTypeText,
    milestones: [
      { 
        name: 'Fase 1: Desarrollo e Implementación', 
        percentage: 60, 
        amount: Math.round(minPrice * 0.6),
        description: `Desarrollo del script de ${scriptType}${needsDatabase ? ', integración con base de datos' : ''}${needsScheduling ? ', configuración de tareas programadas' : ''}, logging y manejo de errores`
      },
      { 
        name: 'Fase 2: Testing y Despliegue', 
        percentage: 40, 
        amount: Math.round(minPrice * 0.4),
        description: `Pruebas exhaustivas, documentación de uso${needsNotifications ? ', configuración de notificaciones' : ''}, deployment en servidor`
      },
    ],
    additionalCosts,
    explanation: `Script de ${scriptType} con complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}. Tarifa: ${currency} ${Math.round(calculatedRate).toLocaleString()}/hora.`,
  };
}

export function estimateGameProject(params: GameProjectParams): EstimateResult {
  const {
    platform,
    gameType,
    complexity,
    mobileTarget,
    needsMultiplayer,
    needsBackend,
    needsIAP,
    needsAds,
    needsLeaderboards,
    needs3D,
    currency = 'USD',
    hourlyRate
  } = params;

  // Calcular tarifa (desarrollo de juegos es 30% más caro que desarrollo web)
  const calculatedRate = hourlyRate || Math.round(getDefaultHourlyRate(currency) * 1.3);
  const rate = currencyRates[currency] || 1;

  let baseHours = 0;

  // Horas base por tipo de juego
  const gameTypeHours: Record<string, number> = {
    casual: 80,      // Juego simple, mecánicas básicas
    arcade: 120,     // Acción rápida, sistema de puntuación
    puzzle: 100,     // Lógica de rompecabezas
    adventure: 200,  // Historia, niveles complejos
    multiplayer: 250 // Sincronización, matchmaking
  };

  baseHours = gameTypeHours[gameType] || 100;

  // Ajustar por plataforma
  const platformMultiplier: Record<string, number> = {
    'web-pwa': 0.8,    // Más rápido, HTML5/WebGL
    'mobile': 1.2,      // SDK móvil, optimización
    'desktop': 1.0,     // Standard
    'console': 1.8      // Certificación, requisitos estrictos
  };

  baseHours *= platformMultiplier[platform] || 1;

  // Ajustar por complejidad
  baseHours *= complexity;

  // Gráficos 3D
  if (needs3D) {
    baseHours *= 1.5; // Modelado, texturas, iluminación
  }

  // Multijugador
  if (needsMultiplayer) {
    baseHours += 80; // Servidor, sincronización, lobby
  }

  // Backend
  if (needsBackend) {
    baseHours += 40; // Sistema de cuentas, guardar progreso
  }

  // Monetización
  if (needsIAP) {
    baseHours += 30; // Integración de compras
  }

  if (needsAds) {
    baseHours += 15; // Integración de anuncios
  }

  if (needsLeaderboards) {
    baseHours += 20; // Sistema de rankings
  }

  const totalHours = Math.round(baseHours);
  const minPrice = Math.round(totalHours * calculatedRate * 0.9);
  const maxPrice = Math.round(totalHours * calculatedRate * 1.2);

  // Costos adicionales
  const additionalCosts = [];

  // Costos de publicación móvil
  if (platform === 'mobile' && mobileTarget) {
    if (mobileTarget === 'ios' || mobileTarget === 'both') {
      additionalCosts.push({
        item: 'Apple Developer Program',
        oneTimeCost: Math.round(99 * rate),
        description: 'Suscripción anual (renovación a cargo del cliente)'
      });
    }

    if (mobileTarget === 'android' || mobileTarget === 'both') {
      additionalCosts.push({
        item: 'Google Play Console',
        oneTimeCost: Math.round(25 * rate),
        description: 'Pago único (a cargo del cliente)'
      });
    }
  }

  // Hosting para juegos web/PWA
  if (platform === 'web-pwa') {
    additionalCosts.push({
      item: 'Hosting para Juego Web',
      monthlyCost: Math.round(10 * rate),
      description: 'Pago mensual CDN + storage (a cargo del cliente)'
    });
  }

  // Backend para multijugador o guardado online
  if (needsBackend || needsMultiplayer) {
    const serverCost = needsMultiplayer ? 50 : 20;
    additionalCosts.push({
      item: needsMultiplayer ? 'Servidor Multijugador' : 'Backend para Guardado',
      monthlyCost: Math.round(serverCost * rate),
      description: `Pago mensual ${needsMultiplayer ? 'con escalabilidad para jugadores' : 'para datos de usuario'} (a cargo del cliente)`
    });
  }

  // Base de datos para leaderboards
  if (needsLeaderboards || needsBackend) {
    additionalCosts.push({
      item: 'Base de Datos',
      monthlyCost: Math.round(15 * rate),
      description: 'Pago mensual para rankings y datos (a cargo del cliente)'
    });
  }

  // Licencias de engine (si aplica)
  if (platform === 'console' || needs3D) {
    additionalCosts.push({
      item: 'Licencia de Game Engine',
      monthlyCost: Math.round(40 * rate),
      description: 'Unity Pro o Unreal (según revenue) - Pago mensual a cargo del cliente'
    });
  }

  const platformName = platform === 'web-pwa' ? 'Web/PWA' : 
                       platform === 'mobile' ? 'Móvil' : 
                       platform === 'desktop' ? 'Desktop' : 'Consola';

  const platformDetails = platform === 'web-pwa' ? 'Web/PWA' :
                          platform === 'mobile' ? `Móvil (${mobileTarget === 'both' ? 'iOS y Android' : mobileTarget?.toUpperCase() || 'Móvil'})` :
                          platform === 'desktop' ? 'Desktop' : 'Consola';
  const gameTypeText = gameType === 'casual' ? 'Casual' :
                       gameType === 'arcade' ? 'Arcade' :
                       gameType === 'puzzle' ? 'Puzzle' :
                       gameType === 'adventure' ? 'Aventura' : 'Multijugador';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'game',
    projectDetails: `${gameTypeText} - ${platformDetails}`,
    milestones: [
      { 
        name: 'Fase 1: Prototipo y GDD', 
        percentage: 20, 
        amount: Math.round(minPrice * 0.2),
        description: `Game Design Document, prototipo jugable, mecánicas core, diseño de niveles${needs3D ? ', modelado 3D básico' : ''}`
      },
      { 
        name: 'Fase 2: Desarrollo Principal', 
        percentage: 50, 
        amount: Math.round(minPrice * 0.5),
        description: `Implementación completa del gameplay, ${needs3D ? 'gráficos y animaciones 3D' : 'sprites y animaciones 2D'}${needsMultiplayer ? ', sistema multijugador' : ''}${needsIAP ? ', tienda in-app' : ''}`
      },
      { 
        name: 'Fase 3: Testing y Publicación', 
        percentage: 30, 
        amount: Math.round(minPrice * 0.3),
        description: `Balanceo del juego, optimización de rendimiento, corrección de bugs${needsLeaderboards ? ', integración de leaderboards' : ''}, publicación`
      },
    ],
    additionalCosts,
    explanation: `Videojuego ${gameType} para ${platformName} con ${needs3D ? 'gráficos 3D' : 'gráficos 2D'} y complejidad ${complexity === 1 ? 'baja' : complexity === 2 ? 'media' : 'alta'}. ${needsMultiplayer ? 'Incluye multijugador online. ' : ''}Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}

export function estimateBusinessSystem(params: BusinessSystemParams): EstimateResult {
  const {
    systemType,
    users,
    modules,
    complexity,
    needsReports,
    needsMobile,
    needsAPI,
    needsGeolocation = false,
    databaseHosting,
    currency = 'USD',
    hourlyRate
  } = params;

  const calculatedRate = hourlyRate || getDefaultHourlyRate(currency);
  const rate = currencyRates[currency] || 1;

  let baseHours = 0;

  // Horas base según tipo de sistema
  switch (systemType) {
    case 'inventory':
      baseHours = 120; // Sistema de inventario/stock
      break;
    case 'crm':
      baseHours = 150; // CRM
      break;
    case 'real-estate':
      baseHours = 180; // Sistema inmobiliario
      break;
    case 'pos':
      baseHours = 100; // Punto de venta
      break;
    case 'erp':
      baseHours = 300; // ERP completo
      break;
    default:
      baseHours = 120;
  }

  // Ajustar por cantidad de usuarios
  if (users > 50) baseHours += 30;
  if (users > 100) baseHours += 40;

  // Ajustar por módulos adicionales (cada módulo extra)
  const extraModules = Math.max(0, modules.length - 3);
  baseHours += extraModules * 20;

  // Ajustar por complejidad
  const complexityMultiplier = complexity === 1 ? 0.8 : complexity === 2 ? 1 : 1.4;
  baseHours = Math.round(baseHours * complexityMultiplier);

  // Funcionalidades adicionales
  if (needsReports) baseHours += 25; // Sistema de reportes avanzado
  if (needsMobile) baseHours += 60; // App móvil complementaria
  if (needsAPI) baseHours += 30; // API REST para integraciones
  if (needsGeolocation) baseHours += 40; // Geolocalización y mapas

  const totalHours = baseHours;
  const minPrice = Math.round(totalHours * calculatedRate * rate * 0.85);
  const maxPrice = Math.round(totalHours * calculatedRate * rate * 1.15);

  // Costos adicionales
  const additionalCosts: { item: string; monthlyCost?: number; oneTimeCost?: number; description: string }[] = [];

  // Hosting de base de datos (obligatorio para estos sistemas)
  if (databaseHosting) {
    let dbCost = 0;
    if (users <= 20) {
      dbCost = 30; // DB pequeña
    } else if (users <= 100) {
      dbCost = 80; // DB media
    } else {
      dbCost = 150; // DB grande
    }
    additionalCosts.push({
      item: 'Alojamiento de Base de Datos',
      description: `Servidor de base de datos dedicado para ${users} usuarios concurrentes`,
      monthlyCost: Math.round(dbCost * rate),
      oneTimeCost: 0,
    });
  }

  // Hosting de aplicación web
  const hostingCost = users > 50 ? 50 : 25;
  additionalCosts.push({
    item: 'Hosting Web Profesional',
    description: `Servidor web con SSL, backups automáticos y soporte para ${users} usuarios`,
    monthlyCost: Math.round(hostingCost * rate),
    oneTimeCost: 0,
  });

  // Dominio personalizado
  additionalCosts.push({
    item: 'Dominio .com Profesional',
    description: 'Registro de dominio por 1 año',
    monthlyCost: 0,
    oneTimeCost: Math.round(15 * rate),
  });

  // SSL Certificado
  additionalCosts.push({
    item: 'Certificado SSL',
    description: 'Certificado SSL para seguridad HTTPS',
    monthlyCost: 0,
    oneTimeCost: Math.round(50 * rate),
  });

  // Servicios de mapas si tiene geolocalización
  if (needsGeolocation) {
    additionalCosts.push({
      item: 'API de Mapas (Google Maps)',
      description: 'Créditos para geolocalización y visualización de mapas',
      monthlyCost: Math.round(50 * rate),
      oneTimeCost: 0,
    });
  }

  // Nombres de tipos de sistema
  const systemNames: Record<string, string> = {
    'inventory': 'Sistema de Inventario/Stock',
    'crm': 'Sistema CRM',
    'real-estate': 'Sistema Inmobiliario',
    'pos': 'Sistema Punto de Venta (POS)',
    'erp': 'Sistema ERP Empresarial'
  };

  const systemName = systemNames[systemType] || 'Sistema de Gestión';
  
  // Detalles del proyecto
  let projectDetails = `${systemName} - ${users} usuarios`;
  if (needsMobile) projectDetails += ', App Móvil';
  if (needsGeolocation) projectDetails += ', Geolocalización';
  if (needsAPI) projectDetails += ', API REST';

  return {
    hours: totalHours,
    minPrice,
    maxPrice,
    projectType: 'business-system',
    projectDetails,
    milestones: [
      {
        name: 'Fase 1: Análisis y Diseño',
        percentage: 20,
        amount: Math.round(minPrice * 0.2),
        description: `Análisis de requerimientos, diseño de base de datos, arquitectura del sistema, wireframes de interfaces${needsGeolocation ? ', integración de mapas' : ''}`
      },
      {
        name: 'Fase 2: Desarrollo del Core',
        percentage: 50,
        amount: Math.round(minPrice * 0.5),
        description: `Implementación de módulos principales (${modules.slice(0, 3).join(', ')}), gestión de usuarios y permisos${needsAPI ? ', desarrollo de API REST' : ''}${needsReports ? ', sistema de reportes' : ''}`
      },
      {
        name: 'Fase 3: Testing y Deploy',
        percentage: 30,
        amount: Math.round(minPrice * 0.3),
        description: `Testing completo del sistema, optimización de rendimiento${needsMobile ? ', desarrollo de app móvil' : ''}, capacitación, documentación y despliegue en producción`
      },
    ],
    additionalCosts,
    explanation: `${systemName} para ${users} usuarios con ${modules.length} módulos y complejidad ${complexity === 1 ? 'básica' : complexity === 2 ? 'media' : 'alta'}. ${needsGeolocation ? 'Incluye geolocalización. ' : ''}Tarifa: ${currency} ${calculatedRate.toLocaleString()}/hora.`,
  };
}
