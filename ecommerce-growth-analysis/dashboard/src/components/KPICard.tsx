interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  accent?: string;
}

export default function KPICard({ title, value, change, changeType = 'neutral', subtitle }: KPICardProps) {
  const changeColor = {
    up: 'var(--success)',
    down: 'var(--danger)',
    neutral: 'var(--text-tertiary)',
  }[changeType];

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 card-hover">
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] sans" style={{ color: 'var(--text-tertiary)' }}>
        {title}
      </p>
      <p className="text-[24px] font-normal tabular-nums mt-2 serif" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {value}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {change && (
          <span className="text-[10px] font-medium sans" style={{ color: changeColor }}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
          </span>
        )}
        {subtitle && <span className="text-[10px] sans" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</span>}
      </div>
    </div>
  );
}
