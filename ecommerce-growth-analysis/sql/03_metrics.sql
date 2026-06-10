-- ============================================================
-- 电商增长分析 - 核心指标计算
-- 所有指标口径在此定义，确保 SQL / Python / 看板一致
-- ============================================================

-- 1. 月度 GMV 和订单量
CREATE OR REPLACE VIEW v_monthly_gmv AS
SELECT
    DATE_TRUNC('month', order_time) AS month,
    COUNT(DISTINCT order_id)        AS order_count,
    SUM(payment_value)              AS gmv,
    AVG(payment_value)              AS avg_order_value,
    COUNT(DISTINCT customer_unique_id) AS unique_customers
FROM v_order_wide
GROUP BY DATE_TRUNC('month', order_time)
ORDER BY month;


-- 2. 月度 DAU（来自模拟行为日志）
CREATE OR REPLACE VIEW v_monthly_dau AS
SELECT
    DATE_TRUNC('month', active_date) AS month,
    AVG(dau)                         AS avg_dau,
    MAX(dau)                         AS peak_dau
FROM v_daily_active
GROUP BY DATE_TRUNC('month', active_date)
ORDER BY month;


-- 3. 转化漏斗（月度）
-- 口径：visit → view → add_to_cart → order → payment
CREATE OR REPLACE VIEW v_monthly_funnel AS
SELECT
    DATE_TRUNC('month', event_timestamp) AS month,
    event_type,
    COUNT(DISTINCT customer_id) AS users
FROM user_behavior_log
WHERE event_type IN ('visit', 'view', 'add_to_cart', 'order', 'payment')
GROUP BY DATE_TRUNC('month', event_timestamp), event_type
ORDER BY month, event_type;


-- 4. 品类 GMV 排名
CREATE OR REPLACE VIEW v_category_gmv AS
SELECT
    COALESCE(category_en, product_category_name, 'unknown') AS category,
    COUNT(DISTINCT order_id) AS order_count,
    SUM(price)               AS gmv,
    AVG(price)               AS avg_price,
    AVG(review_score)        AS avg_rating
FROM v_order_wide
GROUP BY COALESCE(category_en, product_category_name, 'unknown')
ORDER BY gmv DESC;


-- 5. 地区 GMV 分布
CREATE OR REPLACE VIEW v_region_gmv AS
SELECT
    customer_state,
    COUNT(DISTINCT order_id)        AS order_count,
    SUM(payment_value)              AS gmv,
    COUNT(DISTINCT customer_unique_id) AS unique_customers
FROM v_order_wide
GROUP BY customer_state
ORDER BY gmv DESC;


-- 6. 支付方式分布
CREATE OR REPLACE VIEW v_payment_distribution AS
SELECT
    payment_type,
    COUNT(*)                       AS tx_count,
    SUM(payment_value)             AS total_value,
    AVG(payment_installments)      AS avg_installments
FROM order_payments
GROUP BY payment_type
ORDER BY total_value DESC;
