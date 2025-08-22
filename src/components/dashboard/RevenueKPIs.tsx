
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';

export const RevenueKPIs = () => {
  const kpis = [
    {
      title: "Monthly Revenue",
      value: "$45,231",
      description: "This month's earnings",
      icon: DollarSign
    },
    {
      title: "Growth Rate",
      value: "+18.2%",
      description: "vs last month",
      icon: TrendingUp
    },
    {
      title: "Average Deal Size",
      value: "$2,547",
      description: "Per customer",
      icon: CreditCard
    },
    {
      title: "Profit Margin",
      value: "34.8%",
      description: "Net profit",
      icon: PiggyBank
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{kpi.value}</div>
            <p className="text-xs text-emerald-600">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
