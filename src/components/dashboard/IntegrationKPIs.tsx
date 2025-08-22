
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Link, CheckCircle, AlertCircle } from 'lucide-react';

export const IntegrationKPIs = () => {
  const kpis = [
    {
      title: "Connected Services",
      value: "6",
      description: "Active integrations",
      icon: Link
    },
    {
      title: "API Calls",
      value: "45,231",
      description: "Requests today",
      icon: Zap
    },
    {
      title: "Healthy Connections",
      value: "5",
      description: "Working properly",
      icon: CheckCircle
    },
    {
      title: "Issues",
      value: "1",
      description: "Needs attention",
      icon: AlertCircle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{kpi.value}</div>
            <p className="text-xs text-yellow-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
