'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { Product, CartItem } from '@/lib/types';

const WEIGHT_STEPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  return `${parseInt(d)} ב${months[parseInt(m) - 1]} ${y}`;
}

function formatPrice(n: number) {
  return `₪${n % 1 === 0 ? n : n.toFixed(2)}`;
}

function OrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean | null>(null);

  useEffect(() => {
    if (!date) { router.push('/'); return; }
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, [date, router]);

  // Restore cart from localStorage when date is known
  useEffect(() => {
    if (!date) return;
    const saved = localStorage.getItem(`cart_${date}`);
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, [date]);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (!date) return;
    if (cart.length === 0) {
      localStorage.removeItem(`cart_${date}`);
    } else {
      localStorage.setItem(`cart_${date}`, JSON.stringify(cart));
    }
  }, [cart, date]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) return prev.map(i => i.product_id === product.id ? { ...i, quantity } : i);
      return [...prev, { product_id: product.id, product_name: product.name, unit: product.unit, quantity, price: product.price }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(i => i.product_id !== productId));
  }, []);

  const rawTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartTotal = isFirstOrder ? rawTotal * 0.85 : rawTotal;
  const cartCount = cart.length;

  async function checkFirstOrder(phone: string) {
    if (phone.length < 9) { setIsFirstOrder(null); return; }
    const res = await fetch(`/api/orders/check-phone?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setIsFirstOrder(data.isFirst);
  }

  async function handleOrder() {
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: form.name, customer_phone: form.phone, delivery_date: date, notes: form.notes, items: cart }),
    });
    const data = await res.json();
    if (data.id) {
      localStorage.removeItem(`cart_${date}`);
      router.push(`/confirm?id=${data.id}&date=${date}`);
    }
    setSubmitting(false);
  }

  if (!date) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-md"
        style={{ background: 'var(--color-primary)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)' }}
        >
          → חזור
        </button>

        <div className="text-center">
          <h1 className="font-black text-xl text-white tracking-tight">אליתר</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{formatDate(date)}</p>
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition-all"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          <span>🛒</span>
          <span>עגלה</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -left-2 text-xs rounded-full w-5 h-5 flex items-center justify-center font-black"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Products */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-3 animate-pulse">🍲</div>
            <p style={{ color: 'var(--color-text-muted)' }}>טוען מנות...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="font-bold text-xl mb-2" style={{ color: 'var(--color-text)' }}>אין מנות זמינות כרגע</p>
            <p style={{ color: 'var(--color-text-muted)' }}>נחזור בקרוב עם תפריט חדש</p>
          </div>
        ) : (
          <>
            <p className="font-bold text-lg mb-5" style={{ color: 'var(--color-text-muted)' }}>
              בחרו את המנות שלכם
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  cartItem={cart.find(i => i.product_id === p.id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-0 right-0 px-4 z-20 flex justify-center">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 w-full max-w-sm"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            <span
              className="text-sm font-black px-2 py-0.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {cartCount} פריטים
            </span>
            <span className="font-bold">לצפייה בעגלה</span>
            <span className="font-black">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative flex flex-col w-full max-w-sm h-full shadow-2xl" style={{ background: 'var(--color-bg)' }}>

            <div className="flex items-center justify-between px-5 py-4" style={{ background: 'var(--color-primary)' }}>
              <button onClick={() => setShowCart(false)} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
              <h2 className="font-black text-xl text-white">עגלת הקניות</h2>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: 'var(--color-text-muted)' }}>
                <span className="text-5xl">🛒</span>
                <p className="font-medium">העגלה ריקה</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.product_id}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ color: 'var(--color-text)' }}>{item.product_name}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {item.quantity}{item.unit === 'kg' ? ' ק"ג' : ' יח\''} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm" style={{ color: 'var(--color-primary)' }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-lg opacity-40 hover:opacity-100 transition-opacity"
                        >🗑</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black" style={{ color: 'var(--color-text)' }}>סה&quot;כ:</span>
                    <span className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
                    className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    המשך להזמנה ←
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 space-y-4"
            style={{ background: 'var(--color-bg)' }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-2 sm:hidden" style={{ background: 'var(--color-border)' }} />

            <h2 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>פרטי ההזמנה</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>תאריך: {formatDate(date)}</p>

            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>שם מלא *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ישראל ישראלי"
                className="w-full rounded-xl px-4 py-3 font-medium outline-none transition-all"
                style={{ background: 'var(--color-warm)', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>טלפון *</label>
              <input
                type="tel"
                value={form.phone}
                dir="ltr"
                onChange={e => {
                  const phone = e.target.value;
                  setForm(f => ({ ...f, phone }));
                  checkFirstOrder(phone);
                }}
                placeholder="050-0000000"
                className="w-full rounded-xl px-4 py-3 font-medium outline-none transition-all"
                style={{ background: 'var(--color-warm)', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
              {isFirstOrder === true && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold" style={{ background: '#d1fae5', color: '#065f46' }}>
                  <span>🎉</span>
                  <span>15% הנחה להזמנה ראשונה!</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--color-text)' }}>הערות (אופציונלי)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="בקשות מיוחדות, אלרגיות..."
                rows={2}
                className="w-full rounded-xl px-4 py-3 font-medium outline-none resize-none transition-all"
                style={{ background: 'var(--color-warm)', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div
              className="rounded-xl px-4 py-3 space-y-1"
              style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
            >
              {isFirstOrder && (
                <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span>לפני הנחה:</span>
                  <span className="line-through">{formatPrice(rawTotal)}</span>
                </div>
              )}
              {isFirstOrder && (
                <div className="flex justify-between text-sm font-bold" style={{ color: '#065f46' }}>
                  <span>הנחה 15%:</span>
                  <span>-{formatPrice(rawTotal * 0.15)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-bold" style={{ color: 'var(--color-text)' }}>סה&quot;כ לתשלום:</span>
                <span className="text-xl font-black" style={{ color: 'var(--color-primary)' }}>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 rounded-xl font-bold transition-colors"
                style={{ background: 'var(--color-warm)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
              >
                חזרה
              </button>
              <button
                onClick={handleOrder}
                disabled={!form.name || !form.phone || submitting}
                className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {submitting ? '⏳ שולח...' : '✓ אישור הזמנה'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, cartItem, onAdd, onRemove }: {
  product: Product;
  cartItem?: CartItem;
  onAdd: (p: Product, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  const isKg = product.unit === 'kg';
  const [qty, setQty] = useState<number>(cartItem?.quantity ?? (isKg ? 0.5 : 1));
  const [lightbox, setLightbox] = useState(false);
  const inCart = !!cartItem;

  return (
    <>
    {lightbox && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
        onClick={() => setLightbox(false)}
      >
        <div className="relative max-w-3xl max-h-[90vh] w-full mx-4">
          <img
            src={product.image_path!}
            alt={product.name}
            className="w-full h-full object-contain rounded-xl shadow-2xl"
            style={{ maxHeight: '90vh' }}
          />
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-3 left-3 bg-black/60 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold"
          >×</button>
        </div>
      </div>
    )}
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: 'var(--color-card)',
        border: `2px solid ${inCart ? 'var(--color-primary)' : 'var(--color-border)'}`,
        boxShadow: inCart ? '0 4px 20px rgba(139,38,53,0.15)' : '0 2px 12px rgba(45,27,14,0.06)',
      }}
    >
      {/* Image */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: 'var(--color-warm)', cursor: product.image_path ? 'zoom-in' : 'default' }}
        onClick={() => product.image_path && setLightbox(true)}
      >
        {product.image_path ? (
          <Image src={product.image_path} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🍲</div>
        )}

        {/* Unit badge */}
        <span
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: isKg ? 'rgba(200,134,10,0.9)' : 'rgba(139,38,53,0.9)',
            color: '#fff',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isKg ? 'לפי ק"ג' : 'לפי קופסא'}
        </span>

        {inCart && (
          <div
            className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            <span>✓</span> בעגלה
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-black text-lg leading-tight" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
          {product.description && (
            <p className="text-sm mt-0.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>{product.description}</p>
          )}
          <p className="font-black text-lg mt-1.5" style={{ color: 'var(--color-primary)' }}>
            ₪{product.price} <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>/ {isKg ? 'ק"ג' : 'קופסא'}</span>
          </p>
        </div>

        {/* Quantity selector */}
        {isKg ? (
          <div>
            <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--color-text-muted)' }}>כמות בק&quot;ג:</p>
            <div className="flex flex-wrap gap-1.5">
              {WEIGHT_STEPS.map(w => (
                <button
                  key={w}
                  onClick={() => setQty(w)}
                  className="px-2.5 py-1 rounded-lg text-sm font-bold transition-all"
                  style={qty === w
                    ? { background: 'var(--color-primary)', color: '#fff' }
                    : { background: 'var(--color-warm)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
                  }
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>כמות:</p>
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-1.5"
              style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="text-lg font-black w-6 text-center leading-none"
                style={{ color: 'var(--color-primary)' }}
              >−</button>
              <span className="w-5 text-center font-black" style={{ color: 'var(--color-text)' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="text-lg font-black w-6 text-center leading-none"
                style={{ color: 'var(--color-primary)' }}
              >+</button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAdd(product, qty)}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            {inCart ? '↺ עדכן כמות' : '+ הוסף לעגלה'}
          </button>
          {inCart && (
            <button
              onClick={() => onRemove(product.id)}
              className="px-3 py-2.5 rounded-xl text-base transition-all hover:opacity-70"
              style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>טוען...</p>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
