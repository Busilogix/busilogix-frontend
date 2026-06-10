"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { AlertCircle, FileSpreadsheet, Loader2, Upload, X, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { productService } from "@/lib/api/product.service";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

type UploadProductsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded?: () => void;
};

export function UploadProductsModal({
  open,
  onOpenChange,
  onUploaded,
}: UploadProductsModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSample = async () => {
    setIsDownloadingSample(true);
    try {
      const blob = await productService.downloadSample();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "product-upload-template.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Sample template downloaded", {
        description: "Review the structure of product-upload-template.csv to format your data.",
      });
    } catch (err) {
      toast.error("Download failed", {
        description: "Unable to retrieve sample spreadsheet from server.",
      });
    } finally {
      setIsDownloadingSample(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isValidExtension = ["csv", "xlsx", "xls"].includes(extension || "");

    if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
      setError("Unsupported file format. Please upload a CSV or Excel (.xlsx/.xls) file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File is too large. Maximum size allowed is 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await productService.upload(file);
      toast.success("Upload successful", {
        description: response.message,
      });
      onOpenChange(false);
      setFile(null);
      onUploaded?.();
    } catch (err) {
      const message = isApiError(err)
        ? err.message
        : "Failed to upload inventory. Please check the file format.";
      setError(message);
      toast.error("Upload failed", {
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black tracking-tight flex items-center gap-2">
            <Upload className="size-5 text-primary" />
            Bulk Import Products
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Upload a spreadsheet to add new products or update existing stock levels and pricing in bulk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px]",
              dragActive
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-muted-foreground/25 hover:border-primary/45 hover:bg-muted/5",
              file && "border-solid border-emerald-500/30 bg-emerald-500/[0.02]"
            )}
            onClick={!file && !isUploading ? onButtonClick : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onChange={handleChange}
              disabled={isUploading}
            />

            {file ? (
              <div className="space-y-3 w-full">
                <div className="mx-auto size-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <FileSpreadsheet className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold truncate max-w-xs mx-auto text-foreground">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {!isUploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="text-xs text-destructive hover:bg-destructive/10 h-8 gap-1.5"
                  >
                    <X className="size-3.5" />
                    Remove file
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    Drag and drop file here, or <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports CSV or Excel (.xlsx, .xls) up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Banner */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 flex items-start gap-2.5 text-xs text-destructive font-medium">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Schema Instructions */}
          <div className="rounded-xl border bg-muted/20 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black tracking-wide text-foreground uppercase">
                Spreadsheet Template Guidelines
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                disabled={isDownloadingSample}
                onClick={handleDownloadSample}
                className="h-auto p-0 text-xs text-primary font-bold hover:underline flex items-center gap-1.5"
              >
                {isDownloadingSample ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                Download Sample
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your upload spreadsheet should have headers in the first row. All columns are compulsory and must align to the following layout:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] pt-1 font-mono">
              <div className="bg-background rounded border p-1.5 font-bold">
                SKU
                <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">(Required)</span>
              </div>
              <div className="bg-background rounded border p-1.5 font-bold">
                Name
                <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">(Required)</span>
              </div>
              <div className="bg-background rounded border p-1.5 font-bold">
                Description
                <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">(Required)</span>
              </div>
              <div className="bg-background rounded border p-1.5 font-bold">
                Selling Price
                <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">(Required)</span>
              </div>
              <div className="bg-background rounded border p-1.5 font-bold">
                Stock Quantity
                <span className="block text-[8px] text-muted-foreground font-normal mt-0.5">(Required)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!file || isUploading}
              onClick={handleUpload}
              className="min-w-24 shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Importing...
                </>
              ) : (
                "Upload & Sync"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
