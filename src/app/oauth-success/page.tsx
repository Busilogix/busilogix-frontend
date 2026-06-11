import type { Metadata } from "next";
import { Suspense } from "react";

import OAuthSuccessHandler from "./oauth-success-handler";

export const metadata: Metadata = {
  title: "Signing in | Busilogix",
  description: "Processing your Google OAuth authentication session.",
};

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<OAuthSuccessFallback />}>
      <OAuthSuccessHandler />
    </Suspense>
  );
}

function OAuthSuccessFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h1 className="text-xl font-semibold text-foreground">Completing sign in...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your Google credentials.
        </p>
      </div>
    </div>
  );
}
