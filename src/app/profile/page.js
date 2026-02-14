"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      try {
        setUser(currentUser);

        // Fetch profile
        const userSnap = await getDoc(
          doc(db, "users", currentUser.uid)
        );

        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }

        // IMPORTANT: match checkout page subcollection name
        const addrSnap = await getDocs(
          collection(db, "users", currentUser.uid, "addresses")
        );

        setAddressCount(addrSnap.size);

      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="w-full max-w-md">

        {/* PROFILE HEADER */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600">
            {profile?.name
              ? profile.name.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            {profile?.name || "User"}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        {/* OPTIONS */}
        <div className="space-y-4">

          <Link
            href="/orders"
            className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition px-5 py-4 rounded-full"
          >
            <span className="text-xl">📦</span>
            <span className="text-lg font-medium">Orders</span>
          </Link>

          <Link
            href="/profile/address"
            className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition px-5 py-4 rounded-full"
          >
            <span className="text-xl">📍</span>
            <span className="text-lg font-medium">
              Saved Addresses ({addressCount})
            </span>
          </Link>

          <Link
            href="/profile/edit"
            className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition px-5 py-4 rounded-full"
          >
            <span className="text-xl">⚙️</span>
            <span className="text-lg font-medium">
              Manage Account
            </span>
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 transition px-5 py-4 rounded-full"
          >
            <span className="text-xl">🛒</span>
            <span className="text-lg font-medium">Cart</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-4 w-full bg-red-500 hover:bg-red-600 transition px-5 py-4 rounded-full mt-6"
          >
            <span className="text-lg font-medium text-white">
              Logout
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}