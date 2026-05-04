<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/helpers.php';

final class Coupon
{
    public static function all(): array
    {
        return db()->query('SELECT * FROM coupons ORDER BY active DESC, created_at DESC, id DESC')->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = db()->prepare('SELECT * FROM coupons WHERE id = ?');
        $stmt->execute([$id]);
        $coupon = $stmt->fetch();

        return $coupon ?: null;
    }

    public static function findActiveByCode(string $code): ?array
    {
        $stmt = db()->prepare('SELECT * FROM coupons WHERE code = ? AND active = 1');
        $stmt->execute([self::normalizeCode($code)]);
        $coupon = $stmt->fetch();

        return $coupon ?: null;
    }

    public static function create(array $data): void
    {
        $stmt = db()->prepare(
            'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_total, usage_limit, used_count, starts_at, ends_at, active) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)'
        );

        $stmt->execute(self::payload($data));
    }

    public static function update(int $id, array $data): void
    {
        $stmt = db()->prepare(
            'UPDATE coupons SET code = ?, description = ?, discount_type = ?, discount_value = ?, min_order_total = ?, usage_limit = ?, starts_at = ?, ends_at = ?, active = ? WHERE id = ?'
        );

        $payload = self::payload($data);
        $payload[] = $id;
        $stmt->execute($payload);
    }

    public static function delete(int $id): void
    {
        $stmt = db()->prepare('DELETE FROM coupons WHERE id = ?');
        $stmt->execute([$id]);
    }

    public static function incrementUsage(int $id): void
    {
        $stmt = db()->prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?');
        $stmt->execute([$id]);
    }

    public static function normalizeCode(string $code): string
    {
        return strtoupper(trim(preg_replace('/\s+/', '', $code) ?? ''));
    }

    public static function calculateDiscount(array $coupon, float $subtotal): float
    {
        if ($coupon['discount_type'] === 'percent') {
            $discount = $subtotal * ((float) $coupon['discount_value'] / 100);
        } else {
            $discount = (float) $coupon['discount_value'];
        }

        return round(max(0, min($subtotal, $discount)), 2);
    }

    public static function validateForSubtotal(?array $coupon, float $subtotal): array
    {
        if (!$coupon) {
            return ['valid' => false, 'error' => 'Cupom inválido ou inativo.'];
        }

        $now = time();
        if (!empty($coupon['starts_at']) && strtotime((string) $coupon['starts_at']) > $now) {
            return ['valid' => false, 'error' => 'Este cupom ainda não está disponível.'];
        }

        if (!empty($coupon['ends_at']) && strtotime((string) $coupon['ends_at']) < $now) {
            return ['valid' => false, 'error' => 'Este cupom expirou.'];
        }

        if ((float) $coupon['min_order_total'] > 0 && $subtotal < (float) $coupon['min_order_total']) {
            return ['valid' => false, 'error' => 'Pedido mínimo para este cupom: ' . format_money((float) $coupon['min_order_total']) . '.'];
        }

        if ($coupon['usage_limit'] !== null && (int) $coupon['used_count'] >= (int) $coupon['usage_limit']) {
            return ['valid' => false, 'error' => 'Este cupom atingiu o limite de uso.'];
        }

        return [
            'valid' => true,
            'coupon' => $coupon,
            'discount' => self::calculateDiscount($coupon, $subtotal),
        ];
    }

    private static function payload(array $data): array
    {
        $discountType = $data['discount_type'] === 'fixed' ? 'fixed' : 'percent';

        return [
            self::normalizeCode((string) $data['code']),
            trim((string) ($data['description'] ?? '')) ?: null,
            $discountType,
            max(0, (float) $data['discount_value']),
            max(0, (float) ($data['min_order_total'] ?? 0)),
            (int) ($data['usage_limit'] ?? 0) > 0 ? (int) $data['usage_limit'] : null,
            self::normalizeDate((string) ($data['starts_at'] ?? '')),
            self::normalizeDate((string) ($data['ends_at'] ?? '')),
            !empty($data['active']) ? 1 : 0,
        ];
    }

    private static function normalizeDate(string $value): ?string
    {
        $value = trim(str_replace('T', ' ', $value));

        return $value !== '' ? $value : null;
    }
}
