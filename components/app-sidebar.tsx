"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePendingTasksCount } from "@/hooks/use-pending-tasks-count";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  PlusIcon,
  MinusIcon,
  LogOut,
  CrossIcon,
} from "lucide-react";

// Clinic navigation. Each top-level item with sub-items renders as a
// collapsible group; items with no `items` array render as a plain link.
type NavItem = {
  title: string;
  url: string;
  roles?: string[];
  items?: NavItem[];
};

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Patients",
      url: "/dashboard/patients",
      items: [
        { title: "All Patients", url: "/dashboard/patients" },
        { title: "Add Patient", url: "/dashboard/patients/new" },
      ],
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      items: [
        { title: "All Appointments", url: "/dashboard/appointment" },
        { title: "Book Appointment", url: "/dashboard/appointment/new" },
        { title: "Today", url: "/dashboard/appointment/today" },
      ],
    },
    {
      title: "Prescriptions",
      url: "/dashboard/prescriptions",
      items: [
        { title: "All Prescriptions", url: "/dashboard/prescriptions" },
        // Only doctors write prescriptions -- reception views/marks them done
        {
          title: "New Prescription",
          url: "/dashboard/prescriptions/new",
          roles: ["DOCTOR"],
        },
      ],
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();
  const pendingCount = usePendingTasksCount(user?.role);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-700/60 bg-slate-900 text-slate-50 shadow-[0_0_40px_rgba(15,23,42,0.15)]"
    >
      <SidebarHeader className="border-b border-white/10 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="rounded-xl px-2 hover:bg-white/5"
            >
              <Link href="/dashboard" className="w-full">
                <div className="flex size-8 items-center justify-center rounded-md bg-cyan-500 text-primary-foreground">
                  <CrossIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none text-left">
                  <span className="font-semibold tracking-wide text-white">
                    Clinic Portal
                  </span>
                  <span className="text-xs text-slate-400">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {data.navMain
              .filter(
                (item) => !item.roles || item.roles.includes(user?.role ?? ""),
              )
              .map((item) => {
                if (!item.items?.length) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="rounded-xl text-slate-200 hover:bg-white/5 hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-cyan-500 data-[active=true]:to-teal-500 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-cyan-500/20 data-[active=true]:hover:bg-gradient-to-r data-[active=true]:hover:from-cyan-500 data-[active=true]:hover:to-teal-500"
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const isSectionActive = item.items.some(
                  (sub) => pathname === sub.url,
                );

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isSectionActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="rounded-xl text-slate-200 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/5">
                          {item.title}{" "}
                          {item.title === "Prescriptions" &&
                            user?.role === "RECEPTIONIST" &&
                            pendingCount > 0 && (
                              <SidebarMenuBadge className="ml-auto bg-rose-500 text-white">
                                {pendingCount}
                              </SidebarMenuBadge>
                            )}
                          <PlusIcon className="ml-auto size-4 text-slate-400 group-data-[state=open]/collapsible:hidden" />
                          <MinusIcon className="ml-auto size-4 text-slate-400 group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="mt-1 space-y-1 border-l border-white/10 pl-2">
                          {item.items
                            .filter(
                              (sub) =>
                                !sub.roles ||
                                sub.roles.includes(user?.role ?? ""),
                            )
                            .map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === sub.url}
                                  className="rounded-lg text-slate-300 hover:bg-white/5 hover:text-white data-[active=true]:bg-cyan-500/15 data-[active=true]:text-cyan-100 data-[active=true]:shadow-none"
                                >
                                  <Link href={sub.url}>{sub.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              <span className="font-medium text-slate-200">Access</span>
              <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-cyan-200">
                {user?.role ?? "USER"}
              </span>
            </div>
            <SidebarMenuButton
              onClick={handleLogout}
              className="rounded-xl text-slate-200 hover:bg-rose-500/10 hover:text-white"
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="bg-slate-900 text-slate-300" />
    </Sidebar>
  );
}
