<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class Banner
{
    public static function all(bool $activeOnly = false): array
    {
        $sql = 'SELECT * FROM banners';
        if ($activeOnly) {
            $sql .= ' WHERE active = 1';
        }
        $sql .= ' ORDER BY display_order ASC, id DESC';

        return db()->query($sql)->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM banners WHERE id = ?');
        $stmt->execute([$id]);
        $banner = $stmt->fetch();
        return $banner ?: null;
    }

    public static function create(array $data): void
    {
        $stmt = db()->prepare('INSERT INTO banners (image_path, title, subtitle, link_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['image_path'],
            $data['title'] ?: null,
            $data['subtitle'] ?: null,
            $data['link_url'] ?: null,
            (int) $data['display_order'],
            (int) $data['active'],
        ]);
    }

    public static function update(int $id, array $data): void
    {
        $stmt = db()->prepare('UPDATE banners SET image_path = ?, title = ?, subtitle = ?, link_url = ?, display_order = ?, active = ? WHERE id = ?');
        $stmt->execute([
            $data['image_path'],
            $data['title'] ?: null,
            $data['subtitle'] ?: null,
            $data['link_url'] ?: null,
            (int) $data['display_order'],
            (int) $data['active'],
            $id,
        ]);
    }

    public static function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM banners WHERE id = ?');
        $stmt->execute([$id]);
    }
}

