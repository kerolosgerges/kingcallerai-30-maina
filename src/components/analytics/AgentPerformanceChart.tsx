
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { agent: 'Sales Agent', calls: 1200, conversions: 234, rating: 4.8 },
  { agent: 'Support Agent', calls: 980, conversions: 145, rating: 4.6 },
  { agent: 'Lead Qualifier', calls: 1450, conversions: 312, rating: 4.7 },
  { agent: 'Follow-up Agent', calls: 750, conversions: 98, rating: 4.4 },
  { agent: 'Booking Agent', calls: 890, conversions: 187, rating: 4.9 },
];

const chartConfig = {
  calls: {
    label: "Total Calls",
    color: "hsl(var(--chart-1))",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-2))",
  },
};

export const AgentPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>Call volume and conversion rates by agent</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="calls" fill="var(--color-calls)" />
              <Bar dataKey="conversions" fill="var(--color-conversions)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
