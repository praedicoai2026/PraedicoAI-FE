import type { Metadata } from "next";
import { AuthEntrypoint } from "@/components/auth/auth-entrypoint";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create your PraedicoAI account.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <AuthEntrypoint resetToken={token} />;
}
