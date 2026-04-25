<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

start_secure_session();

if (current_admin()) {
    redirect('/admin/index.php');
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL) ?: '';
    $password = (string) ($_POST['password'] ?? '');

    if ($email && $password && login_admin($email, $password)) {
        redirect('/admin/index.php');
    }

    $error = 'E-mail ou senha inválidos.';
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login | Ide.hub Admin</title>
    <style>
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f7f9; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #111827; }
        .box { width: min(420px, calc(100vw - 32px)); background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px; box-shadow: 0 20px 60px rgba(15,23,42,.08); }
        h1 { margin: 0 0 6px; font-size: 26px; }
        p { margin: 0 0 22px; color: #6b7280; }
        label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 750; }
        input { width: 100%; box-sizing: border-box; padding: 13px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; font: inherit; }
        button { width: 100%; min-height: 46px; border: 0; border-radius: 999px; background: #f97316; color: #fff; font-weight: 800; cursor: pointer; }
        .error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 10px 12px; border-radius: 8px; margin-bottom: 16px; }
        .hint { margin-top: 16px; font-size: 13px; color: #6b7280; }
    </style>
</head>
<body>
    <form class="box" method="post">
        <h1>Entrar no painel</h1>
        <p>Gerencie produtos, banners e pedidos da loja.</p>
        <?php if ($error): ?><div class="error"><?= e($error) ?></div><?php endif; ?>
        <?= csrf_field() ?>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required autocomplete="email" value="<?= e($_POST['email'] ?? '') ?>">
        <label for="password">Senha</label>
        <input id="password" name="password" type="password" required autocomplete="current-password">
        <button type="submit">Acessar</button>
        <div class="hint">Primeiro acesso: admin@admin.com / admin123. Altere a senha depois de instalar.</div>
    </form>
</body>
</html>
