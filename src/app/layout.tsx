import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValetPark - 발렛 주차 관리",
  description: "심플한 발렛 주차 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
