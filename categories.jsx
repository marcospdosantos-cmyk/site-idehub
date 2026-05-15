// Categories — 4-card grid with editorial product imagery + count badges.
// First card spans wider; layout is asymmetric (1.4 / 1 / 1 / 1 across 4 cols on desktop).

function Categories() {
  const cats = window.categories;
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
        <a href="categoria.html?cat=tshirt" className="ide-link-arrow">
          Ver tudo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="ide-cat-grid">
        {cats.map((c, i) =>
        <a
          href={c.href}
          key={c.key}
          className={`ide-cat-card ${c.isDrop ? "is-drop" : ""}`}>
          
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
    </section>);

}

window.Categories = Categories;