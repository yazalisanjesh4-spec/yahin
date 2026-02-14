"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function AddressesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      await fetchAddresses(currentUser.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchAddresses = async (uid) => {
    const snapshot = await getDocs(
      collection(db, "users", uid, "addresses")
    );

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAddresses(list);
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) {
      alert("Please enter address");
      return;
    }

    await addDoc(
      collection(db, "users", user.uid, "addresses"),
      {
        address: newAddress,
        createdAt: new Date(),
      }
    );

    setNewAddress("");
    setShowForm(false);
    fetchAddresses(user.uid);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "address", id));
    fetchAddresses(user.uid);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-8 flex justify-center">
      <div className="w-full max-w-md">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          My Addresses
        </h1>

        {/* Add Address Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 bg-blue-600 text-white py-3 rounded-xl font-semibold "
        >
          + Add New Address
        </button>

        {/* Add Address Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <textarea
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter full delivery address"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddAddress}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl font-semibold"
            >
              Save Address
            </button>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.length === 0 && (
            <p className="text-center text-gray-500">
              No saved addresses yet.
            </p>
          )}

          {addresses.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-start"
            >
              <p className="text-sm text-gray-700 w-4/5">
                {item.address}
              </p>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}