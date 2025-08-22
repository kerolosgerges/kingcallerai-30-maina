
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardMetrics } from "@/services/kingcaller/kingCallerTypes";
import { Loader2 } from "lucide-react";

interface SimpleAnalyticsChartProps {
  metrics?: DashboardMetrics | null;
  loading?: boolean;
  error?: string | null;
}

export function SimpleAnalyticsChart({ metrics, loading, error }: SimpleAnalyticsChartProps) {
  // Use live data if available, fallback to mock data
  const chartData = metrics?.callVolume?.map(item => ({
    month: new Date(item.date).toLocaleDateString('en', { month: 'short' }),
    calls: item.count
  })) || [
    { month: "Jan", calls: 124 },
    { month: "Feb", calls: 89 },
    { month: "Mar", calls: 156 },
    { month: "Apr", calls: 203 },
    { month: "May", calls: 178 },
    { month: "Jun", calls: 247 },
  ];

  if (loading) {
    return (
      <Card className="w-full shadow-sm mb-10">
        <CardHeader>
          <CardTitle className="text-lg">Calls Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-sm mb-10">
        <CardHeader>
          <CardTitle className="text-lg">Calls Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] flex items-center justify-center">
            <p className="text-red-600">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm mb-10">
      <CardHeader>
        <CardTitle className="text-lg">Calls Per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 2, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
