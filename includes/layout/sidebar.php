<?php

$currentPath = $_SERVER['SCRIPT_NAME'] ?? '';

function nav_active(string $needle, string $currentPath): string
{
    return str_contains($currentPath, $needle) ? ' active' : '';
}
?>
<aside class="sidebar">
    <div class="brand">Ide.hub Admin</div>
    <nav>
        <a class="nav-link<?= nav_active('/admin/index.php', $currentPath) ?>" href="<?= e(app_url('/admin/index.php')) ?>">Dashboard</a>
        <a class="nav-link<?= nav_active('/admin/settings.php', $currentPath) ?>" href="<?= e(app_url('/admin/settings.php')) ?>">Configurações</a>
        <a class="nav-link<?= nav_active('/admin/banners/', $currentPath) ?>" href="<?= e(app_url('/admin/banners/index.php')) ?>">Banners</a>
        <a class="nav-link<?= nav_active('/admin/categories/', $currentPath) ?>" href="<?= e(app_url('/admin/categories/index.php')) ?>">Categorias</a>
        <a class="nav-link<?= nav_active('/admin/products/', $currentPath) ?>" href="<?= e(app_url('/admin/products/index.php')) ?>">Produtos</a>
        <a class="nav-link<?= nav_active('/admin/orders/', $currentPath) ?>" href="<?= e(app_url('/admin/orders/index.php')) ?>">Pedidos</a>
    </nav>
</aside>
