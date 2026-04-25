<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

final class Setting
{
    public static function get(): array
    {
        $stmt = db()->query('SELECT * FROM settings WHERE id = 1');
        $settings = $stmt->fetch();

        if ($settings) {
            return $settings;
        }

        db()->exec("INSERT INTO settings (id, store_name, whatsapp_number) VALUES (1, 'Ide.hub', '5542999488235')");
        return self::get();
    }

    public static function update(array $data): void
    {
        $stmt = db()->prepare(
            'UPDATE settings SET store_name = ?, logo_path = ?, favicon_path = ?, whatsapp_number = ?, footer_text = ?, primary_color = ?, secondary_color = ?, address = ?, email = ?, instagram = ? WHERE id = 1'
        );

        $stmt->execute([
            $data['store_name'],
            $data['logo_path'] ?: null,
            $data['favicon_path'] ?: null,
            $data['whatsapp_number'],
            $data['footer_text'] ?: null,
            $data['primary_color'] ?: null,
            $data['secondary_color'] ?: null,
            $data['address'] ?: null,
            $data['email'] ?: null,
            $data['instagram'] ?: null,
        ]);
    }
}

