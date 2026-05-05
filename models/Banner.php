<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class Banner
{
    private const HERO_COLUMNS = [
        'eyebrow' => 'VARCHAR(120) NULL',
        'trust_text' => 'VARCHAR(255) NULL',
        'primary_cta' => 'VARCHAR(80) NULL',
        'secondary_cta' => 'VARCHAR(80) NULL',
        'side_kicker' => 'VARCHAR(80) NULL',
        'side_title' => 'VARCHAR(160) NULL',
        'side_text' => 'VARCHAR(255) NULL',
    ];

    private static bool $schemaReady = false;

    private const DEFAULT_HERO_BANNERS = [
        [
            'image_path' => '/image/imgi_18.webp',
            'eyebrow' => 'Vista sua fé.',
            'title' => 'Vista a mensagem. Carregue a presença.',
            'subtitle' => 'Camisetas cristãs para quem quer representar Jesus com estilo, verdade e atitude no dia a dia.',
            'trust_text' => 'Peças limitadas. Chame antes que esgote!',
            'primary_cta' => 'Comprar pelo WhatsApp',
            'secondary_cta' => 'Ver coleção',
            'side_kicker' => 'Coleção ativa',
            'side_title' => 'Fé, identidade e estilo na mesma peça.',
            'side_text' => 'Escolha sua camiseta, confirme os detalhes e finalize com atendimento direto.',
            'link_url' => null,
            'display_order' => 1,
            'active' => 1,
        ],
        [
            'image_path' => '/image/Jesus Way Preto 1.webp',
            'eyebrow' => 'Coleção Ide.hub',
            'title' => 'Jesus no centro.',
            'subtitle' => 'Peças para jovens cristãos que querem se vestir bem sem esconder aquilo em que acreditam.',
            'trust_text' => 'Compra simples, conversa direta e confirmação antes do pagamento.',
            'primary_cta' => 'Escolher minha camiseta',
            'secondary_cta' => 'Tirar dúvidas',
            'side_kicker' => 'Coleção ativa',
            'side_title' => 'Escolha com calma. A gente te ajuda no WhatsApp.',
            'side_text' => 'Antes de finalizar, confirmamos modelo, tamanho, cor e disponibilidade.',
            'link_url' => null,
            'display_order' => 2,
            'active' => 1,
        ],
        [
            'image_path' => '/image/Boas Novas 1.webp',
            'eyebrow' => 'Para quem quer representar Jesus com estilo.',
            'title' => 'Mostre o que te move.',
            'subtitle' => 'Roupas cristãs com visual urbano, mensagens fortes e acabamento pensado para a rotina.',
            'trust_text' => 'Atendimento humanizado para você comprar com segurança e sem complicação.',
            'primary_cta' => 'Chamar no WhatsApp',
            'secondary_cta' => 'Conhecer a coleção',
            'side_kicker' => 'Coleção ativa',
            'side_title' => 'Estilo que aponta para Cristo.',
            'side_text' => 'Navegue pelas peças e escolha a que combina com seu estilo e caminhada.',
            'link_url' => null,
            'display_order' => 3,
            'active' => 1,
        ],
    ];

    private static function ensureHeroColumns(): void
    {
        if (self::$schemaReady) {
            return;
        }

        $columns = db()->query('SHOW COLUMNS FROM banners')->fetchAll();
        $existingColumns = array_flip(array_column($columns, 'Field'));

        foreach (self::HERO_COLUMNS as $column => $definition) {
            if (!isset($existingColumns[$column])) {
                db()->exec("ALTER TABLE banners ADD COLUMN {$column} {$definition}");
            }
        }

        self::$schemaReady = true;
    }

    public static function all(bool $activeOnly = false, ?int $limit = null): array
    {
        self::ensureHeroColumns();

        $sql = 'SELECT * FROM banners';
        if ($activeOnly) {
            $sql .= ' WHERE active = 1';
        }
        $sql .= ' ORDER BY display_order ASC, id DESC';
        if ($limit !== null) {
            $sql .= ' LIMIT ' . max(1, $limit);
        }

        return db()->query($sql)->fetchAll();
    }

    public static function syncDefaultHeroBanners(): void
    {
        self::ensureHeroColumns();

        $count = (int) db()->query('SELECT COUNT(*) FROM banners')->fetchColumn();
        if ($count >= 3) {
            return;
        }

        $stmt = db()->prepare('SELECT id, title, subtitle FROM banners ORDER BY display_order ASC, id ASC LIMIT 1');
        $stmt->execute();
        $firstBanner = $stmt->fetch();

        if ($firstBanner && $count === 1) {
            $legacyTitle = (string) ($firstBanner['title'] ?? '');
            $legacySubtitle = (string) ($firstBanner['subtitle'] ?? '');
            if ($legacyTitle === 'Tudo aqui aponta para Jesus' || $legacySubtitle === 'Oversized T-shirts') {
                self::update((int) $firstBanner['id'], self::DEFAULT_HERO_BANNERS[0]);
            }
        }

        $existingTitles = array_column(self::all(false), 'title');
        foreach (self::DEFAULT_HERO_BANNERS as $banner) {
            if (!in_array($banner['title'], $existingTitles, true)) {
                self::create($banner);
            }
        }
    }

    public static function find(int $id): ?array
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare('SELECT * FROM banners WHERE id = ?');
        $stmt->execute([$id]);
        $banner = $stmt->fetch();
        return $banner ?: null;
    }

    public static function activeCount(?int $excludeId = null): int
    {
        self::ensureHeroColumns();

        $sql = 'SELECT COUNT(*) FROM banners WHERE active = 1';
        $params = [];

        if ($excludeId !== null) {
            $sql .= ' AND id <> ?';
            $params[] = $excludeId;
        }

        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public static function create(array $data): void
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare(
            'INSERT INTO banners (image_path, eyebrow, title, subtitle, trust_text, primary_cta, secondary_cta, side_kicker, side_title, side_text, link_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['image_path'],
            $data['eyebrow'] ?: null,
            $data['title'] ?: null,
            $data['subtitle'] ?: null,
            $data['trust_text'] ?: null,
            $data['primary_cta'] ?: null,
            $data['secondary_cta'] ?: null,
            $data['side_kicker'] ?: null,
            $data['side_title'] ?: null,
            $data['side_text'] ?: null,
            $data['link_url'] ?: null,
            (int) $data['display_order'],
            (int) $data['active'],
        ]);
    }

    public static function update(int $id, array $data): void
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare(
            'UPDATE banners SET image_path = ?, eyebrow = ?, title = ?, subtitle = ?, trust_text = ?, primary_cta = ?, secondary_cta = ?, side_kicker = ?, side_title = ?, side_text = ?, link_url = ?, display_order = ?, active = ? WHERE id = ?'
        );
        $stmt->execute([
            $data['image_path'],
            $data['eyebrow'] ?: null,
            $data['title'] ?: null,
            $data['subtitle'] ?: null,
            $data['trust_text'] ?: null,
            $data['primary_cta'] ?: null,
            $data['secondary_cta'] ?: null,
            $data['side_kicker'] ?: null,
            $data['side_title'] ?: null,
            $data['side_text'] ?: null,
            $data['link_url'] ?: null,
            (int) $data['display_order'],
            (int) $data['active'],
            $id,
        ]);
    }

    public static function setActive(int $id, bool $active): void
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare('UPDATE banners SET active = ? WHERE id = ?');
        $stmt->execute([$active ? 1 : 0, $id]);
    }

    public static function delete(int $id): void
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare('DELETE FROM banners WHERE id = ?');
        $stmt->execute([$id]);
    }
}
