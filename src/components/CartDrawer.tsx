import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Seu carrinho está vazio.</p>
              <button 
                onClick={onClose}
                className="text-black font-medium underline underline-offset-4"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-none overflow-hidden flex-shrink-0">
                    <img
                      src={`https://picsum.photos/seed/${item.product.imageSeed}/200/240?grayscale`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 pr-4">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                      {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                      {item.selectedColor && <p>Cor: {item.selectedColor}</p>}
                      {item.kitNotes && <p className="line-clamp-1">Notas: {item.kitNotes}</p>}
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-none">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:scale-95"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
