
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mic, MessageSquare, Clock } from 'lucide-react';

export const VoiceAIKPIs = () => {
  const kpis = [
    {
      title: "AI Response Time",
      value: "1.2s",
      description: "Average response time",
      icon: Clock
    },
    {
      title: "Voice Quality Score",
      value: "94.5%",
      description: "Speech clarity rating",
      icon: Mic
    },
    {
      title: "Intent Recognition",
      value: "96.8%",
      description: "Accuracy rate",
      icon: Brain
    },
    {
      title: "Conversation Length",
      value: "4.3 min",
      description: "Average duration",
      icon: MessageSquare
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{kpi.value}</div>
            <p className="text-xs text-purple-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
