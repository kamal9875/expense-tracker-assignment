import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Expense Tracker" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/exchange">Exchange Rates</Link>
        </div>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
