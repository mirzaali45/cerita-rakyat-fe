"use client";

import { useEffect, useState, useCallback } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal, Pencil, Trash2, KeyRound, ToggleLeft, Loader2 } from "lucide-react";
import { userService } from "@/services";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export default function UsersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  
  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nama: "",
    role: "USER" as "ADMIN" | "USER",
  });
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAll({ page, limit: 10, search: search || undefined });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await userService.create(formData);
      toast({ title: "Berhasil", description: "User berhasil dibuat", variant: "success" });
      setCreateOpen(false);
      setFormData({ email: "", password: "", nama: "", role: "USER" });
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal membuat user", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await userService.update(selectedUser.id, {
        email: formData.email,
        nama: formData.nama,
        role: formData.role,
      });
      toast({ title: "Berhasil", description: "User berhasil diupdate", variant: "success" });
      setEditOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal update user", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await userService.delete(selectedUser.id);
      toast({ title: "Berhasil", description: "User berhasil dihapus", variant: "success" });
      setDeleteOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus user", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    setSubmitting(true);
    try {
      await userService.resetPassword(selectedUser.id, newPassword);
      toast({ title: "Berhasil", description: "Password berhasil direset", variant: "success" });
      setResetPasswordOpen(false);
      setNewPassword("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal reset password", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleStatus(user.id);
      toast({ title: "Berhasil", description: `Status user berhasil diubah`, variant: "success" });
      fetchUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal ubah status", variant: "destructive" });
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ email: user.email, password: "", nama: user.nama, role: user.role });
    setEditOpen(true);
  };

  const columns = [
    {
      key: "nama",
      header: "User",
      cell: (user: User) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="text-xs sm:text-sm">{user.nama.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{user.nama}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "hidden sm:table-cell",
      cell: (user: User) => (
        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (user: User) => (
        <Badge variant={user.isActive ? "success" : "destructive"} className="text-xs">
          {user.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Terdaftar",
      className: "hidden md:table-cell",
      cell: (user: User) => <span className="text-sm">{formatDate(user.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedUser(user); setResetPasswordOpen(true); }}>
              <KeyRound className="mr-2 h-4 w-4" /> Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
              <ToggleLeft className="mr-2 h-4 w-4" /> Toggle Status
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => { setSelectedUser(user); setDeleteOpen(true); }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <PageWrapper title="Users" description="Kelola pengguna aplikasi">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div />
          <Button onClick={() => setCreateOpen(true)} size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Tambah User</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          searchable
          searchPlaceholder="Cari nama atau email..."
          onSearch={handleSearch}
          pagination={{
            ...meta,
            onPageChange: setPage,
          }}
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
            <DialogDescription>Buat akun user baru</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as "ADMIN" | "USER" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="w-full sm:w-auto">Batal</Button>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as "ADMIN" | "USER" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="w-full sm:w-auto">Batal</Button>
            <Button onClick={handleEdit} disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Reset password untuk {selectedUser?.nama}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setResetPasswordOpen(false)} className="w-full sm:w-auto">Batal</Button>
            <Button onClick={handleResetPassword} disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user {selectedUser?.nama}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
