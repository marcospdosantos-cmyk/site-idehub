<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/upload.php';
require_once __DIR__ . '/../models/Setting.php';

$admin = require_admin();
$settings = Setting::get();
$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    try {
        $logoPath = handle_image_upload('logo', 'logo', $settings['logo_path']);
        $faviconPath = handle_image_upload('favicon', 'favicon', $settings['favicon_path']);

        $data = [
            'store_name' => trim((string) ($_POST['store_name'] ?? '')),
            'logo_path' => $logoPath,
            'favicon_path' => $faviconPath,
            'whatsapp_number' => normalize_whatsapp((string) ($_POST['whatsapp_number'] ?? '')),
            'footer_text' => trim((string) ($_POST['footer_text'] ?? '')),
            'primary_color' => trim((string) ($_POST['primary_color'] ?? '')),
            'secondary_color' => trim((string) ($_POST['secondary_color'] ?? '')),
            'address' => trim((string) ($_POST['address'] ?? '')),
            'email' => trim((string) ($_POST['email'] ?? '')),
            'instagram' => trim((string) ($_POST['instagram'] ?? '')),
        ];

        if ($data['store_name'] === '' || $data['whatsapp_number'] === '') {
            throw new RuntimeException('Nome da loja e WhatsApp são obrigatórios.');
        }

        Setting::update($data);
        $settings = Setting::get();
        $success = 'Configurações salvas.';
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
    }
}

$pageTitle = 'Configurações';
$pageSubtitle = 'Dados gerais exibidos no site.';
require __DIR__ . '/../includes/layout/header.php';
?>
<?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
<?php if ($success): ?><div class="alert alert-success"><?= e($success) ?></div><?php endif; ?>

<form class="card" method="post" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <div class="card-header">
        <div>
            <h2 class="section-title">Identidade da loja</h2>
            <p class="muted">Essas informações aparecem no site, no rodapé e nos contatos da marca.</p>
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Nome da loja</label>
            <input name="store_name" required value="<?= e($settings['store_name']) ?>">
        </div>
        <div class="form-row">
            <label>WhatsApp com DDI e DDD</label>
            <input name="whatsapp_number" required value="<?= e($settings['whatsapp_number']) ?>">
            <p class="field-hint">Exemplo: 5542999999999</p>
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Logo</label>
            <input type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/gif">
            <?php if ($settings['logo_path']): ?><p class="muted">Atual: <?= e($settings['logo_path']) ?></p><?php endif; ?>
        </div>
        <div class="form-row">
            <label>Favicon</label>
            <input type="file" name="favicon" accept="image/jpeg,image/png,image/webp,image/gif">
            <?php if ($settings['favicon_path']): ?><p class="muted">Atual: <?= e($settings['favicon_path']) ?></p><?php endif; ?>
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Cor principal opcional</label>
            <input name="primary_color" placeholder="#f2752f" value="<?= e($settings['primary_color']) ?>">
        </div>
        <div class="form-row">
            <label>Cor secundária opcional</label>
            <input name="secondary_color" placeholder="#111827" value="<?= e($settings['secondary_color']) ?>">
        </div>
    </div>
    <div class="grid grid-2">
        <div class="form-row">
            <label>Email</label>
            <input type="email" name="email" value="<?= e($settings['email']) ?>">
        </div>
        <div class="form-row">
            <label>Instagram</label>
            <input name="instagram" value="<?= e($settings['instagram']) ?>">
        </div>
    </div>
    <div class="form-row">
        <label>Texto do rodapé</label>
        <textarea name="footer_text"><?= e($settings['footer_text']) ?></textarea>
    </div>
    <div class="form-row">
        <label>Endereço opcional</label>
        <textarea name="address"><?= e($settings['address']) ?></textarea>
    </div>
    <button class="btn btn-primary" type="submit">Salvar configurações</button>
</form>
<?php require __DIR__ . '/../includes/layout/footer.php'; ?>
