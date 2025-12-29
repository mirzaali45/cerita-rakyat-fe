"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookOpen,
  Settings,
  LogOut,
  BookMarked,
} from "lucide-react";
import { authService } from "@/services";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Kategori",
    href: "/kategori",
    icon: FolderOpen,
  },
  {
    title: "Cerita",
    href: "/cerita",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <BookMarked className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold">Kisah Nusa</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <Separator className="mb-4" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
