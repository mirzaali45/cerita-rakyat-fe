"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon, Music, File } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (file: File) => Promise<string>;
  onRemove?: (url: string) => Promise<void>;
  value?: string | null;
  onChange: (url: string | null) => void;
  type?: "image" | "audio" | "file";
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize = 5,
  onUpload,
  onRemove,
  value,
  onChange,
  type = "image",
  disabled = false,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultAccept = {
    image: "image/jpeg,image/png,image/gif,image/webp",
    audio: "audio/mpeg,audio/wav,audio/ogg,audio/mp3",
    file: "*/*",
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Ukuran file maksimal ${maxSize}MB`);
        return;
      }

      // Validate file type
      const acceptTypes = (accept || defaultAccept[type]).split(",");
      const isValidType = acceptTypes.some((t) => {
        if (t === "*/*") return true;
        if (t.endsWith("/*")) {
          return file.type.startsWith(t.replace("/*", "/"));
        }
        return file.type === t;
      });

      if (!isValidType) {
        setError("Format file tidak didukung");
        return;
      }

      setUploading(true);
      try {
        const url = await onUpload(file);
        onChange(url);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        setError(error.response?.data?.message || error.message || "Gagal upload file");
      } finally {
        setUploading(false);
      }
    },
    [accept, defaultAccept, maxSize, onChange, onUpload, type]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = async () => {
    if (value && onRemove) {
      try {
        await onRemove(value);
      } catch (err) {
        // Ignore remove errors
      }
    }
    onChange(null);
  };

  const Icon = type === "image" ? ImageIcon : type === "audio" ? Music : File;

  if (value) {
    return (
      <div className={cn("relative", className)}>
        {type === "image" ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : type === "audio" ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
            <Music className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <audio controls className="w-full h-8">
                <source src={value} />
              </audio>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <File className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 truncate text-sm">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || defaultAccept[type]}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Mengupload...</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag & drop atau <span className="text-primary">pilih file</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {type === "image" && "JPG, PNG, GIF, WebP"}
                {type === "audio" && "MP3, WAV, OGG"}
                {type === "file" && "Semua format"}
                {" • "}Max {maxSize}MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
