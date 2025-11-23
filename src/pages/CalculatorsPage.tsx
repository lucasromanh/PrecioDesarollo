import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HourlyRateCalculator } from '@/components/calculators/HourlyRateCalculator';
import { ProjectEstimator } from '@/components/calculators/ProjectEstimator';
import { BackendApiEstimator } from '@/components/calculators/BackendApiEstimator';
import { AiChatbotEstimator } from '@/components/calculators/AiChatbotEstimator';

export function CalculatorsPage() {
  return (
    <PageContainer
      title="Calculadoras de Precios"
      description="Calcula tu tarifa por hora y estima precios para diferentes tipos de proyectos"
    >
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 p-2 mb-6">
          <TabsTrigger value="hourly" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Tarifa por Hora</span>
            <span className="md:hidden">💼 Hora</span>
          </TabsTrigger>
          <TabsTrigger value="web" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Proyecto Web</span>
            <span className="md:hidden">🌐 Web</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Backend/APIs</span>
            <span className="md:hidden">⚙️ API</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">IA/Chatbots</span>
            <span className="md:hidden">🤖 IA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="mt-6">
          <HourlyRateCalculator />
        </TabsContent>

        <TabsContent value="web" className="mt-6">
          <ProjectEstimator />
        </TabsContent>

        <TabsContent value="backend" className="mt-6">
          <BackendApiEstimator />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AiChatbotEstimator />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
