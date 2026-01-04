"use client"

import * as React from "react"
import { Home, Music, Heart, Folder, Plus } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarFooter, useSidebar, } from "@/components/ui/sidebar"

const navigationItems = [
  {
    id: "home",
    title: "Início",
    icon: Home,
  },
  {
    id: "library",
    title: "Biblioteca",
    icon: Music,
  },
  {
    id: "favorites",
    title: "Favoritos",
    icon: Heart,
  },
  {
    id: "folders",
    title: "Pastas",
    icon: Folder,
  },
  {
    id: "add",
    title: "Adicionar Música",
    icon: Plus,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView: string
  onNavigate: (view: any) => void
}

export function AppSidebar({ currentView, onNavigate, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const isCollapsed = state === "collapsed"

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4 group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Music className="size-6" />
            <span className="group-data-[collapsible=icon]:hidden">CifraPobre</span>
          </div>
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0" />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4 group-data-[collapsible=icon]:px-2">
        {/* Logo CifraPobre */}
        <div className="flex items-center gap-2 font-bold text-primary">
          <Music className="size-6" />
          <span className="group-data-[collapsible=icon]:hidden">CifraPobre</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="justify-start">
        {/* Grupo 1: Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex w-full min-w-0 flex-col gap-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.title}
                    size="lg"
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0" />
      <SidebarRail />
    </Sidebar>
  )
}