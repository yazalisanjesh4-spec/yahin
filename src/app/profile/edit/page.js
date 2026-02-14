"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const snap = await getDoc(doc(db, "users", currentUser.uid));

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please fill all fields");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      name,
      phone,
      email: user.email,
    });

    alert("Profile updated successfully");
    router.push("/profile");
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

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-8">
          Edit Profile
        </h1>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-gray-200 rounded-xl px-4 py-3 text-gray-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-green-400 text-white py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}