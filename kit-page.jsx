// Montar Kit — escolha 3 camisetas, ganhe 1 meia.
// Layout: catálogo de produtos (esq, arrastável) + painel do kit (dir, sticky).
// Interação: arrastar ou clicar nos produtos para adicioná-los aos slots.

function KitPage() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{"accent": "#f2752f"}/*EDITMODE-END*/);

  React.useEffect(() => {
    const meta = { "#f2752f": "#f3c27d", "#c19a4b": "#e5cc94" };
    document.documentElement.style.setProperty("--ide-accent", tweaks.accent);
    document.documentElement.style.setProperty("--ide-accent-soft", meta[tweaks.accent] || "#f3c27d");
  }, [tweaks.accent]);

  const allShirts = window.allProducts.filter(p => p.tipo === "camiseta");
  const allSocks  = window.allProducts.filter(p => p.tipo === "meia");

  const KIT_LIMIT = 3;
  const KIT_PRICE = 219.90;

  const [shirts, setShirts] = React.useState([]);
  const [sock, setSock]     = React.useState(null);
  const [picking, setPicking] = React.useState(null);

  const [cart, setCart]           = useCart();
  const [cartOpen, setCartOpen]   = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toast, setToast]         = React.useState({ visible: false, item: null });
  const toastTimer = React.useRef(null);
  const cartCount = cart.reduce((sum, it) => sum + it.qty, 0);

  // Drag state
  const [dragPid, setDragPid]         = React.useState(null);
  const [dragOverSlot, setDragOverSlot] = React.useState(null); // 0 | 1 | 2 | "sock"

  const shirtsFull  = shirts.length === KIT_LIMIT;
  const kitComplete = shirtsFull && sock != null;

  const dragProduct = dragPid ? window.allProducts.find(p => p.id === dragPid) : null;
  const isDraggingShirt = dragProduct?.tipo === "camiseta";
  const isDraggingSock  = dragProduct?.tipo === "meia";

  React.useEffect(() => { document.title = "Montar Kit — Ide.hub"; }, []);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setPicking(null); setCartOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Drag handlers ────────────────────────────────────────────
  const onDragStart = (e, pid) => {
    e.dataTransfer.setData("text/plain", pid);
    e.dataTransfer.effectAllowed = "copy";
    setDragPid(pid);
  };

  const onDragEnd = () => { setDragPid(null); setDragOverSlot(null); };

  const onSlotDragOver = (e, slotKey) => {
    const isShirtSlot = slotKey !== "sock";
    const ok = isShirtSlot
      ? isDraggingShirt && (!shirtsFull || shirts[slotKey] != null)
      : isDraggingSock && shirtsFull && !sock;
    if (!ok) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverSlot(slotKey);
  };

  const onSlotDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverSlot(null);
  };

  const onSlotDrop = (e, slotKey) => {
    e.preventDefault();
    const pid = e.dataTransfer.getData("text/plain");
    const p = window.allProducts.find(x => x.id === pid);
    if (!p) { onDragEnd(); return; }

    if (slotKey === "sock") {
      if (p.tipo === "meia" && shirtsFull) setPicking({ product: p, kind: "sock" });
    } else {
      if (p.tipo === "camiseta") {
        const editIdx = shirts[slotKey] != null ? slotKey : undefined;
        setPicking({ product: p, kind: "shirt", editIdx });
      }
    }
    onDragEnd();
  };

  // ── Click handlers ───────────────────────────────────────────
  const addShirt = (product) => { if (!shirtsFull) setPicking({ product, kind: "shirt" }); };
  const addSock  = (product) => { if (shirtsFull && !sock) setPicking({ product, kind: "sock" }); };
  const editShirt = (idx) => {
    const p = allShirts.find(x => x.id === shirts[idx].pid);
    setPicking({ product: p, kind: "shirt", editIdx: idx });
  };
  const removeShirt = (idx) => setShirts(prev => prev.filter((_, i) => i !== idx));
  const clearSock = () => setSock(null);

  const confirmPick = ({ size, color }) => {
    if (picking.kind === "shirt") {
      const newSel = { pid: picking.product.id, size, color };
      if (picking.editIdx != null) {
        setShirts(prev => prev.map((s, i) => i === picking.editIdx ? newSel : s));
      } else {
        setShirts(prev => [...prev, newSel]);
      }
    } else {
      setSock({ pid: picking.product.id, size, color });
    }
    setPicking(null);
  };

  // ── Pricing ──────────────────────────────────────────────────
  const shirtsOriginal = shirts.reduce((sum, s) => {
    return sum + (allShirts.find(x => x.id === s.pid)?.price || 0);
  }, 0);
  const kitPrice = shirtsFull ? KIT_PRICE : shirtsOriginal;
  const sockPrice = sock ? (allSocks.find(x => x.id === sock.pid)?.price || 0) : 0;
  const savings   = Math.max(0, shirtsOriginal - kitPrice) + sockPrice;

  const finalizeKit = () => {
    if (!kitComplete) return;
    shirts.forEach(s => {
      const p = allShirts.find(x => x.id === s.pid);
      if (!p) return;
      setCart(prev => [...prev, {
        lineId: `${p.id}-${s.size}-${s.color}-kit`,
        id: p.id, name: p.name, subtitle: `Kit · ${p.subtitle}`,
        price: KIT_PRICE / KIT_LIMIT, img: p.img, size: s.size, color: s.color, qty: 1,
      }]);
    });
    const sockP = allSocks.find(x => x.id === sock.pid);
    if (sockP) {
      setCart(prev => [...prev, {
        lineId: `${sockP.id}-${sock.size}-${sock.color}-brinde`,
        id: sockP.id, name: `${sockP.name} (BRINDE)`, subtitle: "Brinde do kit",
        price: 0, img: sockP.img, size: sock.size, color: sock.color, qty: 1,
      }]);
    }
    setCartOpen(true);
    clearTimeout(toastTimer.current);
    setToast({ visible: true, item: { name: "Kit montado!", img: allShirts.find(x => x.id === shirts[0].pid)?.img } });
    toastTimer.current = setTimeout(() => setToast({ visible: false, item: null }), 2600);
  };

  const removeFromCart = (lineId) => setCart(prev => prev.filter(l => l.lineId !== lineId));
  const changeQty = (lineId, qty) => setCart(prev => prev.map(l => l.lineId === lineId ? { ...l, qty } : l));

  return (
    <React.Fragment>
      <Navbar cartCount={cartCount} onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />

      {/* HERO */}
      <section className="ide-kit-hero">
        <div className="ide-kit-hero-bg" />
        <div className="ide-kit-hero-inner">
          <nav className="ide-crumbs is-light" aria-label="breadcrumb">
            <a href="Homepage @ide.hub.html">Início</a>
            <span>/</span>
            <strong>Montar Kit</strong>
          </nav>
          <div className="ide-kit-hero-grid">
            <div>
              <span className="t-eyebrow t-eyebrow-light">Promo · Edição Outono 2026</span>
              <h1>
                Monte seu kit.<br/>
                <span className="ide-italic-soft">3 camisetas + 1 meia de brinde.</span>
              </h1>
              <p>
                Arraste ou clique nas peças para montar seu kit por R$ {KIT_PRICE.toFixed(2).replace(".", ",")}.
                Frete grátis incluído.
              </p>
            </div>
            <ul className="ide-kit-perks">
              <li>
                <span className="ide-kit-perks-num">01</span>
                <div><strong>Economize até R$ 80</strong><p>Comparado ao preço unitário das 3 camisetas.</p></div>
              </li>
              <li>
                <span className="ide-kit-perks-num">02</span>
                <div><strong>Meia de brinde</strong><p>Escolha a cor depois das camisetas.</p></div>
              </li>
              <li>
                <span className="ide-kit-perks-num">03</span>
                <div><strong>Frete grátis</strong><p>Kit já passa do mínimo automaticamente.</p></div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="ide-kit-layout">

        {/* ── LEFT: Product catalog ── */}
        <div className="ide-kit-catalog">

          {/* Shirts */}
          <div className="ide-kit-catalog-section">
            <div className="ide-kit-catalog-head">
              <div>
                <span className="t-eyebrow">Passo 1</span>
                <h3>Escolha 3 camisetas</h3>
              </div>
              <span className="ide-kit-catalog-counter">
                {shirts.length}<span> / {KIT_LIMIT}</span>
              </span>
            </div>

            <div className="ide-product-grid">
              {allShirts.map((p, i) => {
                const inKit = shirts.filter(s => s.pid === p.id).length;
                return (
                  <article
                    key={p.id}
                    className={`ide-pcard ide-pcard-hs-info ide-kit-card ${shirtsFull ? "is-disabled" : ""} ${dragPid === p.id ? "is-dragging" : ""}`}
                    draggable={!shirtsFull}
                    onDragStart={(e) => !shirtsFull && onDragStart(e, p.id)}
                    onDragEnd={onDragEnd}
                    onClick={() => addShirt(p)}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {inKit > 0 && <span className="ide-kit-card-used">No kit ×{inKit}</span>}
                    <div className="ide-pcard-img-wrap">
                      {p.isNew && <span className="ide-pcard-tag is-new">Novo</span>}
                      <img src={p.img} alt={p.name} className="ide-pcard-img" />
                      {!shirtsFull && (
                        <div className="ide-kit-card-drag-hint">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Arrastar para o kit
                        </div>
                      )}
                    </div>
                    <div className="ide-pcard-meta">
                      <div>
                        <span className="ide-pcard-cat">{p.subtitle}</span>
                        <h3>{p.name}</h3>
                      </div>
                      <span className="ide-pcard-price">R$ {p.price.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="ide-pcard-foot">
                      <div className="ide-pcard-swatches sm">
                        {p.colors.map(c => <span key={c} title={c} style={{ background: window.swatchMap[c] || "#d6d3d1" }} />)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Socks */}
          <div className={`ide-kit-catalog-section ide-kit-socks-catalog ${!shirtsFull ? "is-locked" : ""}`}>
            <div className="ide-kit-catalog-head">
              <div>
                <span className="t-eyebrow">{shirtsFull ? "Passo 2" : "Bloqueado"}</span>
                <h3>Escolha sua meia de brinde</h3>
              </div>
              {!shirtsFull
                ? <span className="ide-kit-lock-hint">Termine as 3 camisetas</span>
                : <span className="ide-kit-catalog-counter">{allSocks.length}<span> cores</span></span>
              }
            </div>
            <div className="ide-kit-socks-grid">
              {allSocks.map((p, i) => {
                const isSelected = sock?.pid === p.id;
                return (
                  <article
                    key={p.id}
                    className={`ide-kit-sock ${isSelected ? "is-selected" : ""} ${dragPid === p.id ? "is-dragging" : ""}`}
                    draggable={shirtsFull}
                    onDragStart={(e) => shirtsFull && onDragStart(e, p.id)}
                    onDragEnd={onDragEnd}
                    onClick={() => addSock(p)}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="ide-kit-sock-img"><img src={p.img} alt={p.name} /></div>
                    <div className="ide-kit-sock-meta">
                      <span className="t-eyebrow t-eyebrow-light">Brinde</span>
                      <h3>{p.name}</h3>
                      <span className="ide-kit-sock-price">
                        <s>R$ {p.price.toFixed(2).replace(".", ",")}</s>
                        <strong>Grátis</strong>
                      </span>
                    </div>
                    <span className="ide-kit-sock-check">
                      {isSelected
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      }
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sticky kit panel ── */}
        <div className="ide-kit-panel">
          <div className={`ide-kit-panel-box ${isDraggingShirt && !shirtsFull ? "ide-kit-panel-box-active" : isDraggingSock && shirtsFull ? "ide-kit-panel-box-active" : ""}`}>

            <div className="ide-kit-panel-title">
              <span>Seu kit</span>
              <span className="ide-kit-panel-progress">{shirts.length}/{KIT_LIMIT} camisetas</span>
            </div>

            <div className="ide-kit-panel-slots">

              {/* Shirt slots */}
              {Array.from({ length: KIT_LIMIT }).map((_, idx) => {
                const sel = shirts[idx];
                const p   = sel ? allShirts.find(x => x.id === sel.pid) : null;
                const isOver     = dragOverSlot === idx;
                const isAccepting = isDraggingShirt && !shirtsFull && !sel;
                return (
                  <div
                    key={idx}
                    className={`ide-kit-panel-slot ${p ? "is-filled" : "is-empty"} ${isOver ? "is-drag-over" : ""} ${isAccepting ? "is-accepting" : ""}`}
                    onDragOver={(e) => onSlotDragOver(e, idx)}
                    onDragLeave={onSlotDragLeave}
                    onDrop={(e) => onSlotDrop(e, idx)}
                  >
                    <span className="ide-kit-panel-slot-num">0{idx + 1}</span>
                    {p ? (
                      <React.Fragment>
                        <div className="ide-kit-panel-slot-img">
                          <img src={p.img} alt={p.name} />
                        </div>
                        <div className="ide-kit-panel-slot-info">
                          <span className="ide-kit-panel-slot-name">{p.name}</span>
                          <span className="ide-kit-panel-slot-opts">Tam {sel.size} · {sel.color}</span>
                        </div>
                        <div className="ide-kit-panel-slot-actions">
                          <button className="ide-kit-panel-slot-btn" onClick={() => editShirt(idx)} aria-label="Editar">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className="ide-kit-panel-slot-btn is-remove" onClick={() => removeShirt(idx)} aria-label="Remover">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <span className="ide-kit-panel-slot-hint">
                        {isOver ? "Solte aqui" : "Arraste ou clique"}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Sock slot */}
              {(() => {
                const sockP  = sock ? allSocks.find(x => x.id === sock.pid) : null;
                const isOver = dragOverSlot === "sock";
                return (
                  <div
                    className={`ide-kit-panel-slot ide-kit-panel-slot-sock ${sockP ? "is-filled" : "is-empty"} ${!shirtsFull ? "is-locked" : ""} ${isOver ? "is-drag-over" : ""}`}
                    onDragOver={(e) => onSlotDragOver(e, "sock")}
                    onDragLeave={onSlotDragLeave}
                    onDrop={(e) => onSlotDrop(e, "sock")}
                  >
                    <span className="ide-kit-panel-slot-badge">BRINDE</span>
                    {sockP ? (
                      <React.Fragment>
                        <div className="ide-kit-panel-slot-img"><img src={sockP.img} alt={sockP.name} /></div>
                        <div className="ide-kit-panel-slot-info">
                          <span className="ide-kit-panel-slot-name">{sockP.name}</span>
                          <span className="ide-kit-panel-slot-opts">{sock.color} · Grátis</span>
                        </div>
                        <div className="ide-kit-panel-slot-actions">
                          <button className="ide-kit-panel-slot-btn is-remove" onClick={clearSock} aria-label="Remover">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <span className="ide-kit-panel-slot-hint">
                        {isOver ? "Solte aqui" : !shirtsFull ? "Termine as camisetas" : "Arraste ou clique"}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Drag feedback */}
            {dragPid && (
              <div className="ide-kit-drop-hint">
                {isDraggingShirt && !shirtsFull && "Solte em um slot de camiseta"}
                {isDraggingShirt && shirtsFull && "Kit de camisetas já completo"}
                {isDraggingSock && shirtsFull && !sock && "Solte no slot de brinde"}
                {isDraggingSock && !shirtsFull && "Termine as camisetas primeiro"}
              </div>
            )}

            {/* Pricing */}
            {shirts.length > 0 && (
              <div className="ide-kit-panel-pricing">
                {!shirtsFull && (
                  <div className="ide-kit-panel-price-row">
                    <span>Subtotal parcial</span>
                    <span>R$ {shirtsOriginal.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                {shirtsFull && (
                  <React.Fragment>
                    <div className="ide-kit-panel-price-row">
                      <span>Preço cheio</span>
                      <span style={{ textDecoration: "line-through", color: "var(--stone-500)" }}>
                        R$ {shirtsOriginal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="ide-kit-panel-price-row is-total">
                      <span>Total do kit</span>
                      <span>R$ {kitPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                    {savings > 0 && (
                      <span className="ide-kit-panel-save">
                        Você economiza R$ {savings.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}

            <button
              className="ide-btn ide-btn-orange"
              style={{ width: "100%", justifyContent: "center", opacity: kitComplete ? 1 : 0.5, cursor: kitComplete ? "pointer" : "default" }}
              disabled={!kitComplete}
              onClick={finalizeKit}
            >
              {kitComplete
                ? "Adicionar kit ao carrinho"
                : shirtsFull && !sock
                  ? "Escolha sua meia de brinde"
                  : `Faltam ${KIT_LIMIT - shirts.length} camiseta${KIT_LIMIT - shirts.length === 1 ? "" : "s"}`
              }
              {kitComplete && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />

      {picking && (
        <KitVariantPicker picking={picking} onClose={() => setPicking(null)} onConfirm={confirmPick} />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onChangeQty={changeQty} onRemove={removeFromCart} onClearCart={() => setCart([])} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={() => {}} />
      <CartToast visible={toast.visible} item={toast.item} />

      <TweaksPanel>
        <TweakSection label="Cor de acento" />
        <TweakColor label="Acento" value={tweaks.accent} options={["#f2752f", "#c19a4b"]} onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

// Modal para escolha de tamanho + cor após selecionar/soltar um produto
function KitVariantPicker({ picking, onClose, onConfirm }) {
  const { product } = picking;
  const [size, setSize]   = React.useState(product.sizes[Math.min(1, product.sizes.length - 1)]);
  const [color, setColor] = React.useState(product.colors[0]);

  return (
    <div className="ide-modal-scrim" onClick={onClose}>
      <div className="ide-modal ide-kit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ide-modal-close" onClick={onClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="ide-modal-gallery">
          <div className="ide-modal-img-main">
            <img src={product.img} alt={product.name} />
          </div>
        </div>
        <div className="ide-modal-info">
          <div className="ide-modal-head">
            <span className="t-eyebrow">{picking.kind === "sock" ? "Brinde do kit" : "Adicionando ao kit"}</span>
            <h2>{product.name}</h2>
            {picking.kind === "shirt" && (
              <div className="ide-modal-price-row">
                <span className="ide-modal-installments">No kit: R$ 73,30 (média por peça)</span>
              </div>
            )}
            {picking.kind === "sock" && (
              <div className="ide-modal-price-row">
                <strong style={{ fontSize: 20, color: "var(--ide-accent)", fontWeight: 900 }}>Grátis no kit</strong>
              </div>
            )}
          </div>

          <p className="ide-modal-inspiration">{product.inspiration}</p>

          <div className="ide-modal-section">
            <div className="ide-modal-section-head"><span>Cor · <strong>{color}</strong></span></div>
            <div className="ide-modal-colors">
              {product.colors.map(c => (
                <button key={c} className={`ide-modal-color ${color === c ? "is-active" : ""}`} onClick={() => setColor(c)} aria-label={c}>
                  <span style={{ background: window.swatchMap[c] || "#d6d3d1" }} />
                </button>
              ))}
            </div>
          </div>

          <div className="ide-modal-section">
            <div className="ide-modal-section-head"><span>Tamanho</span></div>
            <div className="ide-modal-sizes">
              {product.sizes.map(s => (
                <button key={s} className={`ide-modal-size ${size === s ? "is-active" : ""}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="ide-modal-actions">
            <button className="ide-btn ide-btn-orange ide-modal-add" onClick={() => onConfirm({ size, color })}>
              {picking.editIdx != null ? "Atualizar peça" : picking.kind === "shirt" ? "Adicionar ao kit" : "Confirmar brinde"}
            </button>
            <button className="ide-btn ide-btn-ghost-dark" onClick={onClose}>Voltar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.KitPage = KitPage;
