<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../includes/upload.php';
require_once __DIR__ . '/../../models/Banner.php';

$admin = require_admin();
$id = (int) ($_GET['id'] ?? 0);
$banner = Banner::find($id);
if (!$banner) {
    redirect('/admin/banners/index.php');
}

$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    try {
        $imagePath = handle_image_upload('image', 'banners', $banner['image_path']);
        Banner::update($id, [
            'image_path' => $imagePath,
            'title' => trim((string) ($_POST['title'] ?? '')),
            'subtitle' => trim((string) ($_POST['subtitle'] ?? '')),
            'link_url' => trim((string) ($_POST['link_url'] ?? '')),
            'display_order' => (int) ($_POST['display_order'] ?? 0),
            'active' => isset($_POST['active']) ? 1 : 0,
        ]);
        redirect('/admin/banners/index.php');
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
        $banner = array_merge($banner, $_POST);
    }
}

$pageTitle = 'Editar banner';
require __DIR__ . '/../../includes/layout/header.php';
?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<form class="card" method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="form-row"><label>Imagem</label><input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif"><p class="muted">Atual: <?= e($banner['image_path']) ?></p></div>
    <div class="form-row"><label>Titulo opcional</label><input name="title" value="<?= e($banner['title']) ?>"></div>
    <div class="form-row"><label>Subtitulo opcional</label><input name="subtitle" value="<?= e($banner['subtitle']) ?>"></div>
    <div class="form-row"><label>Link clicavel opcional</label><input name="link_url" value="<?= e($banner['link_url']) ?>"></div>
    <div class="grid grid-2">
        <div class="form-row"><label>Ordem</label><input type="number" name="display_order" value="<?= e((string) $banner['display_order']) ?>"></div>
        <div class="form-row"><label><input style="width:auto" type="checkbox" name="active" <?= !empty($banner['active']) ? 'checked' : '' ?>> Ativo</label></div>
    </div>
    <div class="actions"><button class="btn btn-primary" type="submit">Salvar</button><a class="btn" href="<?= e(app_url('/admin/banners/index.php')) ?>">Cancelar</a></div>
</form>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
