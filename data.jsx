// Product catalog + reference data for the IdeHub site.
//
// `modelagem` controls which category page a product appears on:
//   - "oversized"  → categoria.html?cat=oversized
//   - "streetwear" → categoria.html?cat=streetwear
//   - "basica"     → categoria.html?cat=tshirt
//   - "meia"       → categoria.html?cat=meias
// `tipo` ("camiseta" | "meia") is used by Montar Kit.

const allProducts = [

  // ── STREETWEAR ────────────────────────────────────────────────────────────
  {
    id: "sw-jesus-way",
    cat: "Streetwear", family: "Camisetas", modelagem: "streetwear", tipo: "camiseta",
    name: "Jesus Way Truth Life",
    subtitle: "Camiseta Streetwear",
    price: 89.90,
    img: "assets/jesus-way-preto-1.webp",
    imgAlt: "assets/jesus-way-off-1.webp",
    colors: ["Preto", "Off white", "Marrom"],
    sizes: ["P", "M", "G", "GG"],
    stock: 35,
    isNew: true,
    inspiration: '"Eu sou o caminho, a verdade e a vida." — João 14:6',
  },
  {
    id: "sw-frutos",
    cat: "Streetwear", family: "Camisetas", modelagem: "streetwear", tipo: "camiseta",
    name: "Frutos do Espírito",
    subtitle: "Camiseta Streetwear",
    price: 89.90,
    img: "assets/frutos-preto-1.webp",
    imgAlt: "assets/frutos-off-1.webp",
    colors: ["Off white", "Preto", "Verde"],
    sizes: ["P", "M", "G", "GG"],
    stock: 29,
    inspiration: "Amor, alegria, paz, paciência…",
  },
  {
    id: "sw-reino",
    cat: "Streetwear", family: "Camisetas", modelagem: "streetwear", tipo: "camiseta",
    name: "Reino de Deus",
    subtitle: "Camiseta Streetwear",
    price: 89.90,
    img: "assets/reino-preto-1.webp",
    imgAlt: "assets/reino-off-1.webp",
    colors: ["Off white", "Preto"],
    sizes: ["P", "M", "G", "GG"],
    stock: 22,
    inspiration: "Buscai primeiro o Reino.",
  },
  {
    id: "sw-follower",
    cat: "Streetwear", family: "Camisetas", modelagem: "streetwear", tipo: "camiseta",
    name: "Jesus Follower",
    subtitle: "Camiseta Streetwear",
    price: 89.90,
    img: "assets/jesus-follower-preto-1.webp",
    imgAlt: "assets/jesus-follower-off-1.webp",
    colors: ["Off white", "Preto"],
    sizes: ["P", "M", "G", "GG"],
    stock: 22,
    inspiration: "Seguir é resposta, não rótulo.",
  },

  // ── BÁSICAS ───────────────────────────────────────────────────────────────
  {
    id: "ba-cristo",
    cat: "Básicas", family: "Camisetas", modelagem: "basica", tipo: "camiseta",
    name: "Cristo em Mim",
    subtitle: "Camiseta Básica",
    price: 89.90,
    img: "assets/cristo-em-mim-preto-1.webp",
    imgAlt: "assets/cristo-em-mim-off-1.webp",
    colors: ["Preto", "Off white"],
    sizes: ["P", "M", "G", "GG"],
    stock: 29,
    inspiration: "Não sou mais eu quem vive, mas Cristo vive em mim.",
  },

  // ── OVERSIZED ─────────────────────────────────────────────────────────────
  {
    id: "os-assim",
    cat: "Oversize", family: "Camisetas", modelagem: "oversized", tipo: "camiseta",
    name: "Assim na Terra",
    subtitle: "Camiseta Oversized",
    price: 89.90,
    img: "assets/assim-na-terra-preto.webp",
    imgAlt: "assets/assim-na-terra-off.webp",
    colors: ["Off white", "Preto", "Marrom"],
    sizes: ["P", "M", "G", "GG"],
    stock: 50,
    isNew: true,
    inspiration: "Venha o teu Reino. Seja feita a tua vontade.",
  },
  {
    id: "os-boas-novas",
    cat: "Oversize", family: "Camisetas", modelagem: "oversized", tipo: "camiseta",
    name: "Boas Novas",
    subtitle: "Camiseta Oversized",
    price: 89.90,
    img: "assets/boas-novas-1.webp",
    imgAlt: "assets/boas-novas-2.webp",
    colors: ["Off white", "Verde"],
    sizes: ["P", "M", "G", "GG"],
    stock: 34,
    isNew: true,
    inspiration: "Bem-aventurados os pés daqueles que anunciam boas novas.",
  },
  {
    id: "os-i-live",
    cat: "Oversize", family: "Camisetas", modelagem: "oversized", tipo: "camiseta",
    name: "I Live for Him",
    subtitle: "Camiseta Oversized",
    price: 89.90,
    img: "assets/i-live-1.webp",
    imgAlt: "assets/i-live-2.webp",
    colors: ["Marrom", "Cinza"],
    sizes: ["P", "M", "G", "GG"],
    stock: 24,
    inspiration: "Vivo, mas já não eu.",
  },
  {
    id: "os-he-left",
    cat: "Oversize", family: "Camisetas", modelagem: "oversized", tipo: "camiseta",
    name: "He Left the 99",
    subtitle: "Camiseta Oversized",
    price: 89.90,
    img: "assets/he-left-off-1.webp",
    imgAlt: "assets/he-left-off-1.webp",
    colors: ["Off white", "Cinza", "Verde"],
    sizes: ["P", "M", "G", "GG"],
    stock: 38,
    inspiration: "E deixa as noventa e nove nas montanhas…",
  },

  // ── MEIAS ─────────────────────────────────────────────────────────────────
  {
    id: "meia-branca",
    cat: "Meias", family: "Meias", modelagem: "meia", tipo: "meia",
    name: "Meia Cano Alto Branca",
    subtitle: "Meia cano alto",
    price: 24.90,
    img: "assets/meia-branca.webp",
    imgAlt: "assets/meia-preto.webp",
    colors: ["Branco"],
    sizes: ["Único"],
    stock: 12,
    inspiration: "Detalhe que carrega a mensagem.",
  },
  {
    id: "meia-preta",
    cat: "Meias", family: "Meias", modelagem: "meia", tipo: "meia",
    name: "Meia Cano Alto Preta",
    subtitle: "Meia cano alto",
    price: 24.90,
    img: "assets/meia-preto.webp",
    imgAlt: "assets/meia-branca.webp",
    colors: ["Preto"],
    sizes: ["Único"],
    stock: 13,
    inspiration: "Detalhe que carrega a mensagem.",
  },
];

// Counts by category page
const _count = (pred) => allProducts.filter(pred).length;
const countOversized = _count(p => p.modelagem === "oversized");
const countStreet    = _count(p => p.modelagem === "streetwear");
const countTshirt    = _count(p => p.modelagem === "basica");
const countMeias     = _count(p => p.modelagem === "meia");
const countAll       = allProducts.length;

const swatchMap = {
  "Off white": "#f4eee2",
  "Preto":     "#111111",
  "Marrom":    "#4a3024",
  "Verde":     "#596247",
  "Branco":    "#ffffff",
  "Cinza":     "#8a8a8a",
};

// Homepage category cards
const categories = [
  {
    key: "oversized",
    label: "Oversized",
    count: countOversized,
    img: "assets/assim-na-terra-preto.webp",
    href: "categoria.html?cat=oversized",
    description: "Modelagem ampla. Caimento solto.",
  },
  {
    key: "streetwear",
    label: "Streetwear",
    count: countStreet,
    img: "assets/jesus-way-preto-1.webp",
    href: "categoria.html?cat=streetwear",
    description: "Cortes urbanos. Rua com propósito.",
  },
  {
    key: "tshirt",
    label: "Básicas",
    count: countTshirt,
    img: "assets/cristo-em-mim-preto-1.webp",
    href: "categoria.html?cat=tshirt",
    description: "Essenciais do dia a dia com mensagem.",
  },
  {
    key: "meias",
    label: "Meias",
    count: countMeias,
    img: "assets/meia-branca.webp",
    href: "categoria.html?cat=meias",
    description: "Detalhe que carrega a mensagem.",
  },
  {
    key: "montar-kit",
    label: "Montar Kit",
    count: countAll,
    img: "assets/i-live-1.webp",
    href: "montar-kit.html",
    isDrop: true,
    description: "Escolha 3 camisetas e ganhe 1 meia.",
  },
];

// Definition for each category page (used by categoria.html)
const categoryPages = {
  oversized: {
    label: "Camisetas Oversized",
    eyebrow: "Modelagem · Oversized",
    title: "Oversized.",
    titleAccent: "Solto, mas firme.",
    description: "Modelagem ampla, caimento solto, tecido pesado. Pra quem quer presença sem exagero. Uma peça que conversa com o corpo e com a mensagem.",
    filter: (p) => p.modelagem === "oversized",
    heroImg: "assets/assim-na-terra-preto.webp",
  },
  streetwear: {
    label: "Camisetas Streetwear",
    eyebrow: "Estilo · Streetwear",
    title: "Streetwear.",
    titleAccent: "Rua com propósito.",
    description: "Cortes urbanos, estampas autorais. Para quem leva a mensagem para o asfalto sem abrir mão do estilo.",
    filter: (p) => p.modelagem === "streetwear",
    heroImg: "assets/jesus-way-preto-1.webp",
  },
  tshirt: {
    label: "Camisetas Básicas",
    eyebrow: "Modelagem · Básica",
    title: "Básicas.",
    titleAccent: "O essencial com mensagem.",
    description: "Caimento regular, malha premium, estampa que entrega a mensagem sem gritar. O dia a dia com propósito.",
    filter: (p) => p.modelagem === "basica",
    heroImg: "assets/cristo-em-mim-preto-1.webp",
  },
  meias: {
    label: "Meias",
    eyebrow: "Acessórios · Meias",
    title: "Meias.",
    titleAccent: "Detalhe que aponta.",
    description: "Algodão grosso, cano alto, bordado com a marca. Combina com qualquer peça da coleção.",
    filter: (p) => p.modelagem === "meia",
    heroImg: "assets/meia-branca.webp",
  },
};

const testimonials = [
  {
    name: "Gabriel Silva",
    handle: "@gabrielsilva.cwb",
    city: "Curitiba, PR",
    role: "comprou Assim na Terra",
    photo: "https://i.pravatar.cc/160?img=12",
    text: "A modelagem oversize é absurda. Tecido pesado, costura limpa, e a mensagem carrega sozinha. Já é minha peça favorita.",
    rating: 5,
  },
  {
    name: "Lucas Mateus",
    handle: "@lucasmateus",
    city: "Recife, PE",
    role: "comprou Kit Reino + Frutos",
    photo: "https://i.pravatar.cc/160?img=15",
    text: "Comprei o kit promocional e me surpreendi. Premium de verdade. Atendimento pelo WhatsApp foi rápido, humano. Vou voltar.",
    rating: 5,
  },
  {
    name: "Sarah Lima",
    handle: "@sarahlima",
    city: "São Paulo, SP",
    role: "comprou Cristo em Mim",
    photo: "https://i.pravatar.cc/160?img=47",
    text: "Recebi e o acabamento me ganhou. As peças vêm bem embaladas, com bilhete escrito à mão. Detalhe que faz diferença.",
    rating: 5,
  },
  {
    name: "Pedro Henrique",
    handle: "@phsantos",
    city: "Belo Horizonte, MG",
    role: "comprou Frutos do Espírito",
    photo: "https://i.pravatar.cc/160?img=33",
    text: "Camiseta com mensagem que faz sentido na minha caminhada. Tecido grosso, caimento perfeito. Recomendo demais.",
    rating: 5,
  },
];

const ugcPosts = [
  { img: "assets/jesus-way-preto-1.webp",    handle: "@gabrielsilva.cwb", likes: 412 },
  { img: "assets/cristo-em-mim-preto-1.webp", handle: "@phsantos",         likes: 287 },
  { img: "assets/i-live-1.webp",              handle: "@sarahlima",        likes: 631 },
  { img: "assets/reino-off-1.webp",           handle: "@lucasmateus",      likes: 198 },
  { img: "assets/frutos-off-1.webp",          handle: "@vitor.ribeiro",    likes: 354 },
  { img: "assets/assim-na-terra-preto.webp",  handle: "@aninha.dev",       likes: 521 },
];

window.allProducts   = allProducts;
window.swatchMap     = swatchMap;
window.categories    = categories;
window.categoryPages = categoryPages;
window.testimonials  = testimonials;
window.ugcPosts      = ugcPosts;
