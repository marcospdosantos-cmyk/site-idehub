<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/csrf.php';
require_once __DIR__ . '/../../models/Order.php';

$admin = require_admin();
verify_csrf();

OrderModel::delete((int) ($_POST['id'] ?? 0));

redirect('/admin/orders/index.php');
