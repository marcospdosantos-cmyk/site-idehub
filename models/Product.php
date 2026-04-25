<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class ProductModel
{
    public static function all(bool $activeOnly = false): array
    {
        $sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id';
        if ($activeOnly) {
            $sql .= ' WHERE p.active = 1 AND (c.active = 1 OR p.category_id IS NULL)';
        }
        $sql .= ' ORDER BY c.display_order ASC, p.featured DESC, p.id DESC';

        return db()->query($sql)->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        return $product ?: null;
    }

    public static function findManyByIds(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        if (!$ids) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = db()->prepare("SELECT * FROM products WHERE active = 1 AND id IN ($placeholders)");
        $stmt->execute($ids);

        $products = [];
        foreach ($stmt->fetchAll() as $product) {
            $products[(int) $product['id']] = $product;
        }

        return $products;
    }

    public static function create(array $data): void
    {
        $stmt = db()->prepare(
            'INSERT INTO products (category_id, name, slug, image_path, short_description, full_description, price, promotional_price, featured, stock, sizes, colors, is_kit, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute(self::values($data));
    }

    public static function update(int $id, array $data): void
    {
        $stmt = db()->prepare(
            'UPDATE products SET category_id = ?, name = ?, slug = ?, image_path = ?, short_description = ?, full_description = ?, price = ?, promotional_price = ?, featured = ?, stock = ?, sizes = ?, colors = ?, is_kit = ?, active = ? WHERE id = ?'
        );
        $values = self::values($data);
        $values[] = $id;
        $stmt->execute($values);
    }

    public static function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
    }

    private static function values(array $data): array
    {
        return [
            $data['category_id'] ?: null,
            $data['name'],
            $data['slug'],
            $data['image_path'] ?: null,
            $data['short_description'],
            $data['full_description'] ?: null,
            (float) $data['price'],
            $data['promotional_price'] !== '' && $data['promotional_price'] !== null ? (float) $data['promotional_price'] : null,
            (int) $data['featured'],
            $data['stock'] !== '' && $data['stock'] !== null ? (int) $data['stock'] : null,
            $data['sizes'] ?: null,
            $data['colors'] ?: null,
            (int) $data['is_kit'],
            (int) $data['active'],
        ];
    }
}

