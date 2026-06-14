"use client";

import { useState } from "react";
import { LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SupportModal } from "./support-modal";

export function AuthSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 sm:top-6 sm:right-8 gap-2 bg-white/50 backdrop-blur-sm border-white/20 shadow-sm hover:bg-white"
        onClick={() => setOpen(true)}
      >
        <LifeBuoy className="size-4 text-primary" />
        <span className="font-semibold text-xs tracking-wide">Support</span>
      </Button>
      <SupportModal open={open} onOpenChange={setOpen} />
    </>
  );
}
