'use client';

import { useState } from 'react';
import { kpiData, monthlyGMV, categoryGMV, regionGMV, funnelData, rfmSegments, retentionCohort } from '@/lib/data';

export default function ExportButton() {
  const [open, setOpen] = useState(false);

  const generateReportHTML = () => {
    const gmvRows = monthlyGMV.map(d => `<tr><td>${d.month}</td><td style="text-align:right">R$ ${d.gmv.toLocaleString()}</td><td style="text-align:right">${d.orders.toLocaleString()}</td></tr>`).join('');
    const catRows = categoryGMV.map((d, i) => `<tr><td>${i+1}</td><td>${d.category}</td><td style="text-align:right">R$ ${d.gmv.toLocaleString()}</td><td style="text-align:right">${d.orders.toLocaleString()}</td></tr>`).join('');
    const regionRows = regionGMV.map((d, i) => `<tr><td>${i+1}</td><td>${d.state}</td><td style="text-align:right">R$ ${d.gmv.toLocaleString()}</td><td style="text-align:right">${d.customers.toLocaleString()}</td></tr>`).join('');
    const funnelRows = funnelData.map(d => `<tr><td>${d.step}</td><td style="text-align:right">${d.users.toLocaleString()}</td><td style="text-align:right">${d.rate}</td></tr>`).join('');
    const rfmRows = rfmSegments.map(d => `<tr><td>${d.segment}</td><td style="text-align:right">${d.count.toLocaleString()}</td><td style="text-align:right">${d.pct}%</td><td style="text-align:right">${d.avgRecency}</td><td style="text-align:right">${d.avgFrequency}</td><td style="text-align:right">R$ ${d.avgMonetary}</td></tr>`).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>电商用户增长分析报告</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #1a1a1a; line-height: 1.8; padding: 40px 50px; font-size: 13px; }
  h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.05em; }
  h2 { font-size: 16px; font-weight: 600; margin: 30px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #8b6f47; color: #8b6f47; }
  h3 { font-size: 14px; font-weight: 600; margin: 20px 0 8px; color: #4a3a2a; }
  .subtitle { color: #8a8278; font-size: 12px; margin-bottom: 24px; }
  .meta { color: #a09890; font-size: 11px; margin-bottom: 30px; padding-bottom: 16px; border-bottom: 1px solid #e8e4de; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; font-size: 12px; }
  th { background: #f5f3f0; padding: 8px 12px; text-align: left; font-weight: 600; font-size: 11px; color: #6b6560; text-transform: uppercase; letter-spacing: 0.1em; }
  td { padding: 7px 12px; border-bottom: 1px solid #f0ece6; }
  tr:hover td { background: #faf9f7; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0 24px; }
  .kpi-card { background: #f9fafb; border: 1px solid #e8e4de; border-radius: 8px; padding: 14px 16px; }
  .kpi-label { font-size: 10px; color: #a09890; text-transform: uppercase; letter-spacing: 0.1em; }
  .kpi-value { font-size: 20px; font-weight: 600; margin-top: 4px; color: #1a1a1a; }
  .insight { background: #faf6ef; border-left: 3px solid #8b6f47; padding: 12px 16px; margin: 12px 0; border-radius: 0 6px 6px 0; font-size: 12px; color: #6b6560; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8e4de; font-size: 10px; color: #a09890; text-align: center; }
  @media print { body { padding: 20px 30px; } .no-print { display: none; } }
</style>
</head>
<body>

<h1>电商用户增长分析报告</h1>
<p class="subtitle">基于 Olist Brazilian E-Commerce 公开数据集</p>
<p class="meta">数据时间范围：2016.09 — 2018.10 ｜ 生成日期：${new Date().toLocaleDateString('zh-CN')} ｜ 分析工具：SQL + Python + Next.js</p>

<h2>一、核心指标</h2>
<div class="kpi-grid">
  <div class="kpi-card"><div class="kpi-label">累计 GMV</div><div class="kpi-value">${kpiData.totalGMV}</div></div>
  <div class="kpi-card"><div class="kpi-label">总订单量</div><div class="kpi-value">${kpiData.totalOrders}</div></div>
  <div class="kpi-card"><div class="kpi-label">平均客单价</div><div class="kpi-value">${kpiData.avgOrderValue}</div></div>
  <div class="kpi-card"><div class="kpi-label">整体转化率</div><div class="kpi-value">${kpiData.conversionRate}</div></div>
  <div class="kpi-card"><div class="kpi-label">日均 DAU</div><div class="kpi-value">${kpiData.dau}</div></div>
  <div class="kpi-card"><div class="kpi-label">次月留存率</div><div class="kpi-value">${kpiData.retention30d}</div></div>
</div>

<h2>二、月度 GMV 趋势</h2>
<table><thead><tr><th>月份</th><th style="text-align:right">GMV (R$)</th><th style="text-align:right">订单量</th></tr></thead><tbody>${gmvRows}</tbody></table>
<div class="insight">关键发现：2017年11月GMV达到峰值，与巴西Black Friday促销高度吻合。Q4整体表现强劲，三个月累计GMV占全年30%+。</div>

<h2>三、品类 GMV 排名</h2>
<table><thead><tr><th>#</th><th>品类</th><th style="text-align:right">GMV (R$)</th><th style="text-align:right">订单量</th></tr></thead><tbody>${catRows}</tbody></table>
<div class="insight">家居生活类合计贡献22% GMV，是平台核心品类。Computers品类客单价高但订单量偏低，适合做高客单运营。</div>

<h2>四、地区 GMV 分布</h2>
<table><thead><tr><th>#</th><th>州</th><th style="text-align:right">GMV (R$)</th><th style="text-align:right">客户数</th></tr></thead><tbody>${regionRows}</tbody></table>
<div class="insight">SP（圣保罗）贡献超过35%的GMV，前3州占比超60%。低渗透地区存在增长空间。</div>

<h2>五、转化漏斗</h2>
<table><thead><tr><th>环节</th><th style="text-align:right">用户数</th><th style="text-align:right">转化率</th></tr></thead><tbody>${funnelRows}</tbody></table>
<div class="insight">浏览→加购转化率仅3.0%，是最大流失点。建议优化商品详情页信任元素、简化加购流程。</div>

<h2>六、RFM 用户分层</h2>
<table><thead><tr><th>分层</th><th style="text-align:right">用户数</th><th style="text-align:right">占比</th><th style="text-align:right">R(天)</th><th style="text-align:right">F(次)</th><th style="text-align:right">M(R$)</th></tr></thead><tbody>${rfmRows}</tbody></table>
<div class="insight">Olist数据集中97%客户只有1笔订单，复购运营是核心增长机会。高价值用户（11.2%）贡献约25% GMV。</div>

<h2>七、增长策略建议</h2>
<h3>短期（1-3个月）</h3>
<p>1. 优化商品详情页：增加销量、评价数、物流时效展示<br>2. 新客首单激励：首次访问弹窗领券<br>3. Black Friday备货：历史数据显示11月GMV峰值明显</p>
<h3>中期（3-6个月）</h3>
<p>1. 复购激励体系：满2单返券、品类交叉推荐<br>2. 沉睡用户召回：按沉睡时长分层触达<br>3. 物流体验优化：缩短配送时效</p>
<h3>长期（6-12个月）</h3>
<p>1. 会员体系搭建：基于RFM分层设计阶梯权益<br>2. 品类扩展：针对高客单品类做专项运营<br>3. 地区拓展：在低渗透州做本地化营销</p>

<div class="footer">电商用户增长分析报告 · Olist E-Commerce · ${new Date().toLocaleDateString('zh-CN')}</div>

</body></html>`;
  };

  const exportPDF = () => {
    const html = generateReportHTML();
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
    setOpen(false);
  };

  const exportWord = () => {
    const html = generateReportHTML();
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '电商增长分析报告.doc';
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 sans"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        导出报告
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden card-hover"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', minWidth: 180 }}>
            <button onClick={exportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] transition-colors sans"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sidebar-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ color: 'var(--danger)' }}>📄</span>
              <div className="text-left">
                <div className="font-medium">PDF 报告</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>打印为 PDF 文件</div>
              </div>
            </button>
            <div style={{ borderTop: '1px solid var(--border-light)' }}></div>
            <button onClick={exportWord}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] transition-colors sans"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sidebar-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ color: 'var(--info)' }}>📝</span>
              <div className="text-left">
                <div className="font-medium">Word 报告</div>
                <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>下载 .doc 文件</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
