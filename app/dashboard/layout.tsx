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

      <SidebarInset className="min-w-0">
        <header className="flex h-16 min-w-0 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />

          <Breadcrumb className="min-w-0">
            <BreadcrumbList>
              {crumbs.map((crumb, index) => (
                <Fragment key={crumb.href}>
                  <BreadcrumbItem
                    className={
                      index < crumbs.length - 1 ? "hidden md:block" : undefined
                    }
                  >
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!crumb.isLast && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
