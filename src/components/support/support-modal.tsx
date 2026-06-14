"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, FileText, Loader2, Upload, X, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { supportService } from "@/lib/api/index";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";

type SupportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const { userName, userEmail } = useAuth();
  
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (open) {
      if (userName) setName(userName);
      if (userEmail) setEmail(userEmail);
      setSubject("");
      setMessage("");
      setFile(null);
      setError(null);
    }
  }, [open, userName, userEmail]);
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File is too large. Maximum size allowed is 5MB.");
      return;
    }

    setFile(selectedFile);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await supportService.submitSupportRequest({
        name,
        email,
        subject,
        message,
      }, file || undefined);
      
      toast.success("Request submitted", {
        description: response.message || "We will get back to you soon.",
      });
      
      onOpenChange(false);
      
    } catch (err) {
      const msg = isApiError(err)
        ? err.message
        : "Failed to submit request. Please try again.";
      setError(msg);
      toast.error("Submission failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>
                Need help? Fill out the form below and we'll get back to you as soon as possible.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting || !!userName}
                readOnly={!!userName}
                className={!!userName ? "bg-muted/50 text-muted-foreground" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || !!userEmail}
                readOnly={!!userEmail}
                className={!!userEmail ? "bg-muted/50 text-muted-foreground" : ""}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
            <Input
              id="subject"
              required
              placeholder="Brief summary of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
            <Textarea
              id="message"
              required
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Attachment (optional)</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer",
                "border-muted-foreground/25 hover:border-primary/45 hover:bg-muted/5",
                file && "border-solid border-emerald-500/30 bg-emerald-500/[0.02]"
              )}
              onClick={!file && !isSubmitting ? onButtonClick : undefined}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                disabled={isSubmitting}
              />

              {file ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <FileText className="size-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold truncate max-w-[200px] text-foreground">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  {!isSubmitting && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2.5 gap-1.5"
                    >
                      <X className="size-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                    <Upload className="size-5" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Click to upload a file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max file size: 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2 text-sm text-destructive font-medium">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t mt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !name || !email || !subject || !message}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
