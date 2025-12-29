"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { authService } from "@/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Settings, User as UserIcon, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || undefined} alt={user?.nama} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.nama ? getInitials(user.nama) : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.nama || "Admin"}</span>
                <span className="text-xs text-muted-foreground">{user?.role || "ADMIN"}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
