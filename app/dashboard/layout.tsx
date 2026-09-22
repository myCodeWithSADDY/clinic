"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  patients: "Patients",
  appointments: "Appointments",
  prescriptions: "Prescriptions",
  staff: "Staff",
  new: "New",
  today: "Today",
};

function toLabel(segment: string) {
  return (
    labelMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

function useBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    return {
      label: toLabel(segment),
      href,
      isLast,
    };
  });
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const crumbs = useBreadcrumbs();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0 bg-transparent">
        {/* Top navigation */}
        <header className="sticky top-0 z-20 px-3 pt-3 sm:px-4 lg:px-6">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-3 shadow-[0_6px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90 sm:px-4">
            <SidebarTrigger className="rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950 dark:hover:text-cyan-300" />

            <Separator orientation="vertical" className="h-5 bg-slate-200 dark:bg-slate-700" />

            <div className="ml-auto">
              <ThemeToggle />
            </div>

            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                {crumbs.map((crumb, index) => (
                  <Fragment key={crumb.href}>
                    <BreadcrumbItem
                      className={
                        index < crumbs.length - 1
                          ? "hidden md:block"
                          : undefined
                      }
                    >
                      {crumb.isLast ? (
                        <BreadcrumbPage className="font-medium text-slate-900 dark:text-slate-100">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {!crumb.isLast && (
                      <BreadcrumbSeparator className="hidden text-slate-300 md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 px-3 pb-6 pt-4 sm:px-4 lg:px-6">
          <div className="min-w-0 p-1 sm:p-2 lg:p-3">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
