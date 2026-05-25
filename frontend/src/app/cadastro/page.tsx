import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { CuratorRegistrationForm } from "@/components/register/CuratorRegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro de Curadoras | Encontro das Brecholeiras",
  description:
    "Cadastre-se como curadora no Encontro das Brecholeiras. Moda circular, brechós e empreendedoras criativas.",
};

export default function CadastroPage() {
  return (
    <>
      <Header />
      <CuratorRegistrationForm />
      <Footer />
    </>
  );
}
