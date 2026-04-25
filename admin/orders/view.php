<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../models/Order.php';

$admin = require_admin();
$order = OrderModel::findWithItems((int) ($_GET['id'] ?? 0));
if (!$order) {
    redirect('/admin/orders/index.php');
}

$pageTitle = 'Pedido #' . $order['id'];
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="grid grid-2">
    <div class="card">
        <h2>Cliente</h2>
        <p><strong>Nome:</strong> <?= e($order['customer_name']) ?></p>
        <p><strong>Telefone:</strong> <?= e($order['customer_phone']) ?></p>
        <?php if ($order['customer_address']): ?><p><strong>Endereço:</strong><br><?= nl2br(e($order['customer_address'])) ?></p><?php endif; ?>
        <?php if ($order['payment_method']): ?><p><strong>Pagamento:</strong> <?= e($order['payment_method']) ?></p><?php endif; ?>
        <?php if ($order['notes']): ?><p><strong>Observações:</strong><br><?= nl2br(e($order['notes'])) ?></p><?php endif; ?>
    </div>
    <div class="card">
        <h2>Resumo</h2>
        <p><strong>Total:</strong> <?= format_money((float) $order['total']) ?></p>
        <p><strong>Status:</strong> <?= e($order['status']) ?></p>
        <p><strong>Data:</strong> <?= e(date('d/m/Y H:i', strtotime($order['created_at']))) ?></p>
        <?php if ($order['whatsapp_link']): ?><a class="btn btn-primary" href="<?= e($order['whatsapp_link']) ?>" target="_blank" rel="noreferrer">Abrir WhatsApp</a><?php endif; ?>
    </div>
</div>

<div class="card" style="margin-top:16px">
    <h2>Itens</h2>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Unitario</th><th>Subtotal</th><th>Detalhes</th></tr></thead>
            <tbody>
            <?php foreach ($order['items'] as $item): ?>
                <tr>
                    <td><?= e($item['product_name']) ?></td>
                    <td><?= (int) $item['quantity'] ?></td>
                    <td><?= format_money((float) $item['unit_price']) ?></td>
                    <td><?= format_money((float) $item['subtotal']) ?></td>
                    <td>
                        <?= $item['selected_size'] ? 'Tam: ' . e($item['selected_size']) . '<br>' : '' ?>
                        <?= $item['selected_color'] ? 'Cor: ' . e($item['selected_color']) . '<br>' : '' ?>
                        <?= $item['kit_notes'] ? nl2br(e($item['kit_notes'])) : '' ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
