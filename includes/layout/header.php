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
        :root {
            --orange: #f2752f;
            --orange-strong: #f2752f;
            --ink: #111827;
            --muted: #667085;
            --line: #e5e7eb;
            --soft-line: #eef2f7;
            --bg: #f5f6f8;
            --surface: #ffffff;
            --surface-soft: #f9fafb;
            --success-bg: #dcfce7;
            --success-text: #166534;
            --danger-bg: #fef2f2;
            --danger-text: #991b1b;
            --radius: 8px;
            --shadow: 0 18px 50px rgba(15, 23, 42, .07);
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--bg); font-size: 15px; line-height: 1.5; }
        a { color: inherit; text-decoration: none; }
        button, input, textarea, select { font: inherit; }
        button, .btn, input, textarea, select { touch-action: manipulation; }
        :focus-visible { outline: 3px solid rgba(242, 117, 47, .32); outline-offset: 2px; }
        .admin-shell { display: grid; grid-template-columns: 270px minmax(0, 1fr); min-height: 100vh; }
        .sidebar { position: sticky; top: 0; align-self: start; min-height: 100vh; background: #101112; color: #fff; padding: 22px; }
        .brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 850; margin-bottom: 8px; letter-spacing: 0; }
        .brand-mark { display: grid; place-items: center; width: 38px; height: 38px; border-radius: var(--radius); background: var(--orange); color: #fff; font-weight: 900; }
        .brand-subtitle { margin: 0 0 24px 48px; color: #a8b0bd; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .sidebar nav { display: grid; gap: 6px; }
        .nav-link { display: flex; align-items: center; min-height: 44px; padding: 11px 12px; border-radius: var(--radius); color: #d5d9df; font-weight: 700; transition: background .18s ease, color .18s ease, transform .18s ease; }
        .nav-link:hover, .nav-link.active { background: rgba(255,255,255,.1); color: #fff; }
        .nav-link.active { box-shadow: inset 3px 0 0 var(--orange); }
        .main { min-width: 0; padding: 30px; }
        .topbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
        .topbar h1 { margin: 0; font-size: clamp(26px, 3vw, 34px); line-height: 1.1; letter-spacing: 0; }
        .topbar p { margin: 8px 0 0; max-width: 720px; }
        .muted { color: var(--muted); }
        .card { background: var(--surface); border: 1px solid var(--soft-line); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); }
        .card h2 { margin: 0 0 14px; font-size: 20px; line-height: 1.2; }
        .section-title { margin: 0; font-size: 18px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 18px; }
        .card-header p { margin: 4px 0 0; }
        .grid { display: grid; gap: 16px; }
        .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .stat-card { position: relative; overflow: hidden; }
        .stat-card::after { content: ""; position: absolute; right: -28px; bottom: -34px; width: 98px; height: 98px; border-radius: 999px; background: rgba(242, 117, 47, .1); }
        .stat-label { color: var(--muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
        .stat { font-size: 36px; font-weight: 900; margin-top: 8px; line-height: 1; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: #fff; cursor: pointer; font-weight: 800; transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(15, 23, 42, .08); }
        .btn-primary { border-color: var(--orange); background: var(--orange); color: #fff; box-shadow: 0 14px 28px rgba(242, 117, 47, .22); }
        .btn-primary:hover { background: var(--orange-strong); border-color: var(--orange-strong); }
        .btn-danger { border-color: #fecaca; background: var(--danger-bg); color: #b91c1c; }
        .btn-ghost { background: var(--surface-soft); }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .actions-between { justify-content: space-between; align-items: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 13px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: middle; }
        th { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); background: var(--surface-soft); }
        tbody tr:hover { background: #fff7ed; }
        input, textarea, select { width: 100%; min-height: 46px; padding: 12px 13px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; color: var(--ink); }
        input:hover, textarea:hover, select:hover { border-color: #cbd5e1; }
        input:focus, textarea:focus, select:focus { border-color: var(--orange); box-shadow: 0 0 0 4px rgba(242, 117, 47, .12); outline: 0; }
        textarea { min-height: 110px; resize: vertical; }
        label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 800; }
        .form-row { margin-bottom: 16px; }
        .field-hint { margin: 7px 0 0; color: var(--muted); font-size: 13px; }
        .check-row { display: flex; gap: 10px; align-items: center; min-height: 44px; padding: 10px 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface-soft); font-weight: 800; }
        .check-row input { width: 18px; height: 18px; min-height: 18px; accent-color: var(--orange); }
        .alert { padding: 12px 14px; border-radius: var(--radius); margin-bottom: 16px; font-weight: 700; }
        .alert-error { background: var(--danger-bg); color: var(--danger-text); border: 1px solid #fecaca; }
        .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .thumb { width: 78px; height: 58px; object-fit: cover; border-radius: 6px; border: 1px solid var(--line); background: #f3f4f6; }
        .badge { display: inline-flex; align-items: center; min-height: 26px; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; background: #f3f4f6; color: #374151; }
        .badge-on { background: var(--success-bg); color: var(--success-text); }
        .badge-off { background: #fee2e2; color: var(--danger-text); }
        .empty-state { padding: 34px 18px; text-align: center; border: 1px dashed #d7dde6; border-radius: var(--radius); background: var(--surface-soft); }
        .empty-state p { margin: 6px auto 18px; max-width: 420px; }
        .details-list { display: grid; gap: 10px; margin: 0; }
        .details-list p { margin: 0; }
        .details-list + .btn { margin-top: 18px; }
        .table-wrap { width: 100%; overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--soft-line); }
        .table-wrap table { min-width: 740px; }
        @media (max-width: 1100px) { .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 900px) {
            .admin-shell { grid-template-columns: 1fr; }
            .sidebar { position: static; min-height: auto; padding: 18px; }
            .brand-subtitle { margin-bottom: 14px; }
            .sidebar nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .main { padding: 20px; }
            .topbar { flex-direction: column; align-items: stretch; }
            .topbar .actions { width: 100%; }
            .topbar .btn { flex: 1; }
            .grid-4, .grid-2 { grid-template-columns: 1fr; }
            .card-header, .actions-between { align-items: stretch; flex-direction: column; }
        }
        @media (max-width: 520px) {
            body { font-size: 14px; }
            .sidebar nav { grid-template-columns: 1fr; }
            .main { padding: 16px; }
            .card { padding: 16px; }
            .actions .btn, .actions button { width: 100%; }
        }
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
                    <a class="btn btn-ghost" href="<?= e(app_url('/')) ?>" target="_blank">Ver site</a>
                    <a class="btn" href="<?= e(app_url('/admin/logout.php')) ?>">Sair</a>
                </div>
            <?php endif; ?>
        </div>
