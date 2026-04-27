USE idehub_ecommerce;

INSERT INTO admins (name, email, password_hash, active)
VALUES (
  'Administrador',
  'admin@admin.com',
  '$2y$10$9gNTex9vfj76mYlN/lGelORU3SqZm.R3MwFnv.Rebj5d8veWP28DW',
  1
)
ON DUPLICATE KEY UPDATE email = VALUES(email);
-- A senha inicial é admin123. Altere imediatamente após o primeiro acesso.

INSERT INTO settings (
  id,
  store_name,
  logo_path,
  favicon_path,
  whatsapp_number,
  footer_text,
  primary_color,
  secondary_color,
  email,
  instagram
) VALUES (
  1,
  'Ide.hub',
  'logo/idehub-logo.png',
  'favicon/idehub-favicon.png',
  '5542999488235',
  'Streetwear cristão premium. Vista sua fé com propósito e estilo.',
  '#f97316',
  '#111827',
  'contato@idehub.com.br',
  '@ide.hub'
) ON DUPLICATE KEY UPDATE id = id;

INSERT INTO banners (image_path, eyebrow, title, subtitle, trust_text, primary_cta, secondary_cta, side_kicker, side_title, side_text, link_url, display_order, active)
VALUES
('/image/imgi_18.webp', 'Streetwear com propósito', 'Vista a mensagem. Carregue a presença.', 'Camisetas premium para quem vive a fé no corre, na rua e no secreto. Design urbano, acabamento de qualidade e identidade cristã sem exagero.', 'Peças limitadas por drop. Chame antes de esgotar.', 'Comprar pelo WhatsApp', 'Ver coleção', 'Drop ativo', '3 caminhos para escolher sua próxima peça.', 'Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.', NULL, 1, 1),
('/image/Jesus Way Preto 1.webp', 'Novo drop Ide.hub', 'Fé no peito, estilo na rua.', 'Uma coleção criada para jovens que não se escondem: visual premium, frases com intenção e camisetas prontas para acompanhar sua rotina.', 'Atendimento direto no WhatsApp e estoque limitado nesta coleção.', 'Garantir minha camiseta', 'Falar com atendimento', 'Drop ativo', 'Escolha sua camiseta com calma e finalize direto no WhatsApp.', 'A gente confirma modelo, tamanho e cor antes do pagamento.', NULL, 2, 1),
('/image/Boas Novas 1.webp', 'Criado para quem representa', 'Sua roupa também pode anunciar.', 'Camisetas streetwear cristãs com presença, conforto e estética limpa. Para vestir bem sem diluir aquilo em que você acredita.', 'Compra rápida pelo WhatsApp. Modelos selecionados com poucas unidades.', 'Comprar agora no WhatsApp', 'Conhecer o drop', 'Drop ativo', '3 caminhos para escolher sua próxima peça.', 'Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.', NULL, 3, 1);

INSERT INTO categories (name, slug, display_order, active) VALUES
('Camiseta Streetwear', 'camiseta-streetwear', 1, 1),
('Camiseta Oversize', 'camiseta-oversize', 2, 1),
('Kit Promocional', 'kit-promocional', 3, 1),
('Meias', 'meias', 4, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), display_order = VALUES(display_order), active = VALUES(active);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta StreetWear | JESUS WAY TRUTH LIFE', 'camiseta-streetwear-jesus-way-truth-life', '/image/Jesus Way Off 1.webp', 'Camiseta com proposta cristã e estilo urbano', 89.90, 109.90, 1, 32, 'P,M,G,GG', 'Off white,Preto,Marrom escuro', 0, 1 FROM categories c WHERE c.slug = 'camiseta-streetwear'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta StreetWear | CRISTO EM MIM', 'camiseta-streetwear-cristo-em-mim', '/image/Cristo em Mim Off 1.webp', 'Estampa cristã com foco em identidade espiritual', 89.90, 109.90, 0, 24, 'P,M,G,GG', 'Off white,Preto', 0, 1 FROM categories c WHERE c.slug = 'camiseta-streetwear'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta Oversize | ASSIM NA TERRA COMO NO CÉU', 'camiseta-oversize-assim-na-terra-como-no-ceu', '/image/Assim na terra Off.webp', 'Modelo oversized com mensagem cristã', 89.90, 109.90, 1, 18, 'P,M,G,GG', 'Off white,Marrom escuro,Preto', 0, 1 FROM categories c WHERE c.slug = 'camiseta-oversize'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta StreetWear | FRUTOS DO ESPÍRITO', 'camiseta-streetwear-frutos-do-espirito', '/image/Frutos Off 1.webp', 'Estampa baseada em valores cristãos', 89.90, 109.90, 0, 23, 'P,M,G,GG', 'Off white,Preto,Verde militar', 0, 1 FROM categories c WHERE c.slug = 'camiseta-streetwear'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta Oversize | BOAS NOVAS', 'camiseta-oversize-boas-novas', '/image/Boas Novas 1.webp', 'Peça oversized com conceito gospel', 89.90, 109.90, 0, 22, 'P,M,G,GG', 'Off white,Verde militar', 0, 1 FROM categories c WHERE c.slug = 'camiseta-oversize'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta Oversize | I LIVE FOR HIM', 'camiseta-oversize-i-live-for-him', '/image/I live 1.webp', 'Estilo street oversized com mensagem cristã', 89.90, 109.90, 0, 24, 'P,M,G,GG', 'Marrom escuro,Cinza', 0, 1 FROM categories c WHERE c.slug = 'camiseta-oversize'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta Oversize | HE LEFT THE 99', 'camiseta-oversize-he-left-the-99', '/image/He Left Off1.webp', 'Peça oversized com referência bíblica', 89.90, 109.90, 0, 18, 'P,M,G,GG', 'Cinza,Off white,Verde militar', 0, 1 FROM categories c WHERE c.slug = 'camiseta-oversize'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta StreetWear | REINO DE DEUS', 'camiseta-streetwear-reino-de-deus', '/image/Reino Off 1.webp', 'Camiseta com temática cristã urbana', 89.90, 109.90, 0, 20, 'P,M,G,GG', 'Off white,Preto', 0, 1 FROM categories c WHERE c.slug = 'camiseta-streetwear'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Camiseta StreetWear | JESUS FOLLOWER', 'camiseta-streetwear-jesus-follower', '/image/Jesus Follower Off 1.webp', 'Estilo street com mensagem cristã', 89.90, 109.90, 0, 20, 'P,M,G,GG', 'Off white,Preto', 0, 1 FROM categories c WHERE c.slug = 'camiseta-streetwear'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Kit Promocional | 3 Camisetas + 1 Meia (Brinde)', 'kit-promocional-3-camisetas-1-meia', NULL, 'Combo com 3 camisetas streetwear à escolha + 1 meia de brinde', 199.90, NULL, 1, NULL, NULL, NULL, 1, 1 FROM categories c WHERE c.slug = 'kit-promocional'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Kit Promocional | 2 Camisetas', 'kit-promocional-2-camisetas', NULL, 'Combo com 2 camisetas streetwear à escolha', 149.90, NULL, 1, NULL, NULL, NULL, 1, 1 FROM categories c WHERE c.slug = 'kit-promocional'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, name, slug, image_path, short_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active)
SELECT c.id, 'Meia Cano Alto | Jesus Way, Truth, Life', 'meia-cano-alto-jesus-way-truth-life', '/image/Meia Preto.webp', 'Meia temática combinando com coleção', 24.90, 34.90, 0, 25, NULL, 'Preto,Branco', 0, 1 FROM categories c WHERE c.slug = 'meias'
ON DUPLICATE KEY UPDATE name = VALUES(name);
