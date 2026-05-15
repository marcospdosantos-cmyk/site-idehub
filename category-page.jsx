// Generic category listing page.
// Reads ?cat=oversized|tshirt|meias from URL, filters allProducts via window.categoryPages[cat].filter
// Renders breadcrumb + page hero + filter bar + product grid + reuses sections (Testimonials, Newsletter, Footer)

function CategoryPage() {
  const [cardHover, setCardHover] = React.useState("info");
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "accent": "#f2752f",
    "cardHover": "info"
  }/*EDITMODE-END*/);

  React.useEffect(() => {
    const meta = { "#f2752f": "#f3c27d", "#c19a4b": "#e5cc94" };
    document.documentElement.style.setProperty("--ide-accent", tweaks.accent);
    document.documentElement.style.setProperty("--ide-accent-soft", meta[tweaks.accent] || "#f3c27d");
  }, [tweaks.accent]);

  // Parse URL
  const params = new URLSearchParams(window.location.search);
  const catKey = params.get("cat") || "tshirt";
  const pageDef = window.categoryPages[catKey] || window.categoryPages.tshirt;
  const allMatching = window.allProducts.filter(pageDef.filter);

  // Filter / sort state
  const [colorFilter, setColorFilter] = React.useState("Todos");
  const [sortBy, setSortBy] = React.useState("relevancia");
  const [view, setView] = React.useState("grid");

  // Build dynamic color filter options from products
  const allColors = ["Todos", ...new Set(allMatching.flatMap(p => p.colors))];

  let filtered = colorFilter === "Todos"
    ? allMatching
    : allMatching.filter(p => p.colors.includes(colorFilter));

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "menor") return a.price - b.price;
    if (sortBy === "maior") return b.price - a.price;
    if (sortBy === "novos") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  // Cart/Quick view state (replica do App principal)
  const [cart, setCart] = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [quickView, setQuickView] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ visible: false, item: null });
  const toastTimer = React.useRef(null);
  const cartCount = cart.reduce((sum, it) => sum + it.qty, 0);

  const addToCart = (product, opts = {}) => {
    const size = opts.size || product.sizes?.[1] || product.sizes?.[0];
    const color = opts.color || product.colors?.[0];
    const lineId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((l) => l.lineId === lineId);
      if (existing) return prev.map((l) => l.lineId === lineId ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { lineId, id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img, size, color, qty: 1 }];
    });
    if (quickView?.id === product.id) setQuickView(null);
    clearTimeout(toastTimer.current);
    setToast({ visible: true, item: product });
    toastTimer.current = setTimeout(() => setToast({ visible: false, item: null }), 2600);
  };
  const removeFromCart = (lineId) => setCart((prev) => prev.filter((l) => l.lineId !== lineId));
  const changeQty = (lineId, qty) => setCart((prev) => prev.map((l) => l.lineId === lineId ? { ...l, qty } : l));

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setQuickView(null); setCartOpen(false); setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Reveal on scroll
  React.useEffect(() => {
    const els = document.querySelectorAll(".ide-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  // Update doc title
  React.useEffect(() => {
    document.title = `${pageDef.label} — Ide.hub`;
  }, [pageDef.label]);

  return (
    <React.Fragment>
      <Navbar
        cartCount={cartCount}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* PAGE HERO */}
      <section className="ide-cathero">
        <div className="ide-cathero-bg">
          <img src={pageDef.heroImg} alt="" />
          <div className="ide-cathero-overlay" />
          <div className="ide-cathero-glow" />
        </div>
        <div className="ide-cathero-inner">
          <nav className="ide-crumbs" aria-label="breadcrumb">
            <a href="Homepage @ide.hub.html">Início</a>
            <span>/</span>
            <span>Coleção</span>
            <span>/</span>
            <strong>{pageDef.label}</strong>
          </nav>

          <div className="ide-cathero-headline">
            <span className="t-eyebrow t-eyebrow-light">{pageDef.eyebrow}</span>
            <h1>
              {pageDef.title} <span className="ide-italic-soft">{pageDef.titleAccent}</span>
            </h1>
            <p>{pageDef.description}</p>
          </div>

          <div className="ide-cathero-stats">
            <div>
              <span className="ide-cathero-stat-v">{allMatching.length}</span>
              <span className="ide-cathero-stat-l">peças disponíveis</span>
            </div>
            <div>
              <span className="ide-cathero-stat-v">{allColors.length - 1}</span>
              <span className="ide-cathero-stat-l">cores</span>
            </div>
            <div>
              <span className="ide-cathero-stat-v">★ 4,9</span>
              <span className="ide-cathero-stat-l">média de avaliação</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="ide-catlist">
        <div className="ide-filterbar">
          <div className="ide-filterbar-l">
            <span className="ide-filterbar-label">Cor</span>
            <div className="ide-filterbar-chips">
              {allColors.map(c => (
                <button
                  key={c}
                  className={`ide-chip ${colorFilter === c ? "is-active" : ""}`}
                  onClick={() => setColorFilter(c)}
                >
                  {c !== "Todos" && (
                    <span className="ide-chip-swatch" style={{ background: window.swatchMap[c] || "#d6d3d1" }} />
                  )}
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="ide-filterbar-r">
            <span className="ide-filterbar-count">{filtered.length} {filtered.length === 1 ? "peça" : "peças"}</span>
            <div className="ide-view-toggle">
              <button
                className={view === "grid" ? "is-active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button
                className={view === "dense" ? "is-active" : ""}
                onClick={() => setView("dense")}
                aria-label="Denso"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="5" height="5"/><rect x="10" y="3" width="5" height="5"/><rect x="17" y="3" width="4" height="5"/><rect x="3" y="10" width="5" height="5"/><rect x="10" y="10" width="5" height="5"/><rect x="17" y="10" width="4" height="5"/><rect x="3" y="17" width="5" height="4"/><rect x="10" y="17" width="5" height="4"/><rect x="17" y="17" width="4" height="4"/></svg>
              </button>
            </div>
            <select
              className="ide-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevancia">Mais relevantes</option>
              <option value="novos">Lançamentos</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ide-empty">
            <h3>Nenhuma peça com esse filtro.</h3>
            <p>Tente outra cor ou volte a ver tudo.</p>
            <button className="ide-btn ide-btn-dark" onClick={() => setColorFilter("Todos")}>Ver todas as peças</button>
          </div>
        ) : (
          <div className={`ide-product-grid ${view === "dense" ? "is-dense" : ""}`}>
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onQuickView={setQuickView}
                onAddToCart={addToCart}
                hoverStyle={tweaks.cardHover}
              />
            ))}
          </div>
        )}
      </section>

      {/* KIT CTA strip — only if this page is not the kit page itself */}
      <section className="ide-kitstrip">
        <div className="ide-kitstrip-inner">
          <div>
            <span className="t-eyebrow t-eyebrow-light">Promo · Monte seu kit</span>
            <h3>
              Leve <strong>3 camisetas</strong> + 1 meia <span className="ide-italic-soft">de brinde.</span>
            </h3>
          </div>
          <a href="montar-kit.html" className="ide-btn ide-btn-orange">
            Montar meu kit
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
            </svg>
          </a>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      {/* Overlays */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onChangeQty={changeQty} onRemove={removeFromCart} onClearCart={() => setCart([])} />
      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} onAddToCart={addToCart} />}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={setQuickView} />
      <CartToast visible={toast.visible} item={toast.item} />

      <TweaksPanel>
        <TweakSection label="Cor de acento" />
        <TweakColor
          label="Acento"
          value={tweaks.accent}
          options={["#f2752f", "#c19a4b"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSection label="Cards de produto" />
        <TweakRadio
          label="Estilo de hover"
          value={tweaks.cardHover}
          options={["minimal", "info", "button"]}
          onChange={(v) => setTweak("cardHover", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.CategoryPage = CategoryPage;
