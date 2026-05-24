export function NewsletterSection() {
  return (
    <section id="newsletter" className="bg-primary py-10 text-white">
      <div className="mx-auto max-w-container px-6 text-center">
        <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">Faça parte do nosso movimento</h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 opacity-90">
          Cadastre-se para receber avisos de novos eventos e oportunidades exclusivas de garimpo.
        </p>
        <form className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 md:flex-row">
          <input
            className="w-full rounded-full border border-white/45 bg-primary px-6 py-4 text-white outline-none placeholder:text-white/75 focus:ring-4 focus:ring-secondary/50"
            placeholder="Seu melhor e-mail"
            type="email"
          />
          <button className="w-full whitespace-nowrap rounded-full bg-secondary px-10 py-4 text-sm font-semibold text-[#1c1c1c] transition hover:bg-secondary-dark hover:text-white md:w-auto">
            Cadastrar Agora
          </button>
        </form>
      </div>
    </section>
  );
}
