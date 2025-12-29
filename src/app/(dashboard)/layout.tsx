// "use client";

// import { useEffect, useState, useCallback, createContext, useContext } from "react";
// import { useRouter } from "next/navigation";
// import { Sidebar } from "@/components/layout/sidebar";
// import { MobileSidebar } from "@/components/layout/mobile-sidebar";
// import { authService } from "@/services";
// import { Loader2 } from "lucide-react";
// import { SidebarContext } from "@/components/layout/sidebarContext";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     const token = authService.getToken();
//     const user = authService.getStoredUser();

//     if (!token || !user) {
//       router.push("/auth/login");
//       return;
//     }

//     if (user.role !== "ADMIN") {
//       router.push("/auth/login");
//       return;
//     }

//     setLoading(false);
//   }, [router]);

//   const handleCloseSidebar = useCallback(() => {
//     setSidebarOpen(false);
//   }, []);

//   const handleOpenSidebar = useCallback(() => {
//     setSidebarOpen(true);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <SidebarContext.Provider value={{ openSidebar: handleOpenSidebar }}>
//       <div className="min-h-screen bg-background">
//         {/* Desktop Sidebar */}
//         <Sidebar />
        
//         {/* Mobile Sidebar */}
//         <MobileSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
//         {/* Main Content */}
//         <main className="lg:pl-64">
//           {children}
//         </main>
//       </div>
//     </SidebarContext.Provider>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { authService } from "@/services";
import { Loader2 } from "lucide-react";
import { SidebarProvider } from "@/components/layout/sidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getStoredUser();

    if (!token || !user || user.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider value={{ openSidebar: handleOpenSidebar }}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="lg:pl-64">{children}</main>
      </div>
    </SidebarProvider>
  );
}
