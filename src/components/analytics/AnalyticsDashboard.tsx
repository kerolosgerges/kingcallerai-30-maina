
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceAIMetrics } from './VoiceAIMetrics';
import { MarketingMetrics } from './MarketingMetrics';
import { CallVolumeChart } from './CallVolumeChart';
import { ConversionFunnel } from './ConversionFunnel';
import { AgentPerformanceChart } from './AgentPerformanceChart';
import { MarketingROIChart } from './MarketingROIChart';

export const AnalyticsDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Voice AI & Marketing Platform KPIs</p>
        </div>
      </div>

      {/* Voice AI KPIs */}
      <VoiceAIMetrics />

      {/* Marketing KPIs */}
      <MarketingMetrics />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CallVolumeChart />
        <ConversionFunnel />
        <AgentPerformanceChart />
        <MarketingROIChart />
      </div>
    </div>
  );
};
