import { ShoppingBag } from 'lucide-react';
import { categories } from '../data/products';

type NavbarProps = {
  cartItemCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: string) => void;
  onGoToStart: () => void;
  selectedCategory: string;
};

export function Navbar({
  cartItemCount,
  onOpenCart,
  onSelectCategory,
  onGoToStart,
  selectedCategory,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-8">
            <button
              type="button"
              onClick={onGoToStart}
              className="cursor-pointer"
              aria-label="Ide.hub"
            >
              <img
                src="/image/logo-preta-transp.png"
                alt="Ide.hub"
                className="h-9 w-auto object-contain"
              />
            </button>
            
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={onGoToStart}
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === 'Todos' ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                Início
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
