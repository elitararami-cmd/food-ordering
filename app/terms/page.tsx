import Link from 'next/link';

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen py-12 px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>← חזרה לעמוד הראשי</Link>
          <h1 className="text-3xl font-black mt-4" style={{ color: 'var(--color-text)' }}>תקנון ותנאי שימוש</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>עדכון אחרון: יוני 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>פרטי העסק</h2>
          <div
            className="rounded-xl p-4 space-y-1"
            style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
          >
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>אליתר — אוכל ביתי</p>
            <p style={{ color: 'var(--color-text-muted)' }}>עוסק מורשה / עוסק פטור מס׳: <strong>OSEK_NUMBER</strong></p>
            <p style={{ color: 'var(--color-text-muted)' }}>טלפון: <a href="tel:PHONE_PLACEHOLDER" style={{ color: 'var(--color-primary)' }}>יש להוסיף מספר טלפון</a></p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>כללי</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            ברוכים הבאים לאליתר. השימוש באתר ובשירות ההזמנות מהווה הסכמה לתנאים המפורטים להלן.
            אליתר שומרת לעצמה את הזכות לעדכן את התקנון מעת לעת.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>קבלת הזמנות ואישורן</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>הגשת הזמנה באתר אינה מהווה אישור סופי — ההזמנה תאושר בהודעה ישירה (טלפון או הודעה).</li>
            <li>אליתר רשאית לסרב לכל הזמנה לפי שיקול דעתה, למשל בשל מחסור בחומרי גלם או עומס חריג.</li>
            <li>במקרה של אי-אישור, הלקוח יקבל הודעה ולא יחויב בתשלום.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>מחירים ותשלום</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>המחירים המוצגים באתר כוללים מע&quot;מ ומעודכנים לתאריך ביצוע ההזמנה.</li>
            <li>אליתר שומרת לעצמה את הזכות לעדכן מחירים ללא הודעה מוקדמת; המחיר הקובע הוא זה שנמסר באישור ההזמנה.</li>
            <li>התשלום מבוצע בעת קבלת ההזמנה, אלא אם סוכם אחרת.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>אספקה ואיחורים</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>אליתר תעשה כמיטב יכולתה לספק את ההזמנה במועד שנקבע.</li>
            <li>איחורים עקב נסיבות שאינן בשליטת אליתר (תנאי מזג אוויר, תקלות, וכד') אינם מקימים עילת תביעה.</li>
            <li>במקרה של עיכוב משמעותי, אליתר תיצור קשר עם הלקוח בהקדם האפשרי.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>ביטול הזמנה</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>ביטול הזמנה יש לבצע לפחות <strong>24 שעות לפני</strong> מועד האספקה.</li>
            <li>ביטול בפחות מ-24 שעות עשוי לחייב בדמי ביטול של עד 50% מסכום ההזמנה, לפי שיקול דעת אליתר.</li>
            <li>לביטול יש לפנות ישירות בטלפון.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>אלרגיות ומגבלות תזונתיות</h2>
          <div
            className="rounded-xl p-4"
            style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}
          >
            <p className="font-bold mb-1" style={{ color: '#92400e' }}>⚠️ חשוב לקריאה</p>
            <p style={{ color: '#78350f' }}>
              המטבח שלנו מטפל במגוון רכיבי מזון, ביניהם גלוטן, ביצים, חלב, שומשום, אגוזים ודגים.
              איננו יכולים להבטיח סביבה נקייה לחלוטין מאלרגנים.
              לקוחות עם אלרגיות קשות מתבקשים לפנות אלינו ישירות לפני ביצוע ההזמנה.
              אליתר לא תישא באחריות לתגובות אלרגיות שלא דווחו מראש.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>אחריות על האוכל</h2>
          <ul className="space-y-2 list-disc list-inside" style={{ color: 'var(--color-text-muted)' }}>
            <li>האוכל מיועד לצריכה ביום האספקה. יש לשמור במקרר ולצרוך תוך 24 שעות.</li>
            <li>אליתר לא תישא באחריות לנזקים הנובעים מאחסון לקוי לאחר האספקה.</li>
            <li>תלונה על איכות המוצר יש להגיש תוך 4 שעות מקבלת ההזמנה.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>יצירת קשר</h2>
          <div
            className="rounded-xl p-4 space-y-1"
            style={{ background: 'var(--color-warm)', border: '1px solid var(--color-border)' }}
          >
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>אליתר — אוכל ביתי</p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              טלפון: <a href="tel:PHONE_PLACEHOLDER" style={{ color: 'var(--color-primary)' }}>יש להוסיף מספר טלפון</a>
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
