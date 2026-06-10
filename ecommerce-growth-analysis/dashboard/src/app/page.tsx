'use client';

import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import ReactECharts from 'echarts-for-react';
import { kpiData, monthlyGMV, monthlyDAU, categoryGMV, conversionTrend } from '@/lib/data';

export default function Home() {
  // 高级感配色：焦棕、暖灰、橄榄绿、暗金
  const c = {
    brown: '#8b6f47',
    darkBrown: '#6d5535',
    warm: '#c4a87c',
    olive: '#7a8a6a',
    gold: '#b8960b',
    rose: '#a06060',
    slate: '#8a8278',
    lightBrown: '#d4c4a8',
  };

  const chartTooltip = {
    backgroundColor: '#fff',
    borderColor: 'var(--border)',
    borderWidth: 1,
    textStyle: { color: '#1a1a1a', fontSize: 12, fontFamily: 'Georgia, serif' },
    extraCssText: 'box-shadow: 0 4px 20px rgba(26,26,26,0.08); border-radius: 12px; padding: 12px 16px;',
  };

  const axisStyle = {
    axisLabel: { fontSize: 10, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' },
    axisLine: { lineStyle: { color: '#e8e4de' } },
    axisTick: { show: false },
  };

  const splitLine = { lineStyle: { color: '#f0ece6', type: 'dashed' as const } };

  const gmvOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 55, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: monthlyGMV.map(d => d.month), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 2 } },
    yAxis: { type: 'value' as const, axisLabel: { ...axisStyle.axisLabel, formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` }, splitLine, axisLine: { show: false } },
    series: [{
      data: monthlyGMV.map(d => d.gmv),
      type: 'line' as const, smooth: true, symbol: 'circle', symbolSize: 4,
      lineStyle: { color: c.brown, width: 2 },
      itemStyle: { color: c.brown, borderWidth: 2, borderColor: '#fff' },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(139,111,71,0.08)' }, { offset: 1, color: 'rgba(139,111,71,0)' }] } },
    }],
  };

  const dauOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category' as const, data: monthlyDAU.map(d => d.month), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 2 } },
    yAxis: { type: 'value' as const, axisLabel: axisStyle.axisLabel, splitLine, axisLine: { show: false } },
    series: [
      { name: '平均DAU', data: monthlyDAU.map(d => d.avgDau), type: 'line' as const, smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: c.olive, width: 2 }, itemStyle: { color: c.olive, borderWidth: 2, borderColor: '#fff' } },
      { name: '峰值DAU', data: monthlyDAU.map(d => d.peakDau), type: 'line' as const, smooth: true, symbol: 'diamond', symbolSize: 3, lineStyle: { color: c.warm, width: 1.5, type: 'dashed' as const }, itemStyle: { color: c.warm } },
    ],
    legend: { data: ['平均DAU', '峰值DAU'], right: 10, top: 0, textStyle: { fontSize: 10, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' }, icon: 'roundRect', itemWidth: 10, itemHeight: 2 },
  };

  const categoryOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 110, right: 30, top: 10, bottom: 30 },
    xAxis: { type: 'value' as const, axisLabel: { ...axisStyle.axisLabel, formatter: (v: number) => `R$${(v / 1000000).toFixed(1)}M` }, splitLine, axisLine: { show: false } },
    yAxis: { type: 'category' as const, data: categoryGMV.map(d => d.category).reverse(), axisLabel: { fontSize: 11, color: '#6b6560', fontFamily: 'PingFang SC, sans-serif' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      data: categoryGMV.map(d => d.gmv).reverse(),
      type: 'bar' as const, barWidth: 12,
      itemStyle: {
        color: (params: { dataIndex: number }) => {
          const gradient = [c.lightBrown, c.warm, c.brown, c.darkBrown, '#5a4530', '#4a3825', '#3a2c1c', '#2a2015', '#1a150d', '#0f0d08'];
          return gradient[params.dataIndex] || c.brown;
        },
        borderRadius: [0, 4, 4, 0],
      },
    }],
  };

  const conversionOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 35, bottom: 30 },
    legend: { data: ['访问→浏览', '浏览→加购', '加购→下单', '下单→支付'], right: 10, top: 0, textStyle: { fontSize: 10, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' }, icon: 'roundRect', itemWidth: 10, itemHeight: 2 },
    xAxis: { type: 'category' as const, data: conversionTrend.map(d => d.month), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 2 } },
    yAxis: { type: 'value' as const, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' }, splitLine, axisLine: { show: false } },
    series: [
      { name: '访问→浏览', data: conversionTrend.map(d => d.visitToView), type: 'line' as const, smooth: true, symbol: 'none', lineStyle: { color: c.brown, width: 1.5 } },
      { name: '浏览→加购', data: conversionTrend.map(d => d.viewToCart), type: 'line' as const, smooth: true, symbol: 'none', lineStyle: { color: c.olive, width: 1.5 } },
      { name: '加购→下单', data: conversionTrend.map(d => d.cartToOrder), type: 'line' as const, smooth: true, symbol: 'none', lineStyle: { color: c.gold, width: 1.5 } },
      { name: '下单→支付', data: conversionTrend.map(d => d.orderToPay), type: 'line' as const, smooth: true, symbol: 'none', lineStyle: { color: c.rose, width: 1.5 } },
    ],
  };

  return (
    <div>
      {/* 项目介绍 */}
      <div className="rounded-2xl p-8 mb-8 card-hover" style={{ background: 'linear-gradient(135deg, #faf6ef 0%, #f5f0e8 100%)', border: '1px solid #e8dcc8' }}>
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] sans" style={{ color: '#b8960b' }}>
              Portfolio Project
            </p>
            <h1 className="text-[26px] font-normal mt-2 serif" style={{ color: '#2a2015', letterSpacing: '0.03em', lineHeight: 1.3 }}>
              电商用户增长分析
            </h1>
            <div className="decor-line mt-3" style={{ background: '#8b6f47' }}></div>
            <p className="text-[13px] mt-4 leading-relaxed sans" style={{ color: '#6b6560' }}>
              基于 <strong>Olist Brazilian E-Commerce</strong> 公开数据集，完成从数据清洗到增长看板的全链路分析。
              涵盖 GMV 趋势、转化漏斗、用户留存、RFM 分层等核心增长模块，展示数据分析与业务洞察能力。
            </p>
            <div className="flex items-center gap-6 mt-5">
              {[
                { label: '数据源', value: 'Olist 真实交易' },
                { label: '时间跨度', value: '2016.09 — 2018.10' },
                { label: '订单量', value: '98,207 笔' },
                { label: '工具链', value: 'SQL · Python · Next.js' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-wider sans" style={{ color: '#a09890' }}>{item.label}</p>
                  <p className="text-[12px] font-medium mt-0.5 sans" style={{ color: '#4a3a2a' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] sans" style={{ color: 'var(--text-tertiary)' }}>
          Overview
        </p>
        <h2 className="text-[18px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
          核心指标
        </h2>
        <div className="decor-line mt-3"></div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <KPICard title="累计 GMV" value={kpiData.totalGMV} />
        <KPICard title="总订单量" value={kpiData.totalOrders} />
        <KPICard title="平均客单价" value={kpiData.avgOrderValue} />
        <KPICard title="整体转化率" value={kpiData.conversionRate} subtitle="访问→支付" />
        <KPICard title="日均 DAU" value={kpiData.dau} subtitle="模拟数据" />
        <KPICard title="次月留存率" value={kpiData.retention30d} subtitle="Cohort 均值" />
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="月度 GMV 趋势" subtitle="单位：巴西雷亚尔 (R$)">
          <ReactECharts option={gmvOption} style={{ height: 260 }} />
        </ChartCard>
        <ChartCard title="月度 DAU 趋势" subtitle="平均值 vs 峰值（模拟数据）">
          <ReactECharts option={dauOption} style={{ height: 260 }} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="品类 GMV 排名" subtitle="Top 10 品类">
          <ReactECharts option={categoryOption} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="转化率趋势" subtitle="各环节转化率月度变化（模拟数据）">
          <ReactECharts option={conversionOption} style={{ height: 300 }} />
        </ChartCard>
      </div>
    </div>
  );
}
