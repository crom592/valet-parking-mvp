import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValetPark - 스마트 발렛 파킹 관리",
  description: "차량 입출차, 키 관리, 위치 추적을 한 곳에서. 종이 대장은 이제 그만!",
  keywords: ["발렛파킹", "주차관리", "발렛", "호텔", "레스토랑", "스마트파킹"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className="dark"><body className="antialiased bg-gray-950 text-white">{children}</body></html>;
}
