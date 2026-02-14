"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  /* =============================
     AUTH CHECK
  ============================== */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  /* =============================
     FETCH ADDRESSES
  ============================== */
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser) return;

      const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "addresses")
      );

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(list);

      if (list.length > 0) {
        setSelectedAddress(list[0]);
      }
    };

    fetchAddresses();
  }, [currentUser]);

  /* =============================
     ATOMIC PLACE ORDER
  ============================== */
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select delivery address");
      return;
    }

    if (!currentUser) return;

    try {
      setPlacingOrder(true);

      await runTransaction(db, async (transaction) => {

        // 1️⃣ Check availability
        for (let item of cartItems) {
          const productRef = doc(db, "products", item.id);
          const productSnap = await transaction.get(productRef);

          if (!productSnap.exists()) {
            throw new Error("Product not found");
          }

          if (!productSnap.data().isAvailable) {
            throw new Error("Product already sold");
          }
        }

        // 2️⃣ Lock products
        for (let item of cartItems) {
          const productRef = doc(db, "products", item.id);
          transaction.update(productRef, {
            isAvailable: false,
          });
        }

        // 3️⃣ Create order
        const orderRef = doc(collection(db, "orders"));
        transaction.set(orderRef, {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          address: selectedAddress,
          items: cartItems,
          totalAmount,
          status: "Payment verification pending",
          createdAt: serverTimestamp(),
        });

      });

      localStorage.removeItem("yahin_cart");
      router.push("/order-confirmation");

    } catch (error) {
      console.error(error);

      if (error.message === "Product already sold") {
        alert("Sorry, this product was just sold to another user.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  /* =============================
     GUARDS
  ============================== */

  if (loadingAuth) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold">
          Your cart is empty
        </h2>
        <Link
          href="/"
          className="text-green-600 font-semibold mt-4 inline-block"
        >
          Go shopping →
        </Link>
      </div>
    );
  }

  /* =============================
     UI
  ============================== */

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ADDRESS SECTION */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-3">
          Select Delivery Address
        </h2>

        {addresses.length === 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-3">
              No saved addresses found.
            </p>
            <Link
              href="/profile/address"
              className="text-green-600 font-semibold"
            >
              + Add New Address
            </Link>
          </>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr)}
              className={`border rounded-lg p-3 mb-2 cursor-pointer ${
                selectedAddress?.id === addr.id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium">{addr.address}</p>
            </div>
          ))
        )}
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white shadow-xl p-4 rounded-2xl shadow-sm ">
        <h2 className="font-semibold mb-4">
          Order Summary
        </h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 mb-4">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-20 h-20 object-contain rounded-lg border"
            />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                Size: {item.size}
              </p>
              <p className="text-sm font-semibold">
                ₹{item.price}
              </p>
            </div>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-4 text-lg">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
        <h2 className="font-semibold mb-3">
          Pay using UPI
        </h2>

        <img
          src="/upi-qr.png"
          alt="UPI QR"
          className="w-48 h-48 mx-auto border rounded-lg mb-4"
        />

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {placingOrder ? "Placing Order..." : "I have paid"}
        </button>
      </div>

    </div>
  );
}