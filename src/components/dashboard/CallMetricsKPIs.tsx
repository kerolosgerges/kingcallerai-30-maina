
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneCall, Clock, CheckCircle } from 'lucide-react';

export const CallMetricsKPIs = () => {
  const kpis = [
    {
      title: "Total Calls",
      value: "12,547",
      description: "Calls made today",
      icon: Phone
    },
    {
      title: "Answer Rate",
      value: "78.5%",
      description: "Calls answered",
      icon: PhoneCall
    },
    {
      title: "Average Call Duration",
      value: "4.3 min",
      description: "Time per call",
      icon: Clock
    },
    {
      title: "Success Rate",
      value: "65.2%",
      description: "Successful outcomes",
      icon: CheckCircle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{kpi.value}</div>
            <p className="text-xs text-blue-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
