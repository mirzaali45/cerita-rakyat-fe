"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  ImageIcon,
  Smartphone,
} from "lucide-react";
import { ceritaService } from "@/services";
import { Cerita, Scene, Quiz } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ceritaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [cerita, setCerita] = useState<Cerita | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Preview state
  const [currentView, setCurrentView] = useState<"intro" | "scene" | "quiz" | "result">("intro");
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ceritaService.getById(ceritaId);
      setCerita(data);
      setScenes(data.scenes || []);
      setQuizzes(data.quizzes || []);
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [audio]);

  const currentScene = scenes[currentSceneIndex];
  const currentQuiz = quizzes[currentQuizIndex];

  const playAudio = (url: string) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(url);
    newAudio.play();
    newAudio.onended = () => setIsPlaying(false);
    setAudio(newAudio);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleStartReading = () => {
    if (scenes.length > 0) {
      setCurrentView("scene");
      setCurrentSceneIndex(0);
    } else if (quizzes.length > 0) {
      setCurrentView("quiz");
    } else {
      toast({ title: "Info", description: "Cerita belum memiliki scene atau quiz" });
    }
  };

  const handleNextScene = () => {
    pauseAudio();
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else if (quizzes.length > 0) {
      setCurrentView("quiz");
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setCurrentView("result");
    }
  };

  const handlePrevScene = () => {
    pauseAudio();
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleSelectAnswer = (pilihanId: string) => {
    if (showAnswer) return;
    setSelectedAnswer(pilihanId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuiz) return;
    
    setShowAnswer(true);
    const isCorrect = currentQuiz.pilihan.find(p => p.id === selectedAnswer)?.isBenar;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setCurrentView("result");
    }
  };

  const handleRestart = () => {
    setCurrentView("intro");
    setCurrentSceneIndex(0);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    pauseAudio();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-[600px] max-w-md mx-auto rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push(`/cerita/${ceritaId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Editor
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>Preview Mode</span>
          </div>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="max-w-sm mx-auto">
        <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
          {/* Phone Notch */}
          <div className="bg-black h-6 w-24 mx-auto rounded-full mb-2" />
          
          {/* Phone Screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden h-[600px] flex flex-col">
            
            {/* INTRO VIEW */}
            {currentView === "intro" && cerita && (
              <div className="flex-1 flex flex-col">
                {/* Cover Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/40">
                  {cerita.thumbnail ? (
                    <Image
                      src={cerita.thumbnail}
                      alt={cerita.judul}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="mb-2 bg-white/20 hover:bg-white/30">
                      {cerita.kategori?.icon} {cerita.kategori?.nama}
                    </Badge>
                    <h1 className="text-2xl font-bold">{cerita.judul}</h1>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <p className="text-gray-600 text-sm flex-1">
                    {cerita.deskripsi || "Tidak ada deskripsi"}
                  </p>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>📖 {scenes.length} Scene</span>
                      <span>❓ {quizzes.length} Quiz</span>
                    </div>
                    
                    <Button className="w-full" size="lg" onClick={handleStartReading}>
                      Mulai Membaca
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE VIEW */}
            {currentView === "scene" && currentScene && (
              <div className="flex-1 flex flex-col">
                {/* Scene Image */}
                <div className="relative h-56 bg-gray-100">
                  {currentScene.gambar ? (
                    <Image
                      src={currentScene.gambar}
                      alt={`Scene ${currentScene.urutan}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Scene Counter */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentSceneIndex + 1} / {scenes.length}
                  </div>
                </div>

                {/* Scene Text */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-gray-800 leading-relaxed">
                    {currentScene.teks}
                  </p>
                </div>

                {/* Audio Player */}
                {currentScene.audio && (
                  <div className="px-4 pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => isPlaying ? pauseAudio() : playAudio(currentScene.audio!)}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" /> Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Dengarkan Narasi
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="p-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handlePrevScene}
                    disabled={currentSceneIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button className="flex-1" onClick={handleNextScene}>
                    {currentSceneIndex === scenes.length - 1 ? (
                      quizzes.length > 0 ? "Mulai Quiz" : "Selesai"
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* QUIZ VIEW */}
            {currentView === "quiz" && currentQuiz && (
              <div className="flex-1 flex flex-col p-4">
                {/* Quiz Header */}
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="mb-2">
                    Quiz {currentQuizIndex + 1} / {quizzes.length}
                  </Badge>
                  <h2 className="text-lg font-semibold">Uji Pemahamanmu!</h2>
                </div>

                {/* Question */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <p className="font-medium">{currentQuiz.pertanyaan}</p>
                  </CardContent>
                </Card>

                {/* Options */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {currentQuiz.pilihan.map((pilihan, index) => {
                    const isSelected = selectedAnswer === pilihan.id;
                    const isCorrect = pilihan.isBenar;
                    
                    let bgColor = "bg-white hover:bg-gray-50";
                    if (showAnswer) {
                      if (isCorrect) {
                        bgColor = "bg-green-100 border-green-500";
                      } else if (isSelected && !isCorrect) {
                        bgColor = "bg-red-100 border-red-500";
                      }
                    } else if (isSelected) {
                      bgColor = "bg-primary/10 border-primary";
                    }

                    return (
                      <button
                        key={pilihan.id}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${bgColor}`}
                        onClick={() => handleSelectAnswer(pilihan.id)}
                        disabled={showAnswer}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1 text-sm">{pilihan.teks}</span>
                          {showAnswer && isCorrect && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Submit/Next Button */}
                <div className="mt-4">
                  {!showAnswer ? (
                    <Button
                      className="w-full"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                    >
                      Jawab
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleNextQuiz}>
                      {currentQuizIndex === quizzes.length - 1 ? "Lihat Hasil" : "Lanjut"}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* RESULT VIEW */}
            {currentView === "result" && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-4xl">🎉</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Selesai!</h2>
                <p className="text-gray-600 mb-6">
                  Kamu telah menyelesaikan cerita ini
                </p>

                {quizzes.length > 0 && (
                  <Card className="w-full mb-6">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Skor Quiz</p>
                      <p className="text-3xl font-bold text-primary">
                        {score} / {quizzes.length}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {score === quizzes.length ? "Sempurna! 🌟" : 
                         score >= quizzes.length / 2 ? "Bagus! 👍" : "Coba lagi! 💪"}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button className="w-full" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Baca Ulang
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Info */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Ini adalah preview bagaimana cerita akan tampil di aplikasi mobile
      </p>
    </div>
  );
}