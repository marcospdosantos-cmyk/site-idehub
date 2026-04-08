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
  address: string;
  paymentMethod: 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito';
};
