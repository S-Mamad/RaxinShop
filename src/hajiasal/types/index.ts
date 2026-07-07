export type ProductCategory =
  | "mountain"
  | "thyme"
  | "multifloral"
  | "royal-jelly"
  | "honeycomb"
  | "specialty"
  | "gift-set";

export interface WeightOption {
  label: string;
  grams: number;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: ProductCategory;
  categoryLabel: string;
  images: string[];
  weightOptions: WeightOption[];
  discountPrice?: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  ingredients?: string;
  shippingInfo?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  weight: WeightOption;
  quantity: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface CategoryItem {
  id: ProductCategory;
  label: string;
  description: string;
  image: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  nav: NavItem[];
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    ctaHref: string;
    image: string;
  };
  freeShippingThreshold: number;
  shippingCost: number;
  trustItems: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  brandStory: {
    title: string;
    paragraphs: string[];
  };
  footer: {
    phone: string;
    email: string;
    address: string;
  };
  categories: CategoryItem[];
}

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "newest";

export interface ProductFilters {
  category?: ProductCategory | null;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  inStockOnly?: boolean;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  notes?: string;
}

export interface CheckoutPayload {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  message: string;
}
