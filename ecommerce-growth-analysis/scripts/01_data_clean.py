"""
01 - 数据探索与清洗
加载 Olist 原始 CSV → 清洗 → 输出 processed 数据
"""
import pandas as pd
import numpy as np
import os

RAW = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')
PROCESSED = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')
os.makedirs(PROCESSED, exist_ok=True)

print("=== 加载原始数据 ===")
customers = pd.read_csv(f'{RAW}/olist_customers_dataset.csv')
orders = pd.read_csv(f'{RAW}/olist_orders_dataset.csv')
order_items = pd.read_csv(f'{RAW}/olist_order_items_dataset.csv')
payments = pd.read_csv(f'{RAW}/olist_order_payments_dataset.csv')
reviews = pd.read_csv(f'{RAW}/olist_order_reviews_dataset.csv')
products = pd.read_csv(f'{RAW}/olist_products_dataset.csv')
sellers = pd.read_csv(f'{RAW}/olist_sellers_dataset.csv')
category_trans = pd.read_csv(f'{RAW}/product_category_name_translation.csv')

for name, df in [('customers', customers), ('orders', orders), ('order_items', order_items),
                  ('payments', payments), ('reviews', reviews), ('products', products),
                  ('sellers', sellers), ('category_trans', category_trans)]:
    print(f'  {name:20s}: {len(df):>10,} rows')

# 订单时间转换
orders['order_purchase_timestamp'] = pd.to_datetime(orders['order_purchase_timestamp'])

print(f'\n订单时间范围: {orders.order_purchase_timestamp.min()} ~ {orders.order_purchase_timestamp.max()}')
print(f'订单状态分布:')
print(orders['order_status'].value_counts().to_string())

# 只保留有效订单
valid_orders = orders[~orders['order_status'].isin(['canceled', 'unavailable'])].copy()
print(f'\n有效订单: {len(valid_orders):,} / {len(orders):,} ({len(valid_orders)/len(orders)*100:.1f}%)')

time_cols = ['order_purchase_timestamp', 'order_approved_at', 'order_delivered_carrier_date',
             'order_delivered_customer_date', 'order_estimated_delivery_date']
for col in time_cols:
    valid_orders[col] = pd.to_datetime(valid_orders[col])

# 支付清洗
payments_clean = payments[(payments['payment_value'] > 0) & (payments['payment_value'] < 10000)].copy()

# 构建宽表
print("\n=== 构建宽表 ===")
order_wide = (
    valid_orders
    .merge(customers, on='customer_id', how='left')
    .merge(order_items, on='order_id', how='left')
    .merge(products, on='product_id', how='left')
    .merge(category_trans, on='product_category_name', how='left')
    .merge(payments_clean.groupby('order_id').agg(
        payment_value=('payment_value', 'sum'),
        payment_type=('payment_type', 'first'),
        payment_installments=('payment_installments', 'max')
    ).reset_index(), on='order_id', how='left')
    .merge(reviews.groupby('order_id')['review_score'].mean().reset_index(), on='order_id', how='left')
)
print(f'宽表: {len(order_wide):,} 行, {len(order_wide.columns)} 列')

# 客户首单表
first_orders = (
    valid_orders
    .merge(customers[['customer_id', 'customer_unique_id']], on='customer_id')
    .groupby('customer_unique_id')
    .agg(first_order_date=('order_purchase_timestamp', 'min'))
    .reset_index()
)

# 保存
order_wide.to_csv(f'{PROCESSED}/order_wide.csv', index=False)
customers.to_csv(f'{PROCESSED}/customers.csv', index=False)
valid_orders.to_csv(f'{PROCESSED}/orders_clean.csv', index=False)
first_orders.to_csv(f'{PROCESSED}/customer_first_orders.csv', index=False)

print("\n已保存:")
for f in os.listdir(PROCESSED):
    size = os.path.getsize(f'{PROCESSED}/{f}') / 1024 / 1024
    print(f'  {f}: {size:.1f} MB')

print("\n=== 数据清洗完成 ===")
