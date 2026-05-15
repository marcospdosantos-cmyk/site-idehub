// Shared layout wrapper for static content pages (FAQ, Trocas, Tamanhos).
// Provides Navbar + Footer + CartDrawer + SearchOverlay with cart persistence.

function ContentPage({ title, children }) {
  const [cart, setCart] = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  React.useEffect(() => {
    document.title = `${title} — Ide.hub`;
    document.documentElement.style.setProperty("--ide-accent", "#f2752f");
    document.documentElement.style.setProperty("--ide-accent-soft", "#f3c27d");
  }, []);

  React.useEffect(() => {
    const h = e => { if (e.key === "Escape") { setCartOpen(false); setSearchOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const changeQty = (id, qty) => setCart(p => p.map(l => l.lineId === id ? { ...l, qty } : l));
  const removeItem = (id) => setCart(p => p.filter(l => l.lineId !== id));

  return (
    <React.Fragment>
      <Navbar cartCount={cartCount} onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onChangeQty={changeQty} onRemove={removeItem} onClearCart={() => setCart([])} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={() => {}} />
    </React.Fragment>
  );
}

window.ContentPage = ContentPage;
