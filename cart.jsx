// Carrinho persistido em localStorage — sobrevive à navegação entre páginas.

const CART_KEY = "idehub_cart";

function useCart() {
  const [cart, setCartRaw] = React.useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setCart = (updater) => {
    setCartRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [cart, setCart];
}

window.useCart = useCart;
