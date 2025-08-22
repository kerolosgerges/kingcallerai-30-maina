import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Phone, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface KPI {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

interface FastKPIsProps {
  stats?: any;
  loading?: boolean;
}

const defaultKPIs: KPI[] = [
  {
    title: 'Total Calls',
    value: '1,250',
    change: '+12%',
    trend: 'up',
    icon: Phone
  },
  {
    title: 'Active Users',
    value: '350',
    change: '+8%',
    trend: 'up',
    icon: Users
  },
  {
    title: 'Success Rate',
    value: '85.2%',
    change: '+2.3%',
    trend: 'up',
    icon: TrendingUp
  },
  {
    title: 'Avg Duration',
    value: '3.2m',
    change: '-0.5%',
    trend: 'down',
    icon: Clock
  },
  {
    title: 'Messages',
    value: '4,500',
    change: '+15%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'Active Agents',
    value: '5',
    change: 'stable',
    trend: 'stable',
    icon: Activity
  }
];

export const FastDashboardKPIs: React.FC<FastKPIsProps> = ({ stats, loading }) => {
  const kpis = stats ? [
    {
      title: 'Total Calls',
      value: stats.totalCalls?.toLocaleString() || '0',
      change: '+12%',
      trend: 'up' as const,
      icon: Phone
    },
    {
      title: 'Active Users',
      value: stats.totalUsers?.toLocaleString() || '0',
      change: '+8%',
      trend: 'up' as const,
      icon: Users
    },
    {
      title: 'Success Rate',
      value: '85.2%',
      change: '+2.3%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages?.toLocaleString() || '0',
      change: '+15%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      title: 'Active Agents',
      value: stats.totalAgents?.toString() || '0',
      change: 'stable',
      trend: 'stable' as const,
      icon: Activity
    },
    {
      title: 'Integrations',
      value: stats.activeIntegrations?.toString() || '0',
      change: '+1',
      trend: 'up' as const,
      icon: Clock
    }
  ] : defaultKPIs;

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.change && (
                <Badge variant="secondary" className={`text-xs ${getTrendColor(kpi.trend)}`}>
                  {kpi.change}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};