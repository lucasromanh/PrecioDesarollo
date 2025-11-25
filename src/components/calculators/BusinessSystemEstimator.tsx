import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calculator, Building2 } from 'lucide-react';
import { estimateBusinessSystem, type BusinessSystemParams, type EstimateResult } from '@/lib/calculators';
import { BudgetGenerator } from '@/components/budget/BudgetGenerator';

export function BusinessSystemEstimator() {
  const [systemType, setSystemType] = useState<string>('inventory');
  const [users, setUsers] = useState(20);
  const [selectedModules, setSelectedModules] = useState<string[]>(['gestion-productos', 'reportes', 'usuarios']);
  const [complexity, setComplexity] = useState<1 | 2 | 3>(2);
  const [needsReports, setNeedsReports] = useState(true);
  const [needsMobile, setNeedsMobile] = useState(false);
  const [needsAPI, setNeedsAPI] = useState(false);
  const [needsGeolocation, setNeedsGeolocation] = useState(false);
  const [databaseHosting, setDatabaseHosting] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'ARS'>('ARS');
  const [hourlyRate, setHourlyRate] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const modulesBySystem: Record<string, string[]> = {
    'inventory': ['Gestión de Productos', 'Control de Stock', 'Alertas', 'Proveedores', 'Reportes', 'Trazabilidad'],
    'crm': ['Gestión de Clientes', 'Ventas', 'Tareas', 'Calendario', 'Email Marketing', 'Pipeline'],
    'real-estate': ['Catálogo de Propiedades', 'Geolocalización', 'Búsqueda Avanzada', 'Portal Clientes', 'Documentos', 'Visitas'],
    'pos': ['Caja', 'Productos', 'Clientes', 'Facturación', 'Reportes', 'Múltiples Cajas'],
    'erp': ['Contabilidad', 'Ventas', 'Compras', 'Inventario', 'RRHH', 'Producción', 'Finanzas']
  };

  const handleModuleToggle = (module: string) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleCalculate = () => {
    const params: BusinessSystemParams = {
      systemType,
      users,
      modules: selectedModules,
      complexity,
      needsReports,
      needsMobile,
      needsAPI,
      needsGeolocation: systemType === 'real-estate' ? needsGeolocation : false,
      databaseHosting,
      currency,
      hourlyRate
    };
    
    const estimate = estimateBusinessSystem(params);
    setResult(estimate);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="border-border/50 bg-card hover:bg-[#222630] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Estimador de Sistemas de Negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="systemType">Tipo de Sistema</Label>
              <Select 
                id="systemType" 
                value={systemType} 
                onChange={(e) => {
                  setSystemType(e.target.value);
                  setSelectedModules([]);
                  if (e.target.value === 'real-estate') {
                    setNeedsGeolocation(true);
                  }
                }}
              >
                <option value="inventory">Sistema de Inventario/Stock</option>
                <option value="crm">CRM (Customer Relationship Management)</option>
                <option value="real-estate">Sistema Inmobiliario (Bienes Raíces)</option>
                <option value="pos">Sistema POS (Punto de Venta)</option>
                <option value="erp">Sistema ERP Empresarial</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                {systemType === 'inventory' && 'Control completo de stock, productos y almacenes'}
                {systemType === 'crm' && 'Gestión de clientes, ventas y seguimiento comercial'}
                {systemType === 'real-estate' && 'Catálogo de propiedades con mapas y geolocalización'}
                {systemType === 'pos' && 'Sistema de punto de venta con facturación'}
                {systemType === 'erp' && 'Sistema integral de gestión empresarial'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="users">Número de Usuarios Concurrentes</Label>
              <Input
                id="users"
                type="number"
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                min={1}
              />
              <p className="text-xs text-muted-foreground">
                Usuarios que utilizarán el sistema simultáneamente
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Módulos del Sistema</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {modulesBySystem[systemType]?.map((module) => (
                  <div key={module} className="flex items-center space-x-2">
                    <Checkbox
                      id={module}
                      checked={selectedModules.includes(module)}
                      onCheckedChange={() => handleModuleToggle(module)}
                    />
                    <Label htmlFor={module} className="cursor-pointer text-sm">
                      {module}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selecciona los módulos que necesitas ({selectedModules.length} seleccionados)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complejidad del Sistema</Label>
              <Select id="complexity" value={complexity.toString()} onChange={(e) => setComplexity(Number(e.target.value) as 1 | 2 | 3)}>
                <option value="1">Básica (Funcionalidades estándar)</option>
                <option value="2">Media (Integraciones y reportes)</option>
                <option value="3">Alta (Procesos complejos y automatizaciones)</option>
              </Select>
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
              <Label>Funcionalidades Adicionales</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reports"
                    checked={needsReports}
                    onCheckedChange={(checked) => setNeedsReports(checked as boolean)}
                  />
                  <Label htmlFor="reports" className="cursor-pointer">
                    Sistema de Reportes Avanzados (PDF, Excel, gráficos)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile"
                    checked={needsMobile}
                    onCheckedChange={(checked) => setNeedsMobile(checked as boolean)}
                  />
                  <Label htmlFor="mobile" className="cursor-pointer">
                    App Móvil Complementaria (iOS/Android)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="api"
                    checked={needsAPI}
                    onCheckedChange={(checked) => setNeedsAPI(checked as boolean)}
                  />
                  <Label htmlFor="api" className="cursor-pointer">
                    API REST para Integraciones Externas
                  </Label>
                </div>

                {systemType === 'real-estate' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="geolocation"
                      checked={needsGeolocation}
                      onCheckedChange={(checked) => setNeedsGeolocation(checked as boolean)}
                    />
                    <Label htmlFor="geolocation" className="cursor-pointer">
                      Geolocalización y Mapas Interactivos
                    </Label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dbHosting"
                    checked={databaseHosting}
                    onCheckedChange={(checked) => setDatabaseHosting(checked as boolean)}
                  />
                  <Label htmlFor="dbHosting" className="cursor-pointer">
                    Incluir Alojamiento de Base de Datos (Recomendado)
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hourlyRate">Tarifa por Hora Personalizada (Opcional)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate || ''}
                onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : undefined)}
                placeholder={`Dejar vacío para usar tarifa de mercado`}
              />
              <p className="text-xs text-muted-foreground">
                Si tienes una tarifa específica, ingrésala aquí. Sino, usaremos la tarifa promedio del mercado argentino.
              </p>
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
