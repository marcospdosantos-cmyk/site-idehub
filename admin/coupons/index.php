<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Coupon.php';

$admin = require_admin();
$pageTitle = 'Cupons';
$pageSubtitle = 'Crie, edite, ative ou desative os descontos usados no checkout.';
$coupons = Coupon::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="card-header">
        <div>
            <h2 class="section-title">Lista de cupons</h2>
            <p class="muted">Controle porcentagem, valor fixo, pedido mínimo, limite de uso e se o cupom está disponível no site.</p>
        </div>
        <a class="btn btn-primary" href="<?= e(app_url('/admin/coupons/create.php')) ?>">Novo cupom</a>
    </div>
    <?php if (!$coupons): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhum cupom cadastrado</h3>
            <p class="muted">Crie um cupom para aparecer no checkout do site.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/admin/coupons/create.php')) ?>">Criar cupom</a>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Desconto</th>
                        <th>Pedido mínimo</th>
                        <th>Uso</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($coupons as $coupon): ?>
                        <tr>
                            <td>
                                <strong><?= e($coupon['code']) ?></strong>
                                <?php if ($coupon['description']): ?><br><span
                                        class="muted"><?= e($coupon['description']) ?></span><?php endif; ?>
                            </td>
                            <td>
                                <?= $coupon['discount_type'] === 'percent' ? e(number_format((float) $coupon['discount_value'], 0, ',', '.')) . '%' : format_money((float) $coupon['discount_value']) ?>
                            </td>
                            <td><?= (float) $coupon['min_order_total'] > 0 ? format_money((float) $coupon['min_order_total']) : 'Sem mínimo' ?>
                            </td>
                            <td><?= (int) $coupon['used_count'] ?><?= $coupon['usage_limit'] !== null ? ' / ' . (int) $coupon['usage_limit'] : '' ?>
                            </td>
                            <td><span
                                    class="badge <?= $coupon['active'] ? 'badge-on' : 'badge-off' ?>"><?= $coupon['active'] ? 'Ativo' : 'Inativo' ?></span>
                            </td>
                            <td class="actions">
                                <form method="post" action="<?= e(app_url('/admin/coupons/toggle.php')) ?>">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="id" value="<?= (int) $coupon['id'] ?>">
                                    <input type="hidden" name="active" value="<?= $coupon['active'] ? 0 : 1 ?>">
                                    <button class="btn <?= $coupon['active'] ? '' : 'btn-primary' ?>" type="submit">
                                        <?= $coupon['active'] ? 'Desativar' : 'Ativar' ?>
                                    </button>
                                </form>
                                <a class="btn"
                                    href="<?= e(app_url('/admin/coupons/edit.php?id=' . (int) $coupon['id'])) ?>">Editar</a>
                                <form method="post" action="<?= e(app_url('/admin/coupons/delete.php')) ?>"
                                    onsubmit="return confirm('Excluir este cupom?')">
                                    <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int) $coupon['id'] ?>">
                                    <button class="btn btn-danger" type="submit">Excluir</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
