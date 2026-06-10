"""
分析 API 服务器
接收上传的 CSV 文件 → 自动生成配置 → 跑分析引擎 → 返回 JSON
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os
import sys
import tempfile
import shutil

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'upload')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'dashboard', 'public', 'data')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_files():
    """上传 CSV 文件，返回列名预览"""
    files = request.files.getlist('files')
    result = {}

    for f in files:
        if f.filename and f.filename.endswith('.csv'):
            filepath = os.path.join(UPLOAD_DIR, f.filename)
            f.save(filepath)
            try:
                df = pd.read_csv(filepath, nrows=5)
                result[f.filename] = {
                    'columns': list(df.columns),
                    'preview': df.head(3).to_dict(orient='records'),
                    'shape': [len(pd.read_csv(filepath)), len(df.columns)]
                }
            except Exception as e:
                result[f.filename] = {'error': str(e)}

    return jsonify(result)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """接收列名映射配置，运行分析"""
    mapping = request.json
    try:
        # 从映射生成标准配置
        config = build_config_from_mapping(mapping)

        # 保存临时配置
        config_path = os.path.join(UPLOAD_DIR, 'temp_config.json')
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)

        # 运行分析引擎
        sys.path.insert(0, os.path.dirname(__file__))
        from run_analysis import load_config, build_wide_table, simulate_behavior, compute_metrics, export_json

        cfg = load_config(config_path)
        wide, orders = build_wide_table(UPLOAD_DIR, cfg)
        daily_active, sim_users = simulate_behavior(wide, cfg)
        results = compute_metrics(wide, daily_active, cfg)
        export_json(results, OUTPUT_DIR)

        return jsonify({'success': True, 'kpi': results['kpi']})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/preview', methods=['POST'])
def preview_data():
    """预览上传的数据"""
    filename = request.json.get('filename')
    if not filename:
        return jsonify({'error': 'No filename'}), 400

    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    df = pd.read_csv(filepath, nrows=10)
    return jsonify({
        'columns': list(df.columns),
        'preview': df.to_dict(orient='records'),
        'dtypes': {col: str(dtype) for col, dtype in df.dtypes.items()},
        'shape': [len(pd.read_csv(filepath)), len(df.columns)]
    })

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """获取可用的分析模板"""
    templates_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
    templates = []
    for f in os.listdir(templates_dir):
        if f.endswith('.json'):
            with open(os.path.join(templates_dir, f), 'r', encoding='utf-8') as fh:
                cfg = json.load(fh)
                templates.append({
                    'filename': f,
                    'name': cfg.get('project', {}).get('name', f),
                    'data_source': cfg.get('project', {}).get('data_source', ''),
                })
    return jsonify(templates)

def build_config_from_mapping(mapping):
    """从前端映射生成分析配置"""
    files = mapping.get('files', {})
    project = mapping.get('project', {})
    column_map = mapping.get('column_map', {})

    config = {
        "project": {
            "name": project.get('name', '电商增长分析'),
            "data_source": project.get('data_source', '用户上传数据'),
            "time_range": project.get('time_range', ''),
            "currency": project.get('currency', '¥'),
            "language": "zh-CN"
        },
        "tables": {},
        "customer_key": column_map.get('customer_id', 'customer_id'),
        "order_key": column_map.get('order_id', 'order_id'),
        "product_key": column_map.get('product_id', 'product_id'),
        "metrics": {
            "gmv_column": column_map.get('payment_value', 'payment_value'),
            "price_column": column_map.get('price', 'price'),
            "region_column": column_map.get('region', 'region'),
            "category_column": column_map.get('category', 'category'),
            "time_column": column_map.get('order_time', 'order_time'),
            "time_granularity": "month"
        },
        "simulation": {
            "visit_to_view": 0.60,
            "view_to_cart": 0.15,
            "cart_to_order": 0.40,
            "order_to_pay": 0.95,
            "mobile_ratio": 0.62,
            "source_weights": {"organic": 0.45, "paid": 0.25, "social": 0.18, "direct": 0.12}
        },
        "rfm": {"percentiles": [0.33, 0.67]},
        "display": {
            "category_map": {},
            "top_n_categories": 10,
            "top_n_regions": 10,
            "retention_cohorts": 6
        }
    }

    # 根据映射生成表配置
    table_defs = {
        'orders': {'required': True, 'time_col': True},
        'customers': {'required': True, 'time_col': False},
        'order_items': {'required': True, 'time_col': False},
        'payments': {'required': True, 'time_col': False},
        'products': {'required': False, 'time_col': False},
    }

    for table_name, table_info in table_defs.items():
        table_file = files.get(table_name)
        if not table_file:
            continue

        cols = column_map.get(table_name, {})
        table_cfg = {
            'file': table_file,
            'columns': cols,
            'valid_statuses': column_map.get('valid_statuses', ['delivered', 'completed', 'shipped']),
        }
        if table_info.get('time_col'):
            table_cfg['time_column'] = list(cols.values())[0] if cols else 'time'

        config['tables'][table_name] = table_cfg

    return config

if __name__ == '__main__':
    print("分析 API 服务器启动: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
