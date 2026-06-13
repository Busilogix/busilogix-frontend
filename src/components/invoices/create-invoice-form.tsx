"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  MapPin,
  Receipt,
  Tag,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { BillingCart } from "@/components/invoices/billing-cart";
import { ProductQuickChips } from "@/components/invoices/product-quick-chips";
import { QuickAddBar } from "@/components/invoices/quick-add-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { InvoiceFormProgress } from "@/components/invoices/invoice-form-progress";
import { isApiError } from "@/lib/api/errors";
import { invoiceService } from "@/lib/api/invoice.service";
import { productService } from "@/lib/api/product.service";
import type { ApiProduct } from "@/lib/api/types/product.types";
import { applyCartItems } from "@/lib/invoices/apply-cart-items";
import { applyCustomerLookupByMobile } from "@/lib/invoices/apply-customer-lookup";
import { calculateCreateInvoiceTotals } from "@/lib/invoices/create-calculations";
import { buildCreateInvoicePayload } from "@/lib/invoices/build-create-payload";
import {
  GST_PRESETS,
  loadInvoiceTaxPreferences,
  saveInvoiceTaxPreferences,
} from "@/lib/invoices/invoice-form-preferences";
import {
  formatInvoiceAddressPreview,
  hasInvoiceAddress,
  isInvoiceCustomerMobileReady,
} from "@/lib/invoices/map-customer-lookup";
import { applyAutoWalkInCustomer } from "@/lib/invoices/auto-walk-in-customer";
import {
  applyCounterSaleCustomer,
  COUNTER_SALE_CUSTOMER,
  isCounterSaleCustomer,
} from "@/lib/invoices/counter-sale";
import { addProductToCart } from "@/lib/invoices/quick-add-product";
import {
  loadRecentBillingCustomers,
  saveRecentBillingCustomer,
  type RecentBillingCustomer,
} from "@/lib/invoices/recent-billing-customers";
import {
  loadRecentBillingProductIds,
  recordBillingProduct,
} from "@/lib/invoices/recent-billing-products";
import { formatCurrency } from "@/lib/invoices/format";
import { cn } from "@/lib/utils";
import {
  createDefaultCreateInvoiceValues,
  createInvoiceFormSchema,
  type CreateInvoiceFormInput,
} from "@/lib/validations/invoice";

import { CreateInvoiceSummary } from "./create-invoice-summary";

const HIGHLIGHT_DURATION_MS = 1200;

type CustomerLookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; customerName: string }
  | { status: "not_found" }
  | { status: "error"; message: string };

export function CreateInvoiceForm() {
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [customerLookup, setCustomerLookup] = useState<CustomerLookupState>({
    status: "idle",
  });
  const [recentCustomers, setRecentCustomers] = useState<
    RecentBillingCustomer[]
  >([]);
  const [addQuantity, setAddQuantity] = useState(1);
  const [recentProductIds, setRecentProductIds] = useState<string[]>([]);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(
    () => (loadInvoiceTaxPreferences().discountAmount ?? 0) > 0,
  );
  const [isTaxOpen, setIsTaxOpen] = useState(false);
  const [highlightedCartIndex, setHighlightedCartIndex] = useState<
    number | null
  >(null);
  const lastLookupMobileRef = useRef<string | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const quickAddInputRef = useRef<HTMLInputElement | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [defaultValues] = useState(() => ({
    ...createDefaultCreateInvoiceValues(),
    ...loadInvoiceTaxPreferences(),
  }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInvoiceFormInput>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues,
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");
  const customerMobile = watch("customer.mobile");
  const customerName = watch("customer.name");
  const customerEmail = watch("customer.email");
  const customerAddress = watch("customer.address");
  const taxPercentage = watch("taxPercentage");
  const taxType = watch("taxType");
  const discountAmount = watch("discountAmount");
  const addressErrors = errors.customer?.address;
  const resolvedCustomerAddress =
    customerAddress ?? createDefaultCreateInvoiceValues().customer.address;
  const hasAddressValues = hasInvoiceAddress(resolvedCustomerAddress);
  const addressPreview = formatInvoiceAddressPreview(resolvedCustomerAddress);

  const cartItemCount = useMemo(
    () => (watchedItems ?? []).filter((item) => Boolean(item.productId)).length,
    [watchedItems],
  );

  const customerComplete = Boolean(
    customerMobile?.trim() && customerName?.trim() && customerEmail?.trim(),
  );
  const itemsComplete = cartItemCount > 0;
  const isCounterSale = isCounterSaleCustomer({
    mobile: customerMobile ?? "",
    name: customerName ?? "",
    email: customerEmail ?? "",
    address:
      customerAddress ?? createDefaultCreateInvoiceValues().customer.address,
  });

  const taxSummaryLabel = `${Number(taxPercentage) || 0}% · ${taxType === "INTRA_STATE" ? "Intra-state" : "Inter-state"
    }`;
  const hasDiscount = Number(discountAmount) > 0;
  const discountPreview = hasDiscount
    ? `${formatCurrency(Number(discountAmount), "INR")} off`
    : "No discount — expand to add";

  const focusQuickAdd = useCallback(() => {
    quickAddInputRef.current?.focus();
  }, []);

  const flashCartRow = useCallback((index: number) => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    setHighlightedCartIndex(index);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedCartIndex(null);
    }, HIGHLIGHT_DURATION_MS);
  }, []);

  const handleQuickAdd = useCallback(
    (productId: string, quantity: number) => {
      const { nextItems, result } = addProductToCart(
        watchedItems ?? [],
        productId,
        quantity,
      );

      applyCartItems(nextItems, setValue);
      flashCartRow(result.index);
      recordBillingProduct(productId);
      setRecentProductIds(loadRecentBillingProductIds());
    },
    [flashCartRow, setValue, watchedItems],
  );

  const handleCounterSale = useCallback(() => {
    const isCurrentlyCounterSale =
      customerMobile?.trim() === COUNTER_SALE_CUSTOMER.mobile &&
      customerName?.trim() === COUNTER_SALE_CUSTOMER.name &&
      customerEmail?.trim() === COUNTER_SALE_CUSTOMER.email;

    if (isCurrentlyCounterSale) {
      setValue("customer.mobile", "", { shouldDirty: true, shouldValidate: false });
      setValue("customer.name", "", { shouldDirty: true, shouldValidate: false });
      setValue("customer.email", "", { shouldDirty: true, shouldValidate: false });
      setValue("customer.address", {
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      }, { shouldDirty: true, shouldValidate: false });
      setCustomerLookup({ status: "idle" });
      lastLookupMobileRef.current = null;
    } else {
      applyCounterSaleCustomer(setValue);
      setCustomerLookup({ status: "idle" });
      lastLookupMobileRef.current = COUNTER_SALE_CUSTOMER.mobile;
      focusQuickAdd();
    }
  }, [focusQuickAdd, setValue, customerMobile, customerName, customerEmail]);

  const handleAutofillWalkInFromMobile = useCallback(() => {
    const mobile = customerMobile?.trim() ?? "";

    if (isInvoiceCustomerMobileReady(mobile)) {
      applyAutoWalkInCustomer(mobile, setValue);
    } else {
      applyCounterSaleCustomer(setValue);
      lastLookupMobileRef.current = COUNTER_SALE_CUSTOMER.mobile;
    }

    focusQuickAdd();
  }, [customerMobile, focusQuickAdd, setValue]);

  const applyRecentCustomer = useCallback(
    (customer: RecentBillingCustomer) => {
      setValue("customer.mobile", customer.mobile, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.name", customer.name, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.email", customer.email, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setCustomerLookup({
        status: "found",
        customerName: customer.name,
      });
      lastLookupMobileRef.current = customer.mobile;
      focusQuickAdd();
    },
    [focusQuickAdd, setValue],
  );

  const runCustomerLookup = useCallback(
    async (mobile: string, immediate = false) => {
      if (mobile === COUNTER_SALE_CUSTOMER.mobile) {
        setCustomerLookup({ status: "idle" });
        lastLookupMobileRef.current = mobile;
        return;
      }

      if (!isInvoiceCustomerMobileReady(mobile)) {
        setCustomerLookup({ status: "idle" });
        lastLookupMobileRef.current = null;
        return;
      }

      if (!immediate && lastLookupMobileRef.current === mobile) {
        return;
      }

      setCustomerLookup({ status: "loading" });

      const result = await applyCustomerLookupByMobile(mobile, setValue);

      lastLookupMobileRef.current = mobile;

      if (result.status === "found") {
        setCustomerLookup({
          status: "found",
          customerName: result.customerName,
        });
        focusQuickAdd();
        return;
      }

      if (result.status === "not_found") {
        setCustomerLookup({ status: "not_found" });
        return;
      }

      setCustomerLookup({
        status: "error",
        message: result.message,
      });
    },
    [focusQuickAdd, setValue],
  );

  useEffect(() => {
    setRecentCustomers(loadRecentBillingCustomers());
    setRecentProductIds(loadRecentBillingProductIds());
    mobileInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (addressErrors && Object.keys(addressErrors).length > 0) {
      setIsAddressOpen(true);
    }
  }, [addressErrors]);

  useEffect(() => {
    if (customerLookup.status === "found" && hasAddressValues) {
      setIsAddressOpen(true);
    }
  }, [customerLookup.status, hasAddressValues]);

  useEffect(() => {
    if (errors.discountAmount) {
      setIsDiscountOpen(true);
    }
  }, [errors.discountAmount]);

  useEffect(() => {
    saveInvoiceTaxPreferences({
      taxPercentage: Number(taxPercentage) || 0,
      taxType,
      discountAmount: Number(discountAmount) || 0,
    });
  }, [taxPercentage, taxType, discountAmount]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);

      try {
        const response = await productService.list({ page: 0, size: 500 });

        if (!cancelled) {
          setProducts(response.items);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const totals = useMemo(
    () =>
      calculateCreateInvoiceTotals(
        watchedItems ?? [],
        products,
        Number(taxPercentage) || 0,
        Number(discountAmount) || 0,
      ),
    [watchedItems, products, taxPercentage, discountAmount],
  );

  const onSubmit = useCallback(
    async (data: CreateInvoiceFormInput) => {
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        const { message, invoice } = await invoiceService.create(
          buildCreateInvoicePayload(data),
        );

        saveInvoiceTaxPreferences({
          taxPercentage: data.taxPercentage,
          taxType: data.taxType,
          discountAmount: data.discountAmount,
        });
        saveRecentBillingCustomer(data.customer);
        setRecentCustomers(loadRecentBillingCustomers());

        toast.success("Invoice created", {
          description: message || invoice.invoiceNumber,
        });
        router.push(`/invoices/${invoice.id}`);
      } catch (error) {
        setSubmitError(
          isApiError(error)
            ? error.message
            : "Unable to create the invoice. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [router],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (event.key === "/" && !isTypingField) {
        event.preventDefault();
        focusQuickAdd();
        return;
      }

      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void handleSubmit(onSubmit)();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [focusQuickAdd, handleSubmit, onSubmit]);

  const {
    ref: mobileRegisterRef,
    onBlur: mobileOnBlur,
    ...mobileRegister
  } = register("customer.mobile", {
    onChange: () => {
      lastLookupMobileRef.current = null;
      if (customerLookup.status !== "idle") {
        setCustomerLookup({ status: "idle" });
      }
    },
  });

  const triggerCustomerLookup = useCallback(() => {
    const mobile = customerMobile?.trim() ?? "";
    void runCustomerLookup(mobile, true);
  }, [customerMobile, runCustomerLookup]);

  const canBill =
    !isSubmitting &&
    !isLoadingProducts &&
    products.length > 0 &&
    customerComplete &&
    itemsComplete;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 pb-6"
      noValidate
    >
      <InvoiceFormProgress
        customerComplete={customerComplete}
        itemsComplete={itemsComplete}
        itemCount={cartItemCount}
      />

      {submitError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {submitError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="border-b py-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">Customer</CardTitle>
                  <CardDescription>
                    Enter mobile and leave the field to search — or use autofill
                    shortcuts below
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="rounded-lg border border-dashed bg-muted/20 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Autofill options
                </p>
                <div className="flex flex-wrap items-center gap-2 w-full">
                  <Button
                    type="button"
                    size="sm"
                    variant={isCounterSale ? "default" : "outline"}
                    className="h-9 flex-1 sm:flex-none"
                    disabled={isSubmitting}
                    onClick={handleCounterSale}
                  >
                    Walk-in customer
                  </Button>
                  {recentCustomers.map((customer) => (
                    <Button
                      key={customer.mobile}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 flex-1 sm:flex-none"
                      disabled={isSubmitting}
                      onClick={() => applyRecentCustomer(customer)}
                    >
                      {customer.name}
                    </Button>
                  ))}
                </div>
              </div>

              {!isCounterSale && (
                <>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(9rem,1fr)_minmax(8rem,1.2fr)_minmax(10rem,1.4fr)]">
                    <Field data-invalid={!!errors.customer?.mobile || undefined}>
                      <FieldLabel htmlFor="customer-mobile">Mobile</FieldLabel>
                      <Input
                        id="customer-mobile"
                        type="tel"
                        placeholder="+917075891626"
                        disabled={isSubmitting}
                        autoComplete="tel"
                        ref={(element) => {
                          mobileRegisterRef(element);
                          mobileInputRef.current = element;
                        }}
                        onBlur={(event) => {
                          mobileOnBlur(event);
                          triggerCustomerLookup();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            triggerCustomerLookup();
                          }
                        }}
                        {...mobileRegister}
                      />
                      {customerLookup.status === "loading" ? (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Loader2 className="size-3 animate-spin" aria-hidden />
                          Looking up saved customer...
                        </p>
                      ) : customerLookup.status === "found" ? (
                        <p className="mt-1 text-xs text-emerald-600">
                          Saved customer autofill applied —{" "}
                          {customerLookup.customerName}
                        </p>
                      ) : customerLookup.status === "not_found" ? (
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            No saved customer for this mobile.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={handleAutofillWalkInFromMobile}
                          >
                            Autofill walk-in
                          </Button>
                        </div>
                      ) : customerLookup.status === "error" ? (
                        <p className="mt-1 text-xs text-destructive">
                          {customerLookup.message}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Leave the mobile field or press Enter to search saved
                          customers.
                        </p>
                      )}
                      <FieldError errors={[errors.customer?.mobile]} />
                    </Field>

                    <Field data-invalid={!!errors.customer?.name || undefined}>
                      <FieldLabel htmlFor="customer-name">Name</FieldLabel>
                      <Input
                        id="customer-name"
                        placeholder="Customer name"
                        disabled={isSubmitting}
                        className={cn(
                          customerLookup.status === "found" &&
                          "border-emerald-500/30 bg-emerald-500/5",
                        )}
                        {...register("customer.name")}
                      />
                      <FieldError errors={[errors.customer?.name]} />
                    </Field>

                    <Field data-invalid={!!errors.customer?.email || undefined}>
                      <FieldLabel htmlFor="customer-email">Email</FieldLabel>
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="email@example.com"
                        disabled={isSubmitting}
                        className={cn(
                          customerLookup.status === "found" &&
                          "border-emerald-500/30 bg-emerald-500/5",
                        )}
                        {...register("customer.email")}
                      />
                      <FieldError errors={[errors.customer?.email]} />
                    </Field>
                  </div>

                  <div className="border-t pt-5">
                    <button
                      type="button"
                      onClick={() => setIsAddressOpen((open) => !open)}
                      className="flex w-full items-start gap-3 rounded-xl border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
                      aria-expanded={isAddressOpen}
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <MapPin className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            Billing address
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Optional
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-xs leading-snug",
                            hasAddressValues
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {hasAddressValues
                            ? addressPreview
                            : "Leave collapsed to omit — expand to add billing address"}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                          isAddressOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>

                    {isAddressOpen ? (
                      <div className="mt-4 space-y-4 rounded-xl border border-dashed p-4">
                        <p className="text-xs text-muted-foreground">
                          If you add any address field, line 1, city, state, and
                          pincode are required. Line 2 is optional.
                        </p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Field
                            className="sm:col-span-2"
                            data-invalid={!!addressErrors?.line1 || undefined}
                          >
                            <FieldLabel htmlFor="address-line1">
                              Address line 1
                            </FieldLabel>
                            <Input
                              id="address-line1"
                              placeholder="Flat 302, Green Residency"
                              disabled={isSubmitting}
                              {...register("customer.address.line1")}
                            />
                            <FieldError errors={[addressErrors?.line1]} />
                          </Field>

                          <Field
                            className="sm:col-span-2"
                            data-invalid={!!addressErrors?.line2 || undefined}
                          >
                            <FieldLabel htmlFor="address-line2">
                              Address line 2{" "}
                              <span className="font-normal text-muted-foreground">
                                (optional)
                              </span>
                            </FieldLabel>
                            <Input
                              id="address-line2"
                              placeholder="Near city mall"
                              disabled={isSubmitting}
                              {...register("customer.address.line2")}
                            />
                            <FieldError errors={[addressErrors?.line2]} />
                          </Field>

                          <Field data-invalid={!!addressErrors?.city || undefined}>
                            <FieldLabel htmlFor="address-city">City</FieldLabel>
                            <Input
                              id="address-city"
                              placeholder="Bangalore"
                              disabled={isSubmitting}
                              {...register("customer.address.city")}
                            />
                            <FieldError errors={[addressErrors?.city]} />
                          </Field>

                          <Field data-invalid={!!addressErrors?.state || undefined}>
                            <FieldLabel htmlFor="address-state">State</FieldLabel>
                            <Input
                              id="address-state"
                              placeholder="Karnataka"
                              disabled={isSubmitting}
                              {...register("customer.address.state")}
                            />
                            <FieldError errors={[addressErrors?.state]} />
                          </Field>

                          <Field
                            className="sm:col-span-2"
                            data-invalid={!!addressErrors?.pincode || undefined}
                          >
                            <FieldLabel htmlFor="address-pincode">
                              Pincode
                            </FieldLabel>
                            <Input
                              id="address-pincode"
                              placeholder="560102"
                              disabled={isSubmitting}
                              {...register("customer.address.pincode")}
                            />
                            <FieldError errors={[addressErrors?.pincode]} />
                          </Field>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card
            className={cn(!customerComplete && "opacity-80")}
            aria-disabled={!customerComplete}
          >
            <CardHeader className="border-b py-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">Bill items</CardTitle>
                  <CardDescription>
                    {customerComplete
                      ? "Tap a product, scan SKU, or search"
                      : "Complete customer details above to add items"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {isLoadingProducts ? (
                <p className="text-sm text-muted-foreground">
                  Loading products...
                </p>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    No products in catalog. Add products before billing.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    render={<Link href="/products" />}
                  >
                    Add Product
                  </Button>
                </div>
              ) : (
                <>
                  <ProductQuickChips
                    products={products}
                    recentProductIds={recentProductIds}
                    quantity={addQuantity}
                    disabled={isSubmitting || !customerComplete}
                    onAdd={handleQuickAdd}
                  />
                  <QuickAddBar
                    products={products}
                    quantity={addQuantity}
                    onQuantityChange={setAddQuantity}
                    disabled={isSubmitting || !customerComplete}
                    onAdd={handleQuickAdd}
                    inputRef={quickAddInputRef}
                  />
                  <BillingCart
                    fields={fields}
                    remove={remove}
                    setValue={setValue}
                    errors={errors}
                    watchedItems={watchedItems}
                    products={products}
                    disabled={isSubmitting || !customerComplete}
                    highlightedIndex={highlightedCartIndex}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <button
              type="button"
              onClick={() => setIsTaxOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 border-b px-5 py-4 text-left"
              aria-expanded={isTaxOpen}
            >
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Receipt className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">Tax</CardTitle>
                  <CardDescription>{taxSummaryLabel}</CardDescription>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  isTaxOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {isTaxOpen ? (
              <CardContent className="pt-5">
                <FieldGroup>
                  <Field data-invalid={!!errors.taxPercentage || undefined}>
                    <FieldLabel>GST rate</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {GST_PRESETS.map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          size="sm"
                          variant={
                            Number(taxPercentage) === preset
                              ? "default"
                              : "outline"
                          }
                          disabled={isSubmitting}
                          onClick={() =>
                            setValue("taxPercentage", preset, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          {preset}%
                        </Button>
                      ))}
                    </div>
                    <Input
                      id="tax-percentage"
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      disabled={isSubmitting}
                      className="mt-3"
                      {...register("taxPercentage", { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.taxPercentage]} />
                  </Field>

                  <Field data-invalid={!!errors.taxType || undefined}>
                    <FieldLabel htmlFor="tax-type">Tax type</FieldLabel>
                    <Controller
                      control={control}
                      name="taxType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="tax-type" className="h-10 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INTRA_STATE">
                              Intra-state
                            </SelectItem>
                            <SelectItem value="INTER_STATE">
                              Inter-state
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.taxType]} />
                  </Field>
                </FieldGroup>
              </CardContent>
            ) : null}
          </Card>

          <Card>
            <button
              type="button"
              onClick={() => setIsDiscountOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 border-b px-5 py-4 text-left"
              aria-expanded={isDiscountOpen}
            >
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Tag className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">Discount</CardTitle>
                  <CardDescription
                    className={cn(hasDiscount && "text-foreground")}
                  >
                    {discountPreview}
                  </CardDescription>
                </div>
              </div>
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Optional</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isDiscountOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </span>
            </button>

            {isDiscountOpen ? (
              <CardContent className="pt-5">
                <FieldGroup>
                  <p className="text-xs text-muted-foreground">
                    Leave at 0 to skip discount on the invoice.
                  </p>
                  <Field data-invalid={!!errors.discountAmount || undefined}>
                    <FieldLabel htmlFor="discount-amount">
                      Discount amount (₹)
                    </FieldLabel>
                    <Input
                      id="discount-amount"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0"
                      disabled={isSubmitting}
                      {...register("discountAmount", { valueAsNumber: true })}
                    />
                    <FieldError errors={[errors.discountAmount]} />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    {[50, 100, 200, 500].map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        size="sm"
                        variant={
                          Number(discountAmount) === preset
                            ? "default"
                            : "outline"
                        }
                        disabled={isSubmitting}
                        onClick={() =>
                          setValue("discountAmount", preset, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        ₹{preset}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      disabled={isSubmitting}
                      onClick={() =>
                        setValue("discountAmount", 0, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Clear
                    </Button>
                  </div>
                </FieldGroup>
              </CardContent>
            ) : null}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="border-b">
              <CardTitle>Bill summary</CardTitle>
              <CardDescription>
                {cartItemCount} item{cartItemCount === 1 ? "" : "s"} ·{" "}
                {taxSummaryLabel}
                {hasDiscount
                  ? ` · ${formatCurrency(Number(discountAmount), "INR")} off`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <CreateInvoiceSummary
                totals={totals}
                taxType={taxType}
                taxPercentage={Number(taxPercentage) || 0}
              />

              <Separator />

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full hidden lg:flex"
                  disabled={!canBill}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden />
                      Billing...
                    </>
                  ) : (
                    <>
                      <Zap className="size-4" aria-hidden />
                      Bill now · {formatCurrency(totals.grandTotal, "INR")}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  render={<Link href="/invoices" />}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1 flex flex-col justify-center text-left whitespace-nowrap">
            <p className="text-xs font-medium text-muted-foreground leading-none">
              {cartItemCount} item{cartItemCount === 1 ? "" : "s"}
            </p>
            <p className="truncate text-base font-bold tabular-nums text-primary mt-1 leading-none">
              {formatCurrency(totals.grandTotal, "INR")}
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!canBill}
            className="shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              "Bill now"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
