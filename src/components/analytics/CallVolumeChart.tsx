
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2024-01', calls: 2400, successful: 2100 },
  { date: '2024-02', calls: 1398, successful: 1200 },
  { date: '2024-03', calls: 9800, successful: 8500 },
  { date: '2024-04', calls: 3908, successful: 3400 },
  { date: '2024-05', calls: 4800, successful: 4200 },
  { date: '2024-06', calls: 3800, successful: 3300 },
  { date: '2024-07', calls: 4300, successful: 3800 },
];

const chartConfig = {
  calls: {
    label: "Total Calls",
    color: "hsl(var(--chart-1))",
  },
  successful: {
    label: "Successful Calls",
    color: "hsl(var(--chart-2))",
  },
};

export const CallVolumeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Volume Trends</CardTitle>
        <CardDescription>Monthly call volume and success rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="var(--color-calls)" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="successful" 
                stroke="var(--color-successful)" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
