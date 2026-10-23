"use client";

import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";

export function AuthEntrypoint({ resetToken }: { resetToken?: string }) {
  const router = useRouter();

  return (
    <AuthModal
      open
      initialView={resetToken ? "reset" : "register"}
      resetToken={resetToken}
      onClose={() => router.push("/")}
    />
  );
}
