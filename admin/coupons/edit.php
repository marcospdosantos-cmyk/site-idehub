<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Coupon.php';

$admin = require_admin();
$coupon = Coupon::find((int) ($_GET['id'] ?? 0));
if (!$coupon) {
    redirect('/admin/coupons/index.php');
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    try {
        $code = Coupon::normalizeCode((string) ($_POST['code'] ?? ''));
        $discountValue = money_to_decimal((string) ($_POST['discount_value'] ?? '0'));

        if ($code === '' || $discountValue <= 0) {
            throw new RuntimeException('Informe código e valor de desconto válidos.');
        }

        Coupon::update((int) $coupon['id'], [
            'code' => $code,
            'description' => $_POST['description'] ?? '',
            'discount_type' => $_POST['discount_type'] ?? 'percent',
            'discount_value' => $discountValue,
            'min_order_total' => money_to_decimal((string) ($_POST['min_order_total'] ?? '0')),
            'usage_limit' => $_POST['usage_limit'] ?? '',
            'starts_at' => $_POST['starts_at'] ?? '',
            'ends_at' => $_POST['ends_at'] ?? '',
            'active' => $_POST['active'] ?? '1',
        ]);

        redirect('/admin/coupons/index.php');
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
    }
}

$pageTitle = 'Editar cupom';
$pageSubtitle = 'Atualize regras, validade e limite de uso.';
require __DIR__ . '/../../includes/layout/header.php';
?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<form class="card" method="post">
    <?= csrf_field() ?>
    <?php require __DIR__ . '/form.php'; ?>
    <button class="btn btn-primary" type="submit">Salvar alterações</button>
    <a class="btn" href="<?= e(app_url('/admin/coupons/index.php')) ?>">Cancelar</a>
</form>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
