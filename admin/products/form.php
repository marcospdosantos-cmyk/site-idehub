<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<form class="card" method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Nome</label>
            <input name="name" required value="<?= e($product['name']) ?>">
        </div>
        <div class="form-row">
            <label>Slug opcional</label>
            <input name="slug" value="<?= e($product['slug']) ?>">
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Categoria</label>
            <select name="category_id">
                <option value="">Sem categoria</option>
                <?php foreach ($categories as $category): ?>
                    <option value="<?= (int) $category['id'] ?>" <?= (int) ($product['category_id'] ?? 0) === (int) $category['id'] ? 'selected' : '' ?>>
                        <?= e($category['name']) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-row">
            <label>Imagem</label>
            <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif">
            <?php if (!empty($product['image_path'])): ?><p class="muted">Atual: <?= e($product['image_path']) ?></p><?php endif; ?>
        </div>
    </div>
    <div class="form-row">
        <label>Descrição curta</label>
        <input name="short_description" required value="<?= e($product['short_description']) ?>">
    </div>
    <div class="form-row">
        <label>Descrição completa opcional</label>
        <textarea name="full_description"><?= e($product['full_description']) ?></textarea>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Preço</label>
            <input name="price" required value="<?= e((string) $product['price']) ?>">
        </div>
        <div class="form-row">
            <label>Preço promocional opcional</label>
            <input name="promotional_price" value="<?= e((string) $product['promotional_price']) ?>">
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Estoque opcional</label>
            <input type="number" name="stock" value="<?= e((string) $product['stock']) ?>">
        </div>
        <div class="form-row">
            <label>Tamanhos separados por vírgula</label>
            <input name="sizes" placeholder="P,M,G,GG" value="<?= e($product['sizes']) ?>">
        </div>
    </div>
    <div class="form-row">
        <label>Cores separadas por vírgula</label>
        <input name="colors" placeholder="Off white,Preto" value="<?= e($product['colors']) ?>">
    </div>
    <div class="actions">
        <label class="check-row"><input type="checkbox" name="featured" <?= !empty($product['featured']) ? 'checked' : '' ?>> Destaque</label>
        <label class="check-row"><input type="checkbox" name="is_kit" <?= !empty($product['is_kit']) ? 'checked' : '' ?>> Kit</label>
        <label class="check-row"><input type="checkbox" name="active" <?= !empty($product['active']) ? 'checked' : '' ?>> Ativo</label>
    </div>
    <div class="actions" style="margin-top:18px">
        <button class="btn btn-primary" type="submit">Salvar</button>
        <a class="btn" href="<?= e(app_url('/admin/products/index.php')) ?>">Cancelar</a>
    </div>
</form>
