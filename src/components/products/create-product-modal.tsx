"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateProductForm } from "./product-form";

type CreateProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreateProductModal({
  open,
  onOpenChange,
  onCreated,
}: CreateProductModalProps) {
  function handleSuccess() {
    onOpenChange(false);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            Add name, SKU, selling price, and opening stock for the new product.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <CreateProductForm
            variant="embedded"
            fieldIdPrefix="create-product-modal"
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
