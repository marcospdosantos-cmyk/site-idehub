import { Product } from './data/products';

export type CartItem = {
  id: string; // unique id for the cart item (product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  kitNotes?: string;
};

export type CheckoutData = {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito';
  notes: string;
};

export type StoreSettings = {
  storeName: string;
  logo: string | null;
  favicon: string | null;
  whatsappNumber: string;
  footerText: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  address: string | null;
  email: string | null;
  instagram: string | null;
};

export type StoreBanner = {
  id: number;
  image: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
};
