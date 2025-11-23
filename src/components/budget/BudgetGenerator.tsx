import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Edit2, Check, X } from 'lucide-react';
import type { HourlyRateResult, EstimateResult } from '@/lib/calculators';

interface BudgetData {
  clientName: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  signature: string;
  date: string;
  items: Array<{
    service: string;
    description: string;
    price: number;
  }>;
  total: number;
}

interface BudgetGeneratorProps {
  result: HourlyRateResult | EstimateResult | null;
  type: 'hourly' | 'project';
}

export function BudgetGenerator({ result, type }: BudgetGeneratorProps) {
  const [showBudget, setShowBudget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    clientName: 'Nombre del Cliente',
    companyName: 'Tu Empresa',
    companyEmail: 'contacto@tuempresa.com',
    companyPhone: '+54 9 11 1234-5678',
    companyAddress: 'Dirección de tu empresa',
    signature: '',
    date: new Date().toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: [],
    total: 0
  });

  const generateBudgetItems = () => {
    if (!result) return;

    if (type === 'hourly' && 'minimumRate' in result) {
      const items = [
        {
          service: 'Servicios de Desarrollo de Software',
          description: `Tarifa por hora de desarrollo profesional`,
          price: result.recommendedMax
        }
      ];
      setBudgetData(prev => ({
        ...prev,
        items,
        total: result.recommendedMax
      }));
    } else if (type === 'project' && 'hours' in result) {
      // Determinar el tipo de servicio según la descripción
      let serviceName = 'Desarrollo de Proyecto Web';
      const explanation = result.explanation.toLowerCase();
      
      if (explanation.includes('backend') || explanation.includes('api')) {
        serviceName = 'Desarrollo de Backend API';
      } else if (explanation.includes('chatbot') || explanation.includes('ia') || explanation.includes('ai')) {
        serviceName = 'Desarrollo de Chatbot con IA';
      } else if (explanation.includes('landing') || explanation.includes('web')) {
        serviceName = 'Desarrollo de Sitio Web';
      }
      
      const items = [
        {
          service: serviceName,
          description: `${result.hours} horas de desarrollo estimadas`,
          price: result.minPrice
        }
      ];
      setBudgetData(prev => ({
        ...prev,
        items,
        total: result.minPrice
      }));
    }
  };

  const handleGenerateBudget = () => {
    generateBudgetItems();
    setShowBudget(true);
  };

  const handleUpdateField = (field: keyof BudgetData, value: string) => {
    setBudgetData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = budgetData.items.map(item => `
      <tr>
        <td>
          <div class="service-name">${item.service}</div>
          <div class="service-desc">${item.description}</div>
        </td>
        <td>$${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Presupuesto</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            @page {
              margin: 0;
              size: A4;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: white;
              color: #000;
              padding: 0;
              margin: 0;
            }
            @media print {
              @page {
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            .budget-container {
              width: 100%;
              min-height: 100vh;
              background: white;
              display: flex;
              flex-direction: column;
            }
            .budget-body {
              flex: 1;
            }
            .header {
              background: linear-gradient(135deg, #FF6A3D 0%, #E65A2F 100%);
              color: white;
              padding: 2.5rem 3rem;
            }
            .header h1 {
              font-size: 2rem;
              font-weight: bold;
              margin-top: 0.5rem;
            }
            .content {
              padding: 3rem;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
              margin-bottom: 2rem;
            }
            .info-section h3 {
              font-size: 0.875rem;
              color: #666;
              margin-bottom: 0.5rem;
              font-weight: 600;
            }
            .info-section p {
              font-size: 0.95rem;
              margin-bottom: 0.25rem;
            }
            .info-section .name {
              font-size: 1.125rem;
              font-weight: 600;
              color: #000;
            }
            .info-section .detail {
              font-size: 0.875rem;
              color: #666;
            }
            .info-right {
              text-align: right;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 2rem;
              border: 1px solid #e5e5e5;
            }
            thead {
              background: #f5f5f5;
            }
            th {
              text-align: left;
              padding: 0.75rem 1rem;
              font-weight: 600;
              border-bottom: 1px solid #e5e5e5;
            }
            th:last-child {
              text-align: right;
            }
            td {
              padding: 0.75rem 1rem;
              border-top: 1px solid #e5e5e5;
            }
            td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .service-name {
              font-weight: 500;
              margin-bottom: 0.25rem;
            }
            .service-desc {
              font-size: 0.875rem;
              color: #666;
            }
            tfoot {
              background: #fff5f0;
              border-top: 2px solid #FF6A3D;
            }
            tfoot td {
              font-weight: bold;
              font-size: 1.125rem;
              padding: 1rem;
            }
            tfoot td:last-child {
              color: #FF6A3D;
              font-size: 1.5rem;
            }
            .signature {
              border-top: 1px solid #e5e5e5;
              padding-top: 1.5rem;
              margin-bottom: 2rem;
            }
            .signature .name {
              font-weight: 600;
              font-size: 1.125rem;
            }
            .signature .company {
              font-size: 0.875rem;
              color: #666;
              margin-top: 0.25rem;
            }
            .footer {
              background: #f9f9f9;
              padding: 2rem 3rem;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 2rem;
            }
            .footer-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }
            .footer-icon {
              width: 32px;
              height: 32px;
              background: #fff5f0;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1rem;
            }
            .footer-info p:first-child {
              font-size: 0.75rem;
              color: #666;
            }
            .footer-info p:last-child {
              font-size: 0.875rem;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="budget-container">
            <div class="budget-body">
              <div class="header">
                <h1>📄 Presupuesto</h1>
              </div>
              
              <div class="content">
              <div class="info-grid">
                <div class="info-section">
                  <h3>Cliente:</h3>
                  <p class="name">${budgetData.clientName}</p>
                  <p class="detail">Fecha: ${budgetData.date}</p>
                </div>
                <div class="info-section info-right">
                  <h3>De:</h3>
                  <p class="name">${budgetData.companyName}</p>
                  <p class="detail">${budgetData.companyEmail}</p>
                  <p class="detail">${budgetData.companyPhone}</p>
                  <p class="detail">${budgetData.companyAddress}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>$${budgetData.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

                ${budgetData.signature ? `
                  <div class="signature">
                    <p class="name">${budgetData.signature}</p>
                    <p class="company">${budgetData.companyName}</p>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="footer">
              <div class="footer-item">
                <div class="footer-icon">📧</div>
                <div class="footer-info">
                  <p>Email</p>
                  <p>${budgetData.companyEmail}</p>
                </div>
              </div>
              <div class="footer-item">
                <div class="footer-icon">📞</div>
                <div class="footer-info">
                  <p>Teléfono</p>
                  <p>${budgetData.companyPhone}</p>
                </div>
              </div>
              <div class="footer-item">
                <div class="footer-icon">📍</div>
                <div class="footer-info">
                  <p>Ubicación</p>
                  <p>Argentina</p>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (!result) return null;

  return (
    <div className="space-y-6 mt-6">
      {!showBudget ? (
        <Button 
          onClick={handleGenerateBudget}
          className="w-full"
          size="lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Generar Presupuesto Profesional
        </Button>
      ) : (
        <>
          <div className="flex gap-3 print:hidden">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
              className="flex-1"
            >
              {isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar Datos
                </>
              )}
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button
              onClick={() => setShowBudget(false)}
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isEditing ? (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-xl">Editar Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="clientName">Nombre del Cliente</Label>
                    <Input
                      id="clientName"
                      value={budgetData.clientName}
                      onChange={(e) => handleUpdateField('clientName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Tu Empresa</Label>
                    <Input
                      id="companyName"
                      value={budgetData.companyName}
                      onChange={(e) => handleUpdateField('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={budgetData.companyEmail}
                      onChange={(e) => handleUpdateField('companyEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Teléfono</Label>
                    <Input
                      id="companyPhone"
                      value={budgetData.companyPhone}
                      onChange={(e) => handleUpdateField('companyPhone', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="companyAddress">Dirección</Label>
                    <Input
                      id="companyAddress"
                      value={budgetData.companyAddress}
                      onChange={(e) => handleUpdateField('companyAddress', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="signature">Firma (opcional)</Label>
                    <Input
                      id="signature"
                      placeholder="Ej: Juan Pérez - Director"
                      value={budgetData.signature}
                      onChange={(e) => handleUpdateField('signature', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div id="budget-preview">
            <BudgetPreview data={budgetData} />
          </div>
        </>
      )}
    </div>
  );
}

function BudgetPreview({ data }: { data: BudgetData }) {
  return (
    <Card className="border-2 border-primary/30 bg-card shadow-[0_8px_24px_var(--shadow)]">
      <CardContent className="p-0">
        {/* Header con diseño naranja */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-[#E65A2F] p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold">Presupuesto</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Información del cliente y empresa */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Cliente:</h3>
            <p className="text-lg font-semibold">{data.clientName}</p>
            <p className="text-sm text-muted-foreground mt-1">Fecha: {data.date}</p>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">De:</h3>
            <p className="text-lg font-semibold">{data.companyName}</p>
            <p className="text-sm text-muted-foreground mt-1">{data.companyEmail}</p>
            <p className="text-sm text-muted-foreground">{data.companyPhone}</p>
            <p className="text-sm text-muted-foreground">{data.companyAddress}</p>
          </div>
        </div>

        {/* Servicios */}
        <div className="px-8 pb-8">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Servicio</th>
                  <th className="text-right p-4 font-semibold">Precio</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4">
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ${item.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-primary/5 border-t-2 border-primary">
                <tr>
                  <td className="p-4 font-bold text-lg">Total</td>
                  <td className="p-4 text-right font-bold text-2xl text-primary">
                    ${data.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Firma */}
        {data.signature && (
          <div className="px-8 pb-8">
            <div className="border-t border-border pt-6">
              <p className="font-semibold text-lg">{data.signature}</p>
              <p className="text-sm text-muted-foreground mt-1">{data.companyName}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-muted/30 px-8 py-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-xs">📧</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{data.companyEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-xs">📞</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium">{data.companyPhone}</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-xs">📍</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ubicación</p>
                <p className="text-sm font-medium">Argentina</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
