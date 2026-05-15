// Cart drawer, Quick view modal, Search overlay, Floating WhatsApp.

const WPP_NUMBER = "5542984137740";

function CartDrawer({ open, onClose, items, onChangeQty, onRemove, onClearCart, freeShippingThreshold = 299 }) {
  const [step, setStep] = React.useState("cart"); // "cart" | "checkout" | "confirmed"
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", cpf: "", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", payment: "pix" });
  const [errors, setErrors] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [cepLoading, setCepLoading] = React.useState(false);

  const subtotal    = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const remaining   = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const pixTotal    = subtotal * 0.95;
  const pixDiscount = subtotal * 0.05;
  const finalTotal  = form.payment === "pix" ? pixTotal : subtotal;

  React.useEffect(() => { if (!open) { setStep("cart"); setErrors({}); setSending(false); } }, [open]);

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const maskPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length === 0) return "";
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };
  const maskCPF = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };
  const maskCEP = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
  };
  const lookupCEP = async (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm(prev => ({ ...prev, street: data.logradouro || prev.street, neighborhood: data.bairro || prev.neighborhood, city: data.localidade || prev.city, state: data.uf || prev.state }));
      }
    } catch {} finally { setCepLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    if (form.cpf.replace(/\D/g, "").length !== 11) e.cpf = "CPF inválido";
    if (form.cep.replace(/\D/g, "").length !== 8) e.cep = "CEP inválido";
    if (!form.street.trim()) e.street = "Obrigatório";
    if (!form.number.trim()) e.number = "Número obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendToWhatsApp = () => {
    if (!validate()) return;
    setSending(true);

    const payLabel = { pix: "Pix (5% de desconto)", cartao: "Cartão de crédito", boleto: "Boleto" }[form.payment];
    const addressFull = `${form.street}, ${form.number}${form.complement ? ` - ${form.complement}` : ""}\n${form.neighborhood}, ${form.city}/${form.state} — CEP ${form.cep}`;

    const itemLines = items.map(it =>
      `• ${it.qty}x ${it.name} — Tam ${it.size} | Cor ${it.color} — R$ ${(it.price * it.qty).toFixed(2).replace(".", ",")}`
    ).join("\n");

    const lines = [
      "Olá! Quero finalizar meu pedido na Ide.hub 🙌",
      "",
      "*DADOS DO CLIENTE*",
      `Nome: ${form.name.trim()}`,
      `E-mail: ${form.email.trim()}`,
      `Telefone: ${form.phone.trim()}`,
      `CPF: ${form.cpf.trim()}`,
      `Endereço:\n${addressFull}`,
      "",
      "*PAGAMENTO*",
      payLabel,
      "",
      "*ITENS DO PEDIDO*",
      itemLines,
      "",
      `Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}`,
      form.payment === "pix" ? `Desconto Pix (5%): - R$ ${pixDiscount.toFixed(2).replace(".", ",")}` : null,
      `*TOTAL: R$ ${finalTotal.toFixed(2).replace(".", ",")}*`,
      `Frete: ${subtotal >= freeShippingThreshold ? "Grátis ✓" : "A calcular"}`,
    ].filter(l => l !== null).join("\n");

    window.open(`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
    onClearCart && onClearCart();
    setSending(false);
    setStep("confirmed");
  };

  const PayOption = ({ value, label, badge }) => (
    <div
      className={`ide-checkout-pay-opt ${form.payment === value ? "is-selected" : ""}`}
      onClick={() => setField("payment", value)}
    >
      <div className="ide-checkout-pay-radio">
        <div className="ide-checkout-pay-radio-dot" />
      </div>
      {label}
      {badge && <span className="ide-checkout-pay-badge">{badge}</span>}
    </div>
  );

  return (
    <React.Fragment>
      <div className={`ide-drawer-scrim ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`ide-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>

        {/* ── Step 1: Cart ── */}
        {step === "cart" && (
          <React.Fragment>
            <header className="ide-drawer-head">
              <div>
                <span className="t-eyebrow">Sacola</span>
                <h3>{items.length} {items.length === 1 ? "peça" : "peças"}</h3>
              </div>
              <button className="ide-drawer-close" onClick={onClose} aria-label="Fechar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </header>

            <div className="ide-drawer-ship">
              <div className="ide-drawer-ship-msg">
                {remaining > 0
                  ? <span>Faltam <strong>R$ {remaining.toFixed(2).replace(".", ",")}</strong> para frete grátis</span>
                  : <span><strong>Frete grátis</strong> garantido nessa compra ✓</span>
                }
              </div>
              <div className="ide-drawer-ship-bar">
                <div className="ide-drawer-ship-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="ide-drawer-body">
              {items.length === 0 ? (
                <div className="ide-drawer-empty">
                  <div className="ide-drawer-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <h4>Sua sacola está vazia.</h4>
                  <p>Comece pelas peças em destaque ou pelo último drop.</p>
                  <button className="ide-btn ide-btn-dark" onClick={onClose}>Voltar à coleção</button>
                </div>
              ) : items.map((it) => (
                <div key={it.lineId} className="ide-drawer-item">
                  <div className="ide-drawer-item-img">
                    <img src={it.img} alt={it.name} />
                  </div>
                  <div className="ide-drawer-item-meta">
                    <div className="ide-drawer-item-top">
                      <div>
                        <span className="ide-drawer-item-cat">{it.subtitle}</span>
                        <h4>{it.name}</h4>
                      </div>
                      <button className="ide-drawer-item-x" onClick={() => onRemove(it.lineId)} aria-label="Remover">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <div className="ide-drawer-item-opts">
                      <span>Tam · <strong>{it.size}</strong></span>
                      <span>Cor · <strong>{it.color}</strong></span>
                    </div>
                    <div className="ide-drawer-item-bot">
                      <div className="ide-qty">
                        <button onClick={() => onChangeQty(it.lineId, Math.max(1, it.qty - 1))}>−</button>
                        <span>{it.qty}</span>
                        <button onClick={() => onChangeQty(it.lineId, it.qty + 1)}>+</button>
                      </div>
                      <strong>R$ {(it.price * it.qty).toFixed(2).replace(".", ",")}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <footer className="ide-drawer-foot">
                <div className="ide-drawer-foot-row">
                  <span>Subtotal</span>
                  <strong>R$ {subtotal.toFixed(2).replace(".", ",")}</strong>
                </div>
                <div className="ide-drawer-foot-row sm">
                  <span>Pix com 5% off</span>
                  <span>R$ {pixTotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <button className="ide-btn ide-btn-orange ide-drawer-checkout" onClick={() => setStep("checkout")}>
                  Finalizar compra
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                  </svg>
                </button>
                <button className="ide-btn ide-btn-ghost-dark" onClick={onClose}>
                  Continuar comprando
                </button>
                <div className="ide-drawer-trust">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Compra 100% segura
                  </span>
                  <span>Pix · Cartão · Boleto</span>
                </div>
              </footer>
            )}
          </React.Fragment>
        )}

        {/* ── Step 2: Checkout form ── */}
        {step === "checkout" && (
          <React.Fragment>
            <header className="ide-drawer-head">
              <div>
                <button className="ide-drawer-back" onClick={() => setStep("cart")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5"/><path d="m12 5-7 7 7 7"/>
                  </svg>
                  Voltar
                </button>
                <h3 style={{ marginTop: 4 }}>Seus dados</h3>
              </div>
              <button className="ide-drawer-close" onClick={onClose} aria-label="Fechar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </header>

            <div className="ide-drawer-body" style={{ paddingTop: 0 }}>
              <div className="ide-checkout-form">

                <div className="ide-checkout-field">
                  <label>Nome completo</label>
                  <input
                    type="text" placeholder="João da Silva"
                    value={form.name} onChange={e => setField("name", e.target.value)}
                    className={errors.name ? "is-error" : ""}
                  />
                  {errors.name && <span className="ide-checkout-error">{errors.name}</span>}
                </div>

                <div className="ide-checkout-field">
                  <label>E-mail</label>
                  <input
                    type="email" placeholder="joao@email.com"
                    value={form.email} onChange={e => setField("email", e.target.value)}
                    className={errors.email ? "is-error" : ""}
                  />
                  {errors.email && <span className="ide-checkout-error">{errors.email}</span>}
                </div>

                <div className="ide-checkout-field">
                  <label>Telefone (WhatsApp)</label>
                  <input
                    type="tel" placeholder="(42) 99999-9999"
                    value={form.phone} onChange={e => setField("phone", maskPhone(e.target.value))}
                    className={errors.phone ? "is-error" : ""}
                  />
                  {errors.phone && <span className="ide-checkout-error">{errors.phone}</span>}
                </div>

                <div className="ide-checkout-field">
                  <label>CPF</label>
                  <input
                    type="text" placeholder="000.000.000-00"
                    value={form.cpf} onChange={e => setField("cpf", maskCPF(e.target.value))}
                    className={errors.cpf ? "is-error" : ""}
                  />
                  {errors.cpf && <span className="ide-checkout-error">{errors.cpf}</span>}
                </div>

                <div className="ide-checkout-field">
                  <label>CEP{cepLoading && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--ide-accent)" }}>buscando...</span>}</label>
                  <input
                    type="text" placeholder="00000-000"
                    value={form.cep}
                    onChange={e => { const v = maskCEP(e.target.value); setField("cep", v); lookupCEP(v); }}
                    className={errors.cep ? "is-error" : ""}
                  />
                  {errors.cep && <span className="ide-checkout-error">{errors.cep}</span>}
                </div>

                <div className="ide-checkout-field">
                  <label>Rua / Logradouro</label>
                  <input
                    type="text" placeholder="Rua das Flores"
                    value={form.street} onChange={e => setField("street", e.target.value)}
                    className={errors.street ? "is-error" : ""}
                  />
                  {errors.street && <span className="ide-checkout-error">{errors.street}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div className="ide-checkout-field">
                    <label>Número</label>
                    <input
                      type="text" placeholder="123"
                      value={form.number} onChange={e => setField("number", e.target.value)}
                      className={errors.number ? "is-error" : ""}
                    />
                    {errors.number && <span className="ide-checkout-error">{errors.number}</span>}
                  </div>
                  <div className="ide-checkout-field">
                    <label>Complemento</label>
                    <input
                      type="text" placeholder="Apto 2"
                      value={form.complement} onChange={e => setField("complement", e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 64px", gap: 8 }}>
                  <div className="ide-checkout-field">
                    <label>Cidade</label>
                    <input
                      type="text" placeholder="Ponta Grossa"
                      value={form.city} onChange={e => setField("city", e.target.value)}
                    />
                  </div>
                  <div className="ide-checkout-field">
                    <label>UF</label>
                    <input
                      type="text" placeholder="PR" maxLength={2}
                      value={form.state} onChange={e => setField("state", e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                <div className="ide-checkout-field">
                  <label>Meio de pagamento</label>
                  <div className="ide-checkout-payments">
                    <PayOption value="pix"    label="Pix" badge="5% OFF" />
                    <PayOption value="cartao" label="Cartão de crédito (até 6x sem juros)" />
                    <PayOption value="boleto" label="Boleto bancário" />
                  </div>
                </div>
              </div>
            </div>

            <footer className="ide-drawer-foot">
              <div className="ide-checkout-summary">
                <div className="ide-checkout-summary-row">
                  <span>{items.length} {items.length === 1 ? "peça" : "peças"}</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                {form.payment === "pix" && (
                  <div className="ide-checkout-summary-row is-discount">
                    <span>Desconto Pix (5%)</span>
                    <span>- R$ {pixDiscount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="ide-checkout-summary-row">
                  <span>Frete</span>
                  <span>{subtotal >= freeShippingThreshold ? "Grátis ✓" : "A calcular"}</span>
                </div>
                <div className="ide-checkout-summary-row is-total">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <button className="ide-btn ide-btn-orange ide-drawer-checkout" onClick={sendToWhatsApp} disabled={sending}>
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.5 1.9 6.5L4 29l7.7-1.8c1.9 1 4.1 1.6 4.3 1.6C22.6 28 28 22.6 28 16c0-7-5.4-13-12-13zm0 22.2c-1.7 0-3.4-.4-4.9-1.3l-.3-.1-3.2.7.7-3.2-.2-.3a9.9 9.9 0 1 1 17.4-6c0 5.5-4.5 10.2-9.5 10.2z"/>
                </svg>
                Confirmar pedido no WhatsApp
              </button>
              <div className="ide-drawer-trust">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Seus dados são privados
                </span>
                <span>100% seguro</span>
              </div>
            </footer>
          </React.Fragment>
        )}

        {/* ── Step 3: Confirmed ── */}
        {step === "confirmed" && (
          <React.Fragment>
            <header className="ide-drawer-head">
              <div><h3>Pedido enviado!</h3></div>
              <button className="ide-drawer-close" onClick={onClose} aria-label="Fechar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </header>
            <div className="ide-drawer-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 20, paddingTop: 64 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <div>
                <h3 style={{ marginBottom: 8 }}>Pedido confirmado!</h3>
                <p style={{ color: "var(--ide-ink-muted)", lineHeight: 1.6 }}>Seu pedido foi enviado pro nosso WhatsApp. A gente entra em contato em breve pra confirmar e combinar os detalhes.</p>
              </div>
              <button className="ide-btn ide-btn-orange" onClick={onClose} style={{ marginTop: 8 }}>Voltar à loja</button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

// ───────────────────────────────────────────────
// Quick view modal
// ───────────────────────────────────────────────

function QuickView({ product, onClose, onAddToCart }) {
  const [size, setSize] = React.useState(product?.sizes?.[1] || product?.sizes?.[0]);
  const [color, setColor] = React.useState(product?.colors?.[0]);
  const [imgIdx, setImgIdx] = React.useState(0);

  if (!product) return null;
  const images = [product.img, product.imgAlt].filter(Boolean);

  return (
    <div className="ide-modal-scrim" onClick={onClose}>
      <div className="ide-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ide-modal-close" onClick={onClose} aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="ide-modal-gallery">
          <div className="ide-modal-img-main">
            <img src={images[imgIdx]} alt={product.name} />
            {product.isNew && <span className="ide-pcard-tag is-new">Novo</span>}
          </div>
          {images.length > 1 && (
            <div className="ide-modal-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`ide-modal-thumb ${imgIdx === i ? "is-active" : ""}`}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={src} alt={`${product.name} ${i+1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ide-modal-info">
          <div className="ide-modal-head">
            <span className="t-eyebrow">{product.subtitle}</span>
            <h2>{product.name}</h2>
            <div className="ide-modal-price-row">
              <span className="ide-modal-price">R$ {product.price.toFixed(2).replace(".", ",")}</span>
              <span className="ide-modal-installments">ou 6x de R$ {(product.price/6).toFixed(2).replace(".", ",")} sem juros</span>
            </div>
            <div className="ide-modal-rating">
              {Array.from({ length: 5 }).map((_, j) => (
                <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.6 6.5L22 9.3l-5.5 4.6L18 22l-6-3.5L6 22l1.5-8.1L2 9.3l7.4-.8L12 2z"/>
                </svg>
              ))}
              <span>4,9 · 128 avaliações</span>
            </div>
          </div>

          <p className="ide-modal-inspiration">{product.inspiration}</p>

          <div className="ide-modal-section">
            <div className="ide-modal-section-head">
              <span>Cor · <strong>{color}</strong></span>
            </div>
            <div className="ide-modal-colors">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`ide-modal-color ${color === c ? "is-active" : ""}`}
                  onClick={() => setColor(c)}
                  aria-label={c}
                >
                  <span style={{ background: window.swatchMap[c] || "#d6d3d1" }} />
                </button>
              ))}
            </div>
          </div>

          <div className="ide-modal-section">
            <div className="ide-modal-section-head">
              <span>Tamanho</span>
              <a href="tamanhos.html" className="ide-modal-sizes-link">Guia de medidas</a>
            </div>
            <div className="ide-modal-sizes">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`ide-modal-size ${size === s ? "is-active" : ""}`}
                  onClick={() => setSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="ide-modal-actions">
            <button
              className="ide-btn ide-btn-orange ide-modal-add"
              onClick={() => onAddToCart && onAddToCart(product, { size, color })}
            >
              Adicionar ao carrinho · R$ {product.price.toFixed(2).replace(".", ",")}
            </button>
            <a
              className="ide-btn ide-btn-ghost ide-modal-wpp"
              href={`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre um produto da Ide.hub.")}`}
              target="_blank" rel="noopener"
            >
              <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.5 1.9 6.5L4 29l7.7-1.8c1.9 1 4.1 1.6 4.3 1.6C22.6 28 28 22.6 28 16c0-7-5.4-13-12-13zm0 22.2c-1.7 0-3.4-.4-4.9-1.3l-.3-.1-3.2.7.7-3.2-.2-.3a9.9 9.9 0 1 1 17.4-6c0 5.5-4.5 10.2-9.5 10.2z"/></svg>
              Tirar dúvida no WhatsApp
            </a>
          </div>

          <ul className="ide-modal-perks">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h5a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18 9h-4"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              Frete grátis acima de R$ 299
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Compra 100% segura
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M9 12l2 2 4-4"/></svg>
              Trocas grátis em 30 dias
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Search overlay
// ───────────────────────────────────────────────

function SearchOverlay({ open, onClose, onSelect }) {
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQ("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const norm = (s) => s.toLowerCase();
  const results = q.trim()
    ? window.allProducts.filter(p =>
        norm(p.name).includes(norm(q)) ||
        norm(p.cat).includes(norm(q)) ||
        norm(p.subtitle).includes(norm(q))
      ).slice(0, 6)
    : window.allProducts.slice(0, 4);

  const popular = ["Cristo em Mim", "Reino", "Hoodie Presença", "Frutos do Espírito"];

  if (!open) return null;
  return (
    <div className="ide-search-scrim" onClick={onClose}>
      <div className="ide-search" onClick={(e) => e.stopPropagation()}>
        <div className="ide-search-head">
          <div className="ide-search-input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você está buscando?"
            />
            {q && <button onClick={() => setQ("")} className="ide-search-clear" aria-label="Limpar">×</button>}
          </div>
          <button className="ide-search-close" onClick={onClose}>
            <span>fechar</span>
            <kbd>esc</kbd>
          </button>
        </div>

        <div className="ide-search-body">
          <div className="ide-search-pop">
            <span className="t-eyebrow">{q ? "Resultados" : "Mais buscados"}</span>
            <div className="ide-search-tags">
              {popular.map(p => (
                <button key={p} className="ide-tag" onClick={() => setQ(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="ide-search-results">
            {results.length === 0 ? (
              <div className="ide-search-empty">
                <p>Nada encontrado para "<strong>{q}</strong>". Tente outro termo.</p>
              </div>
            ) : (
              <React.Fragment>
                <span className="t-eyebrow">{q ? `${results.length} ${results.length === 1 ? "peça" : "peças"}` : "Em destaque"}</span>
                <div className="ide-search-grid">
                  {results.map(p => (
                    <button key={p.id} className="ide-search-result" onClick={() => { onSelect(p); onClose(); }}>
                      <div className="ide-search-result-img">
                        <img src={p.img} alt={p.name} />
                      </div>
                      <div className="ide-search-result-meta">
                        <span className="ide-search-result-cat">{p.subtitle}</span>
                        <strong>{p.name}</strong>
                        <span className="ide-search-result-price">R$ {p.price.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Floating WhatsApp + add-to-cart toast
// ───────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a className="ide-wpp" href={`https://wa.me/${WPP_NUMBER}`} target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.5 1.9 6.5L4 29l7.7-1.8c1.9 1 4.1 1.6 4.3 1.6C22.6 28 28 22.6 28 16c0-7-5.4-13-12-13zm0 22.2c-1.7 0-3.4-.4-4.9-1.3l-.3-.1-3.2.7.7-3.2-.2-.3a9.9 9.9 0 1 1 17.4-6c0 5.5-4.5 10.2-9.5 10.2z"/>
      </svg>
      <span className="ide-wpp-tip">Fale com a gente</span>
    </a>
  );
}

function CartToast({ visible, item }) {
  return (
    <div className={`ide-toast ${visible ? "is-visible" : ""}`}>
      {item && (
        <React.Fragment>
          <div className="ide-toast-img">
            <img src={item.img} alt={item.name} />
          </div>
          <div className="ide-toast-meta">
            <span className="t-eyebrow">Adicionado à sacola</span>
            <strong>{item.name}</strong>
          </div>
          <span className="ide-toast-check">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </span>
        </React.Fragment>
      )}
    </div>
  );
}

window.CartDrawer = CartDrawer;
window.QuickView = QuickView;
window.SearchOverlay = SearchOverlay;
window.FloatingWhatsApp = FloatingWhatsApp;
window.CartToast = CartToast;
