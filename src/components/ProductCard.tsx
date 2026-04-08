import React from 'react';
import { Product } from '../data/products';

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product | null) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="group flex flex-col bg-white rounded-none overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-none cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.imagesByColor ? Object.values(product.imagesByColor)[0][0] : `https://picsum.photos/seed/${product.imageSeed}/600/800?grayscale&blur=2`}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500 italic font-bold uppercase tracking-tight">
              {product.id === '11' ? (
                'Cada camiseta sai por R$ 74,95'
              ) : product.id === '10' ? (
                'R$ 66,63 cada + Meia de brinde'
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
            className="px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};
