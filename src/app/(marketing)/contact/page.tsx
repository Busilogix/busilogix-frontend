"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useRef } from "react";
import { supportService } from "@/lib/api/index";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum allowed size is 5MB.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await supportService.submitSupportRequest(
        { name, email, subject, message },
        file || undefined
      );
      toast.success("Message sent!", {
        description: response.message || "We'll get back to you shortly.",
      });
      setSuccess(true);
    } catch (err) {
      const msg = isApiError(err)
        ? err.message
        : "Failed to send message. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-white to-white" />
        <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-6">
            <MessageSquare className="size-3.5" /> Get in touch
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            We&apos;re here to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              help you succeed
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Have a question, feedback, or need support? Send us a message and
            our team will respond as quickly as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left: Contact Info */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 mb-5">Contact information</h2>
                <div className="space-y-5">
                  {[
                    {
                      icon: Mail,
                      title: "Email us",
                      value: "support@busilogix.com",
                      sub: "We read every message",
                      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
                    },
                    {
                      icon: Clock,
                      title: "Response time",
                      value: "Within 24 hours",
                      sub: "Monday – Friday",
                      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                    },
                    {
                      icon: MessageSquare,
                      title: "Type of help",
                      value: "Billing, bugs, features",
                      sub: "Any question welcome",
                      color: "text-blue-600 bg-blue-50 border-blue-100",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                          item.color
                        )}
                      >
                        <item.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
                <p className="text-xs font-bold text-indigo-900 mb-1">Looking for help docs?</p>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Common questions about invoicing, inventory, and your account are answered in our support center.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-12 flex flex-col items-center text-center">
                  <div className="size-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
                    <CheckCircle className="size-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Message sent!</h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setName("");
                      setEmail("");
                      setSubject("");
                      setMessage("");
                      setFile(null);
                    }}
                    className="mt-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Send us a message</h2>
                  <p className="text-xs text-slate-500 mb-7">All fields marked with * are required.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-name"
                          required
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-subject">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-subject"
                        required
                        placeholder="Brief summary of your question or issue"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="contact-message"
                        required
                        placeholder="Describe your question or issue in as much detail as possible..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[140px] resize-y"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-1.5">
                      <Label>Attachment <span className="text-slate-400 font-normal">(optional, max 5MB)</span></Label>
                      <div
                        className={cn(
                          "relative border-2 border-dashed rounded-xl p-5 transition-all flex flex-col items-center justify-center text-center cursor-pointer",
                          "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30",
                          file && "border-solid border-emerald-300 bg-emerald-50/30"
                        )}
                        onClick={() => !file && !isSubmitting && fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isSubmitting}
                        />
                        {file ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <FileText className="size-4" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                                <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            {!isSubmitting && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFile(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <X className="size-3.5" /> Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Upload className="size-4.5 text-slate-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Click to upload a file</p>
                            <p className="text-xs text-slate-400">Screenshots, logs, or any relevant document</p>
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

                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || !name || !email || !subject || !message}
                        className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all rounded-xl font-bold flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
