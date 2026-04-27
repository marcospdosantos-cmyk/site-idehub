<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../includes/upload.php';
require_once __DIR__ . '/../../models/Banner.php';

$admin = require_admin();
$error = null;
$banner = [
    'eyebrow' => '',
    'title' => '',
    'subtitle' => '',
    'trust_text' => '',
    'primary_cta' => '',
    'secondary_cta' => '',
    'side_kicker' => '',
    'side_title' => '',
    'side_text' => '',
    'link_url' => '',
    'display_order' => 0,
    'active' => 1,
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    try {
        $active = isset($_POST['active']) ? 1 : 0;
        if ($active && Banner::activeCount() >= 3) {
            throw new RuntimeException('O site usa no máximo 3 banners ativos. Desative um banner antes de criar outro ativo.');
        }

        $imagePath = handle_image_upload('image', 'banners');
        if (!$imagePath) {
            throw new RuntimeException('Envie uma imagem para o banner.');
        }

        Banner::create([
            'image_path' => $imagePath,
            'eyebrow' => trim((string) ($_POST['eyebrow'] ?? '')),
            'title' => trim((string) ($_POST['title'] ?? '')),
            'subtitle' => trim((string) ($_POST['subtitle'] ?? '')),
            'trust_text' => trim((string) ($_POST['trust_text'] ?? '')),
            'primary_cta' => trim((string) ($_POST['primary_cta'] ?? '')),
            'secondary_cta' => trim((string) ($_POST['secondary_cta'] ?? '')),
            'side_kicker' => trim((string) ($_POST['side_kicker'] ?? '')),
            'side_title' => trim((string) ($_POST['side_title'] ?? '')),
            'side_text' => trim((string) ($_POST['side_text'] ?? '')),
            'link_url' => trim((string) ($_POST['link_url'] ?? '')),
            'display_order' => (int) ($_POST['display_order'] ?? 0),
            'active' => $active,
        ]);
        redirect('/admin/banners/index.php');
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
        $banner = array_merge($banner, $_POST);
    }
}

$pageTitle = 'Novo banner';
$pageSubtitle = 'Adicione um destaque visual para campanhas, coleções ou chamadas da home.';
require __DIR__ . '/../../includes/layout/header.php';
?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<form class="card" method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <p class="muted">O carrossel da home exibe até 3 banners ativos, na ordem configurada abaixo.</p>
    <div class="form-row"><label>Imagem</label><input type="file" name="image" required accept="image/jpeg,image/png,image/webp,image/gif"><p class="muted">Use imagens horizontais. O site recorta automaticamente para manter todos os banners com a mesma altura.</p></div>
    <div class="form-row"><label>Selo superior</label><input name="eyebrow" maxlength="120" value="<?= e($banner['eyebrow']) ?>" placeholder="Streetwear com propósito"></div>
    <div class="form-row"><label>Título principal</label><input name="title" maxlength="160" value="<?= e($banner['title']) ?>" placeholder="Vista a mensagem. Carregue a presença."></div>
    <div class="form-row"><label>Descrição</label><textarea name="subtitle" rows="3" maxlength="255"><?= e($banner['subtitle']) ?></textarea></div>
    <div class="form-row"><label>Frase de destaque</label><input name="trust_text" maxlength="255" value="<?= e($banner['trust_text']) ?>" placeholder="Peças limitadas por drop. Chame antes de esgotar."></div>
    <div class="grid grid-2">
        <div class="form-row"><label>Botão principal</label><input name="primary_cta" maxlength="80" value="<?= e($banner['primary_cta']) ?>" placeholder="Comprar pelo WhatsApp"></div>
        <div class="form-row"><label>Botão secundário</label><input name="secondary_cta" maxlength="80" value="<?= e($banner['secondary_cta']) ?>" placeholder="Ver coleção"></div>
    </div>
    <div class="grid grid-2">
        <div class="form-row"><label>Cartão lateral - selo</label><input name="side_kicker" maxlength="80" value="<?= e($banner['side_kicker']) ?>" placeholder="Drop ativo"></div>
        <div class="form-row"><label>Cartão lateral - título</label><input name="side_title" maxlength="160" value="<?= e($banner['side_title']) ?>" placeholder="3 caminhos para escolher sua próxima peça."></div>
    </div>
    <div class="form-row"><label>Cartão lateral - texto</label><textarea name="side_text" rows="2" maxlength="255"><?= e($banner['side_text']) ?></textarea></div>
    <div class="form-row"><label>Link do botão principal opcional</label><input name="link_url" value="<?= e($banner['link_url']) ?>" placeholder="https://..."></div>
    <div class="grid grid-2">
        <div class="form-row"><label>Ordem</label><input type="number" name="display_order" value="<?= e((string) $banner['display_order']) ?>"></div>
        <div class="form-row"><label class="check-row"><input type="checkbox" name="active" <?= !empty($banner['active']) ? 'checked' : '' ?>> Ativo</label></div>
    </div>
    <div class="actions"><button class="btn btn-primary" type="submit">Salvar</button><a class="btn" href="<?= e(app_url('/admin/banners/index.php')) ?>">Cancelar</a></div>
</form>
<?php require __DIR__ . '/../../includes/layout/footer.php'; ?>
