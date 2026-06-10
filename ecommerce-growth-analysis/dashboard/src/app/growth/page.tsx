'use client';

import ChartCard from '@/components/ChartCard';
import ReactECharts from 'echarts-for-react';
import { funnelData, retentionCohort, regionGMV, conversionTrend } from '@/lib/data';

export default function GrowthPage() {
  const c = { brown: '#8b6f47', warm: '#c4a87c', olive: '#7a8a6a', gold: '#b8960b', rose: '#a06060', slate: '#8a8278' };

  const chartTooltip = {
    backgroundColor: '#fff', borderColor: 'var(--border)', borderWidth: 1,
    textStyle: { color: '#1a1a1a', fontSize: 12, fontFamily: 'Georgia, serif' },
    extraCssText: 'box-shadow: 0 4px 20px rgba(26,26,26,0.08); border-radius: 12px; padding: 12px 16px;',
  };
  const axisStyle = { axisLabel: { fontSize: 10, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' }, axisLine: { lineStyle: { color: '#e8e4de' } }, axisTick: { show: false } };
  const splitLine = { lineStyle: { color: '#f0ece6', type: 'dashed' as const } };

  const funnelColors = ['#3a2c1c', '#5a4530', '#8b6f47', '#c4a87c', '#d4c4a8'];

  const funnelOption = {
    tooltip: { ...chartTooltip, trigger: 'item' as const },
    series: [{
      type: 'funnel' as const, left: '10%', width: '80%', top: 20, bottom: 20,
      min: 0, max: funnelData[0].users, sort: 'descending' as const, gap: 3,
      label: { show: true, position: 'inside' as const, fontSize: 12, color: '#fff',
        formatter: (params: { name: string; value: number }) => {
          const item = funnelData.find(d => d.step === params.name);
          return `${params.name}\n${(params.value/1000).toFixed(0)}k (${item?.rate})`;
        },
      },
      itemStyle: { borderWidth: 0 },
      data: funnelData.map((d, i) => ({ name: d.step, value: d.users, itemStyle: { color: funnelColors[i] } })),
    }],
  };

  const retentionHeatmapData: number[][] = [];
  retentionCohort.forEach((row, rowIdx) => {
    [row.month0, row.month1, row.month2, row.month3, row.month4, row.month5].forEach((val, colIdx) => {
      if (val !== null && val !== undefined) retentionHeatmapData.push([colIdx, rowIdx, val]);
    });
  });

  const retentionOption = {
    tooltip: { ...chartTooltip, formatter: (params: { value: number[] }) => `${retentionCohort[params.value[1]].cohort} 第${params.value[0]}月: ${params.value[2]}%` },
    grid: { left: 80, right: 20, top: 30, bottom: 50 },
    xAxis: { type: 'category' as const, data: ['当月', '+1月', '+2月', '+3月', '+4月', '+5月'], ...axisStyle },
    yAxis: { type: 'category' as const, data: retentionCohort.map(d => d.cohort), axisLabel: axisStyle.axisLabel, axisLine: { show: false }, axisTick: { show: false } },
    visualMap: { min: 0, max: 100, calculable: false, orient: 'horizontal' as const, left: 'center', bottom: 0, inRange: { color: ['#f5f0e8', '#e8dcc8', '#d4c4a8', '#c4a87c', '#8b6f47'] }, textStyle: { fontSize: 10, color: '#a09890' }, show: true },
    series: [{
      type: 'heatmap' as const, data: retentionHeatmapData,
      label: { show: true, formatter: (params: { value: number[] }) => `${params.value[2]}%`, fontSize: 10, color: '#3a2c1c' },
      itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 4 },
    }],
  };

  const regionOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 40, right: 20, top: 10, bottom: 30 },
    xAxis: { type: 'category' as const, data: regionGMV.map(d => d.state), ...axisStyle },
    yAxis: { type: 'value' as const, axisLabel: { ...axisStyle.axisLabel, formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` }, splitLine, axisLine: { show: false } },
    series: [{
      data: regionGMV.map(d => d.gmv), type: 'bar' as const, barWidth: 18,
      itemStyle: {
        color: (params: { dataIndex: number }) => {
          const colors = ['#3a2c1c', '#5a4530', '#6d5535', '#8b6f47', '#a08060', '#b89878', '#c4a87c', '#d4c4a8', '#e0d4c0', '#ece4d8'];
          return colors[params.dataIndex] || '#c4a87c';
        },
        borderRadius: [4, 4, 0, 0],
      },
    }],
  };

  const repurchaseOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: conversionTrend.map(d => d.month), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 2 } },
    yAxis: { type: 'value' as const, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' }, splitLine, axisLine: { show: false } },
    series: [{
      name: '下单→支付转化率', data: conversionTrend.map(d => d.orderToPay),
      type: 'line' as const, smooth: true, symbol: 'circle', symbolSize: 4,
      lineStyle: { color: c.olive, width: 2 }, itemStyle: { color: c.olive, borderWidth: 2, borderColor: '#fff' },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(122,138,106,0.1)' }, { offset: 1, color: 'rgba(122,138,106,0)' }] } },
    }],
  };

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] sans" style={{ color: 'var(--text-tertiary)' }}>Diagnosis</p>
        <h1 className="text-[22px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>增长诊断</h1>
        <div className="decor-line mt-3"></div>
        <p className="text-[11px] mt-3 sans" style={{ color: 'var(--text-tertiary)' }}>漏斗转化 · 用户留存 · 地区分布 · 支付转化</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="转化漏斗" subtitle="访问 → 浏览 → 加购 → 下单 → 支付（模拟数据）">
          <ReactECharts option={funnelOption} style={{ height: 320 }} />
        </ChartCard>
        <ChartCard title="用户留存 Cohort" subtitle="按首次下单月分群的月留存率">
          <ReactECharts option={retentionOption} style={{ height: 320 }} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="地区 GMV 分布" subtitle="按州统计的销售额">
          <ReactECharts option={regionOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="下单→支付转化率趋势" subtitle="月度变化">
          <ReactECharts option={repurchaseOption} style={{ height: 280 }} />
        </ChartCard>
      </div>

      {/* 诊断摘要 */}
      <div className="mt-4 bg-[var(--bg-card)] rounded-2xl p-6 card-hover">
        <h3 className="text-[13px] font-medium serif mb-5" style={{ color: 'var(--text-primary)' }}>增长诊断摘要</h3>
        <div className="grid grid-cols-3 gap-8">
          {[
            { title: '漏斗瓶颈', text: '浏览→加购转化率仅 3.0%，是最大流失点。建议优化商品详情页信任元素、简化加购流程。' },
            { title: '留存表现', text: 'Olist 复购率低（多数客户仅下单一次），次月留存约 10.9%。新客召回策略需要加强。' },
            { title: '地区集中度', text: 'SP（圣保罗）贡献 37% GMV，前 3 州占比超 64%。可探索低渗透地区增长机会。' },
          ].map(item => (
            <div key={item.title}>
              <p className="text-[12px] font-medium serif mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <div className="decor-line mb-3"></div>
              <p className="text-[11px] leading-relaxed sans" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
