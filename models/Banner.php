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
            'eyebrow' => 'Streetwear com propósito',
            'title' => 'Vista a mensagem. Carregue a presença.',
            'subtitle' => 'Camisetas premium para quem vive a fé no corre, na rua e no secreto. Design urbano, acabamento de qualidade e identidade cristã sem exagero.',
            'trust_text' => 'Peças limitadas por drop. Chame antes de esgotar.',
            'primary_cta' => 'Comprar pelo WhatsApp',
            'secondary_cta' => 'Ver coleção',
            'side_kicker' => 'Drop ativo',
            'side_title' => '3 caminhos para escolher sua próxima peça.',
            'side_text' => 'Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.',
            'link_url' => null,
            'display_order' => 1,
            'active' => 1,
        ],
        [
            'image_path' => '/image/Jesus Way Preto 1.webp',
            'eyebrow' => 'Novo drop Ide.hub',
            'title' => 'Fé no peito, estilo na rua.',
            'subtitle' => 'Uma coleção criada para jovens que não se escondem: visual premium, frases com intenção e camisetas prontas para acompanhar sua rotina.',
            'trust_text' => 'Atendimento direto no WhatsApp e estoque limitado nesta coleção.',
            'primary_cta' => 'Garantir minha camiseta',
            'secondary_cta' => 'Falar com atendimento',
            'side_kicker' => 'Drop ativo',
            'side_title' => 'Escolha sua camiseta com calma e finalize direto no WhatsApp.',
            'side_text' => 'A gente confirma modelo, tamanho e cor antes do pagamento.',
            'link_url' => null,
            'display_order' => 2,
            'active' => 1,
        ],
        [
            'image_path' => '/image/Boas Novas 1.webp',
            'eyebrow' => 'Criado para quem representa',
            'title' => 'Sua roupa também pode anunciar.',
            'subtitle' => 'Camisetas streetwear cristãs com presença, conforto e estética limpa. Para vestir bem sem diluir aquilo em que você acredita.',
            'trust_text' => 'Compra rápida pelo WhatsApp. Modelos selecionados com poucas unidades.',
            'primary_cta' => 'Comprar agora no WhatsApp',
            'secondary_cta' => 'Conhecer o drop',
            'side_kicker' => 'Drop ativo',
            'side_title' => '3 caminhos para escolher sua próxima peça.',
            'side_text' => 'Clique, filtre a coleção e finalize pelo WhatsApp com atendimento direto.',
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

    public static function delete(int $id): void
    {
        self::ensureHeroColumns();

        $stmt = db()->prepare('DELETE FROM banners WHERE id = ?');
        $stmt->execute([$id]);
    }
}
