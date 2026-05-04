import React, { useState } from 'react';
import { MessageCircle, Tag, X } from 'lucide-react';
import { CheckoutData } from '../types';
import { validateCoupon } from '../lib/api';

const CHECKOUT_STORAGE_KEY = 'idehub-checkout';

const defaultCheckoutData: CheckoutData = {
  name: '',
  phone: '',
  address: '',
  paymentMethod: 'Pix',
  notes: '',
};

const getStoredCheckoutData = (): CheckoutData => {
  if (typeof window === 'undefined') return defaultCheckoutData;

  try {
    const storedData = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!storedData) return defaultCheckoutData;

    const parsedData = JSON.parse(storedData);

    return {
      name: typeof parsedData.name === 'string' ? parsedData.name : '',
      phone: typeof parsedData.phone === 'string' ? parsedData.phone : '',
      address: typeof parsedData.address === 'string' ? parsedData.address : '',
      paymentMethod:
        parsedData.paymentMethod === 'Cartão de Crédito' || parsedData.paymentMethod === 'Cartão de Débito'
          ? parsedData.paymentMethod
          : 'Pix',
      notes: typeof parsedData.notes === 'string' ? parsedData.notes : '',
    };
  } catch {
    return defaultCheckoutData;
  }
};

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void | Promise<void>;
  total: number;
  error: string | null;
};

export function CheckoutModal({ isOpen, onClose, onSubmit, total, error }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CheckoutData>(() => getStoredCheckoutData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountTotal: number; total: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  React.useEffect(() => {
    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  React.useEffect(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, [total]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, couponCode: appliedCoupon?.code });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode) {
      setCouponError('Digite um cupom para aplicar.');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const response = await validateCoupon(normalizedCode, total);
      setAppliedCoupon({
        code: response.code,
        discountTotal: response.discountTotal,
        total: response.total,
      });
      setCouponCode(response.code);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error instanceof Error ? error.message : 'Não foi possível aplicar o cupom.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const paymentMethods: CheckoutData['paymentMethod'][] = ['Pix', 'Cartão de Crédito', 'Cartão de Débito'];
  const totalToPay = appliedCoupon?.total ?? total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-black text-gray-900">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="min-h-11 min-w-11 cursor-pointer p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Fechar checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
            <p className="bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-600">
              Você será direcionado ao WhatsApp para conferir o pedido antes de confirmar o pagamento.
            </p>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Nome Completo
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 w-full border border-gray-200 px-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Telefone / WhatsApp
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-11 w-full border border-gray-200 px-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                placeholder="42999999999"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Endereço de Entrega
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-20 w-full resize-none border border-gray-200 px-3 py-2 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                placeholder="Rua, número, bairro, cidade, estado, CEP"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method}
                    className={`flex min-h-11 cursor-pointer items-center border px-3 py-2 transition-all ${
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
                        setFormData({ ...formData, paymentMethod: e.target.value as CheckoutData['paymentMethod'] })
                      }
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-900">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setAppliedCoupon(null);
                    setCouponError(null);
                  }}
                  className="h-11 min-w-0 flex-1 border border-gray-200 px-3 text-sm font-bold uppercase outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                  placeholder="IDE10"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-black bg-black px-4 text-sm font-black text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Tag className="h-4 w-4" />
                  {isApplyingCoupon ? 'Aplicando' : 'Aplicar'}
                </button>
              </div>
              {couponError && <p className="mt-2 text-xs font-semibold text-red-600">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-2 text-xs font-semibold text-emerald-700">
                  Cupom {appliedCoupon.code} aplicado: -R$ {appliedCoupon.discountTotal.toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-800">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="h-16 w-full resize-none border border-gray-200 px-3 py-2 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-black"
                placeholder="Ex.: entregar à tarde"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white px-5 py-4">
            {error && (
              <div className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}
            <div className="mb-3 space-y-1">
              {appliedCoupon && (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-emerald-700">
                    <span>Desconto</span>
                    <span>-R$ {appliedCoupon.discountTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total a pagar</span>
                <span className="text-2xl font-black text-gray-900">
                  R$ {totalToPay.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-base font-black text-white shadow-lg shadow-[#25D366]/20 transition-colors hover:bg-[#128C7E] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <MessageCircle className="h-5 w-5" />
              {isSubmitting ? 'Preparando pedido...' : 'Enviar para WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
