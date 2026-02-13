"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `flex-1 text-center py-3 ${
      pathname === path
        ? "text-green-600 font-semibold"
        : "text-gray-500"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white flex">
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>

      <Link href="/cart" className={linkClass("/cart")}>
        Cart
      </Link>

      <Link href="/orders" className={linkClass("/orders")}>
        Orders
      </Link>

      <Link href="/profile" className={linkClass("/profile")}>
        Profile
      </Link>
    </nav>
  );
}