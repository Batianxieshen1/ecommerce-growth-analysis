import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import ExportButton from '@/components/ExportButton';

export const metadata: Metadata = {
  title: '电商增长分析看板',
  description: 'E-Commerce Growth Analysis Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Sidebar />
        {/* 手机顶部留出横条高度，md 以上左侧留 200px */}
        <main className="mt-[48px] min-h-screen md:ml-[200px] md:mt-0">
          {/* 顶部栏 */}
          <header className="sticky top-[48px] z-30 flex items-center justify-between px-4 py-3 md:top-0 md:px-8 md:py-4"
                  style={{ background: 'rgba(250,249,247,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
            <div></div>
            <ExportButton />
          </header>
          <div className="px-4 py-5 md:px-8 md:py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
