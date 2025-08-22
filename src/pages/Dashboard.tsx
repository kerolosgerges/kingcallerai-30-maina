import React, { useState } from "react";
import { SimpleAnalyticsChart } from "@/components/dashboard/SimpleAnalyticsChart";
import { FastDashboardKPIs } from "@/components/dashboard/FastDashboardKPIs";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { CallDistributionPieChart } from "@/components/dashboard/CallDistributionPieChart";
import { RevenueTrendsChart } from "@/components/dashboard/RevenueTrendsChart";
import { DateRange } from "react-day-picker";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(undefined);

  const handleApplyDateRange = (range: DateRange | undefined) => {
    setAppliedDateRange(range);
  };

  // Mock data
  const stats = {
    totalUsers: 156,
    totalAgents: 12,
    totalCalls: 1234,
    totalMessages: 5678,
    activeIntegrations: 8
  };

  const metrics = {
    callVolume: [
      { date: '2023-12-01', count: 45 },
      { date: '2023-12-02', count: 52 },
      { date: '2023-12-03', count: 38 }
    ],
    userGrowth: [
      { date: '2023-12-01', count: 150 },
      { date: '2023-12-02', count: 155 },
      { date: '2023-12-03', count: 156 }
    ],
    agentPerformance: [
      { agentId: '1', name: 'Agent 1', callCount: 120, avgDuration: 180 },
      { agentId: '2', name: 'Agent 2', callCount: 95, avgDuration: 165 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-0 pt-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Key metrics of your Voice AI business at a glance.
          </p>
        </div>
        <div className="w-full px-4 md:px-8">
          <DateRangeFilter 
            range={dateRange} 
            onChange={setDateRange} 
            onApply={handleApplyDateRange}
          />
          <FastDashboardKPIs stats={stats} loading={false} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <SimpleAnalyticsChart metrics={metrics} loading={false} error={null} />
            <CallDistributionPieChart stats={stats} loading={false} error={null} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevenueTrendsChart metrics={metrics} loading={false} error={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;