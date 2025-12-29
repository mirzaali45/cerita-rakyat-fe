"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { ceritaService, kategoriService, uploadService } from "@/services";
import { Cerita, Kategori } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatDate, truncateText } from "@/lib/utils";

export default function CeritaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cerita, setCerita] = useState<Cerita[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCerita, setSelectedCerita] = useState<Cerita | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    thumbnail: "",
    kategoriId: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  const fetchKategori = useCallback(async () => {
    try {
      const data = await kategoriService.getAll();
      setKategori(data);
    } catch (error) {
      console.error("Failed to fetch kategori", error);
    }
  }, []);

  const fetchCerita = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : (statusFilter as "DRAFT" | "PUBLISHED");
      const response = await ceritaService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status,
      });
      setCerita(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat cerita", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  useEffect(() => {
    fetchCerita();
  }, [fetchCerita]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleCreate = async () => {
    if (!formData.judul || !formData.kategoriId) {
      toast({ title: "Error", description: "Judul dan kategori wajib diisi", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const newCerita = await ceritaService.create({
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        thumbnail: formData.thumbnail || null,
        kategoriId: formData.kategoriId,
        status: formData.status,
      });
      toast({ title: "Berhasil", description: "Cerita berhasil dibuat", variant: "success" });
      setCreateOpen(false);
      setFormData({ judul: "", deskripsi: "", thumbnail: "", kategoriId: "", status: "DRAFT" });
      router.push(`/cerita/${newCerita.id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal membuat cerita", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCerita) return;
    setSubmitting(true);
    try {
      await ceritaService.delete(selectedCerita.id);
      toast({ title: "Berhasil", description: "Cerita berhasil dihapus", variant: "success" });
      setDeleteOpen(false);
      fetchCerita();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus cerita", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (cerita: Cerita) => {
    try {
      if (cerita.status === "PUBLISHED") {
        await ceritaService.unpublish(cerita.id);
        toast({ title: "Berhasil", description: "Cerita berhasil di-unpublish", variant: "success" });
      } else {
        await ceritaService.publish(cerita.id);
        toast({ title: "Berhasil", description: "Cerita berhasil dipublish", variant: "success" });
      }
      fetchCerita();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal mengubah status", variant: "destructive" });
    }
  };

  const handleUploadThumbnail = async (file: File): Promise<string> => {
    const url = await uploadService.uploadImage(file);
    return url;
  };

  const columns = [
    {
      key: "judul",
      header: "Cerita",
      cell: (row: Cerita) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            {row.thumbnail ? (
              <Image
                src={row.thumbnail}
                alt={row.judul}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{row.judul}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
              {row.deskripsi ? truncateText(row.deskripsi, 30) : "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "kategori",
      header: "Kategori",
      className: "hidden md:table-cell",
      cell: (row: Cerita) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <span>{row.kategori?.icon}</span>
          <span className="text-sm">{row.kategori?.nama || "-"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Cerita) => (
        <Badge variant={row.status === "PUBLISHED" ? "success" : "warning"} className="text-xs">
          {row.status}
        </Badge>
      ),
    },
    {
      key: "viewCount",
      header: "Views",
      className: "hidden sm:table-cell",
      cell: (row: Cerita) => (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          {(row.views || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: (row: Cerita) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/cerita/${row.id}`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/cerita/${row.id}/preview`)}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePublish(row)}>
              {row.status === "PUBLISHED" ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" /> Unpublish
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedCerita(row);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <PageWrapper title="Cerita" description="Kelola cerita rakyat Indonesia">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm" className="w-full sm:w-auto sm:size-default">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" /> Tambah Cerita
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={cerita}
          loading={loading}
          searchable
          searchPlaceholder="Cari judul cerita..."
          onSearch={handleSearch}
          pagination={{
            ...meta,
            onPageChange: setPage,
          }}
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Cerita Baru</DialogTitle>
            <DialogDescription>
              Buat cerita rakyat baru. Anda dapat menambahkan scenes dan quiz setelah cerita dibuat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Masukkan judul cerita"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori <span className="text-destructive">*</span></Label>
              <Select
                value={formData.kategoriId}
                onValueChange={(v) => setFormData({ ...formData, kategoriId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategori.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.icon} {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi singkat tentang cerita"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <FileUpload
                type="image"
                value={formData.thumbnail || null}
                onChange={(url) => setFormData({ ...formData, thumbnail: url || "" })}
                onUpload={handleUploadThumbnail}
                maxSize={5}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button onClick={handleCreate} disabled={submitting} className="w-full sm:w-auto">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Cerita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Cerita?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus cerita &quot;{selectedCerita?.judul}&quot;?
              Semua scenes dan quiz yang terkait juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground w-full sm:w-auto"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
