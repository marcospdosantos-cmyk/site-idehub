<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Coupon.php';

$admin = require_admin();
verify_csrf();

$id = (int) ($_POST['id'] ?? 0);
$active = (int) ($_POST['active'] ?? 0) === 1;

if ($id > 0) {
    Coupon::setActive($id, $active);
}

redirect('/admin/coupons/index.php');
