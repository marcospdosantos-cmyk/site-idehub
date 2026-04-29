<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Category.php';

$admin = require_admin();
$error = null;
$category = ['name' => '', 'slug' => '', 'display_order' => 0, 'active' => 1];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    try {
        $name = trim((string) ($_POST['name'] ?? ''));
        if ($name === '') {
            throw new RuntimeException('Nome é obrigatório.');
        }
        Category::create([
            'name' => $name,
            'slug' => trim((string) ($_POST['slug'] ?? '')) ?: slugify($name),
            'display_order' => (int) ($_POST['display_order'] ?? 0),
            'active' => isset($_POST['active']) ? 1 : 0,
        ]);
        redirect('/admin/categories/index.php');
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
        $category = array_merge($category, $_POST);
    }
}

$pageTitle = 'Nova categoria';
$pageSubtitle = 'Crie uma categoria para organizar produtos e filtros do site.';
require __DIR__ . '/../../includes/layout/header.php';
?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<form class="card" method="post">
    <?= csrf_field() ?>
    <div class="form-row"><label>Nome</label><input name="name" required value="<?= e($category['name']) ?>"></div>
    <div class="form-row"><label>Slug opcional</label><input name="slug" value="<?= e($category['slug']) ?>"></div>
    <div class="grid grid-2">
        <div class="form-row"><label>Ordem</label><input type="number" name="display_order" value="<?= e((string) $category['display_order']) ?>"></div>
        <div class="form-row"><label class="check-row"><input type="checkbox" name="active" <?= !empty($category['active']) ? 'checked' : '' ?>> Ativa</label></div>
    </div>
    <div class="actions"><button class="btn btn-primary" type="submit">Salvar</button><a class="btn" href="<?= e(app_url('/admin/categories/index.php')) ?>">Cancelar</a></div>
</form>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
