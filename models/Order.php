<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class OrderModel
{
    public static function all(): array
    {
        return db()->query('SELECT * FROM orders ORDER BY created_at DESC, id DESC')->fetchAll();
    }

    public static function findWithItems(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        $items = db()->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
        $items->execute([$id]);
        $order['items'] = $items->fetchAll();

        return $order;
    }

    public static function create(array $order, array $items): int
    {
        $pdo = db();
        $pdo->beginTransaction();

        try {
            $stmt = $pdo->prepare('INSERT INTO orders (customer_name, customer_phone, customer_address, payment_method, coupon_code, subtotal, discount_total, notes, total, status, whatsapp_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $order['customer_name'],
                $order['customer_phone'],
                $order['customer_address'] ?? null,
                $order['payment_method'] ?? null,
                $order['coupon_code'] ?? null,
                $order['subtotal'] ?? $order['total'],
                $order['discount_total'] ?? 0,
                $order['notes'] ?? null,
                $order['total'],
                $order['status'] ?? 'enviado_para_whatsapp',
                $order['whatsapp_link'] ?? null,
            ]);

            $orderId = (int) $pdo->lastInsertId();
            $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, selected_size, selected_color, kit_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

            foreach ($items as $item) {
                $itemStmt->execute([
                    $orderId,
                    $item['product_id'],
                    $item['product_name'],
                    $item['quantity'],
                    $item['unit_price'],
                    $item['subtotal'],
                    $item['selected_size'] ?? null,
                    $item['selected_color'] ?? null,
                    $item['kit_notes'] ?? null,
                ]);
            }

            $pdo->commit();
            return $orderId;
        } catch (Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }
    }

    public static function updateWhatsappLink(int $id, string $link): void
    {
        $stmt = db()->prepare('UPDATE orders SET whatsapp_link = ? WHERE id = ?');
        $stmt->execute([$link, $id]);
    }
}
