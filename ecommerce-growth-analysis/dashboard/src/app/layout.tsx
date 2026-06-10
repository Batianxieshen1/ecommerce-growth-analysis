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
        <main className="ml-[200px] min-h-screen">
          {/* 顶部栏 */}
          <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
                  style={{ background: 'rgba(250,249,247,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
            <div></div>
            <ExportButton />
          </header>
          <div className="px-8 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
