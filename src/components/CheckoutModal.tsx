import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { CheckoutData } from '../types';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void;
  total: number;
};

export function CheckoutModal({ isOpen, onClose, onSubmit, total }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    address: '',
    paymentMethod: 'Pix',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-none w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-none hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Nome Completo
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Endereço de Entrega
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-24"
              placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Forma de Pagamento
            </label>
            <div className="space-y-2">
              {['Pix', 'Cartão de Crédito', 'Cartão de Débito'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 border rounded-none cursor-pointer transition-all ${
                    formData.paymentMethod === method
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value as any })
                    }
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="ml-3 font-medium text-gray-900">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Total a pagar</span>
              <span className="text-2xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar para WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
