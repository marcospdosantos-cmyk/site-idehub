function Categories() {
  const cats = window.categories;
  const trackRef = React.useRef(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateButtons);
  }, []);

  return (
    <section id="categorias" className="ide-cats">
      <div className="ide-section-head">
        <div>
          <span className="t-eyebrow">COLEÇÃO - 2026</span>
          <h2 className="ide-section-title">
            Escolha por onde&nbsp;
            <span className="ide-italic">começar.</span>
          </h2>
        </div>
        <div className="ide-cat-nav">
          <button
            className={`ide-cat-nav-btn ${!canPrev ? "is-disabled" : ""}`}
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            disabled={!canPrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            className={`ide-cat-nav-btn ${!canNext ? "is-disabled" : ""}`}
            onClick={() => scroll(1)}
            aria-label="Próximo"
            disabled={!canNext}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="ide-cat-grid" ref={trackRef}>
        {cats.map((c) =>
          <a href={c.href} key={c.key} className={`ide-cat-card ${c.isDrop ? "is-drop" : ""}`}>
            <div className="ide-cat-img">
              <img src={c.img} alt={c.label} loading="lazy" />
            </div>
            <div className="ide-cat-meta">
              <div className="ide-cat-meta-l">
                {c.isDrop && <span className="ide-cat-badge">Promo</span>}
                <h3 style={{ color: "rgb(255, 255, 255)" }}>{c.label}</h3>
                {c.description && <p className="ide-cat-desc">{c.description}</p>}
                <span className="ide-cat-count">{c.count} {c.count === 1 ? "peça" : "peças"}</span>
              </div>
              <span className="ide-cat-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

window.Categories = Categories;