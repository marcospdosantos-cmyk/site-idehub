<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/Coupon.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Método não permitido.'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    json_response(['error' => 'JSON inválido.'], 422);
}

$code = Coupon::normalizeCode((string) ($input['couponCode'] ?? ''));
$subtotal = round(max(0, (float) ($input['subtotal'] ?? 0)), 2);

if ($code === '' || $subtotal <= 0) {
    json_response(['error' => 'Informe um cupom e um subtotal válido.'], 422);
}

$result = Coupon::validateForSubtotal(Coupon::findActiveByCode($code), $subtotal);
if (!$result['valid']) {
    json_response(['error' => $result['error']], 422);
}

$coupon = $result['coupon'];
$discount = (float) $result['discount'];

json_response([
    'code' => $coupon['code'],
    'description' => $coupon['description'],
    'discountTotal' => $discount,
    'total' => round(max(0, $subtotal - $discount), 2),
]);
