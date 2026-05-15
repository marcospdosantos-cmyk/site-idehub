// Manifesto, How-to-Buy, Testimonials, UGC grid, Newsletter, Pre-footer, Footer.

function Manifesto() {
  return (
    <section id="manifesto" className="ide-manifesto">
      <div className="ide-manifesto-inner">
        <div className="ide-manifesto-l">
          <span className="t-eyebrow t-eyebrow-light">Por que a ide.hub existe</span>
          <h2>
            Fé também se&nbsp;
            <span className="ide-italic-soft">veste.</span>
          </h2>
        </div>
        <div className="ide-manifesto-r">
          <p className="ide-manifesto-lede">
            A Ide.hub nasceu para jovens cristãos que querem viver a fé por inteiro.
            Na igreja, na rua, na faculdade, no trabalho e em cada escolha do dia a dia.
          </p>
          <p className="ide-manifesto-body">
            Não fazemos camisetas religiosas. Fazemos peças com mensagem, pensadas
            no acabamento, no caimento e na forma como você se enxerga ao usar.
            Estilo com propósito, sem modismos.
          </p>
          <ul className="ide-manifesto-pillars">
            <li>
              <span className="t-num">01</span>
              <h4>Jesus no centro</h4>
              <p>A mensagem vem primeiro. O design existe pra servi-la.</p>
            </li>
            <li>
              <span className="t-num">02</span>
              <h4>Estilo com propósito</h4>
              <p>Streetwear premium, costura limpa, tecidos que duram.</p>
            </li>
            <li>
              <span className="t-num">03</span>
              <h4>Atendimento próximo</h4>
              <p>Você fala com gente, não com bot. Antes, durante e depois.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>);

}

function HowToBuy() {
  const steps = [
  { num: "01", title: "Escolha sua peça", text: "Navegue pela coleção e separe a peça que combina com você. Filtros por modelagem, cor e tamanho.", icon: "shop" },
  { num: "02", title: "Adicione ao carrinho", text: "Compra direto no site, com Pix, cartão ou boleto. Sem precisar sair pra confirmar.", icon: "bag" },
  { num: "03", title: "Vista e represente", text: "Frete pra todo o Brasil. A peça chega pronta pra entrar no seu dia a dia. Vista a mensagem.", icon: "truck" }];


  const Icon = ({ kind }) => {
    if (kind === "shop") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9 5 4h14l2 5" /><path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" /><path d="M3 9h18" /><path d="M9 13a3 3 0 0 0 6 0" />
      </svg>);

    if (kind === "bag") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>);

    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18h5a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18 9h-4" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
      </svg>);

  };

  return (
    <section className="ide-how">
      <div className="ide-section-head">
        <div>
          <span className="t-eyebrow">Como comprar</span>
          <h2 className="ide-section-title">
            Escolha sua peça.
            <br />
            A gente cuida do&nbsp;
            <span className="ide-italic">resto.</span>
          </h2>
        </div>
      </div>
      <div className="ide-how-grid">
        {steps.map((s, i) =>
        <div key={s.num} className="ide-how-card">
            <div className="ide-how-card-top">
              <span className="ide-how-num">{s.num}</span>
              <span className="ide-how-icon"><Icon kind={s.icon} /></span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {i < steps.length - 1 &&
          <span className="ide-how-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              </span>
          }
          </div>
        )}
      </div>
    </section>);

}

function Testimonials() {
  const list = window.testimonials;
  const [active, setActive] = React.useState(0);

  return (
    <section className="ide-testi">
      <div className="ide-testi-bg" />
      <div className="ide-section-head">
        <div>
          <span className="t-eyebrow">Prova social</span>
          <h2 className="ide-section-title">
            Quem veste,&nbsp;
            <span className="ide-italic">recomenda.</span>
          </h2>
        </div>
        <span className="ide-testi-meta">+ 1.200 clientes em todo o Brasil · 4,9 ★</span>
      </div>

      <div className="ide-testi-grid">
        {list.map((t, i) =>
        <div
          key={t.name}
          className={`ide-testi-card ${active === i ? "is-active" : ""}`}
          onMouseEnter={() => setActive(i)}>

            <div className="ide-testi-rating">
              {Array.from({ length: 5 }).map((_, j) =>
            <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.6 6.5L22 9.3l-5.5 4.6L18 22l-6-3.5L6 22l1.5-8.1L2 9.3l7.4-.8L12 2z" />
                </svg>
            )}
            </div>
            <p className="ide-testi-text">"{t.text}"</p>
            <div className="ide-testi-meta-row">
              <span className="ide-testi-name">{t.name}</span>
              <span className="ide-testi-role">{t.role} · {t.city}</span>
            </div>
          </div>
        )}
      </div>
    </section>);

}

function UGC() {
  const posts = window.ugcPosts;
  return (
    <section className="ide-ugc">
      <div className="ide-section-head">
        <div>
          <span className="t-eyebrow">@ide.hub no instagram</span>
          <h2 className="ide-section-title">
            Looks reais.
            <br />
            Comunidade que&nbsp;
            <span className="ide-italic">representa.</span>
          </h2>
        </div>
        <a className="ide-link-arrow" href="https://www.instagram.com/ide.hub" target="_blank" rel="noopener">
          Seguir @ide.hub
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="ide-ugc-grid">
        {posts.map((p, i) =>
        <a key={i} className="ide-ugc-card" href="https://www.instagram.com/ide.hub" target="_blank" rel="noopener">
            <img src={p.img} alt={p.handle} loading="lazy" />
            <div className="ide-ugc-overlay">
              <div className="ide-ugc-meta">
                <span className="ide-ugc-handle">{p.handle}</span>
                <span className="ide-ugc-likes">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" /></svg>
                  {p.likes}
                </span>
              </div>
            </div>
          </a>
        )}
      </div>
    </section>);

}

function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | err | ok
  const submit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {setStatus("err");return;}
    setStatus("ok");
  };

  return (
    <section className="ide-news">
      <div className="ide-news-bg-type" aria-hidden="true">10%</div>
      <div className="ide-news-inner">
        <div className="ide-news-l">
          <span className="t-eyebrow t-eyebrow-light">Lista @ide.hub</span>
          <h2>
            Entra na lista.
            <br />
            Ganha 10% no primeiro&nbsp;
            <span className="ide-italic-soft">pedido.</span>
          </h2>
          <p>Drops antes de todo mundo. Mensagens com propósito. Zero spam.</p>
        </div>
        <form className="ide-news-form" onSubmit={submit}>
          <div className={`ide-news-input-wrap ${status === "err" ? "is-err" : ""}`}>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {setEmail(e.target.value);setStatus("idle");}} />
            
            <button type="submit" className="ide-news-btn">
              {status === "ok" ? "Enviado ✓" : "Quero meu cupom"}
              {status !== "ok" &&
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                </svg>
              }
            </button>
          </div>
          <span className={`ide-news-msg ${status === "err" ? "is-err" : status === "ok" ? "is-ok" : ""}`}>
            {status === "err" && "E-mail inválido. Confere e tenta de novo."}
            {status === "ok" && "Pronto. Seu cupom IDEHUB10 chegou no e-mail."}
            {status === "idle" && "Enviando você concorda em receber nossos e-mails. Cancela quando quiser."}
          </span>
        </form>
      </div>
    </section>);

}

function PreFooter() {
  return (
    <section className="ide-prefoot" style={{ height: "692px", padding: "132.801px 20px 138.648px" }}>
      <div className="ide-prefoot-inner">
        <img src="assets/ovelhinha.png" alt="" className="ide-prefoot-mascot" style={{ width: "475px" }} />
        <div className="ide-prefoot-text">
          <span className="t-eyebrow">@ide.hub</span>
          <h2 style={{ height: "289px" }}>
            Sua fé.
            <br />
            Sua identidade.
            <br />
            Seu&nbsp;<span className="ide-italic">estilo.</span>
          </h2>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="ide-foot">
      <div className="ide-foot-inner">
        <div className="ide-foot-cols">
          <div className="ide-foot-brand">
            <img src="assets/logo-branca-transp.png" alt="Ide.hub" />
            <p>Streetwear cristão premium. Vista sua fé com propósito e estilo.</p>
            <div className="ide-foot-social">
              <a href="https://www.instagram.com/ide.hub" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://wa.me/5542984137740" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3>Loja</h3>
            <ul>
              <li><a href="categoria.html?cat=tshirt">Camisetas</a></li>
              <li><a href="categoria.html?cat=oversized">Oversized</a></li>
              <li><a href="categoria.html?cat=streetwear">Streetwear</a></li>
              <li><a href="categoria.html?cat=meias">Meias</a></li>
              <li><a href="montar-kit.html">Montar Kit</a></li>
            </ul>
          </div>
          <div>
            <h3>Atendimento</h3>
            <ul>
              <li><a href="https://wa.me/5542984137740" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="trocas.html">Trocas e devoluções</a></li>
              <li><a href="#">Frete e entrega</a></li>
              <li><a href="tamanhos.html">Guia de tamanhos</a></li>
              <li><a href="faq.html">Perguntas frequentes</a></li>
            </ul>
          </div>
          <div>
            <h3>Personalizados</h3>
            <ul>
              <li><a href="https://wa.me/5542984137740?text=Ol%C3%A1!%20Tenho%20interesse%20em%20pe%C3%A7as%20personalizadas." target="_blank" rel="noopener">Entre em contato</a></li>
            </ul>
          </div>
        </div>
        <div className="ide-foot-bottom">
          <span>© 2026 Ide.hub. Todos os direitos reservados.</span>
          <span className="ide-foot-mid">CNPJ 66.433.712/0001-02</span>
          <span className="ide-foot-italic">Feito com propósito.</span>
        </div>
      </div>
    </footer>);

}

function TrustBar() {
  const items = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h5a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18 9h-4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
        </svg>
      ),
      title: "Frete Grátis",
      sub: "Acima de R$ 399 (Sul e Sudeste)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
        </svg>
      ),
      title: "Primeira Troca",
      sub: "Gratuita",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
        </svg>
      ),
      title: "Pagamento em",
      sub: "até 6x sem juros",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: "Enviamos pra",
      sub: "todo o Brasil",
    },
  ];

  return (
    <div className="ide-trust-bar">
      {items.map((item, i) => (
        <div key={i} className="ide-trust-item">
          <span className="ide-trust-icon">{item.icon}</span>
          <div className="ide-trust-text">
            <strong>{item.title}</strong>
            <span>{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

window.Manifesto = Manifesto;
window.HowToBuy = HowToBuy;
window.Testimonials = Testimonials;
window.UGC = UGC;
window.Newsletter = Newsletter;
window.PreFooter = PreFooter;
window.Footer = Footer;
window.TrustBar = TrustBar;