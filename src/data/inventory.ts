// Define a estrutura do estoque
// Categoria -> Cor -> Tamanho -> Quantidade Reais
export type InventoryData = Record<string, Record<string, Record<string, number>>>;

// Estoque atualizado a partir do CSV de exportacao.
export const blankInventory: InventoryData = {
  'Camiseta Streetwear': {
    'Off white': {
      P: 0,
      M: 4,
      G: 5,
      GG: 2
    },
    Preto: {
      P: 3,
      M: 7,
      G: 8,
      GG: 2
    },
    'Marrom escuro': {
      P: 1,
      M: 3,
      G: 5,
      GG: 2
    },
    'Verde militar': {
      P: 0,
      M: 0,
      G: 0,
      GG: 0
    }
  },
  'Camiseta Oversize': {
    'Off white': {
      P: 5,
      M: 10,
      G: 7,
      GG: 0
    },
    Preto: {
      P: 5,
      M: 6,
      G: 3,
      GG: 1
    },
    'Marrom escuro': {
      P: 4,
      M: 4,
      G: 5,
      GG: 0
    },
    'Verde militar': {
      P: 4,
      M: 6,
      G: 2,
      GG: 0
    },
    Cinza: {
      P: 6,
      M: 5,
      G: 0,
      GG: 0
    }
  },
  Meias: {
    Preto: {
      'Único': 13
    },
    Branco: {
      'Único': 12
    }
  }
}
;
