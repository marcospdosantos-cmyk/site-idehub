import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { resolveLocalUrl } from '../lib/urls';

type NavbarProps = {
  cartItemCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: string) => void;
  onGoToStart: () => void;
  selectedCategory: string;
  categories: string[];
  logo: string | null;
  storeName: string;
};

export function Navbar({
  cartItemCount,
  onOpenCart,
  onSelectCategory,
  onGoToStart,
  selectedCategory,
  categories,
  logo,
  storeName,
}: NavbarProps) {
  const resolvedLogo = resolveLocalUrl(logo);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    onSelectCategory(category);
    setIsMobileMenuOpen(false);
  };

  const handleGoToStart = () => {
    onGoToStart();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-black border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleGoToStart}
              className="cursor-pointer"
              aria-label="Ide.hub"
            >
              {resolvedLogo ? (
                <img
                  src={resolvedLogo}
                  alt={storeName}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-black tracking-tight text-white">{storeName}</span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center justify-center gap-6">
            <button
              onClick={handleGoToStart}
              className={`cursor-pointer text-sm font-medium transition-colors ${
                selectedCategory === 'Todos' ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Início
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`cursor-pointer text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={onOpenCart}
              className="relative min-h-11 min-w-11 cursor-pointer p-2 text-white hover:text-orange-400 transition-colors"
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

        {isMobileMenuOpen && (
          <div className="border-t border-white/10 py-3 md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                onClick={handleGoToStart}
                className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                  selectedCategory === 'Todos'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Início
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
