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

    try {
        if ($email && $password && login_admin($email, $password)) {
            redirect('/admin/index.php');
        }

        $error = 'E-mail ou senha inválidos.';
    } catch (Throwable) {
        $error = 'Não foi possível conectar ao banco de dados. Inicie o MySQL no XAMPP e tente novamente.';
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login | Ide.hub Admin</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f5f6f8; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #111827; }
        .box { width: min(440px, 100%); background: #fff; border: 1px solid #eef2f7; border-radius: 8px; padding: 30px; box-shadow: 0 24px 70px rgba(15,23,42,.1); }
        .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; font-weight: 900; }
        .mark { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 8px; background: #f2752f; color: #fff; }
        h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.15; }
        p { margin: 0 0 22px; color: #667085; line-height: 1.55; }
        label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 800; }
        input { width: 100%; min-height: 48px; padding: 13px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; font: inherit; }
        input:focus { border-color: #f2752f; box-shadow: 0 0 0 4px rgba(242, 117, 47, .12); outline: 0; }
        button { width: 100%; min-height: 48px; border: 0; border-radius: 999px; background: #f2752f; color: #fff; font-weight: 850; cursor: pointer; box-shadow: 0 16px 30px rgba(242, 117, 47, .22); }
        button:hover { background: #f2752f; }
        .error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 10px 12px; border-radius: 8px; margin-bottom: 16px; font-weight: 700; }
        .hint { margin-top: 16px; font-size: 13px; color: #6b7280; }
        @media (max-width: 480px) { .box { padding: 24px; } h1 { font-size: 24px; } }
    </style>
</head>
<body>
    <form class="box" method="post">
        <div class="brand"><span class="mark">I</span><span>Ide.hub Admin</span></div>
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
