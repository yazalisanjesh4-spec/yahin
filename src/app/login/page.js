"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // After login → go to profile page
      router.push("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl  rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2">
          Yahin
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Sign in to order clothes delivered in under 90 minutes
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border rounded-full py-3 font-medium hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          By continuing, you agree to use Yahin responsibly.
        </p>
      </div>
    </div>
  );
}