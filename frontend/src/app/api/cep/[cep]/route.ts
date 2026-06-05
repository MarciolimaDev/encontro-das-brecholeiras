import { NextResponse } from "next/server";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export async function GET(_request: Request, { params }: { params: Promise<{ cep: string }> }) {
  const { cep } = await params;
  const digits = cep.replace(/\D/g, "");

  if (digits.length !== 8) {
    return NextResponse.json({ detail: "CEP inválido." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    if (!response.ok) {
      return NextResponse.json({ detail: "Não foi possível consultar o CEP." }, { status: 502 });
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return NextResponse.json({ detail: "CEP não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      cep: data.cep ?? "",
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.localidade ?? "",
      uf: data.uf ?? "",
    });
  } catch {
    return NextResponse.json({ detail: "Serviço de CEP indisponível." }, { status: 503 });
  }
}
