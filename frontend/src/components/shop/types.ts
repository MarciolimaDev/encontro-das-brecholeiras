export type ShopData = {
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  brand: {
    id: number;
    name: string;
    slug: string;
    instagram: string;
    description: string;
    status_label: string;
    logo: string;
    products_count: number;
    segment: {
      name: string;
    };
    application: {
      created_at: string;
      status_label: string;
      activities_interest: string;
      experience: string;
      exposition_structure: string;
      previous_fair: string;
      how_did_you_know: string;
    };
  };
  profile: {
    whatsapp: string;
    gender: string;
    profile_photo: string;
  };
  address: {
    cep: string;
    street: string;
    number: string;
    city: string;
    uf: string;
    neighborhood: string;
    complement: string;
  };
  application: {
    status_label: string;
    created_at: string;
  };
};

export type ShopProduct = {
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
  photo: string;
  created_at: string;
};

export type ShopProductCategory = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  products_count: number;
};
