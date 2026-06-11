"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-provider";
import { authService } from "@/lib/api/auth.service";
import { saveToken, removeToken } from "@/lib/api/token-storage";

export default function OAuthSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserEmail } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");

    if (!token) {
      toast.error("Authentication failed", {
        description: "No token was provided by the authentication server.",
      });
      router.replace("/login?error=oauth_failed");
      return;
    }

    async function handleAuth(authToken: string) {
      try {
        // 1. Save token using existing auth strategy (localStorage)
        saveToken(authToken);

        // 2. Fetch the user profile to sync email & name in context
        const user = await authService.getCurrentUser();
        
        // 3. Update the auth context with the user's email
        setUserEmail(user.email);

        toast.success("Welcome!", {
          description: `Successfully signed in as ${user.name || user.email}`,
        });

        // 4. Redirect to dashboard
        router.replace("/dashboard");
      } catch (error) {
        console.error("OAuth session initialization failed:", error);
        toast.error("Session initialization failed", {
          description: "Could not retrieve your user profile. Please try again.",
        });
        
        // Clean up token if login failed midway
        try {
          removeToken();
        } catch (e) {
          console.error(e);
        }

        router.replace("/login?error=oauth_failed");
      }
    }

    void handleAuth(token);
  }, [searchParams, router, setUserEmail]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h1 className="text-xl font-semibold text-foreground">Verifying session...</h1>
        <p className="text-sm text-muted-foreground">
          Setting up your secure environment. You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
