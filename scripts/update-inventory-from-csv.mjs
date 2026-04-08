import fs from 'node:fs';
import path from 'node:path';

const [, , inputPath] = process.argv;

if (!inputPath) {
  console.error('Uso: node scripts/update-inventory-from-csv.mjs "<caminho-do-csv>"');
  process.exit(1);
}

const resolvedInputPath = path.resolve(process.cwd(), inputPath);
const inventoryFilePath = path.resolve(process.cwd(), 'src/data/inventory.ts');

const categoryMap = {
  Oversized: 'Camiseta Oversize',
  Streetware: 'Camiseta Streetwear',
  Meias: 'Meias',
};

const sizeMap = {
  '38 á 42': 'Único',
  '38 a 42': 'Único',
};

const createInventory = () => ({
  'Camiseta Streetwear': {
    'Off white': { P: 0, M: 0, G: 0, GG: 0 },
    Preto: { P: 0, M: 0, G: 0, GG: 0 },
    'Marrom escuro': { P: 0, M: 0, G: 0, GG: 0 },
    'Verde militar': { P: 0, M: 0, G: 0, GG: 0 },
  },
  'Camiseta Oversize': {
    'Off white': { P: 0, M: 0, G: 0, GG: 0 },
    Preto: { P: 0, M: 0, G: 0, GG: 0 },
    'Marrom escuro': { P: 0, M: 0, G: 0, GG: 0 },
    'Verde militar': { P: 0, M: 0, G: 0, GG: 0 },
    Cinza: { P: 0, M: 0, G: 0, GG: 0 },
  },
  Meias: {
    Preto: { Único: 0 },
    Branco: { Único: 0 },
  },
});

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const normalizeHeader = (value) =>
  value
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const csvContent = fs.readFileSync(resolvedInputPath, 'utf8');
const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);

if (lines.length < 2) {
  console.error('CSV vazio ou sem linhas de dados.');
  process.exit(1);
}

const headers = parseCsvLine(lines[0]).map(normalizeHeader);
const headerIndex = Object.fromEntries(headers.map((header, index) => [header, index]));

const getValue = (row, headerName) => row[headerIndex[headerName]] ?? '';
const normalizeColor = (category, color) => {
  if (category === 'Meias') {
    if (color === 'Branca' || color === 'Branco') return 'Branco';
    if (color === 'Preta' || color === 'Preto') return 'Preto';
  }

  const apparelColorMap = {
    Branca: 'Off white',
    Cinza: 'Cinza',
    Marron: 'Marrom escuro',
    Preta: 'Preto',
    Preto: 'Preto',
    Verde: 'Verde militar',
  };

  return apparelColorMap[color];
};

const inventory = createInventory();

for (const line of lines.slice(1)) {
  const row = parseCsvLine(line);
  const modelagem = getValue(row, 'modelagem');
  const cor = getValue(row, 'cor');
  const tamanho = getValue(row, 'tamanho');
  const estoqueBruto = getValue(row, 'estoque');

  const category = categoryMap[modelagem];
  const color = normalizeColor(category, cor);
  const size = sizeMap[tamanho] ?? tamanho;
  const stock = Number(String(estoqueBruto).replace(',', '.'));

  if (!category || !color || !size || Number.isNaN(stock)) {
    continue;
  }

  if (!inventory[category]?.[color]) {
    inventory[category][color] = {};
  }

  inventory[category][color][size] = stock;
}

const fileContents = `// Define a estrutura do estoque
// Categoria -> Cor -> Tamanho -> Quantidade Reais
export type InventoryData = Record<string, Record<string, Record<string, number>>>;

// Estoque atualizado a partir do CSV de exportacao.
export const blankInventory: InventoryData = ${JSON.stringify(inventory, null, 2)
  .replace(/"([^"]+)":/g, (_, key) => `${/^[$A-Z_][0-9A-Z_$]*$/i.test(key) ? key : `'${key}'`}:`)}
;
`;

fs.writeFileSync(inventoryFilePath, fileContents);

console.log(`Estoque atualizado em ${inventoryFilePath}`);
