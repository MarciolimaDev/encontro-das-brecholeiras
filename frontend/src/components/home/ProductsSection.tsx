import Image from "next/image";
import { products } from "./data";
import { Icon } from "./Icon";

export function ProductsSection() {
  return (
    <section className="bg-surface py-10">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Produtos Recentes</h2>
          <button className="flex w-fit items-center gap-1 rounded-full bg-secondary-dark px-6 py-2 text-sm font-semibold text-white transition hover:bg-secondary">
            <Icon name="add" className="h-5 w-5" />
            Anunciar Produto
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <article key={product.title} className="group cursor-pointer">
              <div className="scrapbook-border relative mb-2 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
                <span className="absolute right-2 top-2 rounded-full bg-secondary-dark px-2 py-1 text-[10px] font-bold text-white">
                  {product.tag}
                </span>
              </div>
              <h3 className="truncate text-sm font-semibold text-text-primary">{product.title}</h3>
              <p className="font-bold text-primary">{product.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
