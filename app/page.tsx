'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type SavedCart = { date: string; itemCount: number; total: number };

const HERO_PHOTOS = [
  '/food/hummus.jpg',
  '/food/marroco-fish-2.jpg',
  '/food/tomato-salad.jpg',
  '/food/metuganim.jpg',
];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  return `${parseInt(d)} ב${months[parseInt(m) - 1]} ${y}`;
}

export default function HomePage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const carts: SavedCart[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('cart_')) continue;
      const date = key.slice(5);
      if (date < today) { localStorage.removeItem(key); continue; }
      try {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        if (items.length === 0) continue;
        const total = items.reduce((s: number, it: { price: number; quantity: number }) => s + it.price * it.quantity, 0);
        carts.push({ date, itemCount: items.length, total });
      } catch {}
    }
    carts.sort((a, b) => a.date.localeCompare(b.date));
    setSavedCarts(carts);
  }, [today]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) { setError('יש לבחור תאריך'); return; }
    router.push(`/order?date=${date}`);
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Photo grid background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {HERO_PHOTOS.map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                priority={i < 2}
              />
            </div>
          ))}
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(45,27,14,0.72) 0%, rgba(45,27,14,0.55) 50%, rgba(45,27,14,0.85) 100%)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-lg">

          {/* First order discount badge */}
          <div
            className="mb-5 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
            style={{ background: 'rgba(200,134,10,0.92)', color: '#fff', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            <span>🎉</span>
            <span>15% הנחה להזמנה ראשונה!</span>
          </div>

          {/* Logo / Brand */}
          <div className="mb-2">
            <span
              className="text-7xl font-black tracking-tight"
              style={{ color: '#FFFBF5', letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              אליתר
            </span>
          </div>
          <p
            className="text-lg font-medium mb-1"
            style={{ color: '#F5DEB3', letterSpacing: '0.08em' }}
          >
            אוכל ביתי מהלב
          </p>
          <p
            className="text-sm mb-10"
            style={{ color: 'rgba(245,222,179,0.75)' }}
          >
            לשישי בצהריים · לאירועים · למשפחה שלמה
          </p>

          {/* Saved carts */}
          {savedCarts.length > 0 && (
            <div className="w-full mb-4 space-y-2">
              {savedCarts.map(cart => (
                <button
                  key={cart.date}
                  onClick={() => router.push(`/order?date=${cart.date}`)}
                  className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-right transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(139,38,53,0.92)', backdropFilter: 'blur(12px)' }}
                >
                  <span className="text-white font-black text-base">המשך הזמנה ←</span>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">{formatDate(cart.date)}</p>
                    <p className="text-white/70 text-xs">{cart.itemCount} פריטים · ₪{cart.total % 1 === 0 ? cart.total : cart.total.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Date card */}
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-2xl p-6 shadow-2xl"
            style={{
              background: 'rgba(253,248,240,0.97)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              className="text-base font-bold mb-3 text-right"
              style={{ color: 'var(--color-text)' }}
            >
              {savedCarts.length > 0 ? 'או הזמינו לתאריך חדש:' : 'לאיזה תאריך תרצו להזמין?'}
            </p>

            <input
              type="date"
              value={date}
              min={today}
              onChange={e => { setDate(e.target.value); setError(''); }}
              className="w-full rounded-xl px-4 py-3 text-lg text-center font-medium outline-none transition-all mb-3"
              style={{
                border: `2px solid ${date ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: 'var(--color-warm)',
                color: 'var(--color-text)',
              }}
            />

            {error && (
              <p className="text-sm mb-2 text-center" style={{ color: 'var(--color-primary)' }}>{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              לבחירת המנות ←
            </button>
          </form>

          {/* Scroll hint */}
          <p className="mt-6 text-xs" style={{ color: 'rgba(245,222,179,0.6)' }}>
            גללו למטה לראות עוד
          </p>
        </div>
      </section>

      {/* About strip */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: 'var(--color-warm)' }}
      >
        <h2
          className="text-3xl font-black mb-3"
          style={{ color: 'var(--color-primary)' }}
        >
          בישול כמו בבית. ממש כמו בבית.
        </h2>
        <p
          className="text-base max-w-md mx-auto leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          כל מנה מבושלת ביד, עם חומרי גלם טריים, בדיוק כמו שסבתא הייתה עושה.
          המטבח שלנו עובד כל שבוע כדי שהשולחן שלכם יהיה מלא ומאושר.
        </p>
      </section>

      {/* Food photo gallery strip */}
      <section className="overflow-hidden" style={{ height: 220 }}>
        <div className="flex h-full gap-1">
          {[
            '/food/selek.jpg',
            '/food/tehina.jpg',
            '/food/olives.jpg',
            '/food/kruv-tiras.jpg',
            '/food/dish7.jpg',
          ].map((src, i) => (
            <div key={i} className="relative flex-1 min-w-0 overflow-hidden">
              <Image src={src} alt="" fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="py-14 px-6 max-w-2xl mx-auto w-full">
        <h2
          className="text-2xl font-black text-center mb-10"
          style={{ color: 'var(--color-text)' }}
        >
          למה אליתר?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🏠', title: 'מטבח ביתי', desc: 'בישול אמיתי, לא מפעל. כל מנה עם אהבה.' },
            { icon: '📅', title: 'הזמנה מראש', desc: 'בחרו תאריך ומנות, אנחנו נדאג לכל השאר.' },
            { icon: '🌿', title: 'חומרים טריים', desc: 'ירקות, בשר ותבלינים איכותיים בלבד.' },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{card.title}</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section
        className="py-14 px-6 text-center"
        style={{ background: 'var(--color-primary)' }}
      >
        <h2 className="text-3xl font-black text-white mb-2">מוכנים להזמין?</h2>
        <p className="text-white/70 mb-6 text-base">בחרו תאריך ובנו את הסל שלכם</p>
        <button
          onClick={() => {
            const el = document.querySelector('input[type="date"]');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 rounded-xl font-bold text-base transition-all hover:scale-105"
          style={{ background: '#fff', color: 'var(--color-primary)' }}
        >
          להזמנה ←
        </button>
      </section>

      {/* Footer */}
      <footer
        className="py-6 text-center text-sm"
        style={{ background: 'var(--color-text)', color: 'rgba(255,255,255,0.45)' }}
      >
        אליתר © {new Date().getFullYear()} · אוכל ביתי
      </footer>

    </main>
  );
}
