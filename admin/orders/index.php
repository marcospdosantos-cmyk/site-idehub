<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../models/Order.php';

$admin = require_admin();
$pageTitle = 'Pedidos';
$pageSubtitle = 'Acompanhe as solicitações enviadas pelo checkout do site.';
$orders = OrderModel::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="card-header">
        <div>
            <h2 class="section-title">Histórico de pedidos</h2>
            <p class="muted">Confira dados do cliente, total e status de cada solicitação.</p>
        </div>
    </div>
    <?php if (!$orders): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhum pedido por enquanto</h3>
            <p class="muted">Os pedidos feitos no site aparecerão aqui automaticamente.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/')) ?>" target="_blank">Ver loja</a>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Cliente</th><th>Telefone</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($orders as $order): ?>
                    <tr>
                        <td><?= (int) $order['id'] ?></td>
                        <td><strong><?= e($order['customer_name']) ?></strong></td>
                        <td><?= e($order['customer_phone']) ?></td>
                        <td><?= format_money((float) $order['total']) ?></td>
                        <td><span class="badge"><?= e($order['status']) ?></span></td>
                        <td><?= e(date('d/m/Y H:i', strtotime($order['created_at']))) ?></td>
                        <td><a class="btn" href="<?= e(app_url('/admin/orders/view.php?id=' . (int) $order['id'])) ?>">Ver</a></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
