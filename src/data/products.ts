export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  isKit?: boolean;
  imageSeed: string;
  imagesByColor?: Record<string, string[]>;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Camiseta StreetWear | JESUS WAY TRUTH LIFE',
    category: 'Camiseta Streetwear',
    description: 'Camiseta com proposta cristã e estilo urbano',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Preto', 'Marrom escuro'],
    imageSeed: 'streetwear-1',
    imagesByColor: {
      'Off white': ['/image/Jesus Way Off 1.webp', '/image/Jesus Way Off 2.webp'],
      'Preto': ['/image/Jesus Way Preto 1.webp', '/image/Jesus Way Preto 2.webp'],
      'Marrom escuro': ['/image/Jesus Way Marron 1.webp', '/image/Jesus Way Marron 2.webp'],
    },
  },
  {
    id: '2',
    name: 'Camiseta StreetWear | CRISTO EM MIM',
    category: 'Camiseta Streetwear',
    description: 'Estampa cristã com foco em identidade espiritual',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Preto'],
    imageSeed: 'streetwear-2',
    imagesByColor: {
      'Off white': ['/image/Cristo em Mim Off 1.webp', '/image/Cristo em Mim Off 2.webp'],
      'Preto': ['/image/Cristo em Mim Preto 1.webp', '/image/Cristo em Mim  Preto 2.webp'],
    },
  },
  {
    id: '3',
    name: 'Camiseta Oversize | ASSIM NA TERRA COMO NO CÉU',
    category: 'Camiseta Oversize',
    description: 'Modelo oversized com mensagem cristã',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Marrom escuro', 'Preto'],
    imageSeed: 'oversize-1',
    imagesByColor: {
      'Off white': ['/image/Assim na terra Off.webp'],
      'Marrom escuro': ['/image/Assim na terra Maron.webp'],
      'Preto': ['/image/Assim na terra Preto.webp'],
    },
  },
  {
    id: '4',
    name: 'Camiseta StreetWear | FRUTOS DO ESPÍRITO',
    category: 'Camiseta Streetwear',
    description: 'Estampa baseada em valores cristãos',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Preto', 'Verde militar'],
    imageSeed: 'streetwear-3',
    imagesByColor: {
      'Off white': ['/image/Frutos Off 1.webp', '/image/Frutos Off 2.webp'],
      'Preto': ['/image/Frutos Preto 1.webp', '/image/Frutos Preto 2.webp'],
    },
  },
  {
    id: '5',
    name: 'Camiseta Oversize | BOAS NOVAS',
    category: 'Camiseta Oversize',
    description: 'Peça oversized com conceito gospel',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Verde militar'],
    imageSeed: 'oversize-2',
    imagesByColor: {
      'Off white': ['/image/Boas Novas 1.webp', '/image/Boas Novas 2.webp'],
    },
  },
  {
    id: '6',
    name: 'Camiseta Oversize | I LIVE FOR HIM',
    category: 'Camiseta Oversize',
    description: 'Estilo street oversized com mensagem cristã',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Marrom escuro', 'Cinza'],
    imageSeed: 'oversize-3',
    imagesByColor: {
      'Marrom escuro': ['/image/I live 1.webp', '/image/I live 2.webp'],
    },
  },
  {
    id: '7',
    name: 'Camiseta Oversize | HE LEFT THE 99',
    category: 'Camiseta Oversize',
    description: 'Peça oversized com referência bíblica',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Cinza', 'Off white', 'Verde militar'],
    imageSeed: 'oversize-4',
    imagesByColor: {
      'Off white': ['/image/He Left Off1.webp'],
    },
  },
  {
    id: '8',
    name: 'Camiseta StreetWear | REINO DE DEUS',
    category: 'Camiseta Streetwear',
    description: 'Camiseta com temática cristã urbana',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Preto'],
    imageSeed: 'streetwear-4',
    imagesByColor: {
      'Off white': ['/image/Reino Off 1.webp', '/image/Reino Off 2.webp'],
      'Preto': ['/image/Reino Preto 1.webp', '/image/Reino Preto 2.webp'],
    },
  },
  {
    id: '9',
    name: 'Camiseta StreetWear | JESUS FOLLOWER',
    category: 'Camiseta Streetwear',
    description: 'Estilo street com mensagem cristã',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Off white', 'Preto'],
    imageSeed: 'streetwear-5',
    imagesByColor: {
      'Off white': ['/image/Jesus Follower Off 1.webp', '/image/Jesus Follower Off 2.webp'],
      'Preto': ['/image/Jesus Follower Preto 1.webp', '/image/Jesus Follower Preto 2.webp'],
    },
  },
  {
    id: '10',
    name: 'Kit Promocional | 3 Camisetas + 1 Meia (Brinde)',
    category: 'Kit Promocional',
    description: 'Combo com 3 camisetas streetwear à escolha + 1 meia de brinde',
    price: 199.9,
    isKit: true,
    imageSeed: 'kit-1',
  },
  {
    id: '11',
    name: 'Kit Promocional | 2 Camisetas',
    category: 'Kit Promocional',
    description: 'Combo com 2 camisetas streetwear à escolha',
    price: 149.9,
    isKit: true,
    imageSeed: 'kit-2',
  },
  {
    id: '12',
    name: 'Meia Cano Alto | Jesus Way, Truth, Life',
    category: 'Meias',
    description: 'Meia temática combinando com coleção',
    price: 24.9,
    colors: ['Preto', 'Branco'],
    imageSeed: 'socks-1',
    imagesByColor: {
      'Preto': ['/image/Meia Preto.webp'],
      'Branco': ['/image/Meia Branca.webp'],
    },
  },
];

export const categories = Array.from(new Set(products.map((p) => p.category)));
