import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Activity, User, Settings } from "lucide-react";
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
import logoAsset from "../assets/riqsin-logo-transparent.png.asset.json";

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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" onClick={closeIfMobile} className="flex items-center gap-2 px-2 py-1.5">
          <img src={logoAsset.url} alt="RIQSIN" className="h-8 w-auto" />
          <span className="text-sm font-semibold tracking-[0.2em] text-foreground group-data-[collapsible=icon]:hidden">
            RIQSIN
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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