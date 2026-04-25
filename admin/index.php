<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';

$admin = require_admin();
$pageTitle = 'Dashboard';
$pageSubtitle = 'Resumo rapido da loja.';

$pdo = db();
$totals = [
    'products' => (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn(),
    'categories' => (int) $pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn(),
    'banners' => (int) $pdo->query('SELECT COUNT(*) FROM banners')->fetchColumn(),
    'orders' => (int) $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
];

$latestOrders = $pdo->query('SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5')->fetchAll();

require __DIR__ . '/../includes/layout/header.php';
?>
<div class="grid grid-4">
    <div class="card"><div class="muted">Produtos</div><div class="stat"><?= $totals['products'] ?></div></div>
    <div class="card"><div class="muted">Categorias</div><div class="stat"><?= $totals['categories'] ?></div></div>
    <div class="card"><div class="muted">Banners</div><div class="stat"><?= $totals['banners'] ?></div></div>
    <div class="card"><div class="muted">Pedidos</div><div class="stat"><?= $totals['orders'] ?></div></div>
</div>

<div class="card" style="margin-top:16px">
    <h2>Atalhos</h2>
    <div class="actions">
        <a class="btn btn-primary" href="<?= e(app_url('/admin/products/create.php')) ?>">Novo produto</a>
        <a class="btn" href="<?= e(app_url('/admin/banners/create.php')) ?>">Novo banner</a>
        <a class="btn" href="<?= e(app_url('/admin/categories/create.php')) ?>">Nova categoria</a>
        <a class="btn" href="<?= e(app_url('/admin/settings.php')) ?>">Configurações da loja</a>
    </div>
</div>

<div class="card" style="margin-top:16px">
    <h2>Ultimos pedidos</h2>
    <?php if (!$latestOrders): ?>
        <p class="muted">Nenhum pedido registrado ainda.</p>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Cliente</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($latestOrders as $order): ?>
                    <tr>
                        <td><?= (int) $order['id'] ?></td>
                        <td><?= e($order['customer_name']) ?></td>
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
<?php require __DIR__ . '/../includes/layout/footer.php'; ?>
