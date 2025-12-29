"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookMarked, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      // Check if user is admin
      if (response.user.role !== "ADMIN") {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki akses ke panel admin",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store token and user
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${response.user.nama}!`,
        variant: "success",
      });

      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Login Gagal",
        description: err.response?.data?.message || "Email atau password salah",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <Card className="w-full max-w-md relative animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookMarked className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Kisah Nusa Admin</CardTitle>
            <CardDescription className="mt-2">
              Masuk ke panel admin untuk mengelola konten
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ceritarakyat.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          {/* Register Button */}
          <Link href="/auth/register" className="w-full">
            <Button variant="outline" className="w-full">
              Buat Akun Baru
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
