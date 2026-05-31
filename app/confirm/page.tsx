'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const date = searchParams.get('date');

  const [y, m, d] = (date || '').split('-');
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  const formattedDate = date ? `${parseInt(d)} ב${months[parseInt(m)-1]} ${y}` : '';

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center space-y-4 shadow-xl"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto"
          style={{ background: 'rgba(139,38,53,0.1)' }}
        >
          ✅
        </div>

        <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
          ההזמנה התקבלה!
        </h1>

        <div
          className="rounded-xl px-4 py-3 space-y-1"
          style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>מספר הזמנה</p>
          <p className="text-2xl font-black" style={{ color: 'var(--color-primary)' }}>#{id}</p>
          {formattedDate && (
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              📅 {formattedDate}
            </p>
          )}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          תודה! ניצור איתך קשר בקרוב לאישור הסופי של ההזמנה.
        </p>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3.5 rounded-xl font-bold transition-all hover:opacity-90"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          הזמנה חדשה ←
        </button>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>טוען...</p>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
