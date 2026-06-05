import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Login Admin | Encontro das Brecholeiras",
  description: "Acesso administrativo da Associação Encontro das Brecholeiras.",
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8f8] px-6 py-12">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#ffe8ed] to-transparent" />
      <div className="relative z-10 w-full max-w-md">
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
