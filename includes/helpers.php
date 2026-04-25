<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/app.php';

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): never
{
    header('Location: ' . app_url($path));
    exit;
}

function app_base_url(): string
{
    $scriptName = trim((string) ($_SERVER['SCRIPT_NAME'] ?? ''), '/');
    $segments = $scriptName === '' ? [] : explode('/', $scriptName);
    $firstSegment = $segments[0] ?? '';

    if ($firstSegment !== '' && !in_array($firstSegment, ['admin', 'api', 'index.php'], true)) {
        return '/' . $firstSegment;
    }

    return '';
}

function app_url(string $path = ''): string
{
    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return $path;
    }

    $base = app_base_url();
    $cleanPath = '/' . ltrim($path, '/');

    return $base . ($cleanPath === '/' ? '' : $cleanPath);
}

function money_to_decimal(string $value): float
{
    $normalized = str_replace(['R$', ' ', '.'], '', $value);
    $normalized = str_replace(',', '.', $normalized);
    return round((float) $normalized, 2);
}

function format_money(float $value): string
{
    return 'R$ ' . number_format($value, 2, ',', '.');
}

function slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text) ?: $text;
    $text = preg_replace('/[^a-zA-Z0-9]+/', '-', $text) ?? '';
    $text = trim($text, '-');
    return strtolower($text) ?: bin2hex(random_bytes(4));
}

function normalize_whatsapp(string $value): string
{
    return preg_replace('/\D+/', '', $value) ?? '';
}

function json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function upload_url(?string $path): ?string
{
    if (!$path) {
        return null;
    }

    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return $path;
    }

    if (str_starts_with($path, '/')) {
        return app_url($path);
    }

    return app_url(UPLOAD_BASE_URL . '/' . ltrim($path, '/'));
}
