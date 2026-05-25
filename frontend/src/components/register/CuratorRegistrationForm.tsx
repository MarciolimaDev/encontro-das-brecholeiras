"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/home/Icon";

const SEGMENTS = ["Brechó", "Artesanato", "Alimentação", "Sebo", "Plantas", "Verduras", "Outros"];
const ACTIVITIES = [
  "Participação em eventos (feirinhas, festivais)",
  "Capacitações e oficinas (moda sustentável, artesanato, alimentação)",
  "Divulgação e marketing (social media, conteúdo)",
  "Mentoria para brechós ou empreendimentos sustentáveis",
  "Ações de conscientização sobre consumo sustentável",
  "Outros",
];
const GENDERS = ["Feminino", "Masculino", "Não binário", "Prefiro não informar", "Outros"];
const ACKNOWLEDGEMENTS = ["Ciente", "Não", "Não entendi", "Sou de outro segmento"];

type FormState = {
  first_name: string;
  last_name: string;
  cpf: string;
  telefone: string;
  email: string;
  password: string;
  confirmPassword: string;
  nascimento: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  genero: string;
  marca: string;
  instagram: string;
  segmentos: string[];
  estrutura_brecho: string;
  atividades: string[];
  experiencia: string;
  estrutura_expor: string;
  feiras: string;
  ciencia_regra: string;
  como_conheceu: string;
  veracidade: boolean;
  comunicacoes: boolean;
};

const initial: FormState = {
  first_name: "",
  last_name: "",
  cpf: "",
  telefone: "",
  email: "",
  password: "",
  confirmPassword: "",
  nascimento: "",
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  genero: "",
  marca: "",
  instagram: "",
  segmentos: [],
  estrutura_brecho: "",
  atividades: [],
  experiencia: "",
  estrutura_expor: "",
  feiras: "",
  ciencia_regra: "",
  como_conheceu: "",
  veracidade: false,
  comunicacoes: false,
};

const steps = [
  { title: "Você", subtitle: "Dados pessoais", icon: "user" },
  { title: "Endereço", subtitle: "Onde você está", icon: "location" },
  { title: "Sua marca", subtitle: "Brechó & segmento", icon: "hanger" },
  { title: "Participação", subtitle: "Como quer atuar", icon: "sparkles" },
  { title: "Finalização", subtitle: "Termos & envio", icon: "clipboard" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border bg-white p-4 text-text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
const labelClass = "text-sm font-semibold text-text-secondary";
const draftKey = "brecholeiras:member-application-draft";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const whatsappPattern = /^\(\d{2}\) \d{5}-\d{4}$/;

type PersistedDraft = {
  step: number;
  form: Omit<FormState, "password" | "confirmPassword">;
};

const toDraft = (state: FormState): PersistedDraft["form"] => {
  const draft: Partial<FormState> = { ...state };
  delete draft.password;
  delete draft.confirmPassword;
  return draft as PersistedDraft["form"];
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
};

const formatWhatsapp = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/^(\(\d{2}\) \d{5})(\d)/, "$1-$2");
};

const readDraft = () => {
  if (typeof window === "undefined") {
    return { step: 0, form: initial };
  }

  const stored = window.localStorage.getItem(draftKey);
  if (!stored) {
    return { step: 0, form: initial };
  }

  try {
    const draft = JSON.parse(stored) as Partial<PersistedDraft>;
    const draftForm = draft.form as Partial<PersistedDraft["form"]> & { nome?: string };
    if (draftForm?.nome && !draftForm.first_name) {
      const [firstName, ...lastName] = draftForm.nome.trim().split(/\s+/);
      draftForm.first_name = firstName ?? "";
      draftForm.last_name = lastName.join(" ");
      delete draftForm.nome;
    }

    return {
      step: typeof draft.step === "number" ? Math.min(Math.max(draft.step, 0), steps.length - 1) : 0,
      form: draftForm ? { ...initial, ...draftForm, password: "", confirmPassword: "" } : initial,
    };
  } catch {
    window.localStorage.removeItem(draftKey);
    return { step: 0, form: initial };
  }
};

export function CuratorRegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const benefits = useMemo(
    () => [
      { icon: "leaf", title: "Movimento sustentável", text: "Faça parte da economia circular da moda." },
      { icon: "groups", title: "Rede de curadoras", text: "Conecte-se com brecholeiras de todo o Brasil." },
      { icon: "heart", title: "Visibilidade real", text: "Apareça em feiras, mídia e eventos do coletivo." },
    ] as const,
    [],
  );

  const progress = ((step + 1) / steps.length) * 100;
  const visibleMobileStepIndexes = Array.from(new Set([step - 1, step, step + 1])).filter(
    (index) => index >= 0 && index < steps.length,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const draft = readDraft();
      setForm(draft.form);
      setStep(draft.step);
      setDraftLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    window.localStorage.setItem(draftKey, JSON.stringify({ step, form: toDraft(form) }));
  }, [draftLoaded, form, step]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const toggleArray = (key: "segmentos" | "atividades", value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: previous[key].includes(value)
        ? previous[key].filter((item) => item !== value)
        : [...previous[key], value],
    }));
  };

  const showError = (text: string) => {
    setMessage({ type: "error", text });
  };

  const validateStep = () => {
    if (step === 0) {
      if (form.first_name.trim().length < 2) return showError("Informe seu primeiro nome.");
      if (form.last_name.trim().length < 2) return showError("Informe seu sobrenome.");
      if (!cpfPattern.test(form.cpf)) return showError("Informe o CPF no formato 000.000.000-00.");
      if (!whatsappPattern.test(form.telefone)) return showError("Informe o WhatsApp no formato (00) 00000-0000.");
      if (!emailPattern.test(form.email.trim())) return showError("Informe um e-mail válido.");
      if (form.password.length < 8) return showError("Crie uma senha com pelo menos 8 caracteres.");
      if (form.password !== form.confirmPassword) return showError("A confirmação de senha não confere.");
      if (!form.nascimento) return showError("Informe sua data de nascimento.");
    }

    if (step === 1) {
      if (form.cep.trim().length < 8) return showError("Informe um CEP válido.");
      if (form.endereco.trim().length < 2) return showError("Informe o endereço.");
      if (!form.numero.trim()) return showError("Informe o número.");
      if (form.bairro.trim().length < 2) return showError("Informe o bairro.");
      if (form.cidade.trim().length < 2) return showError("Informe a cidade.");
      if (form.estado.trim().length !== 2) return showError("Informe a UF com 2 letras.");
      if (!form.genero) return showError("Selecione uma opção de gênero.");
    }

    if (step === 2 && form.segmentos.length === 0) {
      return showError("Selecione ao menos um segmento.");
    }

    if (step === 3 && form.atividades.length === 0) {
      return showError("Selecione ao menos uma atividade.");
    }

    if (step === 4) {
      if (!form.ciencia_regra) return showError("Selecione uma opção sobre a regra do coletivo.");
      if (form.como_conheceu.trim().length < 2) return showError("Conte como conheceu o coletivo.");
      if (!form.veracidade) return showError("Você precisa concordar com a declaração de veracidade.");
    }

    setMessage(null);
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((current) => Math.max(current - 1, 0));
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/member-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showError(data?.detail ?? "Não foi possível enviar o cadastro.");
        return;
      }

      window.localStorage.removeItem(draftKey);
      setMessage({ type: "success", text: "Cadastro enviado! Em breve entraremos em contato." });
      setForm(initial);
      setStep(0);
    } catch {
      showError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      <main className="mx-auto max-w-container px-6 pb-20 pt-28">
        <section className="mb-12 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <div className="flex-1 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
              <Icon name="leaf" className="h-4 w-4" />
              Moda circular
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              Faça parte do movimento circular.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-text-secondary md:mx-0">
              Seja uma curadora no Encontro das Brecholeiras. Preencha o cadastro passo a passo.
            </p>
          </div>

          <div className="hidden w-1/3 md:block">
            <div className="relative aspect-square w-full overflow-hidden rounded-full border-8 border-white bg-secondary shadow-xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoI4lFqscmsu2VEETPirRaWypvp6rrIsyjJMq7ECVMfY34H8F3gxMFvnFqfDCEz0axB6wz3W3K20k8lYdEVETFdUcQCuUAti3BG4LcdeP44MDsXoOZu1W_CeteRnbv6O564FK0JMJXW5eAV34SWeCvikbwu7dg_maIuyJHXRIAg8J8eU4qgd8KGe0YO-QF_6c4i5uc8KNnEVg2c3zge3vEkkJzSjG4PmBk8emTpWzFakzPDGyhFs6I-bXR1hsFZ6wViLE9deS2eKmH"
                alt="Curadoras organizando peças de moda sustentável"
                fill
                className="object-cover"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </div>
        </section>

        <div id="cadastro" className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <aside className="order-2 space-y-4 lg:sticky lg:top-24 lg:order-1 lg:col-span-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-[#1c1c1c]">
                  <Icon name={benefit.icon} className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-text-primary">{benefit.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">{benefit.text}</p>
                </div>
              </div>
            ))}
          </aside>

          <form
            onSubmit={submit}
            className="order-1 space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm lg:order-2 lg:col-span-8"
          >
            <div className="space-y-4">
              <div className="hidden items-center justify-between gap-2 overflow-x-auto pb-1 md:flex">
                {steps.map((currentStep, index) => {
                  const isActive = index === step;
                  const isDone = index < step;

                  return (
                    <button
                      type="button"
                      key={currentStep.title}
                      onClick={() => index < step && setStep(index)}
                      className="flex min-w-[74px] flex-col items-center gap-2"
                    >
                      <span
                        className={
                          isActive
                            ? "grid h-10 w-10 scale-110 place-items-center rounded-full border-2 border-primary bg-primary text-white transition"
                            : isDone
                              ? "grid h-10 w-10 place-items-center rounded-full border-2 border-secondary bg-secondary text-[#1c1c1c] transition"
                              : "grid h-10 w-10 place-items-center rounded-full border-2 border-border text-text-secondary transition"
                        }
                      >
                        <Icon name={isDone ? "check" : currentStep.icon} className="h-5 w-5" />
                      </span>
                      <span className={isActive ? "text-center text-xs font-bold text-primary" : "text-center text-xs font-medium text-text-secondary"}>
                        {currentStep.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 pb-1 md:hidden">
                {visibleMobileStepIndexes.map((index) => {
                  const currentStep = steps[index];
                  const isActive = index === step;
                  const isDone = index < step;

                  return (
                    <button
                      type="button"
                      key={currentStep.title}
                      onClick={() => index < step && setStep(index)}
                      className="flex w-16 flex-col items-center gap-2"
                    >
                      <span
                        className={
                          isActive
                            ? "grid h-10 w-10 scale-110 place-items-center rounded-full border-2 border-primary bg-primary text-white transition"
                            : isDone
                              ? "grid h-10 w-10 place-items-center rounded-full border-2 border-secondary bg-secondary text-[#1c1c1c] transition"
                              : "grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-white text-text-secondary transition"
                        }
                      >
                        <Icon name={isDone ? "check" : currentStep.icon} className="h-5 w-5" />
                      </span>
                      <span
                        className={
                          isActive
                            ? "max-w-16 truncate text-center text-[11px] font-bold text-primary"
                            : "max-w-16 truncate text-center text-[11px] font-medium text-text-secondary"
                        }
                      >
                        {currentStep.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <p className="text-sm text-text-secondary">
                Passo <strong className="text-primary">{step + 1}</strong> de {steps.length} — {steps[step].subtitle}
              </p>

              {message && (
                <div
                  className={
                    message.type === "success"
                      ? "rounded-lg border border-secondary bg-secondary/15 px-4 py-3 text-sm font-semibold text-secondary-dark"
                      : "rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
                  }
                >
                  {message.text}
                </div>
              )}
            </div>

            <div className="space-y-5 pt-2">
              {step === 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Primeiro nome">
                    <input className={inputClass} value={form.first_name} onChange={(event) => set("first_name", event.target.value)} placeholder="Seu primeiro nome" />
                  </Field>
                  <Field label="Sobrenome">
                    <input className={inputClass} value={form.last_name} onChange={(event) => set("last_name", event.target.value)} placeholder="Seu sobrenome" />
                  </Field>
                  <Field label="CPF">
                    <input
                      className={inputClass}
                      inputMode="numeric"
                      maxLength={14}
                      value={form.cpf}
                      onChange={(event) => set("cpf", formatCpf(event.target.value))}
                      placeholder="000.000.000-00"
                    />
                  </Field>
                  <Field label="Data de nascimento">
                    <input type="date" className={inputClass} value={form.nascimento} onChange={(event) => set("nascimento", event.target.value)} />
                  </Field>
                  <Field label="Telefone / WhatsApp">
                    <input
                      className={inputClass}
                      inputMode="tel"
                      maxLength={15}
                      value={form.telefone}
                      onChange={(event) => set("telefone", formatWhatsapp(event.target.value))}
                      placeholder="(00) 00000-0000"
                    />
                  </Field>
                  <Field label="E-mail">
                    <input
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(event) => set("email", event.target.value.trim())}
                      placeholder="exemplo@email.com"
                    />
                  </Field>
                  <Field label="Senha">
                    <input type="password" className={inputClass} value={form.password} onChange={(event) => set("password", event.target.value)} placeholder="Mínimo 8 caracteres" />
                  </Field>
                  <Field label="Confirmar senha">
                    <input type="password" className={inputClass} value={form.confirmPassword} onChange={(event) => set("confirmPassword", event.target.value)} placeholder="Repita sua senha" />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                  <Field label="CEP" className="md:col-span-2">
                    <input className={inputClass} value={form.cep} onChange={(event) => set("cep", event.target.value)} placeholder="00000-000" />
                  </Field>
                  <Field label="Endereço" className="md:col-span-4">
                    <input className={inputClass} value={form.endereco} onChange={(event) => set("endereco", event.target.value)} placeholder="Rua, avenida..." />
                  </Field>
                  <Field label="Número" className="md:col-span-1">
                    <input className={inputClass} value={form.numero} onChange={(event) => set("numero", event.target.value)} />
                  </Field>
                  <Field label="Bairro" className="md:col-span-3">
                    <input className={inputClass} value={form.bairro} onChange={(event) => set("bairro", event.target.value)} />
                  </Field>
                  <Field label="Cidade" className="md:col-span-2">
                    <input className={inputClass} value={form.cidade} onChange={(event) => set("cidade", event.target.value)} />
                  </Field>
                  <Field label="UF" className="md:col-span-6">
                    <input maxLength={2} className={`${inputClass} max-w-[100px] uppercase`} value={form.estado} onChange={(event) => set("estado", event.target.value.toUpperCase())} placeholder="AC" />
                  </Field>
                  <div className="flex flex-col gap-2 md:col-span-6">
                    <span className={labelClass}>Gênero</span>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((gender) => (
                        <ChoiceButton key={gender} active={form.genero === gender} onClick={() => set("genero", gender)}>
                          {gender}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Nome do brechó">
                    <input className={inputClass} value={form.marca} onChange={(event) => set("marca", event.target.value)} placeholder="Nome da sua marca" />
                  </Field>
                  <Field label="Instagram">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">@</span>
                      <input className={`${inputClass} pl-8`} value={form.instagram} onChange={(event) => set("instagram", event.target.value)} placeholder="username" />
                    </div>
                  </Field>
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <span className={labelClass}>Segmentação</span>
                    <div className="flex flex-wrap gap-2">
                      {SEGMENTS.map((segment) => (
                        <ChoiceButton key={segment} active={form.segmentos.includes(segment)} onClick={() => toggleArray("segmentos", segment)} withCheck>
                          {segment}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                  <Field label="Se você possui um brechó, qual é o seu nome e como ele está estruturado?" className="md:col-span-2">
                    <textarea className={`${inputClass} resize-none`} rows={4} maxLength={500} value={form.estrutura_brecho} onChange={(event) => set("estrutura_brecho", event.target.value)} placeholder="Conte como funciona seu brechó (físico, online, ateliê...)" />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3">
                    <span className={labelClass}>Quais atividades você gostaria de realizar ou participar dentro do Coletivo?</span>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {ACTIVITIES.map((activity) => (
                        <button
                          type="button"
                          key={activity}
                          onClick={() => toggleArray("atividades", activity)}
                          className={
                            form.atividades.includes(activity)
                              ? "flex items-start gap-2 rounded-lg border border-secondary bg-secondary/20 px-4 py-3 text-left text-sm text-[#1c1c1c]"
                              : "flex items-start gap-2 rounded-lg border border-border px-4 py-3 text-left text-sm text-text-secondary transition hover:border-secondary"
                          }
                        >
                          <Icon name="check" className={form.atividades.includes(activity) ? "mt-0.5 h-4 w-4 shrink-0 opacity-100" : "mt-0.5 h-4 w-4 shrink-0 opacity-30"} />
                          <span>{activity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Você possui alguma experiência ou habilidade relevante para contribuir com o coletivo?">
                    <textarea className={`${inputClass} resize-none`} rows={3} maxLength={500} value={form.experiencia} onChange={(event) => set("experiencia", event.target.value)} placeholder="Conte suas experiências, habilidades, formações..." />
                  </Field>
                  <Field label="Possui estrutura para expor suas peças e/ou produtos? Especifique seus itens.">
                    <textarea className={`${inputClass} resize-none`} rows={2} maxLength={300} value={form.estrutura_expor} onChange={(event) => set("estrutura_expor", event.target.value)} placeholder="Ex.: Sim, 1 mesa 1,4x1m, 1 arara" />
                  </Field>
                  <Field label="Já participa de alguma feira coletiva? Qual?">
                    <input className={inputClass} value={form.feiras} onChange={(event) => set("feiras", event.target.value)} placeholder="Nome da feira ou 'Não participo'" />
                  </Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-secondary bg-secondary/20 p-5">
                    <p className="text-sm leading-6 text-[#1c1c1c]">
                      <strong>Atenção:</strong> No Encontro das Brecholeiras é <strong>proibido</strong> venda de confecção de roupas e calçados — somente Brechó.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {ACKNOWLEDGEMENTS.map((acknowledgement) => (
                        <ChoiceButton key={acknowledgement} active={form.ciencia_regra === acknowledgement} onClick={() => set("ciencia_regra", acknowledgement)}>
                          {acknowledgement}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>
                  <Field label="Como você conheceu o Encontro das Brecholeiras?">
                    <input className={inputClass} value={form.como_conheceu} onChange={(event) => set("como_conheceu", event.target.value)} placeholder="Instagram, indicação, evento..." />
                  </Field>
                  <div className="space-y-3">
                    <Checkbox checked={form.veracidade} onChange={(value) => set("veracidade", value)}>
                      Declaro que as informações prestadas são verídicas e estou ciente de que ao me tornar membro do Coletivo poderei ser convocado(a) para reuniões e atividades do grupo. <strong className="text-primary">Concordo</strong>
                    </Checkbox>
                    <Checkbox checked={form.comunicacoes} onChange={(value) => set("comunicacoes", value)}>
                      Aceito receber comunicações do Coletivo Encontro das Brecholeiras sobre eventos, atividades e atualizações. <strong className="text-primary">Aceito</strong>
                    </Checkbox>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="arrow-left" className="h-4 w-4" />
                Voltar
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-primary-dark active:scale-[0.98]"
                >
                  Próximo
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Finalizar cadastro"}
                  <Icon name="send" className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function ChoiceButton({
  active,
  onClick,
  withCheck = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  withCheck?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-[#1c1c1c]"
          : "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-secondary"
      }
    >
      {withCheck && <Icon name="check" className={active ? "h-4 w-4 opacity-100" : "h-4 w-4 opacity-30"} />}
      {children}
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-border accent-[#E94E8A]"
      />
      <span className="text-sm leading-6 text-text-secondary">{children}</span>
    </label>
  );
}
