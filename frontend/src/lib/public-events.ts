export type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  event_type_label: string;
  location: string;
  city: string;
  uf: string;
  location_label: string;
  start_date: string;
  end_date: string;
  start_date_label: string;
  end_date_label: string;
  day: string;
  month: string;
  status: string;
  status_label: string;
  is_featured: boolean;
  registration_open: boolean;
  banner: string;
};

export type PublicProduct = {
  id: number;
  title: string;
  description: string;
  price: string;
  status: string;
  status_label: string;
  category: {
    id: number | null;
    name: string;
  };
  image: string;
  brand: {
    name: string;
    slug: string;
    instagram: string;
    description: string;
    logo: string;
    segment: string;
    products_count: number;
    city: string;
    uf: string;
    owner: {
      name: string;
      profile_photo: string;
    };
  };
};

export type PublicFeaturedBrand = {
  id: number;
  name: string;
  slug: string;
  instagram: string;
  logo: string;
  segment: string;
  products_count: number;
  owner: {
    name: string;
    profile_photo: string;
  };
};

const backendUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const fallbackEventImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDui6oTxnKD3XO3LVjKZGzdzH0y-Gp3aVrDG7SxAalCE7fvT68GhxUS9V0KSq9yGgxbSXjrh5YafNn4CKyjmhXFQZ-l6-WiLRnKXtGF0nL7QSEF4Qbk_lhOU2MofhKuIqusvcfm1qjVjxGJUGPYy9GEwpeqfaauhDZqon1AKeXSAwsL3y0Co7txO0kjG6lt_vA7oiMuie9cucmj1jc5W8rRJr1y3okz3hziU6Frbewfq7mnKf36nunttkQLoPP9PtpMupqQt4kA6iC";

export async function getPublicEvents() {
  try {
    const response = await fetch(`${backendUrl}/api/events/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { events?: PublicEvent[] };
    return data.events ?? [];
  } catch {
    return [];
  }
}

export async function getPublicEvent(slug: string) {
  try {
    const response = await fetch(`${backendUrl}/api/events/${slug}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { event?: PublicEvent };
    return data.event ?? null;
  } catch {
    return null;
  }
}

export async function getPublicProducts(options?: { all?: boolean }) {
  try {
    const response = await fetch(`${backendUrl}/api/products/${options?.all ? "?limit=all" : ""}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { products?: PublicProduct[] };
    return data.products ?? [];
  } catch {
    return [];
  }
}

export async function getPublicProduct(id: string) {
  try {
    const response = await fetch(`${backendUrl}/api/products/${id}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { product?: PublicProduct };
    return data.product ?? null;
  } catch {
    return null;
  }
}

export async function getPublicFeaturedBrands() {
  try {
    const response = await fetch(`${backendUrl}/api/featured-brands/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { brands?: PublicFeaturedBrand[] };
    return data.brands ?? [];
  } catch {
    return [];
  }
}

export async function getPublicBrecholeiras() {
  try {
    const response = await fetch(`${backendUrl}/api/brecholeiras/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { brands?: PublicFeaturedBrand[] };
    return data.brands ?? [];
  } catch {
    return [];
  }
}
