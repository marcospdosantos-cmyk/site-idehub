import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';
import { resolveLocalUrl } from '../lib/urls';

type FooterProps = {
  settings: StoreSettings;
};

export function Footer({ settings }: FooterProps) {
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}`;
  const logo = resolveLocalUrl(settings.logo) || 'image/logo-preta-transp.png';

  return (
    <footer className="rounded-t-[3rem] bg-[#100f0d] pt-16 pb-8 text-white sm:rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_0.7fr_0.8fr]">
          <div>
            <img
              src={logo}
              alt={settings.storeName}
              className="mb-5 h-14 w-auto object-contain invert brightness-0"
            />
            <p className="max-w-sm text-stone-400 leading-relaxed">
              {settings.footerText || 'Streetwear cristão premium. Vista sua fé com propósito e estilo.'}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]"></span>
              Atendimento online
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href={whatsappHref}
                  target="_blank" 
                  rel="noreferrer" 
                  className="magnetic-button flex w-fit items-center gap-3 text-stone-400 hover:text-white"
                >
                  <MessageCircle className="w-5 h-5" />
                  {settings.whatsappNumber}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="magnetic-button flex w-fit items-center gap-3 text-stone-400 hover:text-white"
                >
                  <Instagram className="w-5 h-5" />
                  {settings.instagram || '@ide.hub'}
                </a>
              </li>
              {settings.email && <li>
                <a 
                  href={`mailto:${settings.email}`} 
                  className="magnetic-button flex w-fit items-center gap-3 text-stone-400 hover:text-white"
                >
                  <Mail className="w-5 h-5" />
                  {settings.email}
                </a>
              </li>}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">Informações</h3>
            <ul className="space-y-3 text-stone-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d96c27]"></span>
                Pagamento via Pix, Cartão de Crédito e Débito
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d96c27]"></span>
                Enviamos para todo o Brasil
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d96c27]"></span>
                Compra 100% segura
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-stone-500 md:flex-row">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
          <p className="font-display text-xl italic text-[#f3c27d]">Feito com propósito.</p>
        </div>
      </div>
    </footer>
  );
}
