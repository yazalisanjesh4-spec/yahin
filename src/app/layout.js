"use client";

import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";

import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/login" || pathname === "/address";

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {!hideHeader && (
          <header className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-green-600">
                  Yahin
                </h1>
                <p className="text-sm text-gray-500">
                  Clothes delivered from nearby shops in under 2 hours
                </p>
              </div>

              <div className="flex gap-4 text-sm font-semibold">
                <a
                  href="/orders"
                  className="text-gray-700 hover:text-green-600"
                >
                  Orders
                </a>
                <a
                  href="/cart"
                  className="text-gray-700 hover:text-green-600"
                >
                  Cart
                </a>
              </div>
            </div>
          </header>
        )}

        
          <OrderProvider>
            <CartProvider>
              <main className="max-w-7xl mx-auto px-4 py-6">
                {children}
              </main>
            </CartProvider>
          </OrderProvider>
       
      </body>
    </html>
  );
}