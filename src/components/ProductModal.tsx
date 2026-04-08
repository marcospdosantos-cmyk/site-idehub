import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { CartItem } from '../types';
import { blankInventory } from '../data/inventory';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
};

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const firstAvailableColor = product.colors?.find((color) => {
    if (product.isKit) return true;
    const stock = blankInventory[product.category]?.[color]?.[product.sizes?.[0] || 'Único'] ?? 0;
    return stock > 0;
  }) || product.colors?.[0] || '';

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(firstAvailableColor);
  const [kitNotes, setKitNotes] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStock = (color: string, size: string) => {
    if (product.isKit) return 999;
    return blankInventory[product.category]?.[color]?.[size] ?? 0;
  };

  // Verifica o estoque atual combinando a cor e tamanho selecionados
  const currentStock = product.sizes 
    ? getStock(selectedColor, selectedSize)
    : (product.isKit ? 999 : (blankInventory[product.category]?.[selectedColor]?.['Único'] ?? 0));
    
  const isSelectedOutOfStock = !product.isKit && currentStock === 0;

  const handleAddToCart = () => {
    onAddToCart({
      product,
      quantity: 1,
      selectedSize: product.sizes ? selectedSize : undefined,
      selectedColor: product.colors ? selectedColor : undefined,
      kitNotes: product.isKit ? kitNotes : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-none w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative aspect-[4/3] bg-gray-100">
          <img
            key={`${selectedColor}-${currentImageIndex}`}
            src={product.imagesByColor && product.imagesByColor[selectedColor] ? product.imagesByColor[selectedColor][currentImageIndex] : `https://picsum.photos/seed/${product.imageSeed}${selectedColor ? `-${selectedColor.replace(/\s+/g, '-').toLowerCase()}` : ''}/800/600?grayscale`}
            alt={`${product.name} - ${selectedColor}`}
            className="object-cover w-full h-full animate-in fade-in duration-300"
            referrerPolicy="no-referrer"
          />
          {product.imagesByColor && product.imagesByColor[selectedColor]?.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.imagesByColor![selectedColor].length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-none text-gray-900 hover:bg-white transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => prev < product.imagesByColor![selectedColor].length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-none text-gray-900 hover:bg-white transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-none text-gray-900 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
            <div className="flex flex-col">
              <span className="text-xs text-orange-500 italic font-bold uppercase tracking-tight">
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
              <span className="text-3xl font-black text-black tracking-tighter">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.isKit && (
                <span className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  Estoque sob consulta*
                </span>
              )}
            </div>
          </div>

          {product.isKit ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quais modelos, tamanhos e cores você deseja no kit?
              </label>
              <textarea
                value={kitNotes}
                onChange={(e) => setKitNotes(e.target.value)}
                placeholder="Ex: 1x JESUS WAY (M, Preto), 1x BOAS NOVAS (G, Off white)..."
                className="w-full p-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none h-24"
              />
            </div>
          ) : (
            <>
              {product.sizes && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tamanho
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const stock = getStock(selectedColor, size);
                      const isOutOfStock = stock === 0;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[4rem] px-4 py-2 rounded-none transition-colors border ${
                            selectedSize === size
                              ? 'bg-black text-white border-black'
                              : isOutOfStock
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{size}</span>
                            {!product.isKit && (
                              <span className={`text-[10px] mt-0.5 ${isOutOfStock ? 'text-red-400 font-medium' : 'opacity-70'}`}>
                                {isOutOfStock ? 'Esgotado' : `${stock} disp.`}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.colors && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Cor
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      (() => {
                        const stock = product.sizes
                          ? getStock(color, selectedSize)
                          : (product.isKit ? 999 : (blankInventory[product.category]?.[color]?.['Único'] ?? 0));
                        const isOutOfStock = !product.isKit && stock === 0;

                        return (
                          <button
                            key={color}
                            onClick={() => {
                              if (isOutOfStock) return;
                              setSelectedColor(color);
                              setCurrentImageIndex(0);
                            }}
                            className={`px-4 py-2 rounded-none text-sm font-medium transition-colors border ${
                              selectedColor === color
                                ? 'bg-black text-white border-black'
                                : isOutOfStock
                                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                  : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{color}</span>
                              {!product.isKit && !product.sizes && (
                                <span className={`text-[10px] mt-0.5 ${isOutOfStock ? 'text-red-400 font-medium' : 'opacity-70'}`}>
                                  {isOutOfStock ? 'Esgotado' : `${stock} disp.`}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })()
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleAddToCart}
            disabled={(product.isKit ? !kitNotes.trim() : false) || isSelectedOutOfStock}
            className="w-full py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            {isSelectedOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}
