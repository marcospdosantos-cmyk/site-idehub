// Navbar — sticky pill nav with mega menu, search trigger, cart trigger.
// Black-on-white, glassmorphic on scroll. Logo swaps based on scroll state.

function Navbar({ onSearchOpen, onCartOpen, cartCount }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
  { key: "inicio", label: "Início", href: "Homepage @ide.hub.html" },
  { key: "oversized", label: "Camisetas Oversized", href: "categoria.html?cat=oversized" },
  { key: "streetwear", label: "Camisetas Streetwear", href: "categoria.html?cat=streetwear" },
  { key: "basicas", label: "Camisetas Básicas", href: "categoria.html?cat=tshirt" },
  { key: "meias", label: "Meias", href: "categoria.html?cat=meias" },
  { key: "montar-kit", label: "Montar Kit", href: "montar-kit.html", badge: "novo" }];

  const handleNav = (href, e) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <React.Fragment>
      {/* Top utility strip */}
      <div className="ide-utility-strip">
        <div className="ide-utility-inner">
          {[0, 1].map(n => (
            <span key={n} className="ide-utility-marquee" aria-hidden={n === 1 ? "true" : undefined}>
              <span>Frete grátis em compras acima de R$ 299</span>
              <span className="dot" />
              <span>Pix com 15% OFF</span>
              <span className="dot" />
              <span>Parcele em até 6x sem juros</span>
              <span className="dot" />
            </span>
          ))}
        </div>
      </div>

      <nav className={`ide-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="ide-nav-inner">
          <a href="Homepage @ide.hub.html" className="ide-nav-logo" aria-label="Ide.hub">
            <img src="assets/logo-preta-transp.png" alt="Ide.hub" style={{ height: "69px", width: "69px", objectFit: "cover" }} />
          </a>

          <ul className="ide-nav-list">
            {items.map((item) =>
            <li
              key={item.key}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}>

                <a
                href={item.href}
                className={`ide-nav-link ${hoveredItem === item.key ? "is-hover" : ""}`}
                onClick={(e) => handleNav(item.href, e)}>

                  {item.label}
                  {item.badge && <span className="ide-nav-badge">{item.badge}</span>}
                </a>
              </li>
            )}
          </ul>

          <div className="ide-nav-actions">
            <button className="ide-icon-btn" aria-label="Buscar" onClick={onSearchOpen}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <button className="ide-icon-btn" aria-label="Conta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
            <button className="ide-icon-btn ide-cart-btn" aria-label="Carrinho" onClick={onCartOpen}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="ide-cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

    </React.Fragment>);

}

window.Navbar = Navbar;