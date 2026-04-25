<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Banner.php';

$admin = require_admin();
$pageTitle = 'Banners';
$banners = Banner::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="actions" style="justify-content:space-between;margin-bottom:14px">
        <p class="muted">Banners usados no destaque principal do site.</p>
        <a class="btn btn-primary" href="<?= e(app_url('/admin/banners/create.php')) ?>">Novo banner</a>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Imagem</th><th>Titulo</th><th>Ordem</th><th>Status</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($banners as $banner): ?>
                <tr>
                    <td><img class="thumb" src="<?= e(upload_url($banner['image_path'])) ?>" alt=""></td>
                    <td><?= e($banner['title'] ?: 'Sem titulo') ?></td>
                    <td><?= (int) $banner['display_order'] ?></td>
                    <td><span class="badge <?= $banner['active'] ? 'badge-on' : 'badge-off' ?>"><?= $banner['active'] ? 'Ativo' : 'Inativo' ?></span></td>
                    <td class="actions">
                        <a class="btn" href="<?= e(app_url('/admin/banners/edit.php?id=' . (int) $banner['id'])) ?>">Editar</a>
                        <form method="post" action="<?= e(app_url('/admin/banners/delete.php')) ?>" onsubmit="return confirm('Excluir este banner?')">
                            <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int) $banner['id'] ?>">
                            <button class="btn btn-danger" type="submit">Excluir</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
