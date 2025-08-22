
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardStats } from "@/services/kingcaller/kingCallerTypes";
import { Loader2 } from "lucide-react";

const COLORS = ["#6366f1", "#38bdf8", "#fbbf24"];

interface CallDistributionPieChartProps {
  stats?: DashboardStats | null;
  loading?: boolean;
  error?: string | null;
}

export function CallDistributionPieChart({ stats, loading, error }: CallDistributionPieChartProps) {
  // Use live data if available, fallback to mock data
  const totalCalls = stats?.totalCalls || 1247;
  const data = [
    { name: "Completed", value: Math.floor(totalCalls * 0.68) },
    { name: "Missed", value: Math.floor(totalCalls * 0.19) },
    { name: "Abandoned", value: Math.floor(totalCalls * 0.13) }
  ];

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">Call Distribution</CardTitle>
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
          <CardTitle className="text-lg">Call Distribution</CardTitle>
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
        <CardTitle className="text-lg">Call Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
