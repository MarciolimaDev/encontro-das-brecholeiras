export type AdminDashboardData = {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "super_admin" | "admin" | "brecholeira" | string;
    is_staff: boolean;
  };
  metrics: {
    total_members: number;
    active_events: number;
    textile_saved_kg: number;
    new_registrations: number;
  };
  pending_approvals: {
    id: number;
    name: string;
    brand: string;
    date: string;
    status: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
      cpf: string;
      birth_date: string;
      whatsapp: string;
      gender: string;
    };
    address: {
      cep: string;
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      uf: string;
      complement: string;
    };
    brand_details: {
      name: string;
      instagram: string;
      segment: string;
      description: string;
      status: string;
    };
    application: {
      activities_interest: string;
      experience: string;
      exposition_structure: string;
      previous_fair: string;
      prohibition_acknowledgement: boolean;
      how_did_you_know: string;
      data_consent: boolean;
      communication_consent: boolean;
    };
  }[];
  events: {
    id: string;
    title: string;
    location: string;
    date: string;
    attendees: string;
    image: string;
  }[];
};

export type AdminMembersData = {
  user: AdminDashboardData["user"];
  metrics: {
    total_members: number;
    brecholeiras: number;
    admins: number;
    active_brands: number;
    pending_approvals: number;
  };
  members: {
    id: string;
    name: string;
    email: string;
    role: string;
    role_label: string;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
    profile: {
      cpf: string;
      whatsapp: string;
      gender: string;
    };
    address: {
      city: string;
      uf: string;
    };
    brand: {
      name: string;
      segment: string;
      status: string;
    };
  }[];
};

export type AdminEventsData = {
  user: AdminDashboardData["user"];
  metrics: {
    total_events: number;
    published: number;
    drafts: number;
    registration_open: number;
    pending_approvals: number;
  };
  events: AdminEvent[];
};

export type AdminBrandsData = {
  user: AdminDashboardData["user"];
  metrics: {
    total_brands: number;
    active: number;
    inactive: number;
    pending: number;
  };
  segments: {
    id: number;
    name: string;
  }[];
  brands: AdminBrand[];
};

export type AdminCategoriesData = {
  user: AdminDashboardData["user"];
  metrics: {
    total_categories: number;
    active: number;
    inactive: number;
    pending_approvals: number;
  };
  categories: AdminProductCategory[];
};

export type AdminProductCategory = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  products_count: number;
};

export type AdminBrand = {
  id: number;
  name: string;
  instagram: string;
  description: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED" | string;
  status_label: string;
  segment: {
    id: number;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    whatsapp: string;
  };
  logo: string;
  application: {
    id: number | null;
    status: string;
    status_label: string;
    created_at: string;
    activities_interest: string;
    experience: string;
    exposition_structure: string;
    previous_fair: string;
    prohibition_acknowledgement: boolean;
    how_did_you_know: string;
    data_consent: boolean;
    communication_consent: boolean;
  };
};

export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  event_type: "EVENT" | "FAIR" | "FESTIVAL" | string;
  event_type_label: string;
  location: string;
  city: string;
  uf: string;
  start_date: string;
  end_date: string;
  start_date_input: string;
  end_date_input: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "FINISHED" | string;
  status_label: string;
  is_featured: boolean;
  registration_open: boolean;
  banner: string;
};
