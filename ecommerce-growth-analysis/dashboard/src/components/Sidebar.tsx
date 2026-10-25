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
    // 手机：顶部横条，标签可横向滚动；md 以上：左侧固定 200px 竖栏
    <aside
      className="fixed left-0 top-0 z-40 flex w-full flex-row items-center gap-1 overflow-x-auto px-3 py-2 md:h-screen md:w-[200px] md:flex-col md:items-stretch md:gap-0 md:overflow-visible md:px-0 md:py-0"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo：手机上只留短标，桌面保留完整署名 */}
      <div className="shrink-0 px-2 md:w-full md:px-6 md:pt-8 md:pb-6"
           style={{ borderBottom: 'none' }}>
        <p className="hidden text-[11px] font-medium uppercase tracking-[0.2em] md:block"
           style={{ color: 'var(--text-tertiary)' }}>
          E-Commerce
        </p>
        <h1 className="serif whitespace-nowrap text-[15px] font-normal md:mt-1 md:text-[18px]"
            style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
          增长分析
        </h1>
        <div className="decor-line mt-3 hidden md:block"></div>
      </div>

      {/* Navigation：手机横排可滚动，桌面竖排 */}
      <nav className="flex flex-1 flex-row items-center gap-1 md:flex-col md:items-stretch md:gap-0 md:space-y-0.5 md:px-4 md:py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 transition-all duration-200 md:py-3"
              style={{
                background: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
              }}
            >
              <span className="block text-[13px] font-medium"
                    style={{ color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)' }}>
                {item.label}
              </span>
              <span className="mt-0.5 hidden text-[10px] md:block"
                    style={{ color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
                {item.desc}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer：仅桌面显示 */}
      <div className="hidden px-6 py-5 md:block" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          Olist Brazilian E-Commerce<br />
          2016.09 — 2018.10
        </p>
      </div>
    </aside>
  );
}
