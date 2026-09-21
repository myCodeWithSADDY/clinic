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
    <Card className="border-0 bg-[linear-gradient(180deg,#ffffff,#f1f9ff)] shadow-[0_16px_40px_rgba(14,165,233,0.08)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col gap-2 text-base font-medium sm:flex-row sm:items-end sm:justify-between">
          <span className="text-slate-600">Revenue (last 30 days)</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Rs. {total.toLocaleString("en-PK")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.28} />
                <stop offset="55%" stopColor="#38bdf8" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#dfeaf5"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 11, fill: "#475569" }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: "#0ea5e9", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid #dbeafe",
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              }}
              formatter={(value) => [
                `Rs. ${Number(value ?? 0).toLocaleString("en-PK")}`,
                "Revenue",
              ]}
              labelFormatter={(label) => formatShortDate(String(label))}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0ea5e9"
              strokeWidth={3}
              fill="url(#revenueFill)"
              activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
