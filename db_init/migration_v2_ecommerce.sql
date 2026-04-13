ALTER TABLE products
  ADD COLUMN slug VARCHAR(255) NULL AFTER name,
  ADD COLUMN sku VARCHAR(100) NULL AFTER slug,
  ADD COLUMN short_description VARCHAR(500) NULL AFTER description,
  ADD COLUMN stock INT NOT NULL DEFAULT 0 AFTER price,
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER stock;

ALTER TABLE products
  ADD UNIQUE KEY uq_products_slug (slug),
  ADD UNIQUE KEY uq_products_sku (sku);

ALTER TABLE orders
  ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER user_id,
  ADD COLUMN shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER subtotal,
  ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'eur' AFTER total,
  ADD COLUMN payment_status ENUM('unpaid','pending','paid','failed','refunded') NOT NULL DEFAULT 'unpaid' AFTER status,
  ADD COLUMN payment_method VARCHAR(50) NULL AFTER payment_status,
  ADD COLUMN stripe_checkout_session_id VARCHAR(255) NULL AFTER payment_method,
  ADD COLUMN stripe_payment_intent_id VARCHAR(255) NULL AFTER stripe_checkout_session_id,
  ADD COLUMN customer_nom VARCHAR(100) NULL AFTER stripe_payment_intent_id,
  ADD COLUMN customer_prenom VARCHAR(100) NULL AFTER customer_nom,
  ADD COLUMN customer_email VARCHAR(150) NULL AFTER customer_prenom,
  ADD COLUMN shipping_address_line1 VARCHAR(255) NULL AFTER customer_email,
  ADD COLUMN shipping_address_line2 VARCHAR(255) NULL AFTER shipping_address_line1,
  ADD COLUMN shipping_postal_code VARCHAR(20) NULL AFTER shipping_address_line2,
  ADD COLUMN shipping_city VARCHAR(100) NULL AFTER shipping_postal_code,
  ADD COLUMN shipping_country VARCHAR(100) NULL AFTER shipping_city,
  ADD COLUMN billing_same_as_shipping TINYINT(1) NOT NULL DEFAULT 1 AFTER shipping_country,
  ADD COLUMN paid_at DATETIME NULL AFTER billing_same_as_shipping,
  ADD COLUMN shipped_at DATETIME NULL AFTER paid_at;

ALTER TABLE order_items
  ADD COLUMN product_name VARCHAR(255) NULL AFTER product_id,
  ADD COLUMN product_image VARCHAR(255) NULL AFTER product_name,
  ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER product_image,
  ADD COLUMN line_total DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER unit_price;