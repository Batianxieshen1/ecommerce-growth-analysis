interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-[var(--bg-card)] rounded-2xl p-6 card-hover ${className}`}>
      <div className="mb-5">
        <h3 className="text-[13px] font-medium serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>{title}</h3>
        {subtitle && <p className="text-[10px] mt-1 sans" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>}
        <div className="decor-line mt-3"></div>
      </div>
      {children}
    </div>
  );
}
