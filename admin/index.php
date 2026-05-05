<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../models/Banner.php';
require_once __DIR__ . '/../models/Coupon.php';

$admin = require_admin();
$pageTitle = 'Painel da loja';
$pageSubtitle = 'Controle os textos, CTAs, imagens, banners e cupons que aparecem no site.';

$pdo = db();
Banner::syncDefaultHeroBanners();
$activeBanners = Banner::all(true, 3);
$coupons = Coupon::all();
$activeCoupons = array_values(array_filter($coupons, static fn(array $coupon): bool => (int) $coupon['active'] === 1));
$totals = [
    'products' => (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn(),
    'categories' => (int) $pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn(),
    'banners' => (int) $pdo->query('SELECT COUNT(*) FROM banners')->fetchColumn(),
    'coupons' => count($coupons),
    'orders' => (int) $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
];

$latestOrders = $pdo->query('SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5')->fetchAll();

require __DIR__ . '/../includes/layout/header.php';
?>
<div class="grid grid-4">
    <div class="card stat-card"><div class="stat-label">Produtos</div><div class="stat"><?= $totals['products'] ?></div></div>
    <div class="card stat-card"><div class="stat-label">Banners ativos</div><div class="stat"><?= count($activeBanners) ?>/3</div></div>
    <div class="card stat-card"><div class="stat-label">Cupons ativos</div><div class="stat"><?= count($activeCoupons) ?></div></div>
    <div class="card stat-card"><div class="stat-label">Pedidos</div><div class="stat"><?= $totals['orders'] ?></div></div>
</div>

<div class="card" style="margin-top:16px">
    <div class="card-header">
        <div>
            <h2 class="section-title">Atalhos rápidos</h2>
            <p class="muted">Use estes atalhos para mudar o que aparece na vitrine do site.</p>
        </div>
    </div>
    <div class="actions">
        <a class="btn btn-primary" href="<?= e(app_url('/admin/products/create.php')) ?>">Novo produto</a>
        <a class="btn" href="<?= e(app_url('/admin/banners/create.php')) ?>">Novo banner</a>
        <a class="btn" href="<?= e(app_url('/admin/banners/index.php')) ?>">Editar frases e CTAs</a>
        <a class="btn" href="<?= e(app_url('/admin/coupons/index.php')) ?>">Ativar/desativar cupons</a>
        <a class="btn" href="<?= e(app_url('/admin/categories/create.php')) ?>">Nova categoria</a>
        <a class="btn" href="<?= e(app_url('/admin/settings.php')) ?>">Configurações da loja</a>
    </div>
</div>

<div class="grid grid-2" style="margin-top:16px">
    <div class="card">
        <div class="card-header">
            <div>
                <h2 class="section-title">Home em execução</h2>
                <p class="muted">Banners, frases e botões que o site está usando agora.</p>
            </div>
            <a class="btn" href="<?= e(app_url('/admin/banners/index.php')) ?>">Editar banners</a>
        </div>
        <?php if (!$activeBanners): ?>
            <div class="empty-state">
                <h3 class="section-title">Nenhum banner ativo</h3>
                <p class="muted">Ative até 3 banners para aparecerem no carrossel principal da home.</p>
                <a class="btn btn-primary" href="<?= e(app_url('/admin/banners/index.php')) ?>">Gerenciar banners</a>
            </div>
        <?php else: ?>
            <div class="preview-list">
                <?php foreach ($activeBanners as $banner): ?>
                    <div class="hero-preview">
                        <img src="<?= e(upload_url($banner['image_path'])) ?>" alt="Banner <?= e($banner['title'] ?: 'sem título') ?>">
                        <div>
                            <span class="mini-label"><?= e($banner['eyebrow'] ?: 'Sem selo superior') ?></span>
                            <h3><?= e($banner['title'] ?: 'Sem título') ?></h3>
                            <?php if ($banner['subtitle']): ?><p class="muted"><?= e($banner['subtitle']) ?></p><?php endif; ?>
                            <div class="meta">
                                <?php if ($banner['primary_cta']): ?><span class="badge"><?= e($banner['primary_cta']) ?></span><?php endif; ?>
                                <?php if ($banner['secondary_cta']): ?><span class="badge"><?= e($banner['secondary_cta']) ?></span><?php endif; ?>
                                <span class="badge badge-on">Ativo</span>
                            </div>
                            <div class="actions" style="margin-top:12px">
                                <a class="btn" href="<?= e(app_url('/admin/banners/edit.php?id=' . (int) $banner['id'])) ?>">Editar</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="card">
        <div class="card-header">
            <div>
                <h2 class="section-title">Cupons de desconto</h2>
                <p class="muted">Controle rápido dos cupons disponíveis no checkout.</p>
            </div>
            <a class="btn" href="<?= e(app_url('/admin/coupons/index.php')) ?>">Gerenciar cupons</a>
        </div>
        <?php if (!$coupons): ?>
            <div class="empty-state">
                <h3 class="section-title">Nenhum cupom cadastrado</h3>
                <p class="muted">Crie códigos de desconto com validade, mínimo e limite de uso.</p>
                <a class="btn btn-primary" href="<?= e(app_url('/admin/coupons/create.php')) ?>">Criar cupom</a>
            </div>
        <?php else: ?>
            <div class="details-list">
                <?php foreach (array_slice($coupons, 0, 5) as $coupon): ?>
                    <p>
                        <strong><?= e($coupon['code']) ?></strong>
                        <span class="badge <?= $coupon['active'] ? 'badge-on' : 'badge-off' ?>"><?= $coupon['active'] ? 'Ativo' : 'Inativo' ?></span>
                        <span class="muted">
                            <?= $coupon['discount_type'] === 'percent' ? e(number_format((float) $coupon['discount_value'], 0, ',', '.')) . '%' : format_money((float) $coupon['discount_value']) ?>
                        </span>
                    </p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<div class="card" style="margin-top:16px">
    <h2>Últimos pedidos</h2>
    <?php if (!$latestOrders): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhum pedido registrado ainda</h3>
            <p class="muted">Quando os clientes finalizarem pelo site, os pedidos aparecerão aqui para acompanhamento.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/')) ?>" target="_blank">Ver loja</a>
        </div>
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
