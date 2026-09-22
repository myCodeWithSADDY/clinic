// components/visitor-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Repeat, TrendingUp } from "lucide-react";

type VisitorStatsData = {
  averagePerDay: number;
  uniquePatients: number;
  repeatedVisitors: number;
  repeatRatePercent: number;
};

export function VisitorStats({ data }: { data: VisitorStatsData }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      <Card className="border-sky-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Visitors / Day
          </CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averagePerDay}</div>
          <p className="text-xs text-muted-foreground">last 30 days</p>
        </CardContent>
      </Card>

      <Card className="border-teal-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Repeat Visitors
          </CardTitle>
          <Repeat className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.repeatedVisitors}</div>
          <p className="text-xs text-muted-foreground">
            of {data.uniquePatients} patients seen
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Repeat Rate
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.repeatRatePercent}%</div>
          <p className="text-xs text-muted-foreground">
            returned for another visit
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
