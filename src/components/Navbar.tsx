import { useEffect, useState } from 'react';
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
  const shouldInvertLogo = Boolean(resolvedLogo?.includes('logo-preta-transp'));
  const [hasLogoError, setHasLogoError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setHasLogoError(false);
  }, [resolvedLogo]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectCategory = (category: string) => {
    onSelectCategory(category);
    setIsMobileMenuOpen(false);
  };

  const handleGoToStart = () => {
    onGoToStart();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-3 z-40 px-3 sm:top-5">
      <div
        className={`mx-auto max-w-6xl border px-3 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:px-5 ${
          isMobileMenuOpen ? 'rounded-[2rem]' : 'rounded-full'
        } ${
          isScrolled || isMobileMenuOpen
            ? 'border-black/10 bg-[#fffaf2]/88 shadow-black/10'
            : 'border-white/15 bg-black/18 shadow-black/20'
        }`}
      >
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-18 sm:gap-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleGoToStart}
              className="magnetic-button cursor-pointer rounded-full"
              aria-label="Ide.hub"
            >
              {resolvedLogo && !hasLogoError ? (
                <img
                  src={resolvedLogo}
                  alt={storeName}
                  onError={() => setHasLogoError(true)}
                  className={`h-10 w-auto max-w-28 object-contain transition duration-300 sm:h-12 ${
                    shouldInvertLogo && !isScrolled && !isMobileMenuOpen ? 'brightness-0 invert' : ''
                  }`}
                />
              ) : (
                <span className={`text-lg font-black tracking-tight ${isScrolled || isMobileMenuOpen ? 'text-black' : 'text-white'}`}>
                  {storeName}
                </span>
              )}
            </button>
          </div>

          <div className="hidden items-center justify-center gap-2 md:flex">
            <button
              onClick={handleGoToStart}
              className={`magnetic-button cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                selectedCategory === 'Todos'
                  ? isScrolled ? 'bg-black text-white' : 'bg-white text-black'
                  : isScrolled ? 'text-stone-600 hover:bg-black/5 hover:text-black' : 'text-white/76 hover:bg-white/10 hover:text-white'
              }`}
            >
              Início
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`magnetic-button cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  selectedCategory === cat
                    ? isScrolled ? 'bg-black text-white' : 'bg-white text-black'
                    : isScrolled ? 'text-stone-600 hover:bg-black/5 hover:text-black' : 'text-white/76 hover:bg-white/10 hover:text-white'
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
              className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full transition-colors md:hidden ${
                isScrolled || isMobileMenuOpen ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'
              }`}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={onOpenCart}
              className={`magnetic-button relative min-h-11 min-w-11 cursor-pointer rounded-full p-2 transition-colors ${
                isScrolled || isMobileMenuOpen ? 'bg-black text-white hover:bg-[#d96c27]' : 'bg-white text-black hover:bg-[#d96c27] hover:text-white'
              }`}
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute right-0 top-0 inline-flex min-h-5 min-w-5 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-[#d96c27] px-1.5 text-xs font-black leading-none text-white ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-black/10 py-3 md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                onClick={handleGoToStart}
                className={`min-h-11 cursor-pointer whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
                  selectedCategory === 'Todos'
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black hover:bg-black/10'
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
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-black hover:bg-black/10'
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
