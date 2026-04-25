<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../includes/upload.php';
require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../models/Category.php';

$admin = require_admin();
$categories = Category::all();
$id = (int) ($_GET['id'] ?? 0);
$product = ProductModel::find($id);
if (!$product) {
    redirect('/admin/products/index.php');
}

$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    try {
        $imagePath = handle_image_upload('image', 'products', $product['image_path']);
        $name = trim((string) ($_POST['name'] ?? ''));
        $price = money_to_decimal((string) ($_POST['price'] ?? '0'));

        if ($name === '' || $price <= 0) {
            throw new RuntimeException('Nome e preço são obrigatórios.');
        }

        ProductModel::update($id, [
            'category_id' => (int) ($_POST['category_id'] ?? 0),
            'name' => $name,
            'slug' => trim((string) ($_POST['slug'] ?? '')) ?: slugify($name),
            'image_path' => $imagePath,
            'short_description' => trim((string) ($_POST['short_description'] ?? '')),
            'full_description' => trim((string) ($_POST['full_description'] ?? '')),
            'price' => $price,
            'promotional_price' => trim((string) ($_POST['promotional_price'] ?? '')) !== '' ? money_to_decimal((string) $_POST['promotional_price']) : null,
            'featured' => isset($_POST['featured']) ? 1 : 0,
            'stock' => trim((string) ($_POST['stock'] ?? '')),
            'sizes' => trim((string) ($_POST['sizes'] ?? '')),
            'colors' => trim((string) ($_POST['colors'] ?? '')),
            'is_kit' => isset($_POST['is_kit']) ? 1 : 0,
            'active' => isset($_POST['active']) ? 1 : 0,
        ]);
        redirect('/admin/products/index.php');
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
        $product = array_merge($product, $_POST);
    }
}

$pageTitle = 'Editar produto';
require __DIR__ . '/../../includes/layout/header.php';
require __DIR__ . '/form.php';
require __DIR__ . '/../../includes/layout/footer.php';
