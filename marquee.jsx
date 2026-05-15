// Marquee — continuous horizontal scroll with biblical/manifesto phrases.
// Two duplicated tracks so the loop is seamless.

function Marquee({ onDark = true }) {
  const phrases = [
  "Vista a mensagem",
  "Carregue a presença",
  "Jesus no centro",
  "Estilo com propósito",
  "Fé também se veste",
  "Sua identidade. Seu estilo.",
  "Mateus 5:14",
  "Reino · Outono 2026"];

  const track = phrases.concat(phrases);

  return (
    <section className={`ide-marquee ${onDark ? "is-dark" : "is-light"}`}>
      <div className="ide-marquee-track">
        {track.map((p, i) =>
        <span key={i} className="ide-marquee-item">
            <span>{p}</span>
            <span className="ide-marquee-sep" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="3" fill="currentColor" />
              </svg>
            </span>
          </span>
        )}
      </div>
    </section>);

}

// Vertical split marquee — used between sections, smaller scale
function MarqueeQuote() {
  const phrase = "Ele lhes disse: — Vão pelo mundo todo e preguem o evangelho a todas as pessoas. Quem crer e for batizado será salvo, mas quem não crer será condenado. Estes sinais acompanharão os que crerem: em meu nome expulsarão demônios; falarão novas línguas; pegarão em serpentes; se beberem algum veneno mortal, não lhes fará mal nenhum; imporão as mãos nos doentes, e estes ficarão curados. · ";
  const track = phrase.repeat(2);

  return (
    <section className="ide-quote-marquee" style={{ backgroundColor: "rgb(0, 0, 0)" }}>
      <div className="ide-quote-marquee-track">
        <span style={{ color: "rgb(243, 242, 242)" }}>{track}</span>
        <span aria-hidden="true" style={{ color: "rgb(243, 242, 242)" }}>{track}</span>
      </div>
    </section>);

}

window.Marquee = Marquee;
window.MarqueeQuote = MarqueeQuote;