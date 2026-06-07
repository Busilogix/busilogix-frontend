"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { imageService } from "@/lib/api/image.service";

type LogoUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function LogoUploader({ value, onChange, disabled, compact = false }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPG, etc.)",
      });
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image size should be less than 5MB",
      });
      return;
    }

    setIsUploading(true);
    try {
      const data = await imageService.upload(file, "STORES");
      onChange(data.url);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Unable to upload image.",
      });
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerUpload = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={triggerUpload}
        className={`relative flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300 transition-all ${
          disabled || isUploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {value ? (
          <div className="relative size-full overflow-hidden rounded-xl bg-white p-1">
            <Image
              src={value}
              alt="Logo"
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
            {!disabled && !isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-sm transition-colors hover:bg-red-600"
                aria-label="Remove logo"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <Upload className="size-5" />
            <span className="text-[10px] font-medium">Upload</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {!compact && (
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={triggerUpload}
            className="text-xs h-8"
          >
            Select file
          </Button>
          <span className="text-[10px] text-muted-foreground leading-normal">
            Supports PNG, JPG, or GIF. Max 5MB.
          </span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
