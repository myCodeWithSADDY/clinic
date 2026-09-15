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
    {
      title: "Administration",
      url: "/dashboard/staff",
      roles: ["DOCTOR"], // no separate admin role -- doctor manages staff for now
      items: [{ title: "Staff", url: "/dashboard/staff" }],
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
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Clinic Portal</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain
              .filter(
                (item) => !item.roles || item.roles.includes(user?.role ?? ""),
              )
              .map((item) => {
                // No sub-items -- render as a plain link (e.g. Dashboard)
                if (!item.items?.length) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black data-[active=true]:hover:text-white"
                      >
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Has sub-items -- render as a collapsible group, open by
                // default if the current route is inside this section
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
                        <SidebarMenuButton>
                          {item.title}{" "}
                          {item.title === "Prescriptions" &&
                            user?.role === "RECEPTIONIST" &&
                            pendingCount > 0 && (
                              <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                                {pendingCount}
                              </SidebarMenuBadge>
                            )}
                          <PlusIcon className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <MinusIcon className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
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
                                  className="data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black data-[active=true]:hover:text-white"
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
