import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, MessageCircle, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { products as fallbackProducts, categories as fallbackCategories, Product } from './data/products';
import { CartItem, CheckoutData, StoreBanner, StoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { blankInventory } from './data/inventory';
import { fetchStorefront, sendCheckout } from './lib/api';
import { resolveLocalUrl } from './lib/urls';

const CART_STORAGE_KEY = 'idehub-cart';

const fallbackSettings: StoreSettings = {
  storeName: 'Ide.hub',
  logo: '/image/logo-preta-transp.png',
  favicon: null,
  whatsappNumber: '5542999488235',
  footerText: 'Streetwear cristão premium. Vista sua fé com propósito e estilo.',
  primaryColor: '#f2752f',
  secondaryColor: '#111827',
  address: null,
  email: 'contato@idehub.com.br',
  instagram: '@ide.hub',
};

const fallbackBanners: StoreBanner[] = [
  {
    id: 1,
    image: '/image/imgi_18.webp',
    eyebrow: 'Vista sua fé.',
    title: 'Vista a mensagem. Carregue a presença.',
    subtitle:
      'Camisetas cristãs para quem quer representar Jesus com estilo, verdade e atitude no dia a dia.',
    trustText: 'Peças limitadas. Chame antes que esgote!',
    primaryCta: 'Comprar pelo WhatsApp',
    secondaryCta: 'Ver coleção',
    sideKicker: 'Coleção ativa',
    sideTitle: 'Fé, identidade e estilo na mesma peça.',
    sideText: 'Escolha sua camiseta, confirme os detalhes e finalize com atendimento direto.',
    linkUrl: null,
  },
  {
    id: 2,
    image: '/image/Jesus Way Preto 1.webp',
    eyebrow: 'Coleção Ide.hub',
    title: 'Jesus no centro.',
    subtitle:
      'Peças para jovens cristãos que querem se vestir bem sem esconder aquilo em que acreditam.',
    trustText: 'Compra simples, conversa direta e confirmação antes do pagamento.',
    primaryCta: 'Escolher minha camiseta',
    secondaryCta: 'Tirar dúvidas',
    sideKicker: 'Coleção ativa',
    sideTitle: 'Escolha com calma. A gente te ajuda no WhatsApp.',
    sideText: 'Antes de finalizar, confirmamos modelo, tamanho, cor e disponibilidade.',
    linkUrl: null,
  },
  {
    id: 3,
    image: '/image/Boas Novas 1.webp',
    eyebrow: 'Para quem quer representar Jesus com estilo.',
    title: 'Mostre o que te move.',
    subtitle:
      'Roupas cristãs com visual urbano, mensagens fortes e acabamento pensado para a rotina.',
    trustText: 'Atendimento humanizado para você comprar com segurança e sem complicação.',
    primaryCta: 'Chamar no WhatsApp',
    secondaryCta: 'Conhecer a coleção',
    sideKicker: 'Coleção ativa',
    sideTitle: 'Estilo que aponta para Cristo.',
    sideText: 'Navegue pelas peças e escolha a que combina com seu estilo e caminhada.',
    linkUrl: null,
  },
];

const legacyCopyReplacements: Record<string, string> = {
  'Streetwear com propósito': 'Vista sua fé.',
  'Peças limitadas por drop. Chame antes de esgotar.': 'Peças limitadas. Chame antes que esgote!',
  'Novo drop Ide.hub': 'Coleção Ide.hub',
  'Fé no peito, estilo na rua.': 'Jesus no centro.',
  'Uma coleção criada para jovens que não se escondem: visual premium, frases com intenção e camisetas prontas para acompanhar sua rotina.':
    'Peças para jovens cristãos que querem se vestir bem sem esconder aquilo em que acreditam.',
  'Atendimento direto no WhatsApp e estoque limitado nesta coleção.': 'Compra simples, conversa direta e confirmação antes do pagamento.',
  'Garantir minha camiseta': 'Escolher minha camiseta',
  'Falar com atendimento': 'Tirar dúvidas',
  'Drop ativo': 'Coleção ativa',
  'Escolha sua camiseta com calma e finalize direto no WhatsApp.': 'Escolha com calma. A gente te ajuda no WhatsApp.',
  'Criado para quem representa': 'Para quem quer representar Jesus com estilo.',
  'Sua roupa também pode anunciar.': 'Mostre o que te move.',
  'Camisetas streetwear cristãs com presença, conforto e estética limpa. Para vestir bem sem diluir aquilo em que você acredita.':
    'Roupas cristãs com visual urbano, mensagens fortes e acabamento pensado para a rotina.',
  'Compra rápida pelo WhatsApp. Modelos selecionados com poucas unidades.':
    'Atendimento humanizado para você comprar com segurança e sem complicação.',
  'Comprar agora no WhatsApp': 'Chamar no WhatsApp',
  'Conhecer o drop': 'Conhecer a coleção',
  '3 caminhos para escolher sua próxima peça.': 'Fé, identidade e estilo na mesma peça.',
  'Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.':
    'Escolha sua camiseta, confirme os detalhes e finalize com atendimento direto.',
};

const displayCopy = (value: string) => legacyCopyReplacements[value] || value;

const getAvailableColors = (product: Product) => {
  if (product.isKit) return product.colors || [];

  const categoryInventory = blankInventory[product.category];
  const colors = product.colors || (categoryInventory ? Object.keys(categoryInventory) : []);

  if (!categoryInventory) return colors;

  return colors.filter((color) => {
    const sizeStock = categoryInventory[color];
    return sizeStock && Object.values(sizeStock).some((stock) => stock > 0);
  });
};

const getAvailableSizes = (product: Product, selectedColor?: string) => {
  if (product.isKit) return product.sizes || [];

  const categoryInventory = blankInventory[product.category];
  const baseSizes = product.sizes || [];

  if (!categoryInventory) return baseSizes;

  const colors = selectedColor ? [selectedColor] : getAvailableColors(product);
  const inventorySizes = Array.from(
    new Set(
      colors.flatMap((color) =>
        Object.entries(categoryInventory[color] || {})
          .filter(([, stock]) => stock > 0)
          .map(([size]) => size)
      )
    )
  );

  if (!baseSizes.length) return inventorySizes;

  return baseSizes.filter((size) => inventorySizes.includes(size));
};

const getHydratedCart = (availableProducts: Product[]): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.reduce<CartItem[]>((validItems, rawItem) => {
      if (!rawItem || typeof rawItem !== 'object') return validItems;

      const matchedProduct = availableProducts.find((product) => product.id === rawItem.product?.id);
      if (!matchedProduct) return validItems;

      const quantity = Number(rawItem.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) return validItems;

      validItems.push({
        id: typeof rawItem.id === 'string' ? rawItem.id : `${matchedProduct.id}`,
        product: matchedProduct,
        quantity,
        selectedSize: typeof rawItem.selectedSize === 'string' ? rawItem.selectedSize : undefined,
        selectedColor: typeof rawItem.selectedColor === 'string' ? rawItem.selectedColor : undefined,
        kitNotes: typeof rawItem.kitNotes === 'string' ? rawItem.kitNotes : undefined,
      });

      return validItems;
    }, []);
  } catch {
    return [];
  }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [settings, setSettings] = useState<StoreSettings>(fallbackSettings);
  const [banners, setBanners] = useState<StoreBanner[]>(fallbackBanners);
  const [cart, setCart] = useState<CartItem[]>(() => getHydratedCart(fallbackProducts));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingWhatsappConfirmation, setPendingWhatsappConfirmation] = useState(false);
  const [showWhatsappConfirmation, setShowWhatsappConfirmation] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const [isCartFeedbackVisible, setIsCartFeedbackVisible] = useState(false);
  const [whatsappOpenedAt, setWhatsappOpenedAt] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const bannerSectionRef = useRef<HTMLDivElement | null>(null);
  const productsSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedColor, setSelectedColor] = useState<string>('Todas');
  const [selectedSize, setSelectedSize] = useState<string>('Todos');
  const [maxPrice, setMaxPrice] = useState<number>(200);

  const availableFilterColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) => {
      getAvailableColors(product).forEach((color) => colors.add(color));
    });

    return Array.from(colors).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  const availableFilterSizes = useMemo(() => {
    const sizeOrder = ['P', 'M', 'G', 'GG', 'Único'];
    const sizes = new Set<string>();
    products.forEach((product) => {
      getAvailableSizes(product).forEach((size) => sizes.add(size));
    });

    return Array.from(sizes).sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b, 'pt-BR');
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchColor = selectedColor === 'Todas' || getAvailableColors(p).includes(selectedColor);
      const matchSize = selectedSize === 'Todos' || getAvailableSizes(p, selectedColor === 'Todas' ? undefined : selectedColor).includes(selectedSize);
      const matchPrice = p.price <= maxPrice;
      return matchCategory && matchColor && matchSize && matchPrice;
    });
  }, [products, selectedCategory, selectedColor, selectedSize, maxPrice]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts]);

  const getItemStock = (item: Pick<CartItem, 'product' | 'selectedColor' | 'selectedSize'>) => {
    if (item.product.isKit) return 999;
    if (typeof item.product.stock === 'number') return Math.max(0, item.product.stock);

    const color = item.selectedColor ?? item.product.colors?.[0];
    const size = item.selectedSize ?? 'Único';

    if (!color) return 0;

    return blankInventory[item.product.category]?.[color]?.[size] ?? 0;
  };

  const triggerCartFeedback = (message: string) => {
    setCartFeedback(message);
    setIsCartFeedbackVisible(true);
  };

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${item.kitNotes || ''}`;
    const availableStock = getItemStock(item);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        if (existing.quantity >= availableStock) {
          triggerCartFeedback('Você já atingiu o estoque disponível desse item.');
          return prev;
        }

        return prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, availableStock) }
            : i
        );
      }
      return [...prev, { ...item, id }];
    });
    triggerCartFeedback('Produto adicionado ao carrinho.');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const availableStock = getItemStock(item);
          const nextQuantity = item.quantity + delta;
          const newQuantity = Math.max(0, Math.min(nextQuantity, availableStock));

          if (delta > 0 && nextQuantity > availableStock) {
            triggerCartFeedback('Quantidade ajustada ao estoque disponível.');
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async (data: CheckoutData) => {
    setCheckoutError(null);

    try {
      const response = await sendCheckout(data, cart);
      window.open(response.whatsappLink, '_blank');
      setIsCheckoutOpen(false);
      setPendingWhatsappConfirmation(true);
      setShowWhatsappConfirmation(false);
      setWhatsappOpenedAt(Date.now());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível finalizar o pedido.';
      setCheckoutError(message);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isHome = selectedCategory === 'Todos';

  const scrollAfterRender = (targetRef: RefObject<HTMLDivElement | null>) => {
    window.setTimeout(() => {
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleGoToStart = () => {
    setSelectedCategory('Todos');
    setSelectedColor('Todas');
    setSelectedSize('Todos');
    setMaxPrice(200);
    setSelectedProduct(null);
    scrollAfterRender(bannerSectionRef);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    scrollAfterRender(productsSectionRef);
  };

  const heroSlides = useMemo(() => {
    const firstCategory = categories[0] || 'Todos';
    const sourceBanners = (banners.length ? banners : fallbackBanners).slice(0, 3);

    return sourceBanners.map((banner, index) => {
      const fallback = fallbackBanners[index] || fallbackBanners[0];

      return {
        eyebrow: displayCopy(banner.eyebrow || fallback.eyebrow || 'Vista sua fé.'),
        headline: displayCopy(banner.title || fallback.title || 'Vista a mensagem. Carregue a presença.'),
        subtitle: displayCopy(banner.subtitle || fallback.subtitle || ''),
        primaryCta: displayCopy(banner.primaryCta || fallback.primaryCta || 'Comprar pelo WhatsApp'),
        secondaryCta: displayCopy(banner.secondaryCta || fallback.secondaryCta || 'Ver coleção'),
        trust: displayCopy(banner.trustText || fallback.trustText || 'Peças limitadas. Chame antes que esgote!'),
        sideKicker: displayCopy(banner.sideKicker || fallback.sideKicker || 'Coleção ativa'),
        sideTitle: displayCopy(banner.sideTitle || fallback.sideTitle || 'Fé, identidade e estilo na mesma peça.'),
        sideText: displayCopy(banner.sideText || fallback.sideText || 'Escolha sua camiseta, confirme os detalhes e finalize com atendimento direto.'),
        image: resolveLocalUrl(banner.image) || resolveLocalUrl(fallback.image) || '/image/imgi_18.webp',
        linkUrl: banner.linkUrl,
        action: banner.linkUrl ? 'link' : 'category',
        secondaryAction: index === 1 ? 'whatsapp' : 'products',
        category: firstCategory,
      };
    });
  }, [banners, categories]);

  const currentHeroSlide = heroSlides[activeHeroSlide] || heroSlides[0];
  const heroHeadlineParts = useMemo(() => {
    const headline = currentHeroSlide?.headline || '';
    const highlightedHeadlines: Record<string, { primary: string; accent: string }> = {
      'Jesus no centro.': { primary: 'Jesus no', accent: 'centro.' },
      'Mostre o que te move.': { primary: 'Mostre o que te', accent: 'move.' },
    };

    if (highlightedHeadlines[headline]) {
      return highlightedHeadlines[headline];
    }

    const match = headline.match(/^(.+?\.)\s+(.+)$/);

    if (!match) {
      return { primary: headline, accent: '' };
    }

    return { primary: match[1], accent: match[2] };
  }, [currentHeroSlide?.headline]);

  const handleHeroAction = (action: string, category?: string, linkUrl?: string | null) => {
    if (action === 'link' && linkUrl) {
      window.open(linkUrl, '_blank');
      return;
    }

    if (action === 'whatsapp') {
      window.open(`https://wa.me/${settings.whatsappNumber}`, '_blank');
      return;
    }

    if (action === 'products') {
      scrollAfterRender(productsSectionRef);
      return;
    }

    handleSelectCategory(category || categories[0] || 'Todos');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    handleGoToStart();
  };

  useEffect(() => {
    if (!showOrderSuccess) return;

    const timer = window.setTimeout(() => {
      setShowOrderSuccess(false);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [showOrderSuccess]);

  useEffect(() => {
    if (!isHome || heroSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length, isHome]);

  useEffect(() => {
    if (activeHeroSlide >= heroSlides.length) {
      setActiveHeroSlide(0);
    }
  }, [activeHeroSlide, heroSlides.length]);

  useEffect(() => {
    if (!cartFeedback) return;

    const fadeOutTimer = window.setTimeout(() => {
      setIsCartFeedbackVisible(false);
    }, 1900);

    const cleanupTimer = window.setTimeout(() => {
      setCartFeedback(null);
    }, 2400);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [cartFeedback]);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let active = true;

    fetchStorefront()
      .then((payload) => {
        if (!active) return;

        const nextProducts = payload.products.length ? payload.products : fallbackProducts;
        setProducts(nextProducts);
        setCategories(payload.categories.length ? payload.categories.map((category) => category.name) : fallbackCategories);
        setSettings(payload.settings || fallbackSettings);
        setBanners(payload.banners.length ? payload.banners : fallbackBanners);
        setCart(getHydratedCart(nextProducts));

        if (payload.settings?.favicon) {
          let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = payload.settings.favicon;
        }

        if (payload.settings?.storeName) {
          document.title = payload.settings.storeName;
        }
      })
      .catch(() => {
        // O catálogo local continua como fallback se a API ainda não estiver instalada.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pendingWhatsappConfirmation || !whatsappOpenedAt) return;

    const maybeAskForConfirmation = () => {
      if (Date.now() - whatsappOpenedAt < 1200) return;
      setShowWhatsappConfirmation(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        maybeAskForConfirmation();
      }
    };

    window.addEventListener('focus', maybeAskForConfirmation);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const fallbackTimer = window.setTimeout(() => {
      setShowWhatsappConfirmation(true);
    }, 5000);

    return () => {
      window.removeEventListener('focus', maybeAskForConfirmation);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearTimeout(fallbackTimer);
    };
  }, [pendingWhatsappConfirmation, whatsappOpenedAt]);

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans text-stone-950">
      <Navbar
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={handleSelectCategory}
        onGoToStart={handleGoToStart}
        selectedCategory={selectedCategory}
        categories={categories}
        logo={settings.logo}
        storeName={settings.storeName}
      />

      <main>
        {isHome && (
          <div ref={bannerSectionRef} className="scroll-mt-24">
            <section className="relative min-h-[100dvh] overflow-hidden bg-[#100f0d] text-white">
              <div className="absolute inset-0 opacity-78">
                <img
                  src={currentHeroSlide.image}
                  alt={currentHeroSlide.headline}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/72 to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_74%,rgba(242,117,47,0.32),transparent_30rem)]" />
              </div>

              <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:px-8">
                <div className="max-w-5xl">
                  <div className="mb-5 inline-flex max-w-full w-fit items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md sm:px-4 sm:text-xs sm:tracking-[0.22em]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate">{currentHeroSlide.eyebrow}</span>
                  </div>

                  <h1 className="max-w-5xl text-[clamp(2.55rem,13vw,8.3rem)] font-black leading-[0.9] tracking-normal break-normal hyphens-none sm:text-[clamp(2.9rem,8vw,8.3rem)]">
                    <span className="block">{heroHeadlineParts.primary}</span>
                    {heroHeadlineParts.accent && (
                      <span className="font-display mt-1 block text-[clamp(3.1rem,15vw,9.6rem)] italic text-[#f3c27d] sm:text-[clamp(3.6rem,10vw,9.6rem)]">
                        {heroHeadlineParts.accent}
                      </span>
                    )}
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-stone-200 sm:text-lg">
                    {currentHeroSlide.subtitle}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleHeroAction(currentHeroSlide.action, currentHeroSlide.category, currentHeroSlide.linkUrl)}
                      className="magnetic-button group inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#f2752f] px-5 text-center text-xs font-black uppercase tracking-wide text-white shadow-2xl shadow-black/30 hover:bg-[#f2752f] sm:px-7 sm:text-sm"
                    >
                      {currentHeroSlide.primaryCta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHeroAction(currentHeroSlide.secondaryAction)}
                      className="magnetic-button min-h-13 cursor-pointer rounded-full border border-white/25 bg-white/8 px-5 text-center text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md hover:bg-white hover:text-black sm:px-7 sm:text-sm"
                    >
                      {currentHeroSlide.secondaryCta}
                    </button>
                  </div>

                  <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex max-w-xl items-start gap-3 border-l-4 border-[#f2752f] bg-white/8 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                      <Flame className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f3c27d]" aria-hidden="true" />
                      <span>{currentHeroSlide.trust}</span>
                    </div>

                    <div className="hidden max-w-sm rounded-[2rem] border border-white/15 bg-black/32 p-5 shadow-2xl shadow-black/20 backdrop-blur-md lg:block">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2752f]">{currentHeroSlide.sideKicker}</p>
                      <p className="mt-3 text-2xl font-black leading-tight">{currentHeroSlide.sideTitle}</p>
                      <p className="mt-3 text-sm leading-6 text-stone-300">{currentHeroSlide.sideText}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveHeroSlide((slide) => (slide - 1 + heroSlides.length) % heroSlides.length)}
                      className="magnetic-button inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black"
                      aria-label="Slide anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex gap-2">
                      {heroSlides.map((slide, index) => (
                        <button
                          key={slide.headline}
                          type="button"
                          onClick={() => setActiveHeroSlide(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            activeHeroSlide === index ? 'w-9 bg-[#f2752f]' : 'w-2.5 bg-white/35 hover:bg-white/70'
                          }`}
                          aria-label={`Ir para slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length)}
                      className="magnetic-button inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black"
                      aria-label="Próximo slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#ffffff] px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-[2rem] border border-black/8 bg-[#ffffff] p-5 shadow-sm">
                  <Truck className="h-5 w-5 text-[#f2752f]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black text-stone-950">Enviamos para o Brasil</p>
                    <p className="text-xs text-stone-500">Você confirma tudo pelo WhatsApp antes do envio.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-[2rem] border border-black/8 bg-[#ffffff] p-5 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-[#f2752f]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black text-stone-950">Compra com orientação</p>
                    <p className="text-xs text-stone-500">Ajudamos você a escolher tamanho, cor e modelo.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-[2rem] border border-black/8 bg-[#ffffff] p-5 shadow-sm">
                  <MessageCircle className="h-5 w-5 text-[#f2752f]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black text-stone-950">Fale com a gente</p>
                    <p className="text-xs text-stone-500">Dúvidas rápidas, atendimento direto e sem enrolação.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#ffffff] px-4 py-20 sm:px-6 lg:px-8">
              <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f2752f]">Por que a Ide.hub existe</p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-normal text-stone-950 sm:text-5xl lg:text-6xl">
                    Fé também se
                    <span className="font-display block italic text-[#f2752f]">veste.</span>
                  </h2>
                </div>
                <div className="rounded-[2rem] border border-black/10 bg-[#100f0d] p-6 text-white shadow-2xl shadow-black/15 sm:p-8">
                  <p className="text-lg leading-8 text-stone-200">
                    A Ide.hub nasceu para impulsionar jovens cristãos que querem viver sua fé por inteiro: na igreja, na rua, na faculdade, no trabalho e nas escolhas do dia a dia.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {['Jesus no centro', 'Estilo com propósito', 'Atendimento próximo'].map((label, index) => (
                      <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                        <p className="font-mono text-xs font-bold text-[#f3c27d]">0{index + 1}</p>
                        <p className="mt-2 text-sm font-black">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#100f0d] px-4 py-20 text-white sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3c27d]">Como comprar</p>
                    <h2 className="mt-4 max-w-2xl text-4xl font-black leading-none sm:text-5xl">
                      Escolha sua peça. A gente te ajuda no resto.
                    </h2>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-stone-300">
                    Você escolhe o produto, chama no WhatsApp e confirma modelo, tamanho, cor e forma de pagamento direto com a gente.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Sparkles, title: 'Escolha sua peça', text: 'Veja as camisetas, kits e meias criadas para representar sua fé com estilo.' },
                    { icon: MessageCircle, title: 'Chame no WhatsApp', text: 'A gente confirma disponibilidade, tamanho, cor e tira suas dúvidas.' },
                    { icon: PackageCheck, title: 'Vista e represente', text: 'Receba sua peça e use no dia a dia como parte daquilo que você acredita.' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20">
                        <div className="mb-8 flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-[#f3c27d]">0{index + 1}</span>
                          <Icon className="h-6 w-6 text-[#f3c27d]" aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-black">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-stone-300">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        <section className="bg-[#ffffff] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f2752f]">Produtos disponíveis</p>
                <h2 className="mt-3 text-4xl font-black leading-none text-stone-950 sm:text-5xl">
                  Escolha uma peça para representar sua fé.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-stone-600">
                Filtre por categoria, encontre seu modelo favorito e finalize pelo WhatsApp.
              </p>
            </div>

            <div className="mb-10 rounded-[2rem] border border-black/8 bg-[#ffffff]/88 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.85fr_0.7fr_1fr_auto] xl:items-end">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-500">Modelo</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => {
                      setSelectedCategory(event.target.value);
                      scrollAfterRender(productsSectionRef);
                    }}
                    className="min-h-12 w-full cursor-pointer rounded-full border border-black/10 bg-white px-4 text-sm font-black text-stone-950 outline-none transition focus:border-[#f2752f]"
                  >
                    <option value="Todos">Todos os modelos</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-500">Cor</span>
                  <select
                    value={selectedColor}
                    onChange={(event) => {
                      setSelectedColor(event.target.value);
                      scrollAfterRender(productsSectionRef);
                    }}
                    className="min-h-12 w-full cursor-pointer rounded-full border border-black/10 bg-white px-4 text-sm font-black text-stone-950 outline-none transition focus:border-[#f2752f]"
                  >
                    <option value="Todas">Todas as cores</option>
                    {availableFilterColors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-500">Tamanho</span>
                  <select
                    value={selectedSize}
                    onChange={(event) => {
                      setSelectedSize(event.target.value);
                      scrollAfterRender(productsSectionRef);
                    }}
                    className="min-h-12 w-full cursor-pointer rounded-full border border-black/10 bg-white px-4 text-sm font-black text-stone-950 outline-none transition focus:border-[#f2752f]"
                  >
                    <option value="Todos">Todos</option>
                    {availableFilterSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-stone-500">
                    Valor até R$ {maxPrice}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    step="10"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(Number(event.target.value))}
                    className="h-12 w-full accent-black"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSelectedColor('Todas');
                    setSelectedSize('Todos');
                    setMaxPrice(200);
                    scrollAfterRender(productsSectionRef);
                  }}
                  className="magnetic-button min-h-12 cursor-pointer rounded-full border border-black/10 bg-black px-5 text-sm font-black text-white hover:bg-[#f2752f]"
                >
                  Limpar filtros
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-stone-500">
                <span className="rounded-full bg-black/5 px-3 py-1.5">{filteredProducts.length} produto(s)</span>
                {selectedCategory !== 'Todos' && <span className="rounded-full bg-black/5 px-3 py-1.5">{selectedCategory}</span>}
                {selectedColor !== 'Todas' && <span className="rounded-full bg-black/5 px-3 py-1.5">{selectedColor}</span>}
                {selectedSize !== 'Todos' && <span className="rounded-full bg-black/5 px-3 py-1.5">Tam. {selectedSize}</span>}
              </div>
            </div>

            {/* Product Grid */}
            {Object.keys(groupedProducts).length > 0 ? (
              <div ref={productsSectionRef} className="scroll-mt-28 space-y-16">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  <div key={category}>
                    <div className="mb-8 flex items-center gap-4">
                      <h2 className="text-2xl font-black text-stone-950">{category}</h2>
                      <div className="h-px flex-1 bg-black/12"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {(categoryProducts as Product[]).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={setSelectedProduct}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-black/8 bg-[#ffffff] py-20 text-center">
                <p className="text-xl font-bold text-stone-500">Nenhum produto encontrado com estes filtros.</p>
                <button
                  onClick={() => { setMaxPrice(200); handleGoToStart(); }}
                  className="magnetic-button mt-4 rounded-full bg-black px-6 py-3 font-black text-white"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Testimonials />
      <Footer settings={settings} />

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onContinueShopping={handleContinueShopping}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        getItemStock={getItemStock}
        onRemove={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        total={cartTotal}
        error={checkoutError}
      />

      {showWhatsappConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Pedido enviado no WhatsApp?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              O WhatsApp não informa para o site se a mensagem foi enviada de fato. Assim que você confirmar, a gente limpa o carrinho com segurança.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCart([]);
                  setPendingWhatsappConfirmation(false);
                  setShowWhatsappConfirmation(false);
                  setShowOrderSuccess(true);
                  setWhatsappOpenedAt(null);
                  handleGoToStart();
                }}
                className="w-full py-4 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition-colors"
              >
                Sim, já enviei
              </button>
              <button
                onClick={() => {
                  setShowWhatsappConfirmation(false);
                }}
                className="w-full py-3 border border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Ainda não
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border border-emerald-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-sm font-semibold text-emerald-700">
            Pedido confirmado no WhatsApp. Carrinho limpo com sucesso.
          </p>
        </div>
      )}

      {cartFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
          <div
            className={`w-full max-w-md rounded-[1.75rem] border border-stone-300/80 bg-gradient-to-b from-stone-50 via-white to-stone-100 px-6 py-5 text-center shadow-[0_18px_55px_rgba(28,25,23,0.16)] backdrop-blur-md transition-all duration-500 ${
              isCartFeedbackVisible
                ? 'translate-y-0 opacity-100 scale-100'
                : '-translate-y-1 opacity-0 scale-[0.985]'
            }`}
          >
            <p className="text-base font-bold tracking-[0.12em] text-stone-800 uppercase">
              {cartFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
