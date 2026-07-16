import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Activity, User, Settings, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Método", url: "/metodo", icon: BookOpen },
  { title: "Progreso", url: "/progreso", icon: Activity },
  { title: "Mi perfil", url: "/perfil", icon: User },
  { title: "Configuración", url: "/configuracion", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isMobile, setOpenMobile } = useSidebar();
  const closeIfMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function check() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { if (!cancelled) setIsAdmin(false); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      if (!cancelled) setIsAdmin(!!data);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);
  const allItems = isAdmin
    ? [...items, { title: "Admin", url: "/admin", icon: ShieldCheck } as const]
    : items;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" onClick={closeIfMobile} className="flex items-center px-2 py-2">
          <span className="text-base font-semibold tracking-[0.28em] text-foreground group-data-[collapsible=icon]:hidden">
            RIQSIN
          </span>
          <span className="hidden text-sm font-bold tracking-widest text-foreground group-data-[collapsible=icon]:inline">
            R
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => {
                const active =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} onClick={closeIfMobile}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 pb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-data-[collapsible=icon]:hidden">
          Conócete · Contrólate · Evoluciona
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}