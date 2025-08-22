import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardMetrics } from "@/services/kingcaller/kingCallerTypes";
import { Loader2 } from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueTrendsChartProps {
  metrics?: DashboardMetrics | null;
  loading?: boolean;
  error?: string | null;
}

export function RevenueTrendsChart({ metrics, loading, error }: RevenueTrendsChartProps) {
  // Use live data if available, fallback to mock data
  const data: RevenueData[] = metrics?.userGrowth?.map(item => ({
    month: new Date(item.date).toLocaleDateString('en', { month: 'short' }),
    revenue: item.count * 50 // Simulate revenue based on user growth
  })) || [
    { month: "Jan", revenue: 6000 },
    { month: "Feb", revenue: 7500 },
    { month: "Mar", revenue: 10500 },
    { month: "Apr", revenue: 9000 },
    { month: "May", revenue: 12000 },
    { month: "Jun", revenue: 11000 },
  ];

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[250px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[250px] flex items-center justify-center">
            <p className="text-red-600">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}