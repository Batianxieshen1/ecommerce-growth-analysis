-- ============================================================
-- 电商增长分析 - RFM 用户分层
-- R(recency) F(frequency) M(monetary) 各分 3 档 → 4 大用户群
-- ============================================================

-- Step 1: 计算每个客户的 RFM 原始值
CREATE OR REPLACE VIEW v_rfm_raw AS
SELECT
    customer_unique_id,
    -- Recency: 距离最后一次下单的天数（以数据中最大日期为基准）
    (SELECT MAX(DATE(order_purchase_timestamp)) FROM orders) - MAX(DATE(order_purchase_timestamp)) AS recency_days,
    -- Frequency: 订单总数
    COUNT(DISTINCT order_id) AS frequency,
    -- Monetary: 累计消费金额
    SUM(payment_value)       AS monetary
FROM v_order_wide
GROUP BY customer_unique_id;


-- Step 2: 用三分位数给 R/F/M 打分（1-3）
CREATE OR REPLACE VIEW v_rfm_scored AS
WITH rfm AS (SELECT * FROM v_rfm_raw),
percentiles AS (
    SELECT
        PERCENTILE_CONT(0.33) WITHIN GROUP (ORDER BY recency_days) AS r_p33,
        PERCENTILE_CONT(0.67) WITHIN GROUP (ORDER BY recency_days) AS r_p67,
        PERCENTILE_CONT(0.33) WITHIN GROUP (ORDER BY frequency)    AS f_p33,
        PERCENTILE_CONT(0.67) WITHIN GROUP (ORDER BY frequency)    AS f_p67,
        PERCENTILE_CONT(0.33) WITHIN GROUP (ORDER BY monetary)     AS m_p33,
        PERCENTILE_CONT(0.67) WITHIN GROUP (ORDER BY monetary)     AS m_p67
    FROM rfm
)
SELECT
    r.*,
    -- R 分（注意：recency 越小越好，所以反向打分）
    CASE WHEN r.recency_days <= p.r_p33 THEN 3
         WHEN r.recency_days <= p.r_p67 THEN 2
         ELSE 1 END AS r_score,
    -- F 分
    CASE WHEN r.frequency >= p.f_p67 THEN 3
         WHEN r.frequency >= p.f_p33 THEN 2
         ELSE 1 END AS f_score,
    -- M 分
    CASE WHEN r.monetary >= p.m_p67 THEN 3
         WHEN r.monetary >= p.m_p33 THEN 2
         ELSE 1 END AS m_score
FROM rfm r, percentiles p;


-- Step 3: 合并为 4 大用户群
CREATE OR REPLACE VIEW v_rfm_segments AS
SELECT
    *,
    r_score + f_score + m_score AS rfm_total,
    CASE
        -- 高价值：R高 F高 M高
        WHEN r_score = 3 AND f_score >= 2 AND m_score >= 2 THEN '高价值用户'
        -- 潜力：R高 但 F 或 M 偏低（新客户或低频高客单）
        WHEN r_score = 3 AND (f_score = 1 OR m_score = 1) THEN '潜力用户'
        -- 沉睡：R低 但曾经 F 或 M 不错
        WHEN r_score = 1 AND (f_score >= 2 OR m_score >= 2) THEN '沉睡用户'
        -- 流失风险：R低 F低 M低
        WHEN r_score = 1 AND f_score = 1 AND m_score = 1 THEN '流失风险'
        -- 其余归为一般用户
        ELSE '一般用户'
    END AS user_segment
FROM v_rfm_scored;


-- Step 4: 分层汇总（供看板使用）
CREATE OR REPLACE VIEW v_rfm_summary AS
SELECT
    user_segment,
    COUNT(*)                             AS user_count,
    ROUND(AVG(recency_days), 0)          AS avg_recency,
    ROUND(AVG(frequency), 2)             AS avg_frequency,
    ROUND(AVG(monetary), 2)              AS avg_monetary,
    ROUND(SUM(monetary), 2)              AS total_monetary
FROM v_rfm_segments
GROUP BY user_segment
ORDER BY total_monetary DESC;
