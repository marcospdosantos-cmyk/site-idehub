<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

function handle_image_upload(string $field, string $folder, ?string $currentPath = null): ?string
{
    if (empty($_FILES[$field]) || !is_array($_FILES[$field])) {
        return $currentPath;
    }

    $file = $_FILES[$field];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return $currentPath;
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Falha ao enviar imagem.');
    }

    if (($file['size'] ?? 0) > 4 * 1024 * 1024) {
        throw new RuntimeException('Imagem muito grande. O limite e 4 MB.');
    }

    $tmpName = $file['tmp_name'] ?? '';
    $info = getimagesize($tmpName);

    if (!$info) {
        throw new RuntimeException('Arquivo enviado não é uma imagem válida.');
    }

    $allowed = [
        IMAGETYPE_JPEG => 'jpg',
        IMAGETYPE_PNG => 'png',
        IMAGETYPE_WEBP => 'webp',
        IMAGETYPE_GIF => 'gif',
    ];

    $imageType = $info[2] ?? null;
    if (!isset($allowed[$imageType])) {
        throw new RuntimeException('Formato inválido. Use JPG, PNG, WEBP ou GIF.');
    }

    $targetDir = UPLOAD_BASE_PATH . '/' . trim($folder, '/');
    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
        throw new RuntimeException('Não foi possível criar a pasta de uploads.');
    }

    if (!is_writable($targetDir)) {
        throw new RuntimeException('A pasta de uploads não está com permissão de escrita: ' . $targetDir);
    }

    $filename = date('YmdHis') . '-' . bin2hex(random_bytes(6)) . '.' . $allowed[$imageType];
    $targetPath = $targetDir . '/' . $filename;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        throw new RuntimeException('Não foi possível salvar a imagem enviada.');
    }

    chmod($targetPath, 0644);

    return trim($folder, '/') . '/' . $filename;
}
