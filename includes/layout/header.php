<?php

declare(strict_types=1);

require_once __DIR__ . '/../helpers.php';

$pageTitle = $pageTitle ?? 'Painel';
$admin = $admin ?? null;
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($pageTitle) ?> | Ide.hub Admin</title>
    <style>
        :root { --orange: #f97316; --ink: #111827; --muted: #6b7280; --line: #e5e7eb; --bg: #f6f7f9; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); }
        a { color: inherit; text-decoration: none; }
        .admin-shell { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; }
        .sidebar { background: #111; color: #fff; padding: 24px; }
        .brand { font-size: 20px; font-weight: 800; margin-bottom: 28px; }
        .nav-link { display: block; padding: 11px 12px; border-radius: 8px; color: #d1d5db; margin-bottom: 6px; font-weight: 650; }
        .nav-link:hover, .nav-link.active { background: rgba(255,255,255,.1); color: #fff; }
        .main { padding: 28px; }
        .topbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; }
        .topbar h1 { margin: 0; font-size: 28px; }
        .muted { color: var(--muted); }
        .card { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 20px; box-shadow: 0 10px 30px rgba(15,23,42,.04); }
        .grid { display: grid; gap: 16px; }
        .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .stat { font-size: 32px; font-weight: 850; margin-top: 8px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--line); background: #fff; cursor: pointer; font-weight: 750; }
        .btn-primary { border-color: var(--orange); background: var(--orange); color: #fff; }
        .btn-danger { border-color: #fee2e2; background: #fef2f2; color: #b91c1c; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 13px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: middle; }
        th { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
        input, textarea, select { width: 100%; padding: 12px; border: 1px solid var(--line); border-radius: 8px; font: inherit; background: #fff; }
        textarea { min-height: 110px; resize: vertical; }
        label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 750; }
        .form-row { margin-bottom: 16px; }
        .alert { padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; }
        .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .thumb { width: 72px; height: 54px; object-fit: cover; border: 1px solid var(--line); background: #f3f4f6; }
        .badge { display: inline-flex; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 750; background: #f3f4f6; color: #374151; }
        .badge-on { background: #dcfce7; color: #166534; }
        .badge-off { background: #fee2e2; color: #991b1b; }
        @media (max-width: 900px) { .admin-shell { grid-template-columns: 1fr; } .sidebar { position: static; } .grid-4, .grid-2 { grid-template-columns: 1fr; } .main { padding: 18px; } table { min-width: 760px; } .table-wrap { overflow-x: auto; } }
    </style>
</head>
<body>
<div class="admin-shell">
    <?php require __DIR__ . '/sidebar.php'; ?>
    <main class="main">
        <div class="topbar">
            <div>
                <h1><?= e($pageTitle) ?></h1>
                <?php if (!empty($pageSubtitle)): ?>
                    <p class="muted"><?= e($pageSubtitle) ?></p>
                <?php endif; ?>
            </div>
            <?php if ($admin): ?>
                <div class="actions">
                    <a class="btn" href="<?= e(app_url('/')) ?>" target="_blank">Ver site</a>
                    <a class="btn" href="<?= e(app_url('/admin/logout.php')) ?>">Sair</a>
                </div>
            <?php endif; ?>
        </div>
