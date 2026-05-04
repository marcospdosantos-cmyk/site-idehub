import { Product } from '../data/products';
import { CartItem, CheckoutData, StoreBanner, StoreSettings } from '../types';
import { resolveLocalUrl } from './urls';

export type StorefrontPayload = {
  settings: StoreSettings;
  banners: StoreBanner[];
  categories: Array<{ id: number; name: string; slug: string }>;
  products: Product[];
};

export type CheckoutResponse = {
  orderId: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  whatsappLink: string;
  message: string;
};

export type CouponResponse = {
  code: string;
  description: string | null;
  discountTotal: number;
  total: number;
};

export async function fetchStorefront(): Promise<StorefrontPayload> {
  const response = await fetch('api/storefront.php', {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar a loja.');
  }

  const payload = await response.json();

  return {
    ...payload,
    settings: {
      ...payload.settings,
      logo: resolveLocalUrl(payload.settings?.logo),
      favicon: resolveLocalUrl(payload.settings?.favicon),
    },
    banners: (payload.banners || []).map((banner: StoreBanner) => ({
      ...banner,
      image: resolveLocalUrl(banner.image) || banner.image,
    })),
    products: (payload.products || []).map((product: Product) => {
      const image = resolveLocalUrl(product.image);
      const imagesByColor = product.imagesByColor
        ? Object.fromEntries(
            Object.entries(product.imagesByColor).map(([color, images]) => [
              color,
              images.map((item) => resolveLocalUrl(item) || item),
            ]),
          )
        : undefined;

      return {
        ...product,
        image,
        imagesByColor,
      };
    }),
  };
}

export async function sendCheckout(data: CheckoutData, items: CartItem[]): Promise<CheckoutResponse> {
  const response = await fetch('api/checkout.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode,
      notes: data.notes,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        kitNotes: item.kitNotes,
      })),
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'Não foi possível finalizar o pedido.');
  }

  return payload;
}

export async function validateCoupon(couponCode: string, subtotal: number): Promise<CouponResponse> {
  const response = await fetch('api/coupon.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ couponCode, subtotal }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'Não foi possível aplicar o cupom.');
  }

  return payload;
}
