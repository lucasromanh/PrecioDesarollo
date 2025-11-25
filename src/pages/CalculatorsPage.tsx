import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HourlyRateCalculator } from '@/components/calculators/HourlyRateCalculator';
import { ProjectEstimator } from '@/components/calculators/ProjectEstimator';
import { BackendApiEstimator } from '@/components/calculators/BackendApiEstimator';
import { AiChatbotEstimator } from '@/components/calculators/AiChatbotEstimator';
import { MobileAppEstimator } from '@/components/calculators/MobileAppEstimator';
import { GameProjectEstimator } from '@/components/calculators/GameProjectEstimator';
import { BusinessSystemEstimator } from '@/components/calculators/BusinessSystemEstimator';
import { DesktopAppEstimator } from '@/components/calculators/DesktopAppEstimator';

export function CalculatorsPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('hourly');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <PageContainer
      title="Calculadoras de Precios"
      description="Calcula tu tarifa por hora y estima precios para diferentes tipos de proyectos"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 h-auto gap-2 p-2 mb-6">
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
          <TabsTrigger value="mobile" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">App Móvil</span>
            <span className="md:hidden">📱 Móvil</span>
          </TabsTrigger>
          <TabsTrigger value="game" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Videojuegos</span>
            <span className="md:hidden">🎮 Juego</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Sistemas</span>
            <span className="md:hidden">🏢 Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="desktop" className="text-sm md:text-base py-3">
            <span className="hidden md:inline">Escritorio</span>
            <span className="md:hidden">💻 Desktop</span>
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

        <TabsContent value="mobile" className="mt-6">
          <MobileAppEstimator />
        </TabsContent>

        <TabsContent value="game" className="mt-6">
          <GameProjectEstimator />
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <BusinessSystemEstimator />
        </TabsContent>

        <TabsContent value="desktop" className="mt-6">
          <DesktopAppEstimator />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
