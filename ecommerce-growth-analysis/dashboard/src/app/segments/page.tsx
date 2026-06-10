'use client';

import ChartCard from '@/components/ChartCard';
import ReactECharts from 'echarts-for-react';
import { rfmSegments } from '@/lib/data';

export default function SegmentsPage() {
  const c = { brown: '#8b6f47', warm: '#c4a87c', olive: '#7a8a6a', gold: '#b8960b', rose: '#a06060', slate: '#8a8278' };
  const chartColors = [c.brown, c.olive, c.slate, c.gold, c.rose];

  const segmentStyles: Record<string, { color: string; bg: string; border: string }> = {
    '高价值用户': { color: '#6d5535', bg: '#faf6ef', border: '#e8dcc8' },
    '潜力用户': { color: '#4a6a4a', bg: '#f5f8f5', border: '#d0ddd0' },
    '一般用户': { color: '#5a5550', bg: '#f8f7f5', border: '#e8e4de' },
    '沉睡用户': { color: '#8a6a30', bg: '#fdf8ed', border: '#e8dcc0' },
    '流失风险': { color: '#7a3c3c', bg: '#faf5f5', border: '#e8d0d0' },
  };

  const getStyle = (seg: string) => segmentStyles[seg] || segmentStyles['一般用户'];

  const chartTooltip = {
    backgroundColor: '#fff', borderColor: 'var(--border)', borderWidth: 1,
    textStyle: { color: '#1a1a1a', fontSize: 12, fontFamily: 'Georgia, serif' },
    extraCssText: 'box-shadow: 0 4px 20px rgba(26,26,26,0.08); border-radius: 12px; padding: 12px 16px;',
  };

  const pieOption = {
    tooltip: { ...chartTooltip, trigger: 'item' as const },
    legend: { orient: 'vertical' as const, right: 20, top: 'center', textStyle: { fontSize: 11, color: '#8a8278', fontFamily: 'PingFang SC, sans-serif' }, icon: 'roundRect', itemWidth: 10, itemHeight: 10 },
    series: [{
      type: 'pie' as const, radius: ['45%', '72%'], center: ['35%', '50%'],
      avoidLabelOverlap: false, label: { show: false },
      emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Georgia, serif' }, scaleSize: 6 },
      itemStyle: { borderColor: '#fff', borderWidth: 3 },
      data: rfmSegments.map((d, i) => ({ name: d.segment, value: d.count, itemStyle: { color: chartColors[i] } })),
    }],
  };

  const matrixOption = {
    tooltip: {
      ...chartTooltip,
      formatter: (params: { data: number[] }) => {
        const seg = rfmSegments[params.data[2]];
        return `<div style="font-family:Georgia,serif;font-weight:600;margin-bottom:4px">${seg.segment}</div>
                <div style="font-family:Helvetica Neue,sans-serif;font-size:11px;color:#8a8278">用户数: ${seg.count.toLocaleString()}</div>
                <div style="font-family:Helvetica Neue,sans-serif;font-size:11px;color:#8a8278">平均R: ${seg.avgRecency}天</div>
                <div style="font-family:Helvetica Neue,sans-serif;font-size:11px;color:#8a8278">平均F: ${seg.avgFrequency}次</div>
                <div style="font-family:Helvetica Neue,sans-serif;font-size:11px;color:#8a8278">平均M: R$ ${seg.avgMonetary}</div>`;
      },
    },
    grid: { left: 60, right: 20, top: 20, bottom: 50 },
    xAxis: { name: 'Recency (天)', nameLocation: 'center' as const, nameGap: 30, nameTextStyle: { fontSize: 11, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' }, axisLabel: { fontSize: 10, color: '#a09890' }, splitLine: { lineStyle: { color: '#f0ece6', type: 'dashed' as const } }, axisLine: { lineStyle: { color: '#e8e4de' } }, axisTick: { show: false } },
    yAxis: { name: 'Frequency (次)', nameLocation: 'center' as const, nameGap: 40, nameTextStyle: { fontSize: 11, color: '#a09890', fontFamily: 'Helvetica Neue, sans-serif' }, axisLabel: { fontSize: 10, color: '#a09890' }, splitLine: { lineStyle: { color: '#f0ece6', type: 'dashed' as const } }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      type: 'scatter' as const,
      symbolSize: (data: number[]) => Math.sqrt(rfmSegments[data[2]].count) / 2.5,
      data: rfmSegments.map((d, i) => [d.avgRecency, d.avgFrequency, i]),
      itemStyle: { color: (params: { data: number[] }) => chartColors[params.data[2]], opacity: 0.85 },
      label: { show: true, formatter: (params: { data: number[] }) => rfmSegments[params.data[2]].segment, fontSize: 10, color: '#4a3a2a', position: 'top' as const, fontFamily: 'PingFang SC, sans-serif' },
    }],
  };

  const monetaryOption = {
    tooltip: { ...chartTooltip, trigger: 'axis' as const },
    grid: { left: 100, right: 30, top: 10, bottom: 30 },
    xAxis: { type: 'value' as const, axisLabel: { fontSize: 10, color: '#a09890', formatter: 'R$ {value}' }, splitLine: { lineStyle: { color: '#f0ece6', type: 'dashed' as const } }, axisLine: { show: false } },
    yAxis: { type: 'category' as const, data: rfmSegments.map(d => d.segment).reverse(), axisLabel: { fontSize: 11, color: '#6b6560', fontFamily: 'PingFang SC, sans-serif' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      data: rfmSegments.map(d => d.avgMonetary).reverse(),
      type: 'bar' as const, barWidth: 16,
      itemStyle: {
        color: (params: { dataIndex: number }) => [...chartColors].reverse()[params.dataIndex] || '#8a8278',
        borderRadius: [0, 4, 4, 0],
      },
    }],
  };

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] sans" style={{ color: 'var(--text-tertiary)' }}>Segmentation</p>
        <h1 className="text-[22px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>用户分层</h1>
        <div className="decor-line mt-3"></div>
        <p className="text-[11px] mt-3 sans" style={{ color: 'var(--text-tertiary)' }}>RFM 模型 · 用户画像 · 运营策略</p>
      </div>

      {/* 分层概览 */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {rfmSegments.map((seg, i) => {
          const style = getStyle(seg.segment);
          return (
            <div key={seg.segment} className="rounded-2xl p-5 card-hover"
                 style={{ background: style.bg, border: `1px solid ${style.border}` }}>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] sans" style={{ color: style.color, opacity: 0.7 }}>{seg.segment}</p>
              <p className="text-[24px] font-normal tabular-nums mt-2 serif" style={{ color: style.color }}>{seg.count.toLocaleString()}</p>
              <div className="decor-line mt-2" style={{ background: style.color, opacity: 0.3 }}></div>
              <p className="text-[10px] mt-2 sans" style={{ color: style.color, opacity: 0.5 }}>占比 {seg.pct}%</p>
            </div>
          );
        })}
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="用户分层占比" subtitle="RFM 评分聚合">
          <ReactECharts option={pieOption} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="RFM 矩阵" subtitle="气泡大小代表用户数量">
          <ReactECharts option={matrixOption} style={{ height: 300 }} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="各分层平均客单价" subtitle="单位：巴西雷亚尔 (R$)">
          <ReactECharts option={monetaryOption} style={{ height: 260 }} />
        </ChartCard>
        <ChartCard title="分层详细数据">
          <div className="overflow-hidden">
            <table className="w-full text-[12px] sans">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2.5 font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-tertiary)' }}>分层</th>
                  <th className="text-right py-2.5 font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-tertiary)' }}>用户数</th>
                  <th className="text-right py-2.5 font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-tertiary)' }}>R(天)</th>
                  <th className="text-right py-2.5 font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-tertiary)' }}>F(次)</th>
                  <th className="text-right py-2.5 font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-tertiary)' }}>M(R$)</th>
                </tr>
              </thead>
              <tbody>
                {rfmSegments.map((seg, i) => (
                  <tr key={seg.segment} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td className="py-3 flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: chartColors[i] }}></span>
                      <span style={{ color: 'var(--text-primary)' }}>{seg.segment}</span>
                    </td>
                    <td className="text-right py-3 tabular-nums" style={{ color: 'var(--text-primary)' }}>{seg.count.toLocaleString()}</td>
                    <td className="text-right py-3 tabular-nums" style={{ color: 'var(--text-secondary)' }}>{seg.avgRecency}</td>
                    <td className="text-right py-3 tabular-nums" style={{ color: 'var(--text-secondary)' }}>{seg.avgFrequency}</td>
                    <td className="text-right py-3 tabular-nums" style={{ color: 'var(--text-secondary)' }}>{seg.avgMonetary.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* 运营策略 */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 card-hover">
        <h3 className="text-[13px] font-medium serif mb-5" style={{ color: 'var(--text-primary)' }}>分层运营策略</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-5">
            {[
              { seg: '高价值用户', text: '会员专属权益、新品优先体验、专属客服通道、复购周期提醒推送。' },
              { seg: '潜力用户', text: '首单优惠券、品类交叉推荐、凑单满减引导、评价返现激励。' },
            ].map((item, i) => (
              <div key={item.seg}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: chartColors[i] }}></div>
                  <p className="text-[12px] font-medium serif" style={{ color: 'var(--text-primary)' }}>{item.seg}</p>
                </div>
                <p className="text-[11px] leading-relaxed sans" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {[
              { seg: '沉睡用户', text: '召回优惠券（阶梯面额）、限时折扣推送、个性化商品推荐邮件、短信触达。' },
              { seg: '流失风险', text: '高面额无门槛券、问卷调研流失原因、客服主动关怀、竞品差异化内容推送。' },
            ].map((item, i) => (
              <div key={item.seg}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: chartColors[i + 3] }}></div>
                  <p className="text-[12px] font-medium serif" style={{ color: 'var(--text-primary)' }}>{item.seg}</p>
                </div>
                <p className="text-[11px] leading-relaxed sans" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
