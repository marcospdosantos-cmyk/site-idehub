import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
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
  primaryColor: '#f97316',
  secondaryColor: '#111827',
  address: null,
  email: 'contato@idehub.com.br',
  instagram: '@ide.hub',
};

const fallbackBanners: StoreBanner[] = [
  {
    id: 1,
    image: '/image/imgi_18.webp',
    title: 'Oversized T-shirts - Tudo aqui aponta para Jesus',
    subtitle: null,
    linkUrl: null,
  },
];

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
  const [maxPrice, setMaxPrice] = useState<number>(200);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      return matchCategory && matchPrice;
    });
  }, [selectedCategory, maxPrice]);

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
  const heroBanner = banners[0];
  const heroImage = heroBanner ? resolveLocalUrl(heroBanner.image) || heroBanner.image : null;

  const scrollAfterRender = (targetRef: RefObject<HTMLDivElement | null>) => {
    window.setTimeout(() => {
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleGoToStart = () => {
    setSelectedCategory('Todos');
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
    const fallbackHeroImage = heroImage || '/image/imgi_18.webp';

    return [
      {
        eyebrow: 'Streetwear com propósito',
        headline: 'Vista a mensagem. Carregue a presença.',
        subtitle:
          'Camisetas premium para quem vive a fé no corre, na rua e no secreto. Design urbano, acabamento de qualidade e identidade cristã sem exagero.',
        primaryCta: 'Comprar pelo WhatsApp',
        secondaryCta: 'Ver coleção',
        trust: 'Peças limitadas por drop. Chame antes de esgotar.',
        image: fallbackHeroImage,
        action: 'category',
        secondaryAction: 'products',
        category: firstCategory,
      },
      {
        eyebrow: 'Novo drop Ide.hub',
        headline: 'Fé no peito, estilo na rua.',
        subtitle:
          'Uma coleção criada para jovens que não se escondem: visual premium, frases com intenção e camisetas prontas para acompanhar sua rotina.',
        primaryCta: 'Garantir minha camiseta',
        secondaryCta: 'Falar com atendimento',
        trust: 'Atendimento direto no WhatsApp e estoque limitado nesta coleção.',
        image: resolveLocalUrl('/image/Jesus Way Preto 1.webp') || fallbackHeroImage,
        action: 'category',
        secondaryAction: 'whatsapp',
        category: firstCategory,
      },
      {
        eyebrow: 'Criado para quem representa',
        headline: 'Sua roupa também pode anunciar.',
        subtitle:
          'Camisetas streetwear cristãs com presença, conforto e estética limpa. Para vestir bem sem diluir aquilo em que você acredita.',
        primaryCta: 'Comprar agora no WhatsApp',
        secondaryCta: 'Conhecer o drop',
        trust: 'Compra rápida pelo WhatsApp. Modelos selecionados com poucas unidades.',
        image: resolveLocalUrl('/image/Boas Novas 1.webp') || fallbackHeroImage,
        action: 'category',
        secondaryAction: 'products',
        category: firstCategory,
      },
    ];
  }, [categories, heroImage]);

  const currentHeroSlide = heroSlides[activeHeroSlide] || heroSlides[0];

  const handleHeroAction = (action: string, category?: string) => {
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
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isHome && (
          <div ref={bannerSectionRef} className="scroll-mt-24">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 bg-orange-600 px-4 py-3 text-white">
              <Flame className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-black uppercase tracking-[0.18em] sm:text-base">
                Queima de estoque
              </span>
              <span className="hidden h-5 w-px bg-white/30 sm:block" aria-hidden="true" />
              <span className="text-center text-xs font-semibold uppercase tracking-wider sm:text-sm">
                Últimas unidades com descontos agressivos
              </span>
            </div>

            <section className="relative mb-8 overflow-hidden border border-black bg-black text-white shadow-2xl shadow-black/20">
              <div className="absolute inset-0 opacity-70">
                <img
                  src={currentHeroSlide.image}
                  alt={currentHeroSlide.headline}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.32),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(255,255,255,0.12),transparent_28%)]" />
              </div>

              <div className="relative grid min-h-[560px] lg:grid-cols-[1fr_0.72fr]">
                <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
                  <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-100">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {currentHeroSlide.eyebrow}
                  </div>

                  <h1 className="max-w-3xl text-4xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                    {currentHeroSlide.headline}
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
                    {currentHeroSlide.subtitle}
                  </p>

                  <div className="mt-6 flex max-w-xl items-start gap-3 border-l-4 border-orange-500 bg-white/8 px-4 py-3 text-sm font-semibold text-orange-50 backdrop-blur">
                    <Flame className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" aria-hidden="true" />
                    <span>{currentHeroSlide.trust}</span>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleHeroAction(currentHeroSlide.action, currentHeroSlide.category)}
                      className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-500 px-7 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
                    >
                      {currentHeroSlide.primaryCta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHeroAction(currentHeroSlide.secondaryAction)}
                      className="min-h-12 cursor-pointer rounded-full border border-white/25 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                    >
                      {currentHeroSlide.secondaryCta}
                    </button>
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveHeroSlide((slide) => (slide - 1 + heroSlides.length) % heroSlides.length)}
                      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
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
                            activeHeroSlide === index ? 'w-9 bg-orange-500' : 'w-2.5 bg-white/35 hover:bg-white/70'
                          }`}
                          aria-label={`Ir para slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length)}
                      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-black"
                      aria-label="Próximo slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="hidden items-end justify-end p-8 lg:flex">
                  <div className="max-w-xs border border-white/15 bg-black/45 p-5 backdrop-blur-md">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">Drop ativo</p>
                    <p className="mt-3 text-2xl font-black leading-tight">3 caminhos para escolher sua próxima peça.</p>
                    <p className="mt-3 text-sm leading-6 text-gray-300">Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 border border-gray-100 bg-white p-4">
                <Truck className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Envio para todo Brasil</p>
                  <p className="text-xs text-gray-500">Pedido confirmado pelo WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-gray-100 bg-white p-4">
                <ShieldCheck className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Compra segura</p>
                  <p className="text-xs text-gray-500">Atendimento humano antes do pagamento.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-gray-100 bg-white p-4">
                <MessageCircle className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Suporte direto</p>
                  <p className="text-xs text-gray-500">Tire dúvidas de tamanho e cor.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-5 border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={handleGoToStart}
              className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full px-5 text-sm font-bold transition-colors ${selectedCategory === 'Todos'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full px-5 text-sm font-bold transition-colors ${selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              Até R$ {maxPrice}
            </span>
            <input
              type="range"
              min="0"
              max="250"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full md:w-48 accent-black"
            />
          </div>
        </div>

        {/* Product Grid */}
        {Object.keys(groupedProducts).length > 0 ? (
          <div ref={productsSectionRef} className="scroll-mt-24 space-y-16">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Nenhum produto encontrado com estes filtros.</p>
            <button
              onClick={() => { setMaxPrice(200); handleGoToStart(); }}
              className="mt-4 text-black font-medium underline underline-offset-4"
            >
              Limpar filtros
            </button>
          </div>
        )}
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
