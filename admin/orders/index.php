<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../models/Order.php';

$admin = require_admin();
$pageTitle = 'Pedidos';
$orders = OrderModel::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="table-wrap">
        <table>
            <thead><tr><th>#</th><th>Cliente</th><th>Telefone</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($orders as $order): ?>
                <tr>
                    <td><?= (int) $order['id'] ?></td>
                    <td><?= e($order['customer_name']) ?></td>
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
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
