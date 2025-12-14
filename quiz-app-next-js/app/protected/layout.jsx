"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.push(`/public/user/signin?returnUrl=${returnUrl}`);
    }
  }, [user, loading, returnUrl, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export default Protected;

