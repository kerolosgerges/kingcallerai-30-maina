
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Phone, DollarSign, Users, BarChart3, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { DashboardStats } from "@/services/kingcaller/kingCallerTypes";

interface DashboardKPIsProps {
  stats?: DashboardStats | null;
  loading?: boolean;
  error?: string | null;
}

export function DashboardKPIs({ stats, loading, error }: DashboardKPIsProps) {
  // Use live data if available, fallback to default values
  const kpiData = {
    totalCalls: stats?.totalCalls || 0,
    totalMessages: stats?.totalMessages || 0,
    totalAgents: stats?.totalAgents || 0,
    activeIntegrations: stats?.activeIntegrations || 0
  };

  const KPIS = [
    {
      title: "Total Calls",
      value: kpiData?.totalCalls?.toLocaleString() || "0",
      change: "+12.5%",
      icon: Phone,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      title: "Total Messages", 
      value: kpiData?.totalMessages?.toLocaleString() || "0",
      change: "+8.2%",
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      title: "Active Agents",
      value: kpiData?.totalAgents?.toString() || "0",
      change: "+2",
      icon: Users,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      title: "Active Integrations",
      value: kpiData?.activeIntegrations?.toString() || "0",
      change: "+1",
      icon: BarChart3,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200"
    }
  ];

  if (loading) {
    return (
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Array(4).fill(0).map((_, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading dashboard data: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {KPIS.map((kpi, idx) => {
        const isPositiveChange = kpi.change.startsWith('+');
        const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;
        const trendColor = isPositiveChange ? 'text-green-600' : 'text-red-600';
        
        return (
          <Card key={idx} className={`h-full ${kpi.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{kpi.value}</div>
              <div className={`text-xs flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                {kpi.change} from last month
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
