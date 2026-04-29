import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Gabriel Silva',
    text: 'A modelagem oversize é perfeita, veste muito bem. O tecido é de altíssima qualidade e a mensagem da estampa é forte. Já quero a próxima coleção!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Lucas Mateus',
    text: 'Comprei o kit promocional e me surpreendi. As camisetas são premium de verdade e a meia de brinde é muito estilosa. Atendimento nota 10.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Felipe Costa',
    text: 'Difícil achar streetwear cristão com essa pegada minimalista. A Ide.hub acertou em cheio. Entrega rápida e embalagem impecável.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Ana Julia',
    text: 'As camisetas são incríveis! O caimento da oversize é exatamente o que eu procurava. A cor off-white é linda demais.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Matheus Oliveira',
    text: 'Qualidade que impressiona. O tecido é grosso e resistente, as estampas são muito bem feitas. Recomendo muito!',
    rating: 4,
  },
  {
    id: 6,
    name: 'Sarah Lima',
    text: 'Amei minha compra! O atendimento pelo WhatsApp foi super-rápido e atencioso. As peças chegaram cheirosas e bem embaladas.',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 3 >= testimonials.length ? 0 : prev + 3));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 3 < 0 ? Math.max(0, testimonials.length - 3) : prev - 3));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <section className="overflow-hidden bg-[#fffaf2] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d96c27]">Prova social</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-stone-950 sm:text-5xl">
              O que nossos clientes dizem
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              A qualidade e o propósito que vestem quem faz a diferença.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="magnetic-button rounded-full border border-black/10 bg-white p-3 hover:bg-black hover:text-white"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="magnetic-button rounded-full border border-black/10 bg-white p-3 hover:bg-black hover:text-white"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500">
          {visibleTestimonials.map((t) => (
            <div key={t.id} className="rounded-[2rem] border border-black/8 bg-[#f6f1e8] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.rating ? 'fill-[#d96c27] text-[#d96c27]' : 'fill-stone-200 text-stone-200'}`}
                  />
                ))}
              </div>
              <p className="mb-6 h-24 overflow-hidden text-stone-600 italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="font-black text-stone-950">{t.name}</div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Compra verificada
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
