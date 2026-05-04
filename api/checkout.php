<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Coupon.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Método não permitido.'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    json_response(['error' => 'JSON inválido.'], 422);
}

$name = trim((string) ($input['name'] ?? ''));
$phone = normalize_whatsapp((string) ($input['phone'] ?? ''));
$address = trim((string) ($input['address'] ?? ''));
$paymentMethod = trim((string) ($input['paymentMethod'] ?? ''));
$couponCode = Coupon::normalizeCode((string) ($input['couponCode'] ?? ''));
$notes = trim((string) ($input['notes'] ?? ''));
$cartItems = $input['items'] ?? [];

if ($name === '' || $phone === '' || !is_array($cartItems) || !$cartItems) {
    json_response(['error' => 'Informe nome, telefone e itens do pedido.'], 422);
}

$productIds = array_map(static fn($item): int => (int) ($item['productId'] ?? 0), $cartItems);
$products = ProductModel::findManyByIds($productIds);
$orderItems = [];
$orderSubtotal = 0.0;

foreach ($cartItems as $item) {
    $productId = (int) ($item['productId'] ?? 0);
    $quantity = max(1, (int) ($item['quantity'] ?? 1));

    if (!isset($products[$productId])) {
        json_response(['error' => 'Um dos produtos não está mais disponível.'], 422);
    }

    $product = $products[$productId];
    if ($product['stock'] !== null && $quantity > (int) $product['stock']) {
        json_response(['error' => 'Quantidade acima do estoque para ' . $product['name']], 422);
    }

    $unitPrice = (float) $product['price'];
    $itemSubtotal = round($unitPrice * $quantity, 2);
    $orderSubtotal += $itemSubtotal;

    $orderItems[] = [
        'product_id' => $productId,
        'product_name' => $product['name'],
        'quantity' => $quantity,
        'unit_price' => $unitPrice,
        'subtotal' => $itemSubtotal,
        'selected_size' => trim((string) ($item['selectedSize'] ?? '')) ?: null,
        'selected_color' => trim((string) ($item['selectedColor'] ?? '')) ?: null,
        'kit_notes' => trim((string) ($item['kitNotes'] ?? '')) ?: null,
    ];
}

$discountTotal = 0.0;
$appliedCoupon = null;

if ($couponCode !== '') {
    $couponResult = Coupon::validateForSubtotal(Coupon::findActiveByCode($couponCode), round($orderSubtotal, 2));
    if (!$couponResult['valid']) {
        json_response(['error' => $couponResult['error']], 422);
    }

    $appliedCoupon = $couponResult['coupon'];
    $discountTotal = (float) $couponResult['discount'];
}

$total = round(max(0, $orderSubtotal - $discountTotal), 2);

$settings = Setting::get();
$orderId = OrderModel::create([
    'customer_name' => $name,
    'customer_phone' => $phone,
    'customer_address' => $address,
    'payment_method' => $paymentMethod,
    'coupon_code' => $appliedCoupon ? $appliedCoupon['code'] : null,
    'subtotal' => round($orderSubtotal, 2),
    'discount_total' => round($discountTotal, 2),
    'notes' => $notes,
    'total' => $total,
    'status' => 'enviado_para_whatsapp',
], $orderItems);

if ($appliedCoupon) {
    Coupon::incrementUsage((int) $appliedCoupon['id']);
}

$message = "Olá! Quero fazer este pedido:\n\n";
$message .= "Pedido: #{$orderId}\n";
$message .= "Nome: {$name}\n";
$message .= "Telefone: {$phone}\n";
if ($address !== '') {
    $message .= "Endereço: {$address}\n";
}
if ($paymentMethod !== '') {
    $message .= "Pagamento: {$paymentMethod}\n";
}
$message .= "\nItens:\n";

foreach ($orderItems as $item) {
    $details = [];
    if ($item['selected_size']) {
        $details[] = 'Tam: ' . $item['selected_size'];
    }
    if ($item['selected_color']) {
        $details[] = 'Cor: ' . $item['selected_color'];
    }
    $detailText = $details ? ' (' . implode(', ', $details) . ')' : '';
    $message .= '- ' . $item['product_name'] . $detailText . ' | Qtd: ' . $item['quantity'] . ' | Unit: ' . format_money((float) $item['unit_price']) . ' | Subtotal: ' . format_money((float) $item['subtotal']) . "\n";
    if ($item['kit_notes']) {
        $message .= '  Observação do kit: ' . $item['kit_notes'] . "\n";
    }
}

$message .= "\nSubtotal: " . format_money(round($orderSubtotal, 2)) . "\n";
if ($appliedCoupon) {
    $message .= 'Cupom: ' . $appliedCoupon['code'] . ' (-' . format_money(round($discountTotal, 2)) . ")\n";
}
$message .= "Total: " . format_money($total) . "\n";
if ($notes !== '') {
    $message .= "Observações: {$notes}\n";
}
$message .= 'Data/hora: ' . date('d/m/Y H:i');

$whatsappNumber = normalize_whatsapp((string) $settings['whatsapp_number']);
$whatsappLink = 'https://wa.me/' . $whatsappNumber . '?text=' . rawurlencode($message);
OrderModel::updateWhatsappLink($orderId, $whatsappLink);

json_response([
    'orderId' => $orderId,
    'subtotal' => round($orderSubtotal, 2),
    'discountTotal' => round($discountTotal, 2),
    'total' => $total,
    'whatsappLink' => $whatsappLink,
    'message' => $message,
]);
