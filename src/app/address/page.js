"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AddressPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const saveDetails = async () => {
    if (!phone || !address) {
      alert("Fill all fields");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      phone,
      address,
      createdAt: new Date(),
    });

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold text-center mb-6">
          Delivery Details
        </h1>

        <input
          type="tel"
          placeholder="Phone number"
          className="w-full border rounded px-3 py-2 mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Delivery address"
          className="w-full border rounded px-3 py-2 mb-4"
          rows={4}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={saveDetails}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}