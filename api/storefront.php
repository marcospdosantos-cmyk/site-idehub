<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../models/Banner.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Product.php';

try {
    $settings = Setting::get();
    $categories = array_map(static fn(array $category): array => [
        'id' => (int) $category['id'],
        'name' => $category['name'],
        'slug' => $category['slug'],
    ], Category::all(true));

    Banner::syncDefaultHeroBanners();
    $banners = array_map(static fn(array $banner): array => [
        'id' => (int) $banner['id'],
        'image' => upload_url($banner['image_path']),
        'eyebrow' => $banner['eyebrow'],
        'title' => $banner['title'],
        'subtitle' => $banner['subtitle'],
        'trustText' => $banner['trust_text'],
        'primaryCta' => $banner['primary_cta'],
        'secondaryCta' => $banner['secondary_cta'],
        'sideKicker' => $banner['side_kicker'],
        'sideTitle' => $banner['side_title'],
        'sideText' => $banner['side_text'],
        'linkUrl' => $banner['link_url'],
    ], Banner::all(true, 3));

    $products = array_map(static function (array $product): array {
        $image = upload_url($product['image_path']);
        $colors = array_values(array_filter(array_map('trim', explode(',', (string) $product['colors']))));
        $sizes = array_values(array_filter(array_map('trim', explode(',', (string) $product['sizes']))));

        return [
            'id' => (string) $product['id'],
            'name' => $product['name'],
            'slug' => $product['slug'],
            'category' => $product['category_name'] ?? 'Sem categoria',
            'description' => $product['short_description'],
            'fullDescription' => $product['full_description'],
            'price' => (float) $product['price'],
            'promotionalPrice' => $product['promotional_price'] !== null ? (float) $product['promotional_price'] : null,
            'featured' => (bool) $product['featured'],
            'stock' => $product['stock'] !== null ? (int) $product['stock'] : null,
            'sizes' => $sizes ?: null,
            'colors' => $colors ?: null,
            'isKit' => (bool) $product['is_kit'],
            'imageSeed' => $product['slug'],
            'imagesByColor' => $image ? ['Principal' => [$image]] : null,
            'image' => $image,
        ];
    }, ProductModel::all(true));

    json_response([
        'settings' => [
            'storeName' => $settings['store_name'],
            'logo' => upload_url($settings['logo_path']),
            'favicon' => upload_url($settings['favicon_path']),
            'whatsappNumber' => $settings['whatsapp_number'],
            'footerText' => $settings['footer_text'],
            'primaryColor' => $settings['primary_color'],
            'secondaryColor' => $settings['secondary_color'],
            'address' => $settings['address'],
            'email' => $settings['email'],
            'instagram' => $settings['instagram'],
        ],
        'banners' => $banners,
        'categories' => $categories,
        'products' => $products,
    ]);
} catch (Throwable $exception) {
    json_response(['error' => 'Não foi possível carregar a loja.'], 500);
}
