"use client";

import { useEffect, useState, useCallback } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from "lucide-react";
import { kategoriService } from "@/services";
import { Kategori } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function KategoriPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ nama: "", icon: "" });

  const fetchKategori = useCallback(async () => {
    setLoading(true);
    try {
      const data = await kategoriService.getAll(true);
      setKategori(data);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat kategori", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await kategoriService.create({ nama: formData.nama, icon: formData.icon || null });
      toast({ title: "Berhasil", description: "Kategori berhasil dibuat", variant: "success" });
      setCreateOpen(false);
      setFormData({ nama: "", icon: "" });
      fetchKategori();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal membuat kategori", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedKategori) return;
    setSubmitting(true);
    try {
      await kategoriService.update(selectedKategori.id, { nama: formData.nama, icon: formData.icon || null });
      toast({ title: "Berhasil", description: "Kategori berhasil diupdate", variant: "success" });
      setEditOpen(false);
      fetchKategori();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal update kategori", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKategori) return;
    setSubmitting(true);
    try {
      await kategoriService.delete(selectedKategori.id);
      toast({ title: "Berhasil", description: "Kategori berhasil dihapus", variant: "success" });
      setDeleteOpen(false);
      fetchKategori();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus kategori", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (kat: Kategori) => {
    setSelectedKategori(kat);
    setFormData({ nama: kat.nama, icon: kat.icon || "" });
    setEditOpen(true);
  };

  return (
    <PageWrapper title="Kategori" description="Kelola kategori cerita rakyat">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <p className="text-sm text-muted-foreground">{kategori.length} kategori</p>
          <Button onClick={() => { setFormData({ nama: "", icon: "" }); setCreateOpen(true); }} size="sm" className="sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Tambah Kategori</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 sm:h-32" />
            ))}
          </div>
        ) : kategori.length === 0 ? (
          <Card className="py-8 sm:py-12">
            <CardContent className="text-center">
              <FolderOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">Belum ada kategori</p>
              <Button className="mt-3 sm:mt-4" onClick={() => setCreateOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {kategori.map((kat) => (
              <Card key={kat.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-xl sm:text-2xl">
                        {kat.icon || "📁"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{kat.nama}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {kat._count?.cerita || 0} cerita
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 sm:gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(kat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedKategori(kat); setDeleteOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>Buat kategori baru untuk cerita rakyat</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input
                placeholder="Contoh: Legenda"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <Input
                placeholder="Contoh: 🏛️"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="w-full sm:w-auto">Batal</Button>
            <Button onClick={handleCreate} disabled={submitting || !formData.nama} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="w-full sm:w-auto">Batal</Button>
            <Button onClick={handleEdit} disabled={submitting || !formData.nama} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori &quot;{selectedKategori?.nama}&quot;?
              Kategori dengan cerita tidak dapat dihapus.
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
