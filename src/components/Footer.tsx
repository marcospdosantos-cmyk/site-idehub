import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { StoreSettings } from '../types';
import { resolveLocalUrl } from '../lib/urls';

type FooterProps = {
  settings: StoreSettings;
};

export function Footer({ settings }: FooterProps) {
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}`;
  const logo = resolveLocalUrl(settings.logo) || 'image/logo-preta-transp.png';

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand/Logo */}
          <div>
            <img
              src={logo}
              alt={settings.storeName}
              className="h-12 w-auto object-contain invert brightness-0 mb-4"
            />
            <p className="text-gray-400 max-w-xs leading-relaxed">
              {settings.footerText || 'Streetwear cristão premium. Vista sua fé com propósito e estilo.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href={whatsappHref}
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {settings.whatsappNumber}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  {settings.instagram || '@ide.hub'}
                </a>
              </li>
              {settings.email && <li>
                <a 
                  href={`mailto:${settings.email}`} 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {settings.email}
                </a>
              </li>}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Pagamento via Pix, Cartão de Crédito e Débito
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Enviamos para todo o Brasil
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                Compra 100% segura
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
          <p>Feito com propósito.</p>
        </div>
      </div>
    </footer>
  );
}
