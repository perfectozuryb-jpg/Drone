'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, X, ExternalLink, Lock } from 'lucide-react';

type PendingUrlItem = {
  id: string;
  url: string;
  status: 'pending';
};

type PublishedDocItem = {
  id: string;
  url: string;
  title: string;
  docNumber?: string;
  abstract?: string;
  date?: string;
  status: 'published';
};

type LegalDocActionPayload = {
  url: string;
  title?: string;
  docNumber?: string;
  abstract?: string;
  date?: string;
};

export default function AdminLegalDashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [pending, setPending] = useState<PendingUrlItem[]>([]);
  const [published, setPublished] = useState<PublishedDocItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/legal');
      if (res.status === 401) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setAuthorized(true);
        setPending(json.pending || []);
        setPublished(json.published || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const res = await fetch('/api/admin/legal');
        if (ignore) return;
        if (res.status === 401) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (ignore) return;
        if (json.success) {
          setAuthorized(true);
          setPending(json.pending || []);
          setPublished(json.published || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    });

    if (res.ok) {
      setAuthorized(true);
      fetchDocs();
    } else {
      setLoginError('Mật khẩu Secret Key không đúng.');
    }
  };

  const handleAction = async (
    item: { url: string; title?: string; docNumber?: string; abstract?: string; date?: string },
    action: 'publish' | 'delete'
  ) => {
    if (action === 'delete' && !confirm('Bạn có chắc muốn xóa URL này khỏi hàng chờ?')) return;

    const res = await fetch('/api/admin/legal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: item.url,
        action,
        title: item.title || 'Số hiệu chưa nhập',
        docNumber: item.docNumber || '',
        abstract: item.abstract || '',
        date: item.date || new Date().toISOString(),
      }),
    });

    if (res.ok) {
      fetchDocs();
    }
  };

  // Màn hình Login
  if (authorized === false) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 border rounded-xl shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Drone Hub Admin Gate</h1>
            <p className="text-sm text-slate-500">Nhập Secret Key để tiếp tục quản trị Legal Link Indexing.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Passphrase / Secret Key</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Nhập ADMIN_SECRET_KEY..."
              required
            />
          </div>

          {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Xác thực truy cập
          </button>
        </form>
      </div>
    );
  }

  if (loading || authorized === null) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-600" /></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Phân hệ Pháp lý (Pure Redis Indexing)</h1>
        <p className="text-slate-600">Duyệt URL mới tìm thấy và ghi metadata trực tiếp vào Redis Hash (legal:documents).</p>
      </div>

      {/* Section 1: Hàng chờ duyệt (legal:pending) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          Hàng chờ duyệt (legal:pending)
          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full font-mono">{pending.length}</span>
        </h2>

        {pending.length === 0 && <p className="text-slate-400 italic">Không có URL mới nào đang chờ duyệt.</p>}

        {pending.map((item) => (
          <PendingCard key={item.id} item={item} onAction={handleAction} />
        ))}
      </div>

      {/* Section 2: Đã xuất bản (legal:documents) */}
      <div className="space-y-4 pt-6 border-t">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          Đã xuất bản (legal:documents)
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-mono">{published.length}</span>
        </h2>

        {published.length === 0 && <p className="text-slate-400 italic">Chưa có văn bản nào được đăng.</p>}

        {published.map((doc) => (
          <div key={doc.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <a href={doc.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                {doc.title} <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-sm text-slate-600 mt-1">{doc.abstract}</p>
              <p className="text-xs text-slate-400 font-mono mt-2">{doc.url}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full shrink-0">Đã Index</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingCard({
  item,
  onAction,
}: {
  item: PendingUrlItem;
  onAction: (doc: LegalDocActionPayload, action: 'publish' | 'delete') => void;
}) {
  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [abstract, setAbstract] = useState('');

  return (
    <div className="p-5 bg-white border border-amber-200 rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-sm">
          {item.url} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 font-medium rounded-full">Chờ duyệt</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Tên/Số hiệu văn bản</label>
          <input
            className="w-full px-3 py-1.5 border rounded-md text-sm"
            placeholder="VD: Nghị định 36/2008/NĐ-CP"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Mã hiệu</label>
          <input
            className="w-full px-3 py-1.5 border rounded-md text-sm"
            placeholder="VD: 36/2008/NĐ-CP"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">Trích yếu nội dung</label>
          <textarea
            className="w-full px-3 py-1.5 border rounded-md text-sm"
            rows={2}
            placeholder="Tóm tắt nội dung chính của văn bản..."
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => onAction({ url: item.url }, 'delete')}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
        >
          <X className="w-3.5 h-3.5" /> Xóa URL
        </button>
        <button
          onClick={() => onAction({ url: item.url, title, docNumber, abstract }, 'publish')}
          className="flex items-center gap-1 px-4 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 font-medium rounded-lg transition"
        >
          <Check className="w-3.5 h-3.5" /> Duyệt & Đẩy vào Index
        </button>
      </div>
    </div>
  );
}
