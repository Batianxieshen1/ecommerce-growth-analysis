-- ============================================================
-- 电商增长分析 - 数据库建表脚本
-- 数据源：Olist Brazilian E-Commerce Public Dataset
-- ============================================================

-- 1. 客户表
CREATE TABLE IF NOT EXISTS customers (
    customer_id              VARCHAR(32) PRIMARY KEY,
    customer_unique_id       VARCHAR(32) NOT NULL,
    customer_zip_code_prefix INTEGER,
    customer_city            VARCHAR(100),
    customer_state           VARCHAR(2)
);

-- 2. 订单主表
CREATE TABLE IF NOT EXISTS orders (
    order_id                      VARCHAR(32) PRIMARY KEY,
    customer_id                   VARCHAR(32) NOT NULL,
    order_status                  VARCHAR(20),
    order_purchase_timestamp      TIMESTAMP,
    order_approved_at             TIMESTAMP,
    order_delivered_carrier_date  TIMESTAMP,
    order_delivered_customer_date TIMESTAMP,
    order_estimated_delivery_date TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 3. 订单商品表
CREATE TABLE IF NOT EXISTS order_items (
    order_id            VARCHAR(32) NOT NULL,
    order_item_id       INTEGER NOT NULL,
    product_id          VARCHAR(32) NOT NULL,
    seller_id           VARCHAR(32) NOT NULL,
    shipping_limit_date TIMESTAMP,
    price               DECIMAL(10,2),
    freight_value       DECIMAL(10,2),
    PRIMARY KEY (order_id, order_item_id)
);

-- 4. 支付表
CREATE TABLE IF NOT EXISTS order_payments (
    order_id             VARCHAR(32) NOT NULL,
    payment_sequential   INTEGER NOT NULL,
    payment_type         VARCHAR(20),
    payment_installments INTEGER,
    payment_value        DECIMAL(10,2),
    PRIMARY KEY (order_id, payment_sequential)
);

-- 5. 评价表
CREATE TABLE IF NOT EXISTS order_reviews (
    review_id               VARCHAR(32) PRIMARY KEY,
    order_id                VARCHAR(32) NOT NULL,
    review_score            INTEGER,
    review_comment_title    TEXT,
    review_comment_message  TEXT,
    review_creation_date    TIMESTAMP,
    review_answer_timestamp TIMESTAMP
);

-- 6. 商品表
CREATE TABLE IF NOT EXISTS products (
    product_id                 VARCHAR(32) PRIMARY KEY,
    product_category_name      VARCHAR(100),
    product_name_lenght        INTEGER,
    product_description_lenght INTEGER,
    product_photos_qty         INTEGER,
    product_weight_g           INTEGER,
    product_length_cm          INTEGER,
    product_height_cm          INTEGER,
    product_width_cm           INTEGER
);

-- 7. 卖家表
CREATE TABLE IF NOT EXISTS sellers (
    seller_id              VARCHAR(32) PRIMARY KEY,
    seller_zip_code_prefix INTEGER,
    seller_city            VARCHAR(100),
    seller_state           VARCHAR(2)
);

-- 8. 地理位置表
CREATE TABLE IF NOT EXISTS geolocation (
    geolocation_zip_code_prefix INTEGER,
    geolocation_lat             DECIMAL(10,6),
    geolocation_lng             DECIMAL(10,6),
    geolocation_city            VARCHAR(100),
    geolocation_state           VARCHAR(2)
);

-- 9. 品类翻译表
CREATE TABLE IF NOT EXISTS category_translation (
    product_category_name         VARCHAR(100) PRIMARY KEY,
    product_category_name_english VARCHAR(100)
);

-- 10. 模拟行为日志表（访问/浏览/加购/下单/支付/复访）
CREATE TABLE IF NOT EXISTS user_behavior_log (
    log_id          SERIAL PRIMARY KEY,
    customer_id     VARCHAR(32),
    session_id      VARCHAR(32),
    event_type      VARCHAR(20),  -- visit / view / add_to_cart / order / payment / revisit
    event_timestamp TIMESTAMP,
    product_id      VARCHAR(32),
    device          VARCHAR(10),  -- mobile / desktop
    source          VARCHAR(20)  -- organic / paid / social / direct
);
