import { useState, useMemo } from 'react';
import { products, categories, Product } from './data/products';
import { CartItem, CheckoutData } from './types';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';

const WHATSAPP_NUMBER = '5542999488235';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${item.kitNotes || ''}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = (data: CheckoutData) => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let message = `*Novo Pedido - Ide.hub*\n\n`;
    message += `*Cliente:* ${data.name}\n`;
    message += `*Endereço:* ${data.address}\n`;
    message += `*Pagamento:* ${data.paymentMethod}\n\n`;
    message += `*Itens do Pedido:*\n`;

    cart.forEach((item) => {
      let details = [];
      if (item.selectedSize) details.push(item.selectedSize);
      if (item.selectedColor) details.push(item.selectedColor);

      const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      const notesStr = item.kitNotes ? `\n  ↳ Notas: ${item.kitNotes}` : '';

      message += `${item.quantity}x ${item.product.name}${detailsStr} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}${notesStr}\n`;
    });

    message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // Optional: Clear cart after sending
    // setCart([]);
    // setIsCheckoutOpen(false);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Navbar
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Promo Banner */}
        <div className="mb-6 bg-orange-600 text-white py-3 px-4 flex items-center justify-center gap-4 animate-pulse">
          <span className="font-black text-xl tracking-tighter uppercase italic">🔥 QUEIMA DE ESTOQUE</span>
          <span className="hidden md:inline font-medium text-sm border-l border-white/30 pl-4 uppercase tracking-widest">Últimas unidades com descontos agressivos</span>
          <span className="font-black text-xl tracking-tighter uppercase italic">🔥 QUEIMA DE ESTOQUE</span>
        </div>

        {/* Banner */}
        <div className="mb-12 w-full rounded-none overflow-hidden shadow-sm border border-gray-100 bg-white">
          <img
            src="/image/imgi_18.webp"
            alt="Oversized T-shirts - Tudo aqui aponta para Jesus"
            className="w-full h-auto object-cover"
            onError={(e) => {
              // Fallback temporário caso a imagem não tenha sido enviada ainda
              e.currentTarget.src = 'https://picsum.photos/seed/idehub-banner/1200/350?grayscale';
            }}
          />
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-none border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('Todos')}
              className={`whitespace-nowrap px-4 py-2 rounded-none text-sm font-medium transition-colors ${selectedCategory === 'Todos'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-none text-sm font-medium transition-colors ${selectedCategory === cat
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
          <div className="space-y-16">
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
              onClick={() => { setSelectedCategory('Todos'); setMaxPrice(200); }}
              className="mt-4 text-black font-medium underline underline-offset-4"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      <Testimonials />
      <Footer />

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
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
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
      />
    </div>
  );
}
