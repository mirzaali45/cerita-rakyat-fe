"use client";

import { Header } from "@/components/layout/header";
import { useSidebar } from "@/components/layout/sidebarContext";

interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageWrapper({ title, description, children }: PageWrapperProps) {
  const { openSidebar } = useSidebar();

  return (
    <>
      <Header title={title} description={description} onMenuClick={openSidebar} />
      {children}
    </>
  );
}
