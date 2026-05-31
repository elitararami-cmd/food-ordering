'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, Order } from '@/lib/types';

type Tab = 'products' | 'orders';

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New product form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: 'box' as 'kg' | 'box' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Edit
  const [editing, setEditing] = useState<Product | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  // Image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  // Lightbox
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  async function fetchProducts() {
    setLoadingProducts(true);
    const res = await fetch('/api/admin/products');
    if (res.status === 401) { router.push('/admin'); return; }
    setProducts(await res.json());
    setLoadingProducts(false);
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    const res = await fetch('/api/orders');
    if (res.status === 401) { router.push('/admin'); return; }
    setOrders(await res.json());
    setLoadingOrders(false);
  }

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (tab === 'orders') fetchOrders(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) { setFormError('יש למלא שם ומחיר'); return; }
    setSaving(true);

    const body = { name: form.name, description: form.description, price: parseFloat(form.price), unit: form.unit };

    if (editing) {
      await fetch(`/api/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, active: editing.active }),
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    setForm({ name: '', description: '', price: '', unit: 'box' });
    setEditing(null);
    setShowForm(false);
    setSaving(false);
    fetchProducts();
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, active: product.active ? 0 : 1 }),
    });
    fetchProducts();
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm({ name: product.name, description: product.description || '', price: product.price.toString(), unit: product.unit });
    setShowForm(true);
    setTimeout(() => editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }

  async function handleImageUpload(productId: number, file: File) {
    setUploadingFor(productId);
    const fd = new FormData();
    fd.append('image', file);
    await fetch(`/api/products/${productId}/image`, { method: 'POST', body: fd });
    setUploadingFor(null);
    fetchProducts();
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🍱 ניהול חנות</h1>
        <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">
          התנתק
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b flex">
        {(['products', 'orders'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t === 'products' ? '📦 מוצרים' : '📋 הזמנות'}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-700">מוצרים ({products.length})</h2>
              <button
                onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', unit: 'box' }); setShowForm(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                + הוסף מוצר
              </button>
            </div>

            {/* Add new product form (top) */}
            {showForm && !editing && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-gray-800 mb-4">מוצר חדש</h3>
                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">מחיר (₪) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      dir="ltr"
                    />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סוג מכירה *</label>
                    <select
                      value={form.unit}
                      onChange={e => setForm(f => ({ ...f, unit: e.target.value as 'kg' | 'box' }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="kg">לפי קילוגרם (ק&quot;ג)</option>
                      <option value="box">לפי קופסא / יחידה</option>
                    </select>
                  </div>

                  {formError && <p className="sm:col-span-2 text-red-500 text-sm">{formError}</p>}

                  <div className="sm:col-span-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditing(null); setFormError(''); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                    >
                      {saving ? 'שומר...' : 'שמור'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product list */}
            {loadingProducts ? (
              <div className="text-center text-gray-500 py-10">טוען...</div>
            ) : (
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id}>
                    <div
                      className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 ${!p.active ? 'opacity-50' : ''}`}
                    >
                      {/* Image */}
                      <div
                        className="relative w-44 h-44 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => p.image_path && setLightboxSrc(p.image_path)}
                      >
                        {p.image_path ? (
                          <Image src={p.image_path} alt={p.name} fill className="object-cover hover:scale-105 transition-transform duration-200" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🍱</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800">{p.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.unit === 'kg' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {p.unit === 'kg' ? 'ק"ג' : 'קופסא'}
                          </span>
                          {!p.active && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">מושבת</span>}
                        </div>
                        {p.description && <p className="text-sm text-gray-500 truncate">{p.description}</p>}
                        <p className="text-red-700 font-bold">{p.price.toFixed(2)} ₪ / {p.unit === 'kg' ? 'ק"ג' : 'קופסא'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => editing?.id === p.id ? (setEditing(null), setShowForm(false)) : startEdit(p)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${editing?.id === p.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          ✏️ עריכה
                        </button>
                        <button
                          onClick={() => toggleActive(p)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                            p.active
                              ? 'bg-red-100 hover:bg-red-200 text-red-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {p.active ? '🔴 השבת' : '🟢 הפעל'}
                        </button>
                        <label className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-center">
                          {uploadingFor === p.id ? '⏳' : '🖼 תמונה'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files?.[0]) handleImageUpload(p.id, e.target.files[0]);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Inline edit form */}
                    {editing?.id === p.id && (
                      <div ref={editFormRef} className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6 mt-1">
                        <h3 className="font-bold text-gray-800 mb-4">עריכת מוצר</h3>
                        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר *</label>
                            <input
                              type="text"
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                            <input
                              type="text"
                              value={form.description}
                              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">מחיר (₪) *</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={form.price}
                              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">סוג מכירה *</label>
                            <select
                              value={form.unit}
                              onChange={e => setForm(f => ({ ...f, unit: e.target.value as 'kg' | 'box' }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            >
                              <option value="kg">לפי קילוגרם (ק&quot;ג)</option>
                              <option value="box">לפי קופסא / יחידה</option>
                            </select>
                          </div>

                          {formError && <p className="sm:col-span-2 text-red-500 text-sm">{formError}</p>}

                          <div className="sm:col-span-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => { setShowForm(false); setEditing(null); setFormError(''); }}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white"
                            >
                              ביטול
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                            >
                              {saving ? 'שומר...' : 'שמור'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700">הזמנות ({orders.length})</h2>

            {loadingOrders ? (
              <div className="text-center text-gray-500 py-10">טוען...</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-400 py-10">אין הזמנות עדיין</div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <OrderRow key={order.id} order={order} onRefresh={fetchOrders} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <input ref={fileInputRef} type="file" className="hidden" />

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full mx-4">
            <img
              src={lightboxSrc}
              alt=""
              className="w-full h-full object-contain rounded-xl shadow-2xl"
              style={{ maxHeight: '90vh' }}
            />
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-3 left-3 bg-black/60 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: 'ממתין',
    confirmed: 'אושר',
    ready: 'מוכן',
    cancelled: 'בוטל',
  };

  async function loadDetails() {
    if (details) { setExpanded(e => !e); return; }
    const res = await fetch(`/api/orders/${order.id}`);
    setDetails(await res.json());
    setExpanded(true);
  }

  async function updateStatus(status: string) {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    onRefresh();
  }

  const [dy, dm, dd] = order.delivery_date.split('-');
  const formattedDate = `${dd}/${dm}/${dy}`;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800">#{order.id}</span>
            <span className="font-medium">{order.customer_name}</span>
            <span className="text-gray-500 text-sm">{order.customer_phone}</span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            משלוח: {formattedDate} · {order.total.toFixed(2)} ₪
          </div>
          {order.items_summary && (
            <div className="text-xs text-gray-400 mt-0.5 truncate">{order.items_summary}</div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
            {statusLabels[order.status] || order.status}
          </span>
          <button
            onClick={loadDetails}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && details && (
        <div className="border-t bg-gray-50 p-4 space-y-3">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">פריטים:</h4>
            <div className="space-y-1">
              {details.items?.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity} {item.unit === 'kg' ? 'ק"ג' : 'קופסאות'}</span>
                  <span className="text-gray-600">{(item.price * item.quantity).toFixed(2)} ₪</span>
                </div>
              ))}
            </div>
            {details.notes && <p className="text-sm text-gray-500 mt-2">הערות: {details.notes}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600">שנה סטטוס:</span>
            {['pending', 'confirmed', 'ready', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || order.status === s}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 ${statusColors[s]}`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
