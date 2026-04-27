<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Banner.php';

$admin = require_admin();
$pageTitle = 'Banners';
$pageSubtitle = 'Controle os 3 banners rotativos da home e todos os textos do destaque.';
Banner::syncDefaultHeroBanners();
$banners = Banner::all();
$activeBannerCount = Banner::activeCount();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="card-header">
        <div>
            <h2 class="section-title">Destaques da home</h2>
            <p class="muted">O site exibe no máximo 3 banners ativos. Ativos agora: <?= $activeBannerCount ?>/3.</p>
        </div>
        <a class="btn btn-primary" href="<?= e(app_url('/admin/banners/create.php')) ?>">Novo banner</a>
    </div>
    <?php if (!$banners): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhum banner cadastrado</h3>
            <p class="muted">Adicione banners para destacar coleções, campanhas e chamadas de compra.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/admin/banners/create.php')) ?>">Criar banner</a>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Imagem</th><th>Texto do banner</th><th>Ordem</th><th>Status</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($banners as $banner): ?>
                    <tr>
                        <td><img class="thumb" src="<?= e(upload_url($banner['image_path'])) ?>" alt="Banner <?= e($banner['title'] ?: 'sem título') ?>"></td>
                        <td>
                            <?php if (!empty($banner['eyebrow'])): ?><span class="muted"><?= e($banner['eyebrow']) ?></span><br><?php endif; ?>
                            <strong><?= e($banner['title'] ?: 'Sem título') ?></strong>
                            <?php if (!empty($banner['subtitle'])): ?><br><span class="muted"><?= e($banner['subtitle']) ?></span><?php endif; ?>
                        </td>
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
    <?php endif; ?>
</div>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
