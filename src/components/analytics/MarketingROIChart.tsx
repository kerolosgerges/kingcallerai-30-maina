
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', spent: 5000, revenue: 15000, roi: 300 },
  { month: 'Feb', spent: 4500, revenue: 13500, roi: 300 },
  { month: 'Mar', spent: 6000, revenue: 21000, roi: 350 },
  { month: 'Apr', spent: 5500, revenue: 19250, roi: 350 },
  { month: 'May', spent: 7000, revenue: 24500, roi: 350 },
  { month: 'Jun', spent: 6500, revenue: 23400, roi: 360 },
];

const chartConfig = {
  spent: {
    label: "Ad Spend ($)",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue ($)",
    color: "hsl(var(--chart-2))",
  },
  roi: {
    label: "ROI (%)",
    color: "hsl(var(--chart-3))",
  },
};

export const MarketingROIChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing ROI</CardTitle>
        <CardDescription>Ad spend vs revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="spent" 
                stroke="var(--color-spent)" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
