// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { PageWrapper } from "@/components/layout/page-wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Skeleton } from "@/components/ui/skeleton";
// import { FileUpload } from "@/components/ui/file-upload";
// import {
//   ArrowLeft,
//   Save,
//   Plus,
//   Pencil,
//   Trash2,
//   ImageIcon,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   GripVertical,
//   FileText,
//   HelpCircle,
// } from "lucide-react";
// import { ceritaService, kategoriService, uploadService } from "@/services";
// import { Cerita, Kategori, Scene, Quiz } from "@/types";
// import { useToast } from "@/hooks/use-toast";

// export default function CeritaDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const ceritaId = params.id as string;

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [cerita, setCerita] = useState<Cerita | null>(null);
//   const [kategori, setKategori] = useState<Kategori[]>([]);
//   const [scenes, setScenes] = useState<Scene[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);

//   // Form data for cerita
//   const [formData, setFormData] = useState({
//     judul: "",
//     deskripsi: "",
//     thumbnail: "",
//     kategoriId: "",
//   });

//   // Scene dialogs
//   const [sceneDialogOpen, setSceneDialogOpen] = useState(false);
//   const [sceneDeleteOpen, setSceneDeleteOpen] = useState(false);
//   const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
//   const [sceneForm, setSceneForm] = useState({ teks: "", gambar: "", audio: "" });

//   // Quiz dialogs
//   const [quizDialogOpen, setQuizDialogOpen] = useState(false);
//   const [quizDeleteOpen, setQuizDeleteOpen] = useState(false);
//   const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
//   const [quizForm, setQuizForm] = useState({
//     pertanyaan: "",
//     pilihan: [
//       { teks: "", isBenar: true },
//       { teks: "", isBenar: false },
//       { teks: "", isBenar: false },
//       { teks: "", isBenar: false },
//     ],
//   });

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [ceritaData, kategoriData] = await Promise.all([
//         ceritaService.getById(ceritaId),
//         kategoriService.getAll(),
//       ]);

//       setCerita(ceritaData);
//       setKategori(kategoriData);
//       setScenes(ceritaData.scenes || []);
//       setQuizzes(ceritaData.quizzes || []);
//       setFormData({
//         judul: ceritaData.judul,
//         deskripsi: ceritaData.deskripsi || "",
//         thumbnail: ceritaData.thumbnail || "",
//         kategoriId: ceritaData.kategoriId,
//       });
//     } catch (error) {
//       toast({ title: "Error", description: "Gagal memuat data cerita", variant: "destructive" });
//       router.push("/cerita");
//     } finally {
//       setLoading(false);
//     }
//   }, [ceritaId, router, toast]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleSaveCerita = async () => {
//     setSaving(true);
//     try {
//       await ceritaService.update(ceritaId, {
//         judul: formData.judul,
//         deskripsi: formData.deskripsi || null,
//         thumbnail: formData.thumbnail || null,
//         kategoriId: formData.kategoriId,
//       });
//       toast({ title: "Berhasil", description: "Cerita berhasil disimpan", variant: "success" });
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleTogglePublish = async () => {
//     if (!cerita) return;
//     try {
//       if (cerita.status === "PUBLISHED") {
//         await ceritaService.unpublish(ceritaId);
//         toast({ title: "Berhasil", description: "Cerita di-unpublish", variant: "success" });
//       } else {
//         await ceritaService.publish(ceritaId);
//         toast({ title: "Berhasil", description: "Cerita dipublish", variant: "success" });
//       }
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal mengubah status", variant: "destructive" });
//     }
//   };

//   // Upload handlers
//   const handleUploadImage = async (file: File): Promise<string> => {
//     return await uploadService.uploadImage(file);
//   };

//   const handleUploadAudio = async (file: File): Promise<string> => {
//     return await uploadService.uploadAudio(file);
//   };

//   // Scene handlers
//   const openSceneDialog = (scene?: Scene) => {
//     if (scene) {
//       setSelectedScene(scene);
//       setSceneForm({ teks: scene.teks, gambar: scene.gambar || "", audio: scene.audio || "" });
//     } else {
//       setSelectedScene(null);
//       setSceneForm({ teks: "", gambar: "", audio: "" });
//     }
//     setSceneDialogOpen(true);
//   };

//   const handleSaveScene = async () => {
//     setSaving(true);
//     try {
//       if (selectedScene) {
//         await ceritaService.updateScene(selectedScene.id, {
//           teks: sceneForm.teks,
//           gambar: sceneForm.gambar || null,
//           audio: sceneForm.audio || null,
//         });
//         toast({ title: "Berhasil", description: "Scene diupdate", variant: "success" });
//       } else {
//         await ceritaService.createSceneAuto(ceritaId, {
//           teks: sceneForm.teks,
//           gambar: sceneForm.gambar || null,
//           audio: sceneForm.audio || null,
//         });
//         toast({ title: "Berhasil", description: "Scene ditambahkan", variant: "success" });
//       }
//       setSceneDialogOpen(false);
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan scene", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteScene = async () => {
//     if (!selectedScene) return;
//     setSaving(true);
//     try {
//       await ceritaService.deleteScene(selectedScene.id);
//       toast({ title: "Berhasil", description: "Scene dihapus", variant: "success" });
//       setSceneDeleteOpen(false);
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus scene", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Quiz handlers
//   const openQuizDialog = (quiz?: Quiz) => {
//     if (quiz) {
//       setSelectedQuiz(quiz);
//       const pilihan = quiz.pilihan.length >= 4 
//         ? quiz.pilihan.map(p => ({ teks: p.teks, isBenar: p.isBenar }))
//         : [...quiz.pilihan.map(p => ({ teks: p.teks, isBenar: p.isBenar })), ...Array(4 - quiz.pilihan.length).fill({ teks: "", isBenar: false })];
//       setQuizForm({ pertanyaan: quiz.pertanyaan, pilihan });
//     } else {
//       setSelectedQuiz(null);
//       setQuizForm({
//         pertanyaan: "",
//         pilihan: [
//           { teks: "", isBenar: true },
//           { teks: "", isBenar: false },
//           { teks: "", isBenar: false },
//           { teks: "", isBenar: false },
//         ],
//       });
//     }
//     setQuizDialogOpen(true);
//   };

//   const handleSaveQuiz = async () => {
//     const validPilihan = quizForm.pilihan.filter(p => p.teks.trim());
//     if (validPilihan.length < 2) {
//       toast({ title: "Error", description: "Minimal 2 pilihan jawaban", variant: "destructive" });
//       return;
//     }
//     if (!validPilihan.some(p => p.isBenar)) {
//       toast({ title: "Error", description: "Harus ada jawaban benar", variant: "destructive" });
//       return;
//     }

//     setSaving(true);
//     try {
//       if (selectedQuiz) {
//         await ceritaService.updateQuiz(selectedQuiz.id, {
//           pertanyaan: quizForm.pertanyaan,
//           pilihan: validPilihan,
//         });
//         toast({ title: "Berhasil", description: "Quiz diupdate", variant: "success" });
//       } else {
//         await ceritaService.createQuiz({
//           pertanyaan: quizForm.pertanyaan,
//           ceritaId,
//           pilihan: validPilihan,
//         });
//         toast({ title: "Berhasil", description: "Quiz ditambahkan", variant: "success" });
//       }
//       setQuizDialogOpen(false);
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan quiz", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteQuiz = async () => {
//     if (!selectedQuiz) return;
//     setSaving(true);
//     try {
//       await ceritaService.deleteQuiz(selectedQuiz.id);
//       toast({ title: "Berhasil", description: "Quiz dihapus", variant: "success" });
//       setQuizDeleteOpen(false);
//       fetchData();
//     } catch (error: unknown) {
//       const err = error as { response?: { data?: { message?: string } } };
//       toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus quiz", variant: "destructive" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const setCorrectAnswer = (index: number) => {
//     setQuizForm({
//       ...quizForm,
//       pilihan: quizForm.pilihan.map((p, i) => ({ ...p, isBenar: i === index })),
//     });
//   };

//   if (loading) {
//     return (
//       <PageWrapper title="Loading...">
//         <div className="p-4 sm:p-6 space-y-6">
//           <Skeleton className="h-10 w-32" />
//           <Skeleton className="h-64 w-full" />
//         </div>
//       </PageWrapper>
//     );
//   }

//   return (
//     <PageWrapper title={cerita?.judul || "Detail Cerita"} description="Edit cerita, kelola scenes dan quiz">
//       <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//         {/* Back button and status */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <Button variant="ghost" onClick={() => router.push("/cerita")} size="sm">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
//           </Button>
//           <div className="flex items-center gap-2 sm:gap-4">
//             <div className="flex items-center gap-2">
//               <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
//               <Badge variant={cerita?.status === "PUBLISHED" ? "success" : "warning"}>
//                 {cerita?.status}
//               </Badge>
//             </div>
//             <Button variant="outline" onClick={handleTogglePublish} size="sm">
//               {cerita?.status === "PUBLISHED" ? (
//                 <>
//                   <XCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Unpublish</span>
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Publish</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         <Tabs defaultValue="info" className="space-y-4 sm:space-y-6">
//           <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
//             <TabsTrigger value="info" className="text-xs sm:text-sm">
//               <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Info</span> Cerita
//             </TabsTrigger>
//             <TabsTrigger value="scenes" className="text-xs sm:text-sm">
//               <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Scenes ({scenes.length})
//             </TabsTrigger>
//             <TabsTrigger value="quiz" className="text-xs sm:text-sm">
//               <HelpCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Quiz ({quizzes.length})
//             </TabsTrigger>
//           </TabsList>

//           {/* Info Tab */}
//           <TabsContent value="info">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg sm:text-xl">Informasi Cerita</CardTitle>
//                 <CardDescription>Edit informasi dasar cerita</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label>Judul</Label>
//                     <Input
//                       value={formData.judul}
//                       onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Kategori</Label>
//                     <Select
//                       value={formData.kategoriId}
//                       onValueChange={(v) => setFormData({ ...formData, kategoriId: v })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {kategori.map((k) => (
//                           <SelectItem key={k.id} value={k.id}>
//                             {k.icon} {k.nama}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Deskripsi</Label>
//                   <Textarea
//                     value={formData.deskripsi}
//                     onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
//                     rows={4}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Thumbnail</Label>
//                   <FileUpload
//                     type="image"
//                     value={formData.thumbnail || null}
//                     onChange={(url) => setFormData({ ...formData, thumbnail: url || "" })}
//                     onUpload={handleUploadImage}
//                     maxSize={5}
//                   />
//                 </div>
//                 <div className="pt-4">
//                   <Button onClick={handleSaveCerita} disabled={saving}>
//                     {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Scenes Tab */}
//           <TabsContent value="scenes">
//             <Card>
//               <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                 <div>
//                   <CardTitle className="text-lg sm:text-xl">Scenes</CardTitle>
//                   <CardDescription>Kelola scenes/adegan dalam cerita</CardDescription>
//                 </div>
//                 <Button onClick={() => openSceneDialog()} size="sm" className="w-full sm:w-auto">
//                   <Plus className="mr-2 h-4 w-4" /> Tambah Scene
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 {scenes.length === 0 ? (
//                   <div className="text-center py-8 sm:py-12 text-muted-foreground">
//                     <ImageIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
//                     <p className="text-sm sm:text-base">Belum ada scene</p>
//                     <Button className="mt-3 sm:mt-4" variant="outline" onClick={() => openSceneDialog()} size="sm">
//                       <Plus className="mr-2 h-4 w-4" /> Tambah Scene Pertama
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3 sm:space-y-4">
//                     {scenes.map((scene) => (
//                       <div
//                         key={scene.id}
//                         className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                       >
//                         <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
//                           <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
//                           <span className="font-medium text-sm w-6 sm:w-8">{scene.urutan}</span>
//                         </div>
//                         <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
//                           {scene.gambar ? (
//                             <Image
//                               src={scene.gambar}
//                               alt={`Scene ${scene.urutan}`}
//                               width={80}
//                               height={80}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center">
//                               <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{scene.teks}</p>
//                           {scene.audio && (
//                             <p className="text-xs text-muted-foreground mt-1">🔊 Audio tersedia</p>
//                           )}
//                         </div>
//                         <div className="flex gap-0.5 sm:gap-1">
//                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openSceneDialog(scene)}>
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-destructive"
//                             onClick={() => {
//                               setSelectedScene(scene);
//                               setSceneDeleteOpen(true);
//                             }}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Quiz Tab */}
//           <TabsContent value="quiz">
//             <Card>
//               <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                 <div>
//                   <CardTitle className="text-lg sm:text-xl">Quiz</CardTitle>
//                   <CardDescription>Kelola pertanyaan quiz untuk cerita ini</CardDescription>
//                 </div>
//                 <Button onClick={() => openQuizDialog()} size="sm" className="w-full sm:w-auto">
//                   <Plus className="mr-2 h-4 w-4" /> Tambah Quiz
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 {quizzes.length === 0 ? (
//                   <div className="text-center py-8 sm:py-12 text-muted-foreground">
//                     <HelpCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
//                     <p className="text-sm sm:text-base">Belum ada quiz</p>
//                     <Button className="mt-3 sm:mt-4" variant="outline" onClick={() => openQuizDialog()} size="sm">
//                       <Plus className="mr-2 h-4 w-4" /> Tambah Quiz Pertama
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3 sm:space-y-4">
//                     {quizzes.map((quiz, index) => (
//                       <div
//                         key={quiz.id}
//                         className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                       >
//                         <div className="flex items-start justify-between gap-3 sm:gap-4">
//                           <div className="flex-1">
//                             <p className="font-medium text-sm sm:text-base mb-2">
//                               {index + 1}. {quiz.pertanyaan}
//                             </p>
//                             <div className="grid gap-1">
//                               {quiz.pilihan.map((p, i) => (
//                                 <div
//                                   key={p.id}
//                                   className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded ${
//                                     p.isBenar
//                                       ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//                                       : "bg-muted"
//                                   }`}
//                                 >
//                                   {String.fromCharCode(65 + i)}. {p.teks}
//                                   {p.isBenar && " ✓"}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                           <div className="flex gap-0.5 sm:gap-1">
//                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openQuizDialog(quiz)}>
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 text-destructive"
//                               onClick={() => {
//                                 setSelectedQuiz(quiz);
//                                 setQuizDeleteOpen(true);
//                               }}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Scene Dialog */}
//       <Dialog open={sceneDialogOpen} onOpenChange={setSceneDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{selectedScene ? "Edit Scene" : "Tambah Scene"}</DialogTitle>
//             <DialogDescription>
//               {selectedScene ? "Ubah konten scene" : "Tambahkan scene baru ke cerita"}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Teks Narasi <span className="text-destructive">*</span></Label>
//               <Textarea
//                 value={sceneForm.teks}
//                 onChange={(e) => setSceneForm({ ...sceneForm, teks: e.target.value })}
//                 rows={4}
//                 placeholder="Tuliskan narasi untuk scene ini..."
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Gambar Scene</Label>
//               <FileUpload
//                 type="image"
//                 value={sceneForm.gambar || null}
//                 onChange={(url) => setSceneForm({ ...sceneForm, gambar: url || "" })}
//                 onUpload={handleUploadImage}
//                 maxSize={5}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Audio Narasi</Label>
//               <FileUpload
//                 type="audio"
//                 value={sceneForm.audio || null}
//                 onChange={(url) => setSceneForm({ ...sceneForm, audio: url || "" })}
//                 onUpload={handleUploadAudio}
//                 maxSize={10}
//               />
//             </div>
//           </div>
//           <DialogFooter className="flex-col sm:flex-row gap-2">
//             <Button variant="outline" onClick={() => setSceneDialogOpen(false)} className="w-full sm:w-auto">
//               Batal
//             </Button>
//             <Button onClick={handleSaveScene} disabled={saving || !sceneForm.teks.trim()} className="w-full sm:w-auto">
//               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Simpan
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Scene Delete Dialog */}
//       <AlertDialog open={sceneDeleteOpen} onOpenChange={setSceneDeleteOpen}>
//         <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Hapus Scene?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Apakah Anda yakin ingin menghapus scene #{selectedScene?.urutan}?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="flex-col sm:flex-row gap-2">
//             <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteScene} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
//               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Quiz Dialog */}
//       <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{selectedQuiz ? "Edit Quiz" : "Tambah Quiz"}</DialogTitle>
//             <DialogDescription>
//               {selectedQuiz ? "Ubah pertanyaan quiz" : "Tambahkan pertanyaan baru"}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Pertanyaan <span className="text-destructive">*</span></Label>
//               <Textarea
//                 value={quizForm.pertanyaan}
//                 onChange={(e) => setQuizForm({ ...quizForm, pertanyaan: e.target.value })}
//                 rows={2}
//                 placeholder="Tuliskan pertanyaan..."
//               />
//             </div>
//             <div className="space-y-3">
//               <Label>Pilihan Jawaban</Label>
//               {quizForm.pilihan.map((p, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   <span className="w-5 text-xs sm:text-sm font-medium">{String.fromCharCode(65 + i)}.</span>
//                   <Input
//                     value={p.teks}
//                     onChange={(e) => {
//                       const newPilihan = [...quizForm.pilihan];
//                       newPilihan[i].teks = e.target.value;
//                       setQuizForm({ ...quizForm, pilihan: newPilihan });
//                     }}
//                     placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
//                     className="flex-1 text-sm"
//                   />
//                   <Button
//                     type="button"
//                     variant={p.isBenar ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setCorrectAnswer(i)}
//                     className="flex-shrink-0"
//                   >
//                     {p.isBenar ? <CheckCircle className="h-4 w-4" /> : "✓"}
//                   </Button>
//                 </div>
//               ))}
//               <p className="text-xs text-muted-foreground">Klik tombol ✓ untuk menandai jawaban yang benar</p>
//             </div>
//           </div>
//           <DialogFooter className="flex-col sm:flex-row gap-2">
//             <Button variant="outline" onClick={() => setQuizDialogOpen(false)} className="w-full sm:w-auto">
//               Batal
//             </Button>
//             <Button onClick={handleSaveQuiz} disabled={saving || !quizForm.pertanyaan.trim()} className="w-full sm:w-auto">
//               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Simpan
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Quiz Delete Dialog */}
//       <AlertDialog open={quizDeleteOpen} onOpenChange={setQuizDeleteOpen}>
//         <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Hapus Quiz?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Apakah Anda yakin ingin menghapus pertanyaan ini?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="flex-col sm:flex-row gap-2">
//             <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteQuiz} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
//               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </PageWrapper>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import {
  ArrowLeft,
  Save,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Loader2,
  CheckCircle,
  XCircle,
  GripVertical,
  FileText,
  HelpCircle,
  Eye,
} from "lucide-react";
import { ceritaService, kategoriService, uploadService } from "@/services";
import { Cerita, Kategori, Scene, Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function CeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ceritaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cerita, setCerita] = useState<Cerita | null>(null);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Form data for cerita
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    thumbnail: "",
    kategoriId: "",
  });

  // Scene dialogs
  const [sceneDialogOpen, setSceneDialogOpen] = useState(false);
  const [sceneDeleteOpen, setSceneDeleteOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [sceneForm, setSceneForm] = useState({ teks: "", gambar: "", audio: "" });

  // Quiz dialogs
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [quizDeleteOpen, setQuizDeleteOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    pertanyaan: "",
    pilihan: [
      { teks: "", isBenar: true },
      { teks: "", isBenar: false },
      { teks: "", isBenar: false },
      { teks: "", isBenar: false },
    ],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ceritaData, kategoriData] = await Promise.all([
        ceritaService.getById(ceritaId),
        kategoriService.getAll(),
      ]);

      setCerita(ceritaData);
      setKategori(kategoriData);
      setScenes(ceritaData.scenes || []);
      setQuizzes(ceritaData.quizzes || []);
      setFormData({
        judul: ceritaData.judul,
        deskripsi: ceritaData.deskripsi || "",
        thumbnail: ceritaData.thumbnail || "",
        kategoriId: ceritaData.kategoriId,
      });
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data cerita", variant: "destructive" });
      router.push("/cerita");
    } finally {
      setLoading(false);
    }
  }, [ceritaId, router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveCerita = async () => {
    setSaving(true);
    try {
      await ceritaService.update(ceritaId, {
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        thumbnail: formData.thumbnail || null,
        kategoriId: formData.kategoriId,
      });
      toast({ title: "Berhasil", description: "Cerita berhasil disimpan", variant: "success" });
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!cerita) return;
    try {
      if (cerita.status === "PUBLISHED") {
        await ceritaService.unpublish(ceritaId);
        toast({ title: "Berhasil", description: "Cerita di-unpublish", variant: "success" });
      } else {
        await ceritaService.publish(ceritaId);
        toast({ title: "Berhasil", description: "Cerita dipublish", variant: "success" });
      }
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal mengubah status", variant: "destructive" });
    }
  };

  // Upload handlers
  const handleUploadImage = async (file: File): Promise<string> => {
    return await uploadService.uploadImage(file);
  };

  const handleUploadAudio = async (file: File): Promise<string> => {
    return await uploadService.uploadAudio(file);
  };

  // Scene handlers
  const openSceneDialog = (scene?: Scene) => {
    if (scene) {
      setSelectedScene(scene);
      setSceneForm({ teks: scene.teks, gambar: scene.gambar || "", audio: scene.audio || "" });
    } else {
      setSelectedScene(null);
      setSceneForm({ teks: "", gambar: "", audio: "" });
    }
    setSceneDialogOpen(true);
  };

  const handleSaveScene = async () => {
    setSaving(true);
    try {
      if (selectedScene) {
        await ceritaService.updateScene(selectedScene.id, {
          teks: sceneForm.teks,
          gambar: sceneForm.gambar || null,
          audio: sceneForm.audio || null,
        });
        toast({ title: "Berhasil", description: "Scene diupdate", variant: "success" });
      } else {
        await ceritaService.createSceneAuto(ceritaId, {
          teks: sceneForm.teks,
          gambar: sceneForm.gambar || null,
          audio: sceneForm.audio || null,
        });
        toast({ title: "Berhasil", description: "Scene ditambahkan", variant: "success" });
      }
      setSceneDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan scene", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteScene = async () => {
    if (!selectedScene) return;
    setSaving(true);
    try {
      await ceritaService.deleteScene(selectedScene.id);
      toast({ title: "Berhasil", description: "Scene dihapus", variant: "success" });
      setSceneDeleteOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus scene", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Quiz handlers
  const openQuizDialog = (quiz?: Quiz) => {
    if (quiz) {
      setSelectedQuiz(quiz);
      const pilihan = quiz.pilihan.length >= 4 
        ? quiz.pilihan.map(p => ({ teks: p.teks, isBenar: p.isBenar }))
        : [...quiz.pilihan.map(p => ({ teks: p.teks, isBenar: p.isBenar })), ...Array(4 - quiz.pilihan.length).fill({ teks: "", isBenar: false })];
      setQuizForm({ pertanyaan: quiz.pertanyaan, pilihan });
    } else {
      setSelectedQuiz(null);
      setQuizForm({
        pertanyaan: "",
        pilihan: [
          { teks: "", isBenar: true },
          { teks: "", isBenar: false },
          { teks: "", isBenar: false },
          { teks: "", isBenar: false },
        ],
      });
    }
    setQuizDialogOpen(true);
  };

  const handleSaveQuiz = async () => {
    const validPilihan = quizForm.pilihan.filter(p => p.teks.trim());
    if (validPilihan.length < 2) {
      toast({ title: "Error", description: "Minimal 2 pilihan jawaban", variant: "destructive" });
      return;
    }
    if (!validPilihan.some(p => p.isBenar)) {
      toast({ title: "Error", description: "Harus ada jawaban benar", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (selectedQuiz) {
        await ceritaService.updateQuiz(selectedQuiz.id, {
          pertanyaan: quizForm.pertanyaan,
          pilihan: validPilihan,
        });
        toast({ title: "Berhasil", description: "Quiz diupdate", variant: "success" });
      } else {
        await ceritaService.createQuiz({
          pertanyaan: quizForm.pertanyaan,
          ceritaId,
          pilihan: validPilihan,
        });
        toast({ title: "Berhasil", description: "Quiz ditambahkan", variant: "success" });
      }
      setQuizDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal menyimpan quiz", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;
    setSaving(true);
    try {
      await ceritaService.deleteQuiz(selectedQuiz.id);
      toast({ title: "Berhasil", description: "Quiz dihapus", variant: "success" });
      setQuizDeleteOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: "Error", description: err.response?.data?.message || "Gagal hapus quiz", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const setCorrectAnswer = (index: number) => {
    setQuizForm({
      ...quizForm,
      pilihan: quizForm.pilihan.map((p, i) => ({ ...p, isBenar: i === index })),
    });
  };

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <div className="p-4 sm:p-6 space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={cerita?.judul || "Detail Cerita"} description="Edit cerita, kelola scenes dan quiz">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Back button and status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => router.push("/cerita")} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
              <Badge variant={cerita?.status === "PUBLISHED" ? "success" : "warning"}>
                {cerita?.status}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => router.push(`/cerita/${ceritaId}/preview`)} size="sm">
              <Eye className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button variant="outline" onClick={handleTogglePublish} size="sm">
              {cerita?.status === "PUBLISHED" ? (
                <>
                  <XCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Unpublish</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Publish</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4 sm:space-y-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="info" className="text-xs sm:text-sm">
              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Info</span> Cerita
            </TabsTrigger>
            <TabsTrigger value="scenes" className="text-xs sm:text-sm">
              <ImageIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Scenes ({scenes.length})
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-xs sm:text-sm">
              <HelpCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Quiz ({quizzes.length})
            </TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Informasi Cerita</CardTitle>
                <CardDescription>Edit informasi dasar cerita</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Judul</Label>
                    <Input
                      value={formData.judul}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select
                      value={formData.kategoriId}
                      onValueChange={(v) => setFormData({ ...formData, kategoriId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <FileUpload
                    type="image"
                    value={formData.thumbnail || null}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url || "" })}
                    onUpload={handleUploadImage}
                    maxSize={5}
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveCerita} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenes Tab */}
          <TabsContent value="scenes">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Scenes</CardTitle>
                  <CardDescription>Kelola scenes/adegan dalam cerita</CardDescription>
                </div>
                <Button onClick={() => openSceneDialog()} size="sm" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Scene
                </Button>
              </CardHeader>
              <CardContent>
                {scenes.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <ImageIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Belum ada scene</p>
                    <Button className="mt-3 sm:mt-4" variant="outline" onClick={() => openSceneDialog()} size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Tambah Scene Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {scenes.map((scene) => (
                      <div
                        key={scene.id}
                        className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                          <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="font-medium text-sm w-6 sm:w-8">{scene.urutan}</span>
                        </div>
                        <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {scene.gambar ? (
                            <Image
                              src={scene.gambar}
                              alt={`Scene ${scene.urutan}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{scene.teks}</p>
                          {scene.audio && (
                            <p className="text-xs text-muted-foreground mt-1">🔊 Audio tersedia</p>
                          )}
                        </div>
                        <div className="flex gap-0.5 sm:gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openSceneDialog(scene)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setSelectedScene(scene);
                              setSceneDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Quiz</CardTitle>
                  <CardDescription>Kelola pertanyaan quiz untuk cerita ini</CardDescription>
                </div>
                <Button onClick={() => openQuizDialog()} size="sm" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Quiz
                </Button>
              </CardHeader>
              <CardContent>
                {quizzes.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <HelpCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Belum ada quiz</p>
                    <Button className="mt-3 sm:mt-4" variant="outline" onClick={() => openQuizDialog()} size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Tambah Quiz Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {quizzes.map((quiz, index) => (
                      <div
                        key={quiz.id}
                        className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base mb-2">
                              {index + 1}. {quiz.pertanyaan}
                            </p>
                            <div className="grid gap-1">
                              {quiz.pilihan.map((p, i) => (
                                <div
                                  key={p.id}
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded ${
                                    p.isBenar
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                      : "bg-muted"
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}. {p.teks}
                                  {p.isBenar && " ✓"}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-0.5 sm:gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openQuizDialog(quiz)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setQuizDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scene Dialog */}
      <Dialog open={sceneDialogOpen} onOpenChange={setSceneDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedScene ? "Edit Scene" : "Tambah Scene"}</DialogTitle>
            <DialogDescription>
              {selectedScene ? "Ubah konten scene" : "Tambahkan scene baru ke cerita"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Teks Narasi <span className="text-destructive">*</span></Label>
              <Textarea
                value={sceneForm.teks}
                onChange={(e) => setSceneForm({ ...sceneForm, teks: e.target.value })}
                rows={4}
                placeholder="Tuliskan narasi untuk scene ini..."
              />
            </div>
            <div className="space-y-2">
              <Label>Gambar Scene</Label>
              <FileUpload
                type="image"
                value={sceneForm.gambar || null}
                onChange={(url) => setSceneForm({ ...sceneForm, gambar: url || "" })}
                onUpload={handleUploadImage}
                maxSize={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Audio Narasi</Label>
              <FileUpload
                type="audio"
                value={sceneForm.audio || null}
                onChange={(url) => setSceneForm({ ...sceneForm, audio: url || "" })}
                onUpload={handleUploadAudio}
                maxSize={10}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSceneDialogOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button onClick={handleSaveScene} disabled={saving || !sceneForm.teks.trim()} className="w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scene Delete Dialog */}
      <AlertDialog open={sceneDeleteOpen} onOpenChange={setSceneDeleteOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Scene?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus scene #{selectedScene?.urutan}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteScene} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quiz Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedQuiz ? "Edit Quiz" : "Tambah Quiz"}</DialogTitle>
            <DialogDescription>
              {selectedQuiz ? "Ubah pertanyaan quiz" : "Tambahkan pertanyaan baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pertanyaan <span className="text-destructive">*</span></Label>
              <Textarea
                value={quizForm.pertanyaan}
                onChange={(e) => setQuizForm({ ...quizForm, pertanyaan: e.target.value })}
                rows={2}
                placeholder="Tuliskan pertanyaan..."
              />
            </div>
            <div className="space-y-3">
              <Label>Pilihan Jawaban</Label>
              {quizForm.pilihan.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 text-xs sm:text-sm font-medium">{String.fromCharCode(65 + i)}.</span>
                  <Input
                    value={p.teks}
                    onChange={(e) => {
                      const newPilihan = [...quizForm.pilihan];
                      newPilihan[i].teks = e.target.value;
                      setQuizForm({ ...quizForm, pilihan: newPilihan });
                    }}
                    placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant={p.isBenar ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCorrectAnswer(i)}
                    className="flex-shrink-0"
                  >
                    {p.isBenar ? <CheckCircle className="h-4 w-4" /> : "✓"}
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Klik tombol ✓ untuk menandai jawaban yang benar</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setQuizDialogOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button onClick={handleSaveQuiz} disabled={saving || !quizForm.pertanyaan.trim()} className="w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Delete Dialog */}
      <AlertDialog open={quizDeleteOpen} onOpenChange={setQuizDeleteOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pertanyaan ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}