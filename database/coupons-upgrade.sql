ALTER TABLE orders
  ADD COLUMN coupon_code VARCHAR(60) NULL AFTER payment_method,
  ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER coupon_code,
  ADD COLUMN discount_total DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER subtotal;

UPDATE orders SET subtotal = total WHERE subtotal = 0;

CREATE TABLE IF NOT EXISTS coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  discount_type ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  usage_limit INT UNSIGNED NULL,
  used_count INT UNSIGNED NOT NULL DEFAULT 0,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupons_code_active (code, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
