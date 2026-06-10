-- ============================================================
-- 电商增长分析 - ETL 宽表构建
-- 目的：将多表关联为订单宽表，供下游指标计算使用
-- ============================================================

-- 订单宽表：关联客户、订单、支付、评价、商品、品类
CREATE OR REPLACE VIEW v_order_wide AS
SELECT
    -- 订单维度
    o.order_id,
    o.order_status,
    o.order_purchase_timestamp      AS order_time,
    o.order_approved_at             AS approve_time,
    o.order_delivered_carrier_date  AS ship_time,
    o.order_delivered_customer_date AS deliver_time,
    o.order_estimated_delivery_date AS estimate_time,

    -- 客户维度
    c.customer_id,
    c.customer_unique_id,
    c.customer_city,
    c.customer_state,

    -- 商品维度
    oi.product_id,
    oi.order_item_id,
    oi.seller_id,
    p.product_category_name,
    ct.product_category_name_english AS category_en,
    p.product_weight_g,

    -- 金额
    oi.price,
    oi.freight_value,
    op.payment_type,
    op.payment_installments,
    op.payment_value,

    -- 评价
    or2.review_score

FROM orders o
JOIN customers c           ON o.customer_id = c.customer_id
LEFT JOIN order_items oi   ON o.order_id = oi.order_id
LEFT JOIN products p       ON oi.product_id = p.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.product_category_name
LEFT JOIN order_payments op ON o.order_id = op.order_id
LEFT JOIN order_reviews or2 ON o.order_id = or2.order_id
WHERE o.order_status NOT IN ('canceled', 'unavailable');


-- 客户首单表：用于留存分析的 cohort 基准
CREATE OR REPLACE VIEW v_customer_first_order AS
SELECT
    customer_unique_id,
    MIN(DATE(order_purchase_timestamp)) AS first_order_date,
    MIN(order_purchase_timestamp)       AS first_order_ts
FROM orders
WHERE order_status NOT IN ('canceled', 'unavailable')
GROUP BY customer_unique_id;


-- 日级活跃表：从行为日志聚合 DAU
CREATE OR REPLACE VIEW v_daily_active AS
SELECT
    DATE(event_timestamp) AS active_date,
    COUNT(DISTINCT customer_id) AS dau,
    COUNT(DISTINCT session_id)  AS sessions,
    COUNT(*) AS total_events
FROM user_behavior_log
GROUP BY DATE(event_timestamp);
