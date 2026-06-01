import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <main id="main-content" className="min-h-screen py-12 px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>← חזרה לעמוד הראשי</Link>
          <h1 className="text-3xl font-black mt-4" style={{ color: 'var(--color-text)' }}>הצהרת נגישות</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>עדכון אחרון: יוני 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>מחויבות לנגישות</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            אליתר מחויבת להנגשת האתר לאנשים עם מוגבלויות, בהתאם לתקן ישראלי 5568 ולהנחיות WCAG 2.1 ברמה AA.
            אנו פועלים באופן שוטף לשיפור הנגישות ומעודכנים בהנחיות העדכניות ביותר.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>נגישות פיזית</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            העסק פועל במתכונת של משלוחים בלבד ואינו מקבל קהל פיזית. אין צורך בהגעה למקום.
            ההזמנה מבוצעת דרך האתר וניתנת לביצוע מכל מקום ומכל מכשיר.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>מה מונגש באתר</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>האתר מוגדר בשפה העברית (<code>lang=&quot;he&quot;</code>) ובכיוון RTL</li>
            <li>כל התמונות כוללות טקסט חלופי (alt text)</li>
            <li>כל כפתורי הפעולה כוללים תיאור נגיש (aria-label)</li>
            <li>ניתן לנווט באתר באמצעות מקלדת בלבד</li>
            <li>קיים קישור &quot;דלג לתוכן הראשי&quot; לניווט מהיר</li>
            <li>שדות הטופס כוללים תוויות ברורות</li>
            <li>ניגודיות הצבעים עומדת בדרישות WCAG AA לטקסט גדול ובולט</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>מגבלות נגישות ידועות</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>חלק מרכיבי הממשק עשויים להיות לא אופטימליים לקוראי מסך מסוימים — אנו עובדים על שיפור זה</li>
            <li>ניגודיות הצבעים בטקסט רגיל עשויה שלא לעמוד ברמת AAA</li>
          </ul>
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
          >
            <p style={{ color: 'var(--color-text-muted)' }}>
              במידה ונתקלתם בקושי בשימוש באתר או בביצוע הזמנה עקב מגבלת נגישות, נשמח להעניק לכם שירות אישי
              ולבצע את ההזמנה <strong>טלפונית</strong> — צרו קשר ישירות עם רכז הנגישות שלנו.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>פנייה לרכז הנגישות</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן בהקדם האפשרי.
          </p>
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
          >
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>רכז נגישות: ישראל ישראלי</p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              טלפון / WhatsApp:{' '}
              <a href="tel:PHONE_PLACEHOLDER" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                יש להוסיף מספר טלפון
              </a>
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              אימייל:{' '}
              <a href="mailto:EMAIL_PLACEHOLDER" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                יש להוסיף כתובת אימייל
              </a>
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>זמן תגובה מרבי: 5 ימי עסקים</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>תאריך הצהרה ועדכון</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            הצהרת נגישות זו עודכנה לאחרונה ביוני 2026 ותעודכן אחת לשנה לכל הפחות.
          </p>
        </section>

      </div>
    </main>
  );
}
