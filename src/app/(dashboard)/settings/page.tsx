"use client";

import { useEffect, useState, useCallback } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { Save, User, Settings, Shield, Loader2 } from "lucide-react";
import { authService, settingService, uploadService } from "@/services";
import { User as UserType, AppSetting } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User profile
  const [user, setUser] = useState<UserType | null>(null);
  const [profileForm, setProfileForm] = useState({ nama: "", avatar: "" });

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // App settings
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, appSettings] = await Promise.all([
        authService.getProfile(),
        settingService.getAll(),
      ]);

      setUser(profile);
      setProfileForm({ nama: profile.nama, avatar: profile.avatar || "" });
      setSettings(appSettings);

      const settingsObj: Record<string, string> = {};
      appSettings.forEach((s) => {
        settingsObj[s.key] = s.value;
      });
      setSettingsForm(settingsObj);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUploadAvatar = async (file: File): Promise<string> => {
    return await uploadService.uploadImage(file);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const updated = await authService.updateProfile({
        nama: profileForm.nama,
        avatar: profileForm.avatar || null,
      });
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast({ title: "Berhasil", description: "Profil diupdate", variant: "success" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal update profil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Konfirmasi password tidak cocok", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password minimal 6 karakter", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Berhasil", description: "Password berhasil diubah", variant: "success" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal ubah password", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSettings = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(settingsForm).map(([key, value]) => ({ key, value }));
      await settingService.bulkUpdate(settingsArray);
      toast({ title: "Berhasil", description: "Pengaturan disimpan", variant: "success" });
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal simpan pengaturan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <PageWrapper title="Settings">
        <div className="p-4 sm:p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Settings" description="Kelola profil dan pengaturan aplikasi">
      <div className="p-4 sm:p-6">
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              <Shield className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Keamanan
            </TabsTrigger>
            <TabsTrigger value="app" className="text-xs sm:text-sm">
              <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Aplikasi
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Profil Saya</CardTitle>
                <CardDescription>Kelola informasi profil akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={profileForm.avatar || undefined} />
                    <AvatarFallback className="text-base sm:text-lg bg-primary text-primary-foreground">
                      {user?.nama ? getInitials(user.nama) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-base sm:text-lg">{user?.nama}</h3>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Role: {user?.role}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                      value={profileForm.nama}
                      onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    <FileUpload
                      type="image"
                      value={profileForm.avatar || null}
                      onChange={(url) => setProfileForm({ ...profileForm, avatar: url || "" })}
                      onUpload={handleUploadAvatar}
                      maxSize={2}
                    />
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Keamanan</CardTitle>
                <CardDescription>Ubah password akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Password Lama</Label>
                    <Input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Baru</Label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Konfirmasi Password Baru</Label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordForm.oldPassword || !passwordForm.newPassword}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Shield className="mr-2 h-4 w-4" /> Ubah Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Settings Tab */}
          <TabsContent value="app">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Pengaturan Aplikasi</CardTitle>
                <CardDescription>Konfigurasi pengaturan global aplikasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 max-w-lg">
                  <div className="space-y-2">
                    <Label>Nama Aplikasi</Label>
                    <Input
                      value={settingsForm.app_name || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, app_name: e.target.value })}
                      placeholder="Cerita Rakyat Indonesia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Versi Aplikasi</Label>
                    <Input
                      value={settingsForm.app_version || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, app_version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div>
                      <Label className="text-sm sm:text-base">Mode Maintenance</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Aktifkan untuk menonaktifkan akses publik sementara
                      </p>
                    </div>
                    <Switch
                      checked={settingsForm.maintenance_mode === "true"}
                      onCheckedChange={(checked) =>
                        setSettingsForm({ ...settingsForm, maintenance_mode: checked ? "true" : "false" })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm sm:text-base">Pengaturan Tambahan</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Anda dapat menambahkan pengaturan kustom lainnya
                    </p>

                    {settings
                      .filter((s) => !["app_name", "app_version", "maintenance_mode"].includes(s.key))
                      .map((setting) => (
                        <div key={setting.key} className="space-y-2">
                          <Label className="capitalize text-sm">{setting.key.replace(/_/g, " ")}</Label>
                          <Input
                            value={settingsForm[setting.key] || ""}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, [setting.key]: e.target.value })
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <Button onClick={handleUpdateSettings} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
