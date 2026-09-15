// components/revenue-chart.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RevenuePoint = { date: string; revenue: number };

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
  });
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between text-base font-medium">
          <span>Revenue (last 30 days)</span>
          <span className="text-2xl font-bold text-foreground">
            Rs. {total.toLocaleString("en-PK")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => [
                `Rs. ${Number(value ?? 0).toLocaleString("en-PK")}`,
                "Revenue",
              ]}
              labelFormatter={(label) => formatShortDate(String(label))}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0f172a"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
