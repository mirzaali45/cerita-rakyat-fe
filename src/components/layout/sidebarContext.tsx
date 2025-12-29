"use client";

import { createContext, useContext } from "react";

interface SidebarContextType {
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  openSidebar: () => {},
});

export const SidebarProvider = SidebarContext.Provider;
export const useSidebar = () => useContext(SidebarContext);
