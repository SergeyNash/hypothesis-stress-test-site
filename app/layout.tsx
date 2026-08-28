import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hypothesis Stress Test — ломайте слабые гипотезы до разработки",
  description:
    "Open-source фреймворк Сергея Синякова для системной проверки продуктовых гипотез с помощью LLM, внутренних знаний и рыночных сигналов.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
