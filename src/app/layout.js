"use client";

import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide header on these pages
  const hideHeader =
    pathname === "/login" ||
    pathname === "/cart" ||
    pathname === "/orders" ||
    pathname === "/profile"||
    pathname.startsWith("/profile/edit")||
    pathname.startsWith("/profile/address")

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* HEADER */}
        {!hideHeader && (
          <header className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-5xl font-extrabold text-blue-400">
                Yahin
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Get your favourite clothes delivered in less than 90 minutes
              </p>
            </div>
          </header>
        )}

        {/* PROVIDERS */}
        <OrderProvider>
          <CartProvider>
            <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
              {children}
            </main>
          </CartProvider>
        </OrderProvider>

        {/* NAVBAR */}
        <Navbar />
      </body>
    </html>
  );
}