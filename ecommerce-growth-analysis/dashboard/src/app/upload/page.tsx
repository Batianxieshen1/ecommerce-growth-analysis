'use client';

import { useState, useCallback, useRef } from 'react';
import ChartCard from '@/components/ChartCard';

interface FileInfo {
  filename: string;
  columns: string[];
  preview: Record<string, unknown>[];
  shape: number[];
}

interface ColumnMapping {
  order_id: string;
  customer_id: string;
  customer_unique_id: string;
  product_id: string;
  order_time: string;
  order_status: string;
  payment_value: string;
  price: string;
  region: string;
  category: string;
  city: string;
}

const API = 'http://localhost:5000';

export default function UploadPage() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string>>({});
  const [columnMap, setColumnMap] = useState<ColumnMapping>({
    order_id: '', customer_id: '', customer_unique_id: '', product_id: '',
    order_time: '', order_status: '', payment_value: '', price: '',
    region: '', category: '', city: '',
  });
  const [projectName, setProjectName] = useState('');
  const [currency, setCurrency] = useState('¥');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; kpi?: Record<string, string>; error?: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (fileList: FileList) => {
    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append('files', f));

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      const newFiles = Object.entries(data).map(([filename, info]: [string, any]) => ({
        filename,
        columns: info.columns || [],
        preview: info.preview || [],
        shape: info.shape || [0, 0],
      }));
      setFiles(prev => [...prev, ...newFiles]);
      if (step === 1) setStep(2);
    } catch (e) {
      alert('上传失败，请确认 API 服务器已启动 (python scripts/api_server.py)');
    }
    setLoading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  }, []);

  const autoDetectColumns = (file: FileInfo) => {
    const cols = file.columns.map(c => c.toLowerCase());
    const find = (keywords: string[]) => file.columns.find(c => keywords.some(k => c.toLowerCase().includes(k))) || '';

    setColumnMap(prev => ({
      ...prev,
      order_id: prev.order_id || find(['order_id', 'orderid', '订单']),
      customer_id: prev.customer_id || find(['customer_id', 'userid', '用户']),
      customer_unique_id: prev.customer_unique_id || find(['unique', 'uid']),
      product_id: prev.product_id || find(['product_id', 'itemid', '商品']),
      order_time: prev.order_time || find(['timestamp', 'time', 'date', '日期', '时间']),
      order_status: prev.order_status || find(['status', 'state', '状态']),
      payment_value: prev.payment_value || find(['payment', 'amount', 'pay', '金额', '支付']),
      price: prev.price || find(['price', '单价']),
      region: prev.region || find(['state', 'province', 'region', '省', '州', '地区']),
      category: prev.category || find(['category', '品类', '分类']),
      city: prev.city || find(['city', '城市']),
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: selectedFiles,
          project: { name: projectName || '电商增长分析', data_source: '用户上传', time_range: '', currency },
          column_map: columnMap,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setStep(4);
    } catch (e) {
      setResult({ success: false, error: '分析失败，请检查 API 服务器' });
    }
    setLoading(false);
  };

  const allColumns = files.flatMap(f => f.columns);

  const tableRoles = [
    { key: 'orders', label: '订单表', desc: '包含订单ID、客户ID、下单时间、状态', required: true },
    { key: 'customers', label: '客户表', desc: '包含客户ID、城市、省份', required: true },
    { key: 'order_items', label: '订单明细表', desc: '包含订单ID、商品ID、价格', required: true },
    { key: 'payments', label: '支付表', desc: '包含订单ID、支付金额', required: true },
    { key: 'products', label: '商品表', desc: '包含商品ID、品类', required: false },
  ];

  const columnFields = [
    { key: 'order_id', label: '订单 ID', table: 'orders' },
    { key: 'customer_id', label: '客户 ID', table: 'customers' },
    { key: 'customer_unique_id', label: '客户唯一 ID', table: 'customers' },
    { key: 'product_id', label: '商品 ID', table: 'order_items' },
    { key: 'order_time', label: '下单时间', table: 'orders' },
    { key: 'order_status', label: '订单状态', table: 'orders' },
    { key: 'payment_value', label: '支付金额', table: 'payments' },
    { key: 'price', label: '商品单价', table: 'order_items' },
    { key: 'region', label: '省份/州', table: 'customers' },
    { key: 'category', label: '商品品类', table: 'products' },
  ];

  return (
    <div>
      {/* 页头 */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] sans" style={{ color: 'var(--text-tertiary)' }}>New Project</p>
        <h1 className="text-[22px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>新建分析项目</h1>
        <div className="decor-line mt-3"></div>
        <p className="text-[11px] mt-3 sans" style={{ color: 'var(--text-tertiary)' }}>上传电商数据集 → 自动分析 → 生成看板</p>
      </div>

      {/* 进度条 */}
      <div className="flex items-center gap-3 mb-8">
        {['上传数据', '分配表角色', '映射列名', '分析结果'].map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium"
                   style={{
                     background: step > i + 1 ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--bg-sidebar)',
                     color: step >= i + 1 ? '#fff' : 'var(--text-tertiary)',
                   }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-[11px] sans" style={{ color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
            </div>
            {i < 3 && <div className="w-8 h-px" style={{ background: step > i + 1 ? 'var(--accent)' : 'var(--border)' }}></div>}
          </div>
        ))}
      </div>

      {/* Step 1: 上传 */}
      {step === 1 && (
        <div
          className={`rounded-2xl p-12 text-center cursor-pointer transition-all ${dragActive ? 'scale-[1.01]' : ''}`}
          style={{
            border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
            background: dragActive ? 'var(--accent-light)' : 'var(--bg-card)',
          }}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" multiple accept=".csv" className="hidden"
                 onChange={e => e.target.files && handleUpload(e.target.files)} />
          <div className="text-[40px] mb-4">📁</div>
          <p className="text-[14px] font-medium serif" style={{ color: 'var(--text-primary)' }}>
            {loading ? '上传中...' : '拖拽 CSV 文件到这里，或点击选择'}
          </p>
          <p className="text-[11px] mt-2 sans" style={{ color: 'var(--text-tertiary)' }}>
            支持同时上传多个 CSV 文件（订单表、客户表、商品表等）
          </p>
        </div>
      )}

      {/* Step 2: 分配表角色 */}
      {step === 2 && (
        <div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 card-hover mb-6">
            <h3 className="text-[14px] font-medium serif mb-4" style={{ color: 'var(--text-primary)' }}>
              已上传 {files.length} 个文件
            </h3>
            <div className="space-y-4">
              {tableRoles.map(role => (
                <div key={role.key} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium sans" style={{ color: 'var(--text-primary)' }}>{role.label}</span>
                      {role.required && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#fef2f2', color: '#dc2626' }}>必需</span>}
                    </div>
                    <p className="text-[10px] mt-0.5 sans" style={{ color: 'var(--text-tertiary)' }}>{role.desc}</p>
                  </div>
                  <select
                    value={selectedFiles[role.key] || ''}
                    onChange={e => setSelectedFiles(prev => ({ ...prev, [role.key]: e.target.value }))}
                    className="px-3 py-2 rounded-lg text-[12px] sans"
                    style={{ border: '1px solid var(--border)', background: '#fff', color: 'var(--text-primary)', minWidth: 200 }}
                  >
                    <option value="">-- 选择文件 --</option>
                    {files.map(f => <option key={f.filename} value={f.filename}>{f.filename} ({f.shape[0]} 行)</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => setStep(1)} className="text-[12px] sans" style={{ color: 'var(--text-tertiary)' }}>← 重新上传</button>
              <button onClick={() => { if (Object.values(selectedFiles).filter(Boolean).length >= 4) { autoDetectColumns(files[0]); setStep(3); } }}
                      className="px-5 py-2.5 rounded-xl text-[12px] font-medium sans"
                      style={{ background: Object.values(selectedFiles).filter(Boolean).length >= 4 ? 'var(--accent)' : 'var(--border)', color: Object.values(selectedFiles).filter(Boolean).length >= 4 ? '#fff' : 'var(--text-tertiary)', cursor: Object.values(selectedFiles).filter(Boolean).length >= 4 ? 'pointer' : 'not-allowed' }}>
                下一步：映射列名 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 列名映射 */}
      {step === 3 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 card-hover">
            <h3 className="text-[14px] font-medium serif mb-1" style={{ color: 'var(--text-primary)' }}>项目信息</h3>
            <div className="decor-line mt-2 mb-4"></div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider sans block mb-1" style={{ color: 'var(--text-tertiary)' }}>项目名称</label>
                <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="例：淘宝用户增长分析"
                       className="w-full px-3 py-2 rounded-lg text-[12px] sans" style={{ border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider sans block mb-1" style={{ color: 'var(--text-tertiary)' }}>货币符号</label>
                <input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="¥"
                       className="w-full px-3 py-2 rounded-lg text-[12px] sans" style={{ border: '1px solid var(--border)', width: 80 }} />
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-2xl p-6 card-hover">
            <h3 className="text-[14px] font-medium serif mb-1" style={{ color: 'var(--text-primary)' }}>列名映射</h3>
            <div className="decor-line mt-2 mb-4"></div>
            <p className="text-[10px] mb-4 sans" style={{ color: 'var(--text-tertiary)' }}>
              将你的列名映射到分析引擎需要的字段。已自动检测，可手动调整。
            </p>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2">
              {columnFields.map(field => (
                <div key={field.key} className="flex items-center gap-2">
                  <label className="text-[11px] sans w-24 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                  <select
                    value={(columnMap as any)[field.key]}
                    onChange={e => setColumnMap(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="flex-1 px-2 py-1.5 rounded-lg text-[11px] sans"
                    style={{ border: '1px solid var(--border)', background: '#fff' }}
                  >
                    <option value="">-- 选择列 --</option>
                    {allColumns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 flex justify-between items-center">
            <button onClick={() => setStep(2)} className="text-[12px] sans" style={{ color: 'var(--text-tertiary)' }}>← 上一步</button>
            <button onClick={handleAnalyze}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-[12px] font-medium sans"
                    style={{ background: 'var(--accent)', color: '#fff', opacity: loading ? 0.6 : 1 }}>
              {loading ? '分析中...' : '🚀 开始分析'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 结果 */}
      {step === 4 && result?.success && (
        <div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-8 card-hover text-center mb-6">
            <div className="text-[48px] mb-3">🎉</div>
            <h3 className="text-[18px] font-medium serif mb-2" style={{ color: 'var(--text-primary)' }}>分析完成！</h3>
            <p className="text-[12px] sans mb-6" style={{ color: 'var(--text-tertiary)' }}>数据已生成看板 JSON，点击下方按钮查看</p>
            <div className="flex justify-center gap-4">
              <a href="/" className="px-6 py-2.5 rounded-xl text-[12px] font-medium sans"
                 style={{ background: 'var(--accent)', color: '#fff' }}>
                查看看板 →
              </a>
              <button onClick={() => { setStep(1); setFiles([]); setSelectedFiles({}); setResult(null); }}
                      className="px-6 py-2.5 rounded-xl text-[12px] font-medium sans"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                新建项目
              </button>
            </div>
          </div>

          {/* KPI 预览 */}
          {result.kpi && (
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(result.kpi).map(([key, value]) => (
                <div key={key} className="bg-[var(--bg-card)] rounded-2xl p-5 card-hover">
                  <p className="text-[10px] uppercase tracking-wider sans" style={{ color: 'var(--text-tertiary)' }}>{key}</p>
                  <p className="text-[18px] font-normal mt-1 serif" style={{ color: 'var(--text-primary)' }}>{String(value)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 错误 */}
      {result && !result.success && (
        <div className="bg-[#fef2f2] rounded-2xl p-6 card-hover">
          <p className="text-[13px] font-medium" style={{ color: '#dc2626' }}>分析出错</p>
          <p className="text-[11px] mt-2" style={{ color: '#9a3c3c' }}>{result.error}</p>
        </div>
      )}
    </div>
  );
}
