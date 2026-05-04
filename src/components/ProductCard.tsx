import React from 'react';
import { Product } from '../data/products';
import { blankInventory } from '../data/inventory';
import { resolveLocalUrl } from '../lib/urls';

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product | null) => void;
};

const colorSwatches: Record<string, string> = {
  'Off white': '#f4eee2',
  Preto: '#111111',
  'Marrom escuro': '#4a3024',
  'Verde militar': '#596247',
  Cinza: '#8a8a8a',
  Branco: '#ffffff',
};

const getAvailableColors = (product: Product) => {
  if (product.isKit) return product.colors || [];

  const categoryInventory = blankInventory[product.category];
  const colors = product.colors || (categoryInventory ? Object.keys(categoryInventory) : []);

  if (!categoryInventory) return colors;

  return colors.filter((color) => {
    const sizeStock = categoryInventory[color];
    return sizeStock && Object.values(sizeStock).some((stock) => stock > 0);
  });
};

const getAvailableSizes = (product: Product) => {
  if (product.isKit) return product.sizes || [];

  const categoryInventory = blankInventory[product.category];
  const baseSizes = product.sizes || [];

  if (!categoryInventory) return baseSizes;

  const colors = getAvailableColors(product);
  const inventorySizes = Array.from(
    new Set(
      colors.flatMap((color) =>
        Object.entries(categoryInventory[color] || {})
          .filter(([, stock]) => stock > 0)
          .map(([size]) => size)
      )
    )
  );

  if (!baseSizes.length) return inventorySizes;

  return baseSizes.filter((size) => inventorySizes.includes(size));
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const rawImage = product.image || (product.imagesByColor ? Object.values(product.imagesByColor)[0][0] : `https://picsum.photos/seed/${product.imageSeed}/600/800?grayscale&blur=2`);
  const image = resolveLocalUrl(rawImage) || rawImage;
  const originalPrice = product.promotionalPrice || (product.category === 'Meias' ? 34.9 : product.category.includes('Camiseta') ? 109.9 : null);
  const discountPercent = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : null;
  const stockLabel = product.isKit ? 'Kit promocional' : typeof product.stock === 'number' && product.stock <= 5 ? 'Últimas unidades' : 'Pronta entrega';
  const availableColors = getAvailableColors(product);
  const availableSizes = getAvailableSizes(product);
  const visibleColors = availableColors.slice(0, 4);
  const hiddenColorsCount = Math.max(0, availableColors.length - visibleColors.length);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/8 bg-[#ffffff] shadow-[0_18px_60px_rgba(17,17,17,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-black/16 hover:shadow-[0_26px_80px_rgba(17,17,17,0.12)]">
      <div 
        className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-stone-200"
        onClick={() => onSelect(product)}
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/0 to-black/0 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {discountPercent && discountPercent > 0 && (
            <span className="w-fit rounded-full bg-[#f2752f] px-3 py-1 text-xs font-black text-white shadow-lg shadow-black/20">
              -{discountPercent}%
            </span>
          )}
          <span className="w-fit rounded-full border border-white/12 bg-black/72 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
            {stockLabel}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelect(product);
            }}
            className="magnetic-button w-full rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-wide text-black shadow-xl"
          >
            Ver detalhes
          </button>
        </div>
      </div>
      <div className="flex flex-grow flex-col p-5">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#f2752f]">
          {product.category}
        </div>
        <h3 className="mb-2 text-base font-black leading-tight text-stone-950">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-2 flex-grow text-sm leading-6 text-stone-500">
          {product.description}
        </p>
        <div className="mb-5 space-y-3">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Tamanhos</p>
            <div className="flex flex-wrap gap-1.5">
              {availableSizes.length ? (
                availableSizes.map((size) => (
                  <span key={size} className="inline-flex min-h-7 min-w-8 items-center justify-center rounded-full border border-black/8 bg-black/[0.04] px-2 text-[11px] font-black text-stone-700">
                    {size}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[11px] font-black text-stone-500">
                  Consulte no WhatsApp
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Cores</p>
            <div className="flex flex-wrap gap-2">
              {visibleColors.length ? (
                <>
                  {visibleColors.map((color) => (
                    <span key={color} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-black text-stone-600">
                      <span
                        className="h-3 w-3 rounded-full border border-black/15"
                        style={{ backgroundColor: colorSwatches[color] || '#d6d3d1' }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{color}</span>
                    </span>
                  ))}
                  {hiddenColorsCount > 0 && (
                    <span className="rounded-full bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-black text-stone-500">
                      +{hiddenColorsCount}
                    </span>
                  )}
                </>
              ) : (
                <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[11px] font-black text-stone-500">
                  Cores a combinar
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-4 border-t border-black/8 pt-4 min-[380px]:flex-row min-[380px]:items-end min-[380px]:justify-between">
          <div className="flex flex-col">
            <span className="min-h-4 text-[10px] font-black uppercase tracking-wide text-[#f2752f]">
              {product.id === '11' ? (
                'Cada camiseta sai por R$ 74,95'
              ) : product.id === '10' ? (
                'R$ 66,63 cada + Meia de brinde'
              ) : product.promotionalPrice ? (
                <>De <span className="line-through">R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}</span> por</>
              ) : product.category.includes('Camiseta') ? (
                <>De <span className="line-through">R$ 109,90</span> por</>
              ) : product.category === 'Meias' ? (
                <>De <span className="line-through">R$ 34,90</span> por</>
              ) : (
                ''
              )}
            </span>
            <span className="text-2xl font-black tracking-normal text-black">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            onClick={() => onSelect(product)}
            className="magnetic-button min-h-11 w-full cursor-pointer rounded-full bg-black px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-black/15 hover:bg-[#f2752f] active:scale-95 min-[380px]:w-auto"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
};
