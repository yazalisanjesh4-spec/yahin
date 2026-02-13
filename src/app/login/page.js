"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/address");
    } catch (err) {
      alert(err.message);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/address");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Yahin
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={emailLogin}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold"
        >
          Login
        </button>

        <div className="my-4 text-center text-gray-400">
          OR
        </div>

        <button
          onClick={googleLogin}
          className="w-full border py-3 rounded font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}