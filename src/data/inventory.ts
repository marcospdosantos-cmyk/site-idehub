// Define a estrutura do estoque
// Categoria -> Cor -> Tamanho -> Quantidade Reais
export type InventoryData = Record<string, Record<string, Record<string, number>>>;

// Este é o seu controle principal de estoque de camisetas **lisas**.
// Quando o cliente escolhe a estampa "Jesus Way" (que é Streetwear), 
// o sistema vai abater ou checar a quantidade nesta tabela.
export const blankInventory: InventoryData = {
  'Camiseta Streetwear': {
    'Off white': {
      'P': 10,
      'M': 8,
      'G': 5,
      'GG': 0, // Esgotado para teste
    },
    'Preto': {
      'P': 20,
      'M': 15,
      'G': 15,
      'GG': 5,
    },
    'Marrom escuro': {
      'P': 5,
      'M': 7,
      'G': 2,
      'GG': 1,
    },
    'Verde militar': {
      'P': 4,
      'M': 6,
      'G': 3,
      'GG': 0,
    }
  },
  'Camiseta Oversize': {
    'Off white': {
      'P': 12,
      'M': 10,
      'G': 5,
      'GG': 3,
    },
    'Preto': {
      'P': 8,
      'M': 12,
      'G': 10,
      'GG': 2,
    },
    'Marrom escuro': {
      'P': 3,
      'M': 5,
      'G': 4,
      'GG': 0,
    },
    'Verde militar': {
      'P': 2,
      'M': 4,
      'G': 1,
      'GG': 0,
    },
    'Cinza': {
      'P': 0, // Esgotado
      'M': 8,
      'G': 5,
      'GG': 2,
    }
  },
  'Meias': {
    'Preto': {
      'Único': 50,
    },
    'Branco': {
      'Único': 40,
    }
  }
};
