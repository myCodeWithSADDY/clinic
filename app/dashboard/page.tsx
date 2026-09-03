"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Users, CalendarDays, FileText } from "lucide-react";

type Stats = {
  totalPatients: number;
  todaysAppointments: number;
  prescriptionsIssued: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");

        if (!res.ok) {
          throw new Error("Failed to load dashboard stats");
        }

        const data: Stats = await res.json();

        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="text-sm text-muted-foreground">
          Overview of today&apos;s clinic activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>

            <Users className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "--" : (stats?.totalPatients ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Appointments
            </CardTitle>

            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "--" : (stats?.todaysAppointments ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prescriptions Issued
            </CardTitle>

            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "--" : (stats?.prescriptionsIssued ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="mb-1 text-sm font-medium">Recent activity</h2>

        <p className="text-sm text-muted-foreground">
          Recently booked appointments and issued prescriptions will show up
          here.
        </p>
      </div>
    </div>
  );
}
