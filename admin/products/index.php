<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Product.php';

$admin = require_admin();
$pageTitle = 'Produtos';
$pageSubtitle = 'Controle os itens que aparecem na vitrine, preços, estoque e destaques.';
$products = ProductModel::all();
require __DIR__ . '/../../includes/layout/header.php';
?>
<div class="card">
    <div class="card-header">
        <div>
            <h2 class="section-title">Catálogo</h2>
            <p class="muted">Produtos exibidos no frontend.</p>
        </div>
        <a class="btn btn-primary" href="<?= e(app_url('/admin/products/create.php')) ?>">Novo produto</a>
    </div>
    <?php if (!$products): ?>
        <div class="empty-state">
            <h3 class="section-title">Nenhum produto cadastrado</h3>
            <p class="muted">Cadastre o primeiro produto para começar a montar sua vitrine.</p>
            <a class="btn btn-primary" href="<?= e(app_url('/admin/products/create.php')) ?>">Cadastrar produto</a>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Imagem</th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?php if ($product['image_path']): ?><img class="thumb" src="<?= e(upload_url($product['image_path'])) ?>" alt="Imagem de <?= e($product['name']) ?>"><?php endif; ?></td>
                        <td><strong><?= e($product['name']) ?></strong><br><span class="muted"><?= e($product['slug']) ?></span></td>
                        <td><?= e($product['category_name'] ?? 'Sem categoria') ?></td>
                        <td><?= format_money((float) $product['price']) ?></td>
                        <td><?= $product['stock'] === null ? 'Sob consulta' : (int) $product['stock'] ?></td>
                        <td><span class="badge <?= $product['active'] ? 'badge-on' : 'badge-off' ?>"><?= $product['active'] ? 'Ativo' : 'Inativo' ?></span></td>
                        <td class="actions">
                            <a class="btn" href="<?= e(app_url('/admin/products/edit.php?id=' . (int) $product['id'])) ?>">Editar</a>
                            <form method="post" action="<?= e(app_url('/admin/products/delete.php')) ?>" onsubmit="return confirm('Excluir este produto?')">
                                <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int) $product['id'] ?>">
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
