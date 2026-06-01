import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אליתר — אוכל ביתי",
  description: "הזמינו אוכל ביתי מסורתי לשישי, אירועים ומשפחות",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
          style={{ background: '#8B2635', color: '#fff' }}
        >
          דלג לתוכן הראשי
        </a>
        {children}
      </body>
    </html>
  );
}
