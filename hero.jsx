// Hero — fullscreen editorial image, gigantic headline with Playfair italic accent.

function Hero({ onSearchOpen }) {
  return (
    <section id="top" className="ide-hero">
      <div className="ide-hero-bg">
        <img src="assets/hero-1.webp" alt="" fetchpriority="high" />
        <div className="ide-hero-grain" />
        <div className="ide-hero-overlay" />
        <div className="ide-hero-glow" />
      </div>

      {/* Background super-headline (decorative, behind the main composition) */}
      <div className="ide-hero-bg-type" aria-hidden="true">
        IDE.HUB
      </div>

      <div className="ide-hero-inner">
        <div className="ide-hero-top">
          <span className="ide-hero-kicker">
            <span className="dot" />
            Drop Outono · 2026
          </span>
          <span className="ide-hero-meta">
            <span>Edição limitada</span>
            <span className="sep" />
            <span>Estoque restrito</span>
          </span>
        </div>

        <h1 className="ide-hero-title">
          <span className="ide-hero-line">Vista a mensagem.</span>
          <span className="ide-hero-line">
            Carregue a&nbsp;
            <span className="ide-hero-italic">presença.</span>
          </span>
        </h1>

        <div className="ide-hero-bottom">
          <div className="ide-hero-lede">
            <p>
              Camisetas e peças cristãs para quem quer representar Jesus com estilo,
              verdade e atitude. No dia a dia, na faculdade, no trabalho e em
              cada escolha.
            </p>
            <div className="ide-hero-ctas">
              <a href="#produtos" className="ide-btn ide-btn-orange" onClick={(e) => {
                e.preventDefault();
                document.querySelector("#produtos")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Ver coleção
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              </a>
              <a href="#manifesto" className="ide-btn ide-btn-ghost" onClick={(e) => {
                e.preventDefault();
                document.querySelector("#manifesto")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Conhecer manifesto
              </a>
            </div>
          </div>

          {/* Featured drop card on the right */}
          <a href="#produtos" className="ide-hero-card" onClick={(e) => {
            e.preventDefault();
            document.querySelector("#produtos")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="ide-hero-card-img">
              <img src="assets/assim-na-terra-preto.webp" alt="Assim na Terra" />
            </div>
            <div className="ide-hero-card-meta">
              <span className="t-eyebrow t-eyebrow-light">Drop atual</span>
              <h3>Assim na Terra</h3>
              <div className="ide-hero-card-foot">
                <span>R$ 99,90</span>
                <span className="ide-hero-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </div>

        <div className="ide-hero-foot">
          <span>01 · Drop Outono</span>
          <span className="ide-hero-foot-mid">Vista sua fé. Represente.</span>
          <span>@ide.hub</span>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
