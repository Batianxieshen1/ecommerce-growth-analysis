# 电商用户增长分析框架 · E-Commerce Growth Analysis Framework

> 配置驱动的通用电商增长分析框架 — 导入任何电商数据集即可生成完整分析看板

## 项目简介

这是一个**可复用的电商增长分析框架**。通过修改一个 JSON 配置文件，即可适配不同的电商数据集，自动生成：
- 数据宽表构建
- 用户行为日志模拟
- GMV / DAU / 漏斗 / 留存 / RFM 等核心指标计算
- 可视化看板（Next.js + ECharts）
- 可导出的分析报告（PDF / Word）

当前已适配：**Olist Brazilian E-Commerce**（9.8 万笔订单，2000 万雷亚尔 GMV）

## 架构设计

```
                    ┌─────────────────┐
                    │  analysis_config │  ← 唯一需要修改的文件
                    │     (.json)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  run_analysis.py │  ← 通用分析引擎
                    │  (读取配置执行)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ 宽表构建  │  │ 指标计算  │  │ 行为模拟  │
        └─────┬────┘  └─────┬────┘  └─────┬────┘
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │  JSON 数据文件   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Next.js 看板   │  ← 自动渲染
                    └─────────────────┘
```

## 快速开始

### 1. 环境准备

```bash
pip install pandas numpy
cd dashboard && npm install
```

### 2. 使用 Olist 数据（默认）

```bash
# 下载数据：https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
# 放入 data/raw/ 目录

# 一键运行分析
python scripts/run_analysis.py

# 启动看板
cd dashboard && npm run dev
```

### 3. 接入新数据集（3 步）

#### 步骤 1：准备数据

将你的电商数据集整理为以下 CSV 文件（放入 `data/raw/`）：

| 文件 | 必需 | 说明 |
|------|------|------|
| 订单表 | ✅ | 订单ID、客户ID、状态、时间 |
| 客户表 | ✅ | 客户ID、城市、省份 |
| 订单明细表 | ✅ | 订单ID、商品ID、价格 |
| 支付表 | ✅ | 订单ID、支付金额 |
| 商品表 | ✅ | 商品ID、品类 |
| 品类翻译表 | ❌ | 品类名翻译（可选） |

#### 步骤 2：修改配置

```bash
# 复制模板
cp templates/new_dataset_template.json templates/my_dataset.json

# 编辑配置文件，映射你的列名
```

配置文件核心部分：

```jsonc
{
  "tables": {
    "orders": {
      "file": "你的订单表.csv",
      "columns": {
        "order_id": "你的订单ID列名",
        "customer_id": "你的客户ID列名",
        "status": "你的状态列名",
        "purchase_time": "你的下单时间列名"
      },
      "valid_statuses": ["已完成", "已发货"]
    }
  },
  "metrics": {
    "gmv_column": "支付金额列名（重命名后）",
    "region_column": "地区列名（重命名后）"
  },
  "display": {
    "category_map": {
      "electronics": "电子产品",
      "clothing": "服装"
    }
  }
}
```

#### 步骤 3：运行

```bash
python scripts/run_analysis.py --config templates/my_dataset.json --data data/raw/
cd dashboard && npm run dev
```

看板自动适配新数据，无需修改任何前端代码。

## 项目结构

```
ecommerce-growth-analysis/
├── templates/
│   ├── analysis_config.json         # 默认配置（Olist）
│   └── new_dataset_template.json    # 新数据集模板
├── scripts/
│   ├── run_analysis.py              # ⭐ 通用分析引擎（核心）
│   ├── 01_data_clean.py             # Olist 专用清洗
│   └── 02_simulation_and_metrics.py # Olist 专用模拟
├── adapters/                        # 未来：数据适配器
├── sql/                             # SQL 建模参考
├── dashboard/                       # Next.js 看板
│   ├── src/
│   │   ├── app/                     # 3 个分析页面
│   │   ├── components/              # UI 组件 + 导出功能
│   │   └── lib/data.ts             # 数据层（支持 JSON / 内联）
│   └── public/data/                 # JSON 输出
├── data/
│   ├── raw/                         # 原始 CSV
│   ├── processed/                   # 清洗后数据
│   └── simulated/                   # 模拟行为日志
├── report/
│   └── analysis_report.md           # 分析报告
└── README.md
```

## 配置说明

| 配置项 | 说明 |
|--------|------|
| `project` | 项目名称、数据源、时间范围、货币符号 |
| `tables` | 每个 CSV 文件的列名映射 |
| `metrics` | 指标计算用的关键列名 |
| `simulation` | 行为日志模拟的转化率参数 |
| `rfm` | RFM 分层的分位数和分层规则 |
| `display` | 品类中文映射、Top N 显示数量 |

## 看板功能

| 页面 | 内容 |
|------|------|
| **总览** | 项目介绍、6 个 KPI、GMV 趋势、DAU 趋势、品类排名、转化率 |
| **增长诊断** | 转化漏斗、留存 Cohort、地区分布、支付转化趋势 |
| **用户分层** | RFM 分层卡片、占比饼图、矩阵散点图、运营策略 |
| **导出** | PDF / Word 报告一键导出 |

## 适配过的数据集

| 数据集 | 地区 | 订单量 | 状态 |
|--------|------|--------|------|
| Olist Brazilian E-Commerce | 巴西 | 98K | ✅ 已适配 |
| 你的数据集 | 你的地区 | 你的数据 | 📝 按模板配置 |

## 技术栈

- **分析引擎**：Python / Pandas / NumPy（配置驱动，一个脚本搞定）
- **数据建模**：SQL（PostgreSQL 语法，参考用）
- **可视化**：Next.js 16 / React 19 / Tailwind CSS 4 / ECharts
- **导出**：PDF（浏览器打印）/ Word（HTML 格式）

## License

MIT

---

> 更多作品与札记：**[蓝纸 · 造物与札记](https://batianxieshen1.github.io/blog/)**
