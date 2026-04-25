<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class Category
{
    public static function all(bool $activeOnly = false): array
    {
        $sql = 'SELECT * FROM categories';
        if ($activeOnly) {
            $sql .= ' WHERE active = 1';
        }
        $sql .= ' ORDER BY display_order ASC, name ASC';

        return db()->query($sql)->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $category = $stmt->fetch();
        return $category ?: null;
    }

    public static function create(array $data): void
    {
        $stmt = db()->prepare('INSERT INTO categories (name, slug, display_order, active) VALUES (?, ?, ?, ?)');
        $stmt->execute([$data['name'], $data['slug'], (int) $data['display_order'], (int) $data['active']]);
    }

    public static function update(int $id, array $data): void
    {
        $stmt = db()->prepare('UPDATE categories SET name = ?, slug = ?, display_order = ?, active = ? WHERE id = ?');
        $stmt->execute([$data['name'], $data['slug'], (int) $data['display_order'], (int) $data['active'], $id]);
    }

    public static function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
    }
}

