<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Category.php';

$admin = require_admin();
$pageTitle = 'Categorias';
$pageSubtitle = 'Organize o menu e os filtros da loja para facilitar a navegação.';
$categories = Category::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="card-header">
        <div>
            <h2 class="section-title">Lista de categorias</h2>
            <p class="muted">Categorias usadas no menu, filtros e agrupamento do catálogo.</p>
        </div>
        <a class="btn btn-primary" href="<?= e(app_url('/admin/categories/create.php')) ?>">Nova categoria</a>
    </div>
    <?php if (!$categories): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhuma categoria cadastrada</h3>
            <p class="muted">Crie categorias para deixar o catálogo mais claro e fácil de filtrar.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/admin/categories/create.php')) ?>">Criar categoria</a>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Nome</th><th>Slug</th><th>Ordem</th><th>Status</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($categories as $category): ?>
                    <tr>
                        <td><strong><?= e($category['name']) ?></strong></td>
                        <td><?= e($category['slug']) ?></td>
                        <td><?= (int) $category['display_order'] ?></td>
                        <td><span class="badge <?= $category['active'] ? 'badge-on' : 'badge-off' ?>"><?= $category['active'] ? 'Ativo' : 'Inativo' ?></span></td>
                        <td class="actions">
                            <a class="btn" href="<?= e(app_url('/admin/categories/edit.php?id=' . (int) $category['id'])) ?>">Editar</a>
                            <form method="post" action="<?= e(app_url('/admin/categories/delete.php')) ?>" onsubmit="return confirm('Excluir esta categoria? Produtos vinculados ficarão sem categoria.')">
                                <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int) $category['id'] ?>">
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
