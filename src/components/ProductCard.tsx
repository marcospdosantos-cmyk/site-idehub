import React from 'react';
import { Product } from '../data/products';
import { resolveLocalUrl } from '../lib/urls';

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product | null) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const rawImage = product.image || (product.imagesByColor ? Object.values(product.imagesByColor)[0][0] : `https://picsum.photos/seed/${product.imageSeed}/600/800?grayscale&blur=2`);
  const image = resolveLocalUrl(rawImage) || rawImage;
  const originalPrice = product.promotionalPrice || (product.category === 'Meias' ? 34.9 : product.category.includes('Camiseta') ? 109.9 : null);
  const discountPercent = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : null;
  const stockLabel = product.isKit ? 'Kit promocional' : typeof product.stock === 'number' && product.stock <= 5 ? 'Últimas unidades' : 'Pronta entrega';

  return (
    <article className="group flex flex-col overflow-hidden border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-none cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {discountPercent && discountPercent > 0 && (
            <span className="w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white shadow-lg shadow-orange-500/25">
              -{discountPercent}%
            </span>
          )}
          <span className="w-fit rounded-full bg-black/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
            {stockLabel}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          <span className="rounded-full bg-gray-100 px-2.5 py-1">Tecido premium</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1">Envio Brasil</span>
        </div>
        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500 italic font-bold uppercase tracking-tight">
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
            <span className="text-2xl font-black text-black tracking-tighter">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            onClick={() => onSelect(product)}
            className="min-h-11 cursor-pointer px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  );
};
