import type { ApiStore } from "@/lib/api/types/store.types";

export type StoreSummary = {
  companyName: string;
  gstNumber: string;
  paymentConfigured: boolean;
  profileComplete: number;
  location: string;
  contactLine: string;
  paymentPreview: string;
  hasLogo: boolean;
  setupSteps: SetupStep[];
  nextAction: string;
};

export type SetupStep = {
  label: string;
  done: boolean;
};

const PROFILE_FIELDS = [
  (store: ApiStore) => store.name,
  (store: ApiStore) => store.gstNumber,
  (store: ApiStore) => store.address.line1,
  (store: ApiStore) => store.address.city,
  (store: ApiStore) => store.address.state,
  (store: ApiStore) => store.address.pincode,
] as const;

function isPaymentConfigured(store: ApiStore): boolean {
  const payment = store.paymentInfo;

  return Boolean(
    payment?.upiId?.trim() &&
    payment.bankName?.trim() &&
    payment.accountName?.trim() &&
    payment.accountNumber?.trim() &&
    payment.ifscCode?.trim(),
  );
}

function formatLocation(store: ApiStore): string {
  const parts = [
    store.address.city?.trim(),
    store.address.state?.trim(),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Location not added";
}

function formatContactLine(store: ApiStore): string {
  const email = store.email?.trim();
  const mobile = store.mobile?.trim();

  if (email && mobile) {
    return `${email} · ${mobile}`;
  }

  return email || mobile || "Add email and phone for invoices";
}

function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");

  if (digits.length < 4) {
    return accountNumber;
  }

  return `****${digits.slice(-4)}`;
}

function formatPaymentPreview(store: ApiStore): string {
  const payment = store.paymentInfo;

  if (!payment || !isPaymentConfigured(store)) {
    return "Add UPI and bank details to get paid faster";
  }

  const parts = [payment.bankName?.trim(), payment.upiId?.trim()].filter(
    Boolean,
  );

  if (payment.accountNumber?.trim()) {
    parts.push(maskAccountNumber(payment.accountNumber.trim()));
  }

  return parts.join(" · ");
}

function getSetupSteps(store: ApiStore | null): SetupStep[] {
  if (!store) {
    return [
      { label: "Create store profile", done: false },
      { label: "Add GST number", done: false },
      { label: "Configure payment details", done: false },
      { label: "Upload logo URL", done: false },
    ];
  }

  const paymentConfigured = isPaymentConfigured(store);

  return [
    {
      label: "Store profile created",
      done: Boolean(store.name?.trim() && store.address?.line1?.trim()),
    },
    {
      label: "GST number added",
      done: Boolean(store.gstNumber?.trim()),
    },
    {
      label: "Payment details configured",
      done: paymentConfigured,
    },
    {
      label: "Logo added",
      done: Boolean(store.logoUrl?.trim()),
    },
  ];
}

function getNextAction(store: ApiStore | null, steps: SetupStep[]): string {
  if (!store) {
    return "Start by filling in your company and address details below.";
  }

  const pendingStep = steps.find((step) => !step.done);

  if (!pendingStep) {
    return "Your store is fully configured and ready for invoicing.";
  }

  switch (pendingStep.label) {
    case "GST number added":
      return "Add your GST number to stay compliant on tax invoices.";
    case "Payment details configured":
      return "Set up UPI and bank details so customers know how to pay you.";
    case "Logo added":
      return "Add a logo URL to personalize invoices and your workspace.";
    default:
      return "Complete the remaining fields in the form below.";
  }
}

export function getEmptyStoreSummary(): StoreSummary {
  const setupSteps = getSetupSteps(null);

  return {
    companyName: "",
    gstNumber: "",
    paymentConfigured: false,
    profileComplete: 0,
    location: "Not set up yet",
    contactLine: "Add your business contact details",
    paymentPreview: "Customers need a way to pay you",
    hasLogo: false,
    setupSteps,
    nextAction: getNextAction(null, setupSteps),
  };
}

export function getStoreSummary(store: ApiStore): StoreSummary {
  const paymentConfigured = isPaymentConfigured(store);
  const setupSteps = getSetupSteps(store);
  const completedSteps = setupSteps.filter((step) => step.done).length;

  return {
    companyName: (store.name || "").trim(),
    gstNumber: (store.gstNumber || "").trim(),
    paymentConfigured,
    profileComplete: Math.round((completedSteps / setupSteps.length) * 100),
    location: formatLocation(store),
    contactLine: formatContactLine(store),
    paymentPreview: formatPaymentPreview(store),
    hasLogo: Boolean(store.logoUrl?.trim()),
    setupSteps,
    nextAction: getNextAction(store, setupSteps),
  };
}
