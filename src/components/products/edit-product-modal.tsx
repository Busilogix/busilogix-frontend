"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { EditProductForm } from "./product-form";

type EditProductModalProps = {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
};

export function EditProductModal({
  productId,
  open,
  onOpenChange,
  onUpdated,
}: EditProductModalProps) {
  function handleSuccess() {
    onOpenChange(false);
    onUpdated?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update name, SKU, selling price, and stock for this product.
          </DialogDescription>
        </DialogHeader>
        {open && productId ? (
          <EditProductForm
            productId={productId}
            variant="embedded"
            fieldIdPrefix="edit-product-modal"
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
