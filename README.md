# Ide.hub Mini E-commerce

Frontend React preservado + backend administrativo em PHP 8 e MySQL/MariaDB.

## Estrutura

- `src/`: frontend atual em React/Vite.
- `public/image/`: imagens originais do site.
- `admin/`: painel administrativo PHP.
- `api/`: endpoints usados pelo frontend.
- `config/`: configuração de banco e app.
- `database/`: SQL de estrutura e seed inicial.
- `assets/uploads/`: uploads de banners, produtos, logo e favicon.

## Banco de dados

1. Crie um banco MySQL/MariaDB.
2. Importe `database/schema.sql`.
3. Importe `database/seed.sql`.
4. Ajuste as credenciais em `config/database.php`.

Banco padrão do arquivo:

```php
DB_NAME = idehub_ecommerce
DB_USER = root
DB_PASS = ''
```

## Admin

Acesse:

```txt
/admin/login.php
```

Credenciais iniciais:

```txt
email: admin@admin.com
senha: admin123
```

Altere essa senha após o primeiro acesso. O hash fica na tabela `admins`, campo `password_hash`, gerado com `password_hash`.

## Rodar localmente

### Frontend

```bash
npm install
npm run dev
```

### PHP local com XAMPP

1. Coloque o projeto dentro de `htdocs`.
2. Crie/importe o banco pelo phpMyAdmin.
3. Ajuste `config/database.php`.
4. Acesse `http://localhost/nome-da-pasta/admin/login.php`.

Para o frontend consumir `/api/storefront.php` e `/api/checkout.php`, publique o build junto com os arquivos PHP no mesmo domínio.

## Publicar em hospedagem PHP

Envie para a hospedagem:

- `admin/`
- `api/`
- `assets/`
- `config/`
- `includes/`
- `models/`
- `database/` apenas se quiser guardar o SQL no servidor
- `dist/` ou o conteúdo gerado por `npm run build`
- `public/image/` caso a hospedagem use o projeto na raiz

Recomendado:

1. Rode `npm run build`.
2. Envie o conteúdo de `dist/` para a raiz pública.
3. Envie também `admin`, `api`, `assets`, `config`, `includes` e `models` para a mesma raiz pública.
4. Garanta permissão de escrita em `assets/uploads`.
5. Importe o banco e configure `config/database.php`.

## Integração com o frontend

O frontend tenta carregar:

```txt
/api/storefront.php
```

Esse endpoint retorna configurações, banners, categorias e produtos. Se ele não estiver disponível, o site continua usando os dados locais antigos como fallback.

O checkout envia:

```txt
POST /api/checkout.php
```

Payload esperado:

```json
{
  "name": "Joao",
  "phone": "42999999999",
  "address": "Rua...",
  "paymentMethod": "Pix",
  "notes": "entregar à tarde",
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "selectedSize": "M",
      "selectedColor": "Preto"
    }
  ]
}
```

O backend valida os produtos no banco, calcula o total, registra em `orders` e `order_items`, monta a mensagem e devolve `whatsappLink`.

## Testar fluxo WhatsApp

1. Entre no admin.
2. Configure o número do WhatsApp em Configurações.
3. Cadastre ou ative produtos.
4. Abra o site.
5. Adicione produtos ao carrinho.
6. Finalize o pedido.
7. Confira se o WhatsApp abre com o resumo e se o pedido aparece em `admin/orders`.

## Segurança básica implementada

- PDO com prepared statements.
- Senhas com `password_hash`/`password_verify`.
- Sessões com cookie `HttpOnly` e `SameSite=Lax`.
- CSRF nos formulários administrativos.
- Sanitização de saída com `htmlspecialchars`.
- Validação de upload por MIME real via `getimagesize`.
- Limite de upload de imagem em 4 MB.
