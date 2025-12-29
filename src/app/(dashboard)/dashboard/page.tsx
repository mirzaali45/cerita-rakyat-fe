"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, FolderOpen, Eye, TrendingUp, Star } from "lucide-react";
import { userService, kategoriService, ceritaService } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalUsers: number;
  totalKategori: number;
  totalCerita: number;
  publishedCerita: number;
  draftCerita: number;
  totalViews: number;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalKategori: 0,
    totalCerita: 0,
    publishedCerita: 0,
    draftCerita: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, kategoriRes, ceritaRes] = await Promise.all([
        userService.getAll({ limit: 1 }),
        kategoriService.getAll(true),
        ceritaService.getAll({ limit: 100 }),
      ]);

      const published = ceritaRes.data.filter((c) => c.status === "PUBLISHED").length;
      const draft = ceritaRes.data.filter((c) => c.status === "DRAFT").length;
      const views = ceritaRes.data.reduce((acc, c) => acc + c.views, 0);

      setStats({
        totalUsers: usersRes.meta.total,
        totalKategori: kategoriRes.length,
        totalCerita: ceritaRes.meta.total,
        publishedCerita: published,
        draftCerita: draft,
        totalViews: views,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat statistik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Kategori",
      value: stats.totalKategori,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Total Cerita",
      value: stats.totalCerita,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Published",
      value: stats.publishedCerita,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Draft",
      value: stats.draftCerita,
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950",
    },
  ];

  return (
    <PageWrapper title="Dashboard" description="Selamat datang di Admin Panel Cerita Rakyat">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 sm:h-8 w-16 sm:w-20" />
                ) : (
                  <p className="text-xl sm:text-3xl font-bold">{stat.value.toLocaleString()}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                href="/cerita"
                icon={BookOpen}
                title="Kelola Cerita"
                description="Tambah atau edit cerita rakyat"
              />
              <QuickActionCard
                href="/kategori"
                icon={FolderOpen}
                title="Kelola Kategori"
                description="Atur kategori cerita"
              />
              <QuickActionCard
                href="/users"
                icon={Users}
                title="Kelola Users"
                description="Lihat dan kelola pengguna"
              />
              <QuickActionCard
                href="/settings"
                icon={Star}
                title="Pengaturan"
                description="Konfigurasi aplikasi"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center p-3 sm:p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-center group"
    >
      <div className="p-2 sm:p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2 sm:mb-3">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      </div>
      <h3 className="font-medium text-sm sm:text-base">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">{description}</p>
    </a>
  );
}
