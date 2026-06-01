import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen py-12 px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>← חזרה לעמוד הראשי</Link>
          <h1 className="text-3xl font-black mt-4" style={{ color: 'var(--color-text)' }}>מדיניות פרטיות</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>עדכון אחרון: יוני 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>אילו מידע אנו אוספים</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            בעת ביצוע הזמנה, אנו אוספים את הפרטים הבאים בלבד:
          </p>
          <ul className="space-y-1 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>שם מלא</li>
            <li>מספר טלפון</li>
            <li>תאריך אספקה מבוקש</li>
            <li>פריטי ההזמנה</li>
            <li>הערות (אם הוזנו)</li>
          </ul>
          <p style={{ color: 'var(--color-text-muted)' }}>אנו <strong>לא</strong> אוספים כתובות אימייל, פרטי תשלום, או כל מידע אחר.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>למה אנו משתמשים במידע</h2>
          <ul className="space-y-1 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>לצורך עיבוד וסיום ההזמנה</li>
            <li>ליצירת קשר בנוגע להזמנה</li>
            <li>לבדיקת היסטוריית הזמנות לצורך הנחה לקוחות חוזרים</li>
          </ul>
          <p style={{ color: 'var(--color-text-muted)' }}>
            <strong>המידע לא ישמש לשיווק, לא יועבר לצד שלישי, ולא יימכר.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>שמירת המידע</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            פרטי ההזמנות נשמרים למשך שנה אחת מיום ביצוע ההזמנה לצורכי ניהול עסקי, ולאחר מכן נמחקים.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>הזכות לעיין ולמחוק מידע</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            בהתאם לחוק הגנת הפרטיות, יש לכם זכות לעיין במידע שנשמר עליכם ולבקש את מחיקתו.
            לבקשות כאלה, צרו איתנו קשר:
          </p>
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
          >
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>אליתר — אוכל ביתי</p>
            <p style={{ color: 'var(--color-text-muted)' }}>צרו קשר דרך האתר ונטפל בבקשתכם תוך 14 ימי עסקים.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>עוגיות (Cookies)</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            האתר משתמש בעוגייה טכנית אחת בלבד לצורך אימות ממשק הניהול. עוגייה זו אינה מכילה מידע אישי ומוחקת עם סגירת הדפדפן.
            לא נעשה שימוש בעוגיות שיווקיות או של צד שלישי.
          </p>
        </section>

      </div>
    </main>
  );
}
