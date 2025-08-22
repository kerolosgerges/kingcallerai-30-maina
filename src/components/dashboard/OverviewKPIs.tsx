
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Phone, Users, DollarSign, BarChart3 } from 'lucide-react';

export const OverviewKPIs = () => {
  const kpis = [
    {
      title: "Total Calls",
      value: "12,547",
      change: "+12.5%",
      trend: "up",
      icon: Phone
    },
    {
      title: "Active Agents",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Users
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Conversion Rate",
      value: "23.4%",
      change: "-2.1%",
      trend: "down",
      icon: BarChart3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className={`text-xs flex items-center gap-1 ${
              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpi.trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {kpi.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
