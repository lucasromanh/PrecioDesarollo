import { useState, useEffect } from 'react';
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
    isRecurring?: boolean;
    isHeader?: boolean;
    isMilestone?: boolean;
    isSubtotal?: boolean;
  }>;
  milestones?: Array<{
    name: string;
    percentage: number;
    amount: number;
    description?: string;
  }>;
  subtotal: number;
  hasDiscount: boolean;
  discountPercentage: number;
  discountReason: string;
  includeIVA: boolean;
  ivaRate: number;
  total: number;
  isHourlyRate?: boolean;
}

interface BudgetGeneratorProps {
  result: HourlyRateResult | EstimateResult | null;
  type: 'hourly' | 'project';
}

export function BudgetGenerator({ result, type }: BudgetGeneratorProps) {
  const [showBudget, setShowBudget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [discountInput, setDiscountInput] = useState<string>('0');
  const [selectedPrice, setSelectedPrice] = useState<'min' | 'max'>('min');
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
    subtotal: 0,
    hasDiscount: false,
    discountPercentage: 0,
    discountReason: '',
    includeIVA: false,
    ivaRate: 21, // IVA estándar Argentina
    total: 0,
    isHourlyRate: false
  });

  // Resetear el presupuesto cuando cambia el resultado
  useEffect(() => {
    if (result && showBudget) {
      setShowBudget(false);
    }
  }, [result]);

  const generateBudgetItems = () => {
    if (!result) return;

    if (type === 'hourly' && 'minimumRate' in result) {
      const items = [];
      
      // Encabezado del servicio
      items.push({
        service: 'Servicios de Desarrollo de Software',
        description: 'Tarifa por hora de desarrollo profesional',
        price: 0,
        isRecurring: false,
        isHeader: true
      });
      
      // Información del profesional (como milestone/desglose)
      if (result.role) {
        items.push({
          service: `  Rol: ${result.role}`,
          description: `Seniority: ${result.seniority || 'N/A'}`,
          price: 0,
          isRecurring: false,
          isMilestone: true
        });
      }
      
      if (result.country) {
        items.push({
          service: `  País: ${result.country}`,
          description: result.monthlyExpenses 
            ? `Gasto mensual estimado: $${result.monthlyExpenses.toLocaleString()}`
            : '',
          price: 0,
          isRecurring: false,
          isMilestone: true
        });
      }
      
      // Tarifa por hora - mostrar el precio por hora
      items.push({
        service: `  Tarifa por Hora`,
        description: 'Tarifa recomendada máxima por hora de trabajo',
        price: result.recommendedMax,
        isRecurring: false,
        isMilestone: true
      });
      
      // Total mensual = Tarifa × Horas
      const monthlyTotal = result.workingHours 
        ? result.recommendedMax * result.workingHours 
        : result.recommendedMax;
      
      if (result.workingHours) {
        items.push({
          service: `  Total de horas facturables al mes`,
          description: `${result.workingHours} horas × $${result.recommendedMax.toLocaleString()} por hora`,
          price: monthlyTotal,
          isRecurring: false,
          isMilestone: true
        });
      }
      
      // Subtotal (ingreso mensual total)
      items.push({
        service: 'Ingreso Mensual Total',
        description: result.workingHours ? `${result.workingHours}h mensuales facturables` : 'Basado en horas facturables',
        price: monthlyTotal,
        isRecurring: false,
        isSubtotal: true
      });
      
      setBudgetData(prev => ({
        ...prev,
        items,
        subtotal: monthlyTotal,
        total: monthlyTotal,
        isHourlyRate: true
      }));
    } else if (type === 'project' && 'hours' in result) {
      // Determinar el tipo de servicio según el projectType
      const projectTypeNames: Record<string, string> = {
        'web': 'Desarrollo de Sitio Web',
        'backend': 'Desarrollo de Backend/API',
        'ai': 'Desarrollo de Chatbot con IA',
        'mobile': 'Desarrollo de Aplicación Móvil',
        'game': 'Desarrollo de Videojuego',
        'desktop': 'Desarrollo de Aplicación de Escritorio',
        'automation': 'Desarrollo de Script/Automatización'
      };
      
      let serviceName = ('projectType' in result && result.projectType) 
        ? projectTypeNames[result.projectType] || 'Desarrollo de Proyecto'
        : 'Desarrollo de Proyecto';
      
      // Agregar detalles específicos del proyecto si existen
      if ('projectDetails' in result && result.projectDetails) {
        serviceName = `${serviceName} - ${result.projectDetails}`;
      }
      
      const selectedAmount = selectedPrice === 'min' ? result.minPrice : result.maxPrice;
      const serviceDescription = `${result.hours} horas de desarrollo estimadas`;
      
      const items = [];
      
      // Agregar encabezado del servicio principal
      items.push({
        service: serviceName,
        description: serviceDescription,
        price: 0, // No tiene precio, solo es el encabezado
        isRecurring: false,
        isHeader: true
      });

      // Agregar los hitos/fases como desglose del servicio
      if ('milestones' in result && result.milestones) {
        result.milestones.forEach(milestone => {
          const milestoneAmount = Math.round(selectedAmount * (milestone.percentage / 100));
          items.push({
            service: `  ${milestone.name}`,
            description: milestone.description || '',
            price: milestoneAmount,
            isRecurring: false,
            isMilestone: true
          });
        });
      }

      // Agregar línea de subtotal del desarrollo
      items.push({
        service: 'Subtotal Desarrollo',
        description: '',
        price: selectedAmount,
        isRecurring: false,
        isSubtotal: true
      });

      // Agregar costos adicionales si existen
      if ('additionalCosts' in result && result.additionalCosts && result.additionalCosts.length > 0) {
        result.additionalCosts.forEach(cost => {
          const costPrice = cost.oneTimeCost || cost.monthlyCost || 0;
          items.push({
            service: cost.item,
            description: cost.description + (cost.monthlyCost ? ' (Costo mensual)' : ' (Pago único)'),
            price: costPrice,
            isRecurring: !!cost.monthlyCost
          });
        });
      }

      // Calcular subtotal solo de items que no sean header ni subtotal
      const subtotal = items.reduce((sum, item) => {
        if (item.isHeader || item.isSubtotal) return sum;
        return sum + item.price;
      }, 0);
      
      setBudgetData(prev => ({
        ...prev,
        milestones: undefined, // Ya no usamos la sección separada
        items,
        subtotal,
        total: subtotal
      }));
    }
  };

  const handleGenerateBudget = () => {
    generateBudgetItems();
    setShowBudget(true);
  };

  const handleUpdateField = (field: keyof BudgetData, value: string | boolean | number) => {
    setBudgetData(prev => {
      const updated = { ...prev, [field]: value };
      // Recalcular total si cambió descuento o IVA
      if (field === 'hasDiscount' || field === 'discountPercentage' || field === 'includeIVA' || field === 'ivaRate') {
        const discountAmount = updated.hasDiscount ? updated.subtotal * (updated.discountPercentage / 100) : 0;
        const subtotalAfterDiscount = updated.subtotal - discountAmount;
        const ivaAmount = updated.includeIVA ? subtotalAfterDiscount * (updated.ivaRate / 100) : 0;
        updated.total = subtotalAfterDiscount + ivaAmount;
      }
      return updated;
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Determinar si necesitamos múltiples páginas
    const itemsPerPage = 12;
    const needsSecondPage = budgetData.items.length > itemsPerPage;
    const page1Items = needsSecondPage ? budgetData.items.slice(0, itemsPerPage) : budgetData.items;
    const page2Items = needsSecondPage ? budgetData.items.slice(itemsPerPage) : [];
    const hasRecurringCosts = budgetData.items.some(item => item.isRecurring);

    // Función para generar el HTML de los items
    const generateItemsHtml = (items: typeof budgetData.items) => items.map(item => {
      if (item.isHeader) {
        return `
          <tr style="background: #fff5f0; border-top: 2px solid #FF6A3D;">
            <td colspan="2" style="padding: 0.75rem; font-weight: 700; color: #FF6A3D; font-size: 1.05rem;">
              ${item.service}
              ${item.description ? `<div style="font-size: 0.875rem; color: #666; font-weight: 400; margin-top: 0.25rem;">${item.description}</div>` : ''}
            </td>
          </tr>
        `;
      } else if (item.isMilestone) {
        return `
          <tr style="background: #fafafa;">
            <td style="padding: 0.65rem 0.75rem; padding-left: 1.5rem;">
              <div style="font-weight: 600; color: #333; font-size: 0.95rem;">${item.service}</div>
              ${item.description ? `<div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem; line-height: 1.4;">${item.description}</div>` : ''}
            </td>
            <td style="text-align: right; padding: 0.65rem 0.75rem; font-weight: 600; color: #FF6A3D;">$${item.price.toLocaleString()}</td>
          </tr>
        `;
      } else if (item.isSubtotal) {
        return `
          <tr style="background: #fff5f0; border-bottom: 2px solid #e5e5e5;">
            <td style="text-align: right; padding: 0.75rem; font-weight: 700; color: #FF6A3D;">
              ${item.service}:
            </td>
            <td style="text-align: right; padding: 0.75rem; font-weight: 700; color: #FF6A3D; font-size: 1.1rem;">
              $${item.price.toLocaleString()}
            </td>
          </tr>
        `;
      } else {
        return `
          <tr style="border-bottom: 1px solid #e5e5e5;">
            <td>
              <div class="service-name">${item.service}${item.isRecurring ? ' 🔄' : ''}</div>
              <div class="service-desc">${item.description}</div>
            </td>
            <td>$${item.price.toLocaleString()}</td>
          </tr>
        `;
      }
    }).join('');

    // Generar HTML para página 1 y página 2
    const page1ItemsHtml = generateItemsHtml(page1Items);
    const page2ItemsHtml = needsSecondPage ? generateItemsHtml(page2Items) : '';

    const discountAmount = budgetData.hasDiscount ? budgetData.subtotal * (budgetData.discountPercentage / 100) : 0;
    const subtotalAfterDiscount = budgetData.subtotal - discountAmount;
    const ivaAmount = budgetData.includeIVA ? subtotalAfterDiscount * (budgetData.ivaRate / 100) : 0;

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
              .page-break {
                page-break-before: always;
              }
            }
            .page {
              width: 100%;
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: auto;
            }
            .budget-container {
              width: 100%;
              background: white;
            }
            .budget-body {
              width: 100%;
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
              margin-top: 3rem;
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
          <!-- PÁGINA 1 -->
          <div class="page">
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
                    ${page1ItemsHtml}
                  </tbody>
                  ${!needsSecondPage ? `
                  <tbody>
                    <tr style="border-top: 2px solid #e5e5e5;">
                      <td style="text-align: right; font-weight: 600; padding: 0.75rem;">Subtotal:</td>
                      <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${budgetData.subtotal.toLocaleString()}</td>
                    </tr>
                    ${budgetData.hasDiscount ? `
                      <tr style="color: #16a34a;">
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">
                          Descuento (${budgetData.discountPercentage}%)
                          ${budgetData.discountReason ? `<br><span style="font-size: 0.875rem; font-weight: 400; color: #666;">${budgetData.discountReason}</span>` : ''}
                        </td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">-$${discountAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">Subtotal con descuento:</td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${subtotalAfterDiscount.toLocaleString()}</td>
                      </tr>
                    ` : ''}
                    ${budgetData.includeIVA ? `
                      <tr>
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">IVA (${budgetData.ivaRate}%):</td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${ivaAmount.toLocaleString()}</td>
                      </tr>
                    ` : ''}
                  </tbody>
                  <tfoot style="background: #fff5f0; border-top: 2px solid #FF6A3D;">
                    <tr>
                      <td style="text-align: right; padding: 1rem; font-weight: 700; font-size: 1.125rem;">TOTAL</td>
                      <td style="text-align: right; padding: 1rem; font-weight: 700; font-size: 1.25rem; color: #FF6A3D;">$${budgetData.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                  ` : `
                  <tbody>
                    <tr style="border-top: 1px solid #e5e5e5; background: #f9f9f9;">
                      <td colspan="2" style="text-align: center; padding: 0.75rem; font-size: 0.875rem; color: #666; font-style: italic;">
                        Continúa en la página siguiente...
                      </td>
                    </tr>
                  </tbody>
                  `}
                </table>

                ${!needsSecondPage ? `
                  ${hasRecurringCosts ? `
                  <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                    <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
                      <strong style="color: #0f172a;">Nota Importante sobre Costos Recurrentes:</strong><br>
                      Los ítems marcados como "Pago mensual" o con 🔄 son servicios de terceros (hosting, bases de datos, APIs, tokens de IA, etc.) 
                      que <strong>están a cargo del cliente</strong> y deben renovarse periódicamente. El desarrollador no se hace responsable 
                      de estos costos operativos una vez finalizado el proyecto.
                    </p>
                  </div>
                  ` : ''}
                  
                  ${budgetData.isHourlyRate ? `
                  <div style="background: #fff5f0; border-left: 4px solid #FF6A3D; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                    <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
                      <strong style="color: #0f172a;">Términos de Contratación por Horas:</strong><br>
                      Este presupuesto está basado en la cantidad de horas estimadas mencionadas. Si el proyecto se completa en <strong>menos tiempo del estimado</strong>, quedará a consideración del desarrollador realizar un ajuste o descuento proporcional sobre el monto total. En caso de que el proyecto requiera <strong>horas adicionales</strong> debido a solicitudes extras o cambios en los requerimientos iniciales por parte del cliente, estas serán <strong>facturadas por separado</strong> a la tarifa por hora establecida antes de la finalización del proyecto.
                    </p>
                  </div>
                  ` : ''}

                  ${budgetData.signature ? `
                  <div class="signature">
                    <p class="name">${budgetData.signature}</p>
                    <p class="company">${budgetData.companyName}</p>
                  </div>
                  ` : ''}
                  
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
                ` : ''}
            </div>
          </div>

          <!-- PÁGINA 2 (si es necesario) -->
          ${needsSecondPage ? `
          <div class="page page-break">
            <div class="header">
              <h1>📄 Presupuesto - Página 2</h1>
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
                  ${page2Items.length > 0 ? `
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  ` : ''}
                  <tbody>
                    ${page2ItemsHtml}
                    <tr style="border-top: 2px solid #e5e5e5;">
                      <td style="text-align: right; font-weight: 600; padding: 0.75rem;">Subtotal:</td>
                      <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${budgetData.subtotal.toLocaleString()}</td>
                    </tr>
                    ${budgetData.hasDiscount ? `
                      <tr style="color: #16a34a;">
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">
                          Descuento (${budgetData.discountPercentage}%)
                          ${budgetData.discountReason ? `<br><span style="font-size: 0.875rem; font-weight: 400; color: #666;">${budgetData.discountReason}</span>` : ''}
                        </td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">-$${discountAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">Subtotal con descuento:</td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${subtotalAfterDiscount.toLocaleString()}</td>
                      </tr>
                    ` : ''}
                    ${budgetData.includeIVA ? `
                      <tr>
                        <td style="text-align: right; font-weight: 600; padding: 0.75rem;">IVA (${budgetData.ivaRate}%):</td>
                        <td style="text-align: right; padding: 0.75rem; font-weight: 600;">$${ivaAmount.toLocaleString()}</td>
                      </tr>
                    ` : ''}
                  </tbody>
                  <tfoot style="background: #fff5f0; border-top: 2px solid #FF6A3D;">
                    <tr>
                      <td style="text-align: right; padding: 1rem; font-weight: 700; font-size: 1.125rem;">TOTAL</td>
                      <td style="text-align: right; padding: 1rem; font-weight: 700; font-size: 1.25rem; color: #FF6A3D;">$${budgetData.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                ${hasRecurringCosts ? `
                <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                  <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
                    <strong style="color: #0f172a;">Nota Importante sobre Costos Recurrentes:</strong><br>
                    Los ítems marcados como "Pago mensual" o con 🔄 son servicios de terceros (hosting, bases de datos, APIs, tokens de IA, etc.) 
                    que <strong>están a cargo del cliente</strong> y deben renovarse periódicamente. El desarrollador no se hace responsable 
                    de estos costos operativos una vez finalizado el proyecto.
                  </p>
                </div>
                ` : ''}
                
                ${budgetData.isHourlyRate ? `
                <div style="background: #fff5f0; border-left: 4px solid #FF6A3D; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                  <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
                    <strong style="color: #0f172a;">Términos de Contratación por Horas:</strong><br>
                    Este presupuesto está basado en la cantidad de horas estimadas mencionadas. Si el proyecto se completa en <strong>menos tiempo del estimado</strong>, quedará a consideración del desarrollador realizar un ajuste o descuento proporcional sobre el monto total. En caso de que el proyecto requiera <strong>horas adicionales</strong> debido a solicitudes extras o cambios en los requerimientos iniciales por parte del cliente, estas serán <strong>facturadas por separado</strong> a la tarifa por hora establecida antes de la finalización del proyecto.
                  </p>
                </div>
                ` : ''}

                ${budgetData.signature ? `
                <div class="signature">
                  <p class="name">${budgetData.signature}</p>
                  <p class="company">${budgetData.companyName}</p>
                </div>
                ` : ''}
                
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
          </div>
          ` : ''}
          
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

  // Mostrar selector de precio solo para proyectos con rango de precios
  const showPriceSelector = type === 'project' && 'minPrice' in result && 'maxPrice' in result;

  return (
    <div className="space-y-6 mt-6">
      {!showBudget ? (
        <div className="space-y-4">
          {showPriceSelector && (
            <Card className="border-primary/20 bg-card/50">
              <CardContent className="pt-6">
                <Label className="text-sm font-semibold mb-3 block">
                  Selecciona el tipo de estimación para el presupuesto:
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedPrice('min')}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                      selectedPrice === 'min'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-xs md:text-sm font-semibold mb-1">Estimación Conservadora</div>
                    <div className="text-sm md:text-2xl font-bold text-primary mb-1 break-words">
                      ${result.minPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground hidden md:block">
                      Precio mínimo - Proyecto sin imprevistos
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden">
                      Precio mínimo
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedPrice('max')}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                      selectedPrice === 'max'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-xs md:text-sm font-semibold mb-1">Estimación Completa</div>
                    <div className="text-sm md:text-2xl font-bold text-primary mb-1 break-words">
                      ${result.maxPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground hidden md:block">
                      Precio máximo - Incluye margen de seguridad
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden">
                      Precio máximo
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
          <Button 
            onClick={handleGenerateBudget}
            className="w-full"
            size="lg"
          >
            <FileText className="mr-2 h-5 w-5" />
            Generar Presupuesto Profesional
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 print:hidden mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-amber-600 text-lg">💡</span>
              <p className="text-sm text-amber-800">
                <strong>Personaliza tu presupuesto:</strong> Usa el botón "Editar Datos" para agregar descuentos, IVA, modificar información del cliente y más.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
                className="flex-1"
                size="lg"
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
                size="lg"
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
                  <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="hasDiscount"
                        checked={budgetData.hasDiscount}
                        onChange={(e) => handleUpdateField('hasDiscount', e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <Label htmlFor="hasDiscount" className="cursor-pointer font-semibold text-green-700 dark:text-green-400">
                        Aplicar Descuento
                      </Label>
                    </div>
                    {budgetData.hasDiscount && (
                      <div className="ml-6 space-y-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Descuento:</Label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountInput('5');
                                handleUpdateField('hasDiscount', true);
                                handleUpdateField('discountPercentage', 5);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                budgetData.discountPercentage === 5
                                  ? 'bg-green-600 text-white'
                                  : 'bg-background border border-input text-foreground hover:bg-green-100 dark:hover:bg-green-900'
                              }`}
                            >
                              5%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountInput('10');
                                handleUpdateField('hasDiscount', true);
                                handleUpdateField('discountPercentage', 10);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                budgetData.discountPercentage === 10
                                  ? 'bg-green-600 text-white'
                                  : 'bg-background border border-input text-foreground hover:bg-green-100 dark:hover:bg-green-900'
                              }`}
                            >
                              10%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountInput('15');
                                handleUpdateField('hasDiscount', true);
                                handleUpdateField('discountPercentage', 15);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                budgetData.discountPercentage === 15
                                  ? 'bg-green-600 text-white'
                                  : 'bg-background border border-input text-foreground hover:bg-green-100 dark:hover:bg-green-900'
                              }`}
                            >
                              15%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountInput('20');
                                handleUpdateField('hasDiscount', true);
                                handleUpdateField('discountPercentage', 20);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                budgetData.discountPercentage === 20
                                  ? 'bg-green-600 text-white'
                                  : 'bg-background border border-input text-foreground hover:bg-green-100 dark:hover:bg-green-900'
                              }`}
                            >
                              20%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountInput('25');
                                handleUpdateField('hasDiscount', true);
                                handleUpdateField('discountPercentage', 25);
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                budgetData.discountPercentage === 25
                                  ? 'bg-green-600 text-white'
                                  : 'bg-background border border-input text-foreground hover:bg-green-100 dark:hover:bg-green-900'
                              }`}
                            >
                              25%
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="discountPercentage" className="text-xs text-muted-foreground">Personalizado:</Label>
                            <input
                              type="text"
                              id="discountPercentage"
                              value={discountInput}
                              onChange={(e) => {
                                const value = e.target.value;
                                setDiscountInput(value);
                                
                                if (value === '') {
                                  handleUpdateField('discountPercentage', 0);
                                } else {
                                  const num = Number(value);
                                  if (!isNaN(num) && num >= 0 && num <= 100) {
                                    handleUpdateField('discountPercentage', num);
                                  }
                                }
                              }}
                              onBlur={() => {
                                if (discountInput === '') {
                                  setDiscountInput('0');
                                }
                              }}
                              placeholder="0"
                              className="border border-input bg-background text-foreground rounded-md px-3 py-1 text-sm w-20"
                            />
                            <span className="text-sm font-medium text-foreground">%</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="discountReason" className="text-sm font-medium text-foreground">Motivo del descuento:</Label>
                          <select
                            id="discountReason"
                            value={budgetData.discountReason}
                            onChange={(e) => handleUpdateField('discountReason', e.target.value)}
                            className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm"
                          >
                            <option value="">Seleccionar motivo...</option>
                            <option value="Pago en efectivo">Pago en efectivo</option>
                            <option value="Sin factura">Sin factura</option>
                            <option value="Tarifa empresarial">Tarifa empresarial</option>
                            <option value="Cliente recurrente">Cliente recurrente</option>
                            <option value="Promoción especial">Promoción especial</option>
                            <option value="Volumen de proyecto">Volumen de proyecto</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="includeIVA"
                        checked={budgetData.includeIVA}
                        onChange={(e) => handleUpdateField('includeIVA', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <Label htmlFor="includeIVA" className="cursor-pointer font-semibold text-foreground">
                        Incluir IVA (Factura A)
                      </Label>
                    </div>
                    {budgetData.includeIVA && (
                      <div className="ml-6 flex items-center gap-3">
                        <Label htmlFor="ivaRate" className="text-sm text-foreground">Alícuota:</Label>
                        <select
                          id="ivaRate"
                          value={budgetData.ivaRate}
                          onChange={(e) => handleUpdateField('ivaRate', Number(e.target.value))}
                          className="border border-input bg-background text-foreground rounded-md px-3 py-1 text-sm"
                        >
                          <option value="10.5">10.5% (Reducido)</option>
                          <option value="21">21% (General)</option>
                          <option value="27">27% (Especial)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div id="budget-preview">
            <BudgetPreview data={budgetData} />
          </div>

          {/* Botones duplicados al final del presupuesto */}
          <div className="flex gap-3 mt-6 print:hidden">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
              className="flex-1"
              size="lg"
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
              size="lg"
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
        </>
      )}
    </div>
  );
}

function BudgetPreview({ data }: { data: BudgetData }) {
  const hasRecurringCosts = data.items.some(item => item.isRecurring);
  
  // Determinar si necesitamos múltiples páginas (más de 12 items o muchos items + costos recurrentes)
  const itemsPerPage = 12;
  const needsSecondPage = data.items.length > itemsPerPage;
  
  const page1Items = needsSecondPage ? data.items.slice(0, itemsPerPage) : data.items;
  const page2Items = needsSecondPage ? data.items.slice(itemsPerPage) : [];

  // Componente de encabezado reutilizable
  const BudgetHeader = ({ pageNumber }: { pageNumber?: number }) => (
    <>
      {/* Header con diseño naranja */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-[#E65A2F] p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold">Presupuesto{pageNumber ? ` - Página ${pageNumber}` : ''}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Información del cliente y empresa */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-1">CLIENTE</h3>
          <p className="text-base font-semibold">{data.clientName}</p>
          <p className="text-xs text-muted-foreground mt-1">Fecha: {data.date}</p>
        </div>
        <div className="text-left md:text-right">
          <h3 className="text-xs font-semibold text-muted-foreground mb-1">DE</h3>
          <p className="text-base font-semibold">{data.companyName}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.companyEmail}</p>
          <p className="text-xs text-muted-foreground">{data.companyPhone}</p>
          <p className="text-xs text-muted-foreground">{data.companyAddress}</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* PÁGINA 1 - Presupuesto Principal */}
      <Card className="border-2 border-primary/30 bg-card shadow-[0_8px_24px_var(--shadow)] mb-8 page-break">
        <CardContent className="p-0">
          <BudgetHeader />

          {/* Tabla de Servicios */}
          <div className="px-6 pb-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Servicio</th>
                    <th className="text-right p-3 font-semibold">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {page1Items.map((item, index) => {
                    if (item.isHeader) {
                      return (
                        <tr key={index} className="bg-primary/5 border-t-2 border-primary">
                          <td colSpan={2} className="p-3">
                            <p className="font-bold text-primary text-base">{item.service}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </td>
                        </tr>
                      );
                    } else if (item.isMilestone) {
                      return (
                        <tr key={index} className="bg-muted/20 border-t border-border/50">
                          <td className="p-3 pl-6">
                            <p className="font-semibold text-sm">{item.service}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                            )}
                          </td>
                          <td className="p-3 text-right font-semibold text-primary whitespace-nowrap">
                            ${item.price.toLocaleString()}
                          </td>
                        </tr>
                      );
                    } else if (item.isSubtotal) {
                      return (
                        <tr key={index} className="bg-primary/5 border-t-2 border-border">
                          <td className="p-3 text-right font-bold text-primary">
                            {item.service}:
                          </td>
                          <td className="p-3 text-right font-bold text-primary text-base whitespace-nowrap">
                            ${item.price.toLocaleString()}
                          </td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={index} className="border-t border-border">
                          <td className="p-3">
                            <p className="font-medium flex items-center gap-2">
                              {item.service}
                              {item.isRecurring && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                                  Recurrente
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.description}</p>
                          </td>
                          <td className="p-3 text-right font-semibold whitespace-nowrap">
                            ${item.price.toLocaleString()}
                          </td>
                        </tr>
                      );
                    }
                  })}
                  
                  {/* Mostrar totales solo si NO hay segunda página */}
                  {!needsSecondPage && (
                    <>
                      <tr className="border-t-2 border-border">
                        <td className="p-3 text-right font-semibold">Subtotal:</td>
                        <td className="p-3 text-right font-semibold">
                          ${data.subtotal.toLocaleString()}
                        </td>
                      </tr>
                      {data.hasDiscount && (
                        <>
                          <tr className="text-green-600">
                            <td className="p-3 text-right">
                              <div className="font-semibold">Descuento ({data.discountPercentage}%)</div>
                              {data.discountReason && (
                                <div className="text-[10px] text-muted-foreground mt-0.5">{data.discountReason}</div>
                              )}
                            </td>
                            <td className="p-3 text-right font-semibold">
                              -${(data.subtotal * (data.discountPercentage / 100)).toLocaleString()}
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="p-3 text-right font-semibold">Subtotal con descuento:</td>
                            <td className="p-3 text-right font-semibold">
                              ${(data.subtotal - (data.subtotal * (data.discountPercentage / 100))).toLocaleString()}
                            </td>
                          </tr>
                        </>
                      )}
                      {data.includeIVA && (
                        <tr>
                          <td className="p-3 text-right font-semibold">IVA ({data.ivaRate}%):</td>
                          <td className="p-3 text-right font-semibold">
                            ${((data.subtotal - (data.hasDiscount ? data.subtotal * (data.discountPercentage / 100) : 0)) * (data.ivaRate / 100)).toLocaleString()}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  
                  {/* Mensaje de continuación solo si hay items en página 2 */}
                  {needsSecondPage && (
                    <tr className="border-t border-border bg-muted/30">
                      <td colSpan={2} className="p-3 text-center text-xs text-muted-foreground italic">
                        Continúa en la página siguiente...
                      </td>
                    </tr>
                  )}
                </tbody>
                {!needsSecondPage && (
                  <tfoot className="bg-primary/5 border-t-2 border-primary">
                    <tr>
                      <td className="p-3 font-bold text-base">TOTAL</td>
                      <td className="p-3 text-right font-bold text-xl text-primary">
                        ${data.total.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Notas en página 1 - Solo si NO hay segunda página */}
          {!needsSecondPage && (
            <>
              {/* Nota sobre costos recurrentes */}
              {hasRecurringCosts && (
                <div className="px-6 pb-6">
                  <div className="border border-border bg-background rounded p-4">
                    <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Nota Importante sobre Costos Recurrentes</h4>
                    <p className="text-xs text-foreground leading-relaxed">
                      Los ítems marcados como "RECURRENTE" son servicios de terceros (hosting, bases de datos, APIs, tokens de IA, registros de dominio, etc.) que <strong>están a cargo del cliente</strong> y deben renovarse periódicamente. El desarrollador no se hace responsable de estos costos operativos una vez finalizado el proyecto.
                    </p>
                  </div>
                </div>
              )}

              {/* Nota específica para presupuestos por hora */}
              {data.isHourlyRate && (
                <div className="px-6 pb-6">
                  <div className="border border-primary/30 bg-primary/5 rounded p-4">
                    <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Términos de Contratación por Horas</h4>
                    <p className="text-xs text-foreground leading-relaxed">
                      Este presupuesto está basado en la cantidad de horas estimadas mencionadas. Si el proyecto se completa en <strong>menos tiempo del estimado</strong>, quedará a consideración del desarrollador realizar un ajuste o descuento proporcional sobre el monto total. En caso de que el proyecto requiera <strong>horas adicionales</strong> debido a solicitudes extras o cambios en los requerimientos iniciales por parte del cliente, estas serán <strong>facturadas por separado</strong> a la tarifa por hora establecida antes de la finalización del proyecto.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer en página 1 */}
              <div className="bg-muted/30 px-6 py-4 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Email</p>
                    <p className="font-medium text-foreground truncate">{data.companyEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Teléfono</p>
                    <p className="font-medium text-foreground truncate">{data.companyPhone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Ubicación</p>
                    <p className="font-medium text-foreground">Argentina</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* PÁGINA 2 - Detalles y Notas (si es necesario) */}
      {needsSecondPage && (
        <Card className="border-2 border-primary/30 bg-card shadow-[0_8px_24px_var(--shadow)] page-break">
          <CardContent className="p-0">
            {/* Repetir encabezado completo en página 2 */}
            <BudgetHeader pageNumber={2} />

            {/* Continuación de ítems o resumen de totales */}
            <div className="p-6">
              <h3 className="text-sm font-semibold mb-3">{page2Items.length > 0 ? 'Servicios (continuación)' : 'Resumen del Presupuesto'}</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  {page2Items.length > 0 && (
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold">Servicio</th>
                        <th className="text-right p-3 font-semibold">Precio</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {page2Items.map((item, index) => {
                        if (item.isHeader) {
                          return (
                            <tr key={index} className="bg-primary/5 border-t-2 border-primary">
                              <td colSpan={2} className="p-3">
                                <p className="font-bold text-primary text-base">{item.service}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                )}
                              </td>
                            </tr>
                          );
                        } else if (item.isMilestone) {
                          return (
                            <tr key={index} className="bg-muted/20 border-t border-border/50">
                              <td className="p-3 pl-6">
                                <p className="font-semibold text-sm">{item.service}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                                )}
                              </td>
                              <td className="p-3 text-right font-semibold text-primary whitespace-nowrap">
                                ${item.price.toLocaleString()}
                              </td>
                            </tr>
                          );
                        } else if (item.isSubtotal) {
                          return (
                            <tr key={index} className="bg-primary/5 border-t-2 border-border">
                              <td className="p-3 text-right font-bold text-primary">
                                {item.service}:
                              </td>
                              <td className="p-3 text-right font-bold text-primary text-base whitespace-nowrap">
                                ${item.price.toLocaleString()}
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={index} className="border-t border-border">
                              <td className="p-3">
                                <p className="font-medium flex items-center gap-2">
                                  {item.service}
                                  {item.isRecurring && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                                      Recurrente
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.description}</p>
                              </td>
                              <td className="p-3 text-right font-semibold whitespace-nowrap">
                                ${item.price.toLocaleString()}
                              </td>
                            </tr>
                          );
                        }
                      })}
                      <tr className="border-t-2 border-border">
                        <td className="p-3 text-right font-semibold">Subtotal:</td>
                        <td className="p-3 text-right font-semibold">
                          ${data.subtotal.toLocaleString()}
                        </td>
                      </tr>
                      {data.hasDiscount && (
                        <>
                          <tr className="text-green-600">
                            <td className="p-3 text-right">
                              <div className="font-semibold">Descuento ({data.discountPercentage}%)</div>
                              {data.discountReason && (
                                <div className="text-[10px] text-muted-foreground mt-0.5">{data.discountReason}</div>
                              )}
                            </td>
                            <td className="p-3 text-right font-semibold">
                              -${(data.subtotal * (data.discountPercentage / 100)).toLocaleString()}
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="p-3 text-right font-semibold">Subtotal con descuento:</td>
                            <td className="p-3 text-right font-semibold">
                              ${(data.subtotal - (data.subtotal * (data.discountPercentage / 100))).toLocaleString()}
                            </td>
                          </tr>
                        </>
                      )}
                      {data.includeIVA && (
                        <tr>
                          <td className="p-3 text-right font-semibold">IVA ({data.ivaRate}%):</td>
                          <td className="p-3 text-right font-semibold">
                            ${((data.subtotal - (data.hasDiscount ? data.subtotal * (data.discountPercentage / 100) : 0)) * (data.ivaRate / 100)).toLocaleString()}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-primary/5 border-t-2 border-primary">
                      <tr>
                        <td className="p-3 font-bold text-base">TOTAL</td>
                        <td className="p-3 text-right font-bold text-xl text-primary">
                          ${data.total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            {/* Notas importantes - En página 2 si existe, o en página 1 si no hay segunda página */}
            {hasRecurringCosts && (
              <div className="px-6 pb-6">
                <div className="border border-border bg-background rounded p-4">
                  <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Nota Importante sobre Costos Recurrentes</h4>
                  <p className="text-xs text-foreground leading-relaxed">
                    Los ítems marcados como "RECURRENTE" son servicios de terceros (hosting, bases de datos, APIs, tokens de IA, registros de dominio, etc.) que <strong>están a cargo del cliente</strong> y deben renovarse periódicamente. El desarrollador no se hace responsable de estos costos operativos una vez finalizado el proyecto.
                  </p>
                </div>
              </div>
            )}

            {/* Nota específica para presupuestos por hora */}
            {data.isHourlyRate && (
              <div className="px-6 pb-6">
                <div className="border border-primary/30 bg-primary/5 rounded p-4">
                  <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Términos de Contratación por Horas</h4>
                  <p className="text-xs text-foreground leading-relaxed">
                    Este presupuesto está basado en la cantidad de horas estimadas mencionadas. Si el proyecto se completa en <strong>menos tiempo del estimado</strong>, quedará a consideración del desarrollador realizar un ajuste o descuento proporcional sobre el monto total. En caso de que el proyecto requiera <strong>horas adicionales</strong> debido a solicitudes extras o cambios en los requerimientos iniciales por parte del cliente, estas serán <strong>facturadas por separado</strong> a la tarifa por hora establecida antes de la finalización del proyecto.
                  </p>
                </div>
              </div>
            )}

            {/* Firma - Siempre al final (página 2 o página 1 si no hay segunda página) */}
            {data.signature && (
              <div className="px-6 pb-6">
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-base">{data.signature}</p>
                  <p className="text-xs text-muted-foreground mt-1">{data.companyName}</p>
                </div>
              </div>
            )}

            {/* Footer - Siempre al final (página 2 o página 1 si no hay segunda página) */}
            <div className="bg-muted/30 px-6 py-4 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Email</p>
                  <p className="font-medium text-foreground truncate">{data.companyEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Teléfono</p>
                  <p className="font-medium text-foreground truncate">{data.companyPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Ubicación</p>
                  <p className="font-medium text-foreground">Argentina</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
