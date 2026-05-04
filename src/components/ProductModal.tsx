import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { CartItem } from '../types';
import { blankInventory } from '../data/inventory';
import { resolveLocalUrl } from '../lib/urls';

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
    if (typeof product.stock === 'number') return Math.max(0, product.stock);
    return blankInventory[product.category]?.[color]?.[size] ?? 0;
  };

  // Verifica o estoque atual combinando a cor e tamanho selecionados
  const currentStock = product.sizes 
    ? getStock(selectedColor, selectedSize)
    : (product.isKit ? 999 : (typeof product.stock === 'number' ? Math.max(0, product.stock) : (blankInventory[product.category]?.[selectedColor]?.['Único'] ?? 0)));
    
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

  const modalImage =
    product.imagesByColor && product.imagesByColor[selectedColor]
      ? product.imagesByColor[selectedColor][currentImageIndex]
      : product.image || `https://picsum.photos/seed/${product.imageSeed}${selectedColor ? `-${selectedColor.replace(/\s+/g, '-').toLowerCase()}` : ''}/800/600?grayscale`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6">
      <div className="grid max-h-[92dvh] w-full max-w-5xl grid-rows-[minmax(210px,34dvh)_minmax(0,1fr)] overflow-hidden rounded-[1.5rem] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:grid-rows-[minmax(260px,42dvh)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)] md:grid-rows-none md:rounded-none">
        <div className="relative min-h-0 overflow-hidden bg-gray-100 md:min-h-[620px]">
          <img
            key={`${selectedColor}-${currentImageIndex}`}
            src={resolveLocalUrl(modalImage) || modalImage}
            alt={`${product.name} - ${selectedColor}`}
            className="h-full w-full object-cover animate-in fade-in duration-300"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {product.imagesByColor && product.imagesByColor[selectedColor]?.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.imagesByColor![selectedColor].length - 1)}
                className="absolute left-4 top-1/2 min-h-11 min-w-11 -translate-y-1/2 cursor-pointer bg-white/80 p-2 text-gray-900 backdrop-blur-md transition-colors hover:bg-white"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => prev < product.imagesByColor![selectedColor].length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 min-h-11 min-w-11 -translate-y-1/2 cursor-pointer bg-white/80 p-2 text-gray-900 backdrop-blur-md transition-colors hover:bg-white"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 min-h-11 min-w-11 cursor-pointer bg-white/80 p-2 text-gray-900 backdrop-blur-md transition-colors hover:bg-white"
            aria-label="Fechar detalhes do produto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="min-w-0 overflow-y-auto p-4 sm:p-7">
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              <span className="rounded-full bg-gray-100 px-2.5 py-1">Compra pelo WhatsApp</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1">Envio Brasil</span>
            </div>
            <h2 className="text-xl font-black leading-tight text-gray-900 sm:text-2xl">{product.name}</h2>
            <div className="flex flex-col">
              <span className="text-xs text-[#f2752f] italic font-bold uppercase tracking-tight">
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
              <span className="text-3xl font-black tracking-normal text-black sm:text-4xl">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.isKit && (
                <span className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  Estoque sob consulta*
                </span>
              )}
            </div>
          </div>

          <p className="mb-6 text-sm leading-6 text-gray-600">
            {product.fullDescription || product.description}
          </p>

          {product.isKit ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quais modelos, tamanhos e cores você deseja no kit?
              </label>
              <textarea
                value={kitNotes}
                onChange={(e) => setKitNotes(e.target.value)}
                placeholder="Ex: 1x JESUS WAY (M, Preto), 1x BOAS NOVAS (G, Off white)..."
                className="h-24 w-full resize-none rounded-[1rem] border border-gray-200 p-3 outline-none focus:border-transparent focus:ring-2 focus:ring-black"
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
                            className={`min-h-12 min-w-[3.6rem] cursor-pointer rounded-full border px-3 py-2 transition-colors sm:min-w-[4rem] sm:px-4 ${
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
                          : (product.isKit ? 999 : (typeof product.stock === 'number' ? Math.max(0, product.stock) : (blankInventory[product.category]?.[color]?.['Único'] ?? 0)));
                        const isOutOfStock = !product.isKit && stock === 0;

                        return (
                          <button
                            key={color}
                            onClick={() => {
                              if (isOutOfStock) return;
                              setSelectedColor(color);
                              setCurrentImageIndex(0);
                            }}
                            className={`min-h-11 cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
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
            className="w-full min-h-12 cursor-pointer py-4 bg-[#f2752f] text-white rounded-full font-bold text-lg hover:bg-[#f2752f] transition-all shadow-lg shadow-[rgba(242,117,47,0.30)] hover:shadow-[rgba(242,117,47,0.50)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            {isSelectedOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}
