'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '总览', desc: '核心指标' },
  { href: '/growth', label: '增长诊断', desc: '漏斗 · 留存' },
  { href: '/segments', label: '用户分层', desc: 'RFM 分析' },
  { href: '/upload', label: '新建项目', desc: '上传数据集' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] h-screen fixed left-0 top-0 flex flex-col z-10"
           style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
          E-Commerce
        </p>
        <h1 className="text-[18px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
          增长分析
        </h1>
        <div className="decor-line mt-3"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-3 rounded-lg transition-all duration-200"
              style={{
                background: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
              }}
            >
              <span className="text-[13px] font-medium block"
                    style={{ color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)' }}>
                {item.label}
              </span>
              <span className="text-[10px] block mt-0.5"
                    style={{ color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
                {item.desc}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          Olist Brazilian E-Commerce<br />
          2016.09 — 2018.10
        </p>
      </div>
    </aside>
  );
}
