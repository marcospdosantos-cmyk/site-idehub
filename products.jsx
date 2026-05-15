// Product card + featured grid + drop banner with countdown.
// Card supports 3 hover styles via TWEAK: "minimal", "info", "button".

function ProductCard({ product, onQuickView, onAddToCart, hoverStyle = "info", index = 0 }) {
  const [hover, setHover] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(product.img);

  React.useEffect(() => {
    if (hover && product.imgAlt) {
      const t = setTimeout(() => setImgSrc(product.imgAlt), 150);
      return () => clearTimeout(t);
    } else {
      setImgSrc(product.img);
    }
  }, [hover, product]);

  const lowStock = product.stock <= 5;

  return (
    <article
      className={`ide-pcard ide-pcard-hs-${hoverStyle} ${hover ? "is-hover" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onQuickView && onQuickView(product)}
      style={{ transitionDelay: `${index * 60}ms` }}>
      
      <div className="ide-pcard-img-wrap">
        {product.isNew && <span className="ide-pcard-tag is-new">Novo</span>}
        {lowStock && <span className="ide-pcard-tag is-low">Últimas {product.stock}</span>}

        <img src={imgSrc} alt={product.name} className="ide-pcard-img" loading="lazy" />

        {/* Hover overlay — minimal: nothing extra; info: cores + tamanhos; button: visible CTA */}
        {hoverStyle === "info" &&
        <div className="ide-pcard-info">
            <div className="ide-pcard-info-row">
              <span>Cores</span>
              <div className="ide-pcard-swatches">
                {product.colors.map((c) =>
              <span key={c} title={c} style={{ background: window.swatchMap[c] || "#d6d3d1" }} />
              )}
              </div>
            </div>
            <div className="ide-pcard-info-row">
              <span>Tamanhos</span>
              <div className="ide-pcard-sizes">
                {product.sizes.map((s) =>
              <span key={s}>{s}</span>
              )}
              </div>
            </div>
            <button
            className="ide-pcard-quick"
            onClick={(e) => {e.stopPropagation();onQuickView && onQuickView(product);}}>
            
              Visualização rápida
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        }

        {hoverStyle === "button" &&
        <div className="ide-pcard-btn-wrap">
            <button
            className="ide-pcard-add"
            onClick={(e) => {e.stopPropagation();onAddToCart && onAddToCart(product);}}>
            
              Adicionar ao carrinho
            </button>
          </div>
        }
      </div>

      <div className="ide-pcard-meta">
        <div>
          <span className="ide-pcard-cat">{product.subtitle}</span>
          <h3>{product.name}</h3>
        </div>
        <span className="ide-pcard-price">R$ {product.price.toFixed(2).replace(".", ",")}</span>
      </div>
      <div className="ide-pcard-foot">
        <div className="ide-pcard-swatches sm">
          {product.colors.map((c) =>
          <span key={c} title={c} style={{ background: window.swatchMap[c] || "#d6d3d1" }} />
          )}
        </div>
        <span className="ide-pcard-stock">
          {lowStock ? <span className="dot dot-warn" /> : <span className="dot dot-ok" />}
          {lowStock ? "Estoque baixo" : "Em estoque"}
        </span>
      </div>
    </article>);

}

function FeaturedProducts({ products, onQuickView, onAddToCart, hoverStyle }) {
  return (
    <section id="produtos" className="ide-products">
      <div className="ide-section-head">
        <div>
          <span className="t-eyebrow">Produtos disponíveis</span>
          <h2 className="ide-section-title">
            Em destaque agora.
            <br />
            Vista o que te&nbsp;
            <span className="ide-italic">move.</span>
          </h2>
        </div>
        <div className="ide-section-head-r">
          <span>{products.length} peças curadas</span>
          <a href="#produtos" className="ide-link-arrow">
            Ver coleção completa
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      <div className="ide-product-grid">
        {products.map((p, i) =>
        <ProductCard
          key={p.id}
          product={p}
          index={i}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          hoverStyle={hoverStyle} />

        )}
      </div>
    </section>);

}

// ───────────────────────────────────────────────
// Drop banner with live countdown
// ───────────────────────────────────────────────

function DropCountdown() {
  // Target: roughly 3 days, 14 hours from "now" — recomputed once on mount
  const target = React.useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 86); // ~3.5 days
    return d.getTime();
  }, []);

  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hrs = Math.floor(diff % 86_400_000 / 3_600_000);
  const mins = Math.floor(diff % 3_600_000 / 60_000);
  const secs = Math.floor(diff % 60_000 / 1000);

  const fmt = (n) => String(n).padStart(2, "0");

  return (
    <section className="ide-drop">
      <div className="ide-drop-inner">
        <div className="ide-drop-l">
          <span className="t-eyebrow t-eyebrow-light">Próximo drop</span>
          <h3 style={{ color: "rgb(244, 243, 243)" }}>
            Coleção <span className="ide-italic-soft">Reino.</span>
          </h3>
          <p>Peças limitadas. Numeração corrida. Liberação em breve.</p>
        </div>

        <div className="ide-drop-clock">
          {[
          { v: fmt(days), l: "dias" },
          { v: fmt(hrs), l: "horas" },
          { v: fmt(mins), l: "min" },
          { v: fmt(secs), l: "seg" }].
          map((b, i) =>
          <React.Fragment key={b.l}>
              <div className="ide-drop-block">
                <span className="ide-drop-v">{b.v}</span>
                <span className="ide-drop-l-lbl">{b.l}</span>
              </div>
              {i < 3 && <span className="ide-drop-colon">:</span>}
            </React.Fragment>
          )}
        </div>

        <button className="ide-btn ide-btn-orange ide-drop-cta">
          Avise-me
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10 21a2 2 0 0 0 4 0" />
          </svg>
        </button>
      </div>
    </section>);

}

window.ProductCard = ProductCard;
window.FeaturedProducts = FeaturedProducts;
window.DropCountdown = DropCountdown;