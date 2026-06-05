import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { ShopLoginForm } from "@/components/shop/ShopLoginForm";

export const metadata: Metadata = {
  title: "Login da Brecholeira | Encontro das Brecholeiras",
  description: "Acesse o painel da sua loja no Encontro das Brecholeiras.",
};

export default function ShopLoginPage() {
  return (
    <>
      <Header />
      <main className="grid min-h-screen place-items-center bg-background px-6 pb-16 pt-32">
        <Suspense fallback={<div className="text-sm font-semibold text-text-secondary">Carregando...</div>}>
          <ShopLoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
