"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { Button, Card, TextInput, Label, Alert } from "flowbite-react";
import { FaUser, FaEnvelope, FaImage, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

export default function ProfileForm() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    street: "",
    city: "",
    zipCode: "",
  });
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        street: "",
        city: "",
        zipCode: "",
      });
      loadUserAddress();
    }
  }, [user]);

  const loadUserAddress = async () => {
    if (!user) return;

    setLoadingAddress(true);
    try {
      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (snapshot.exists()) {
        const data = snapshot.data();
        const address = data.address || {};
        setFormData((prev) => ({
          ...prev,
          street: address.street || "",
          city: address.city || "",
          zipCode: address.zipCode || "",
        }));
      }
    } catch (error) {
      console.error("Error loading user address:", error);
      if (error.code === "permission-denied") {
        setError("Brak uprawnień do odczytu danych użytkownika.");
      }
    } finally {
      setLoadingAddress(false);
    }
  };

  if (!user) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const data = {
      displayName: e.target["displayName"].value,
      photoURL: e.target["photoURL"].value,
      street: e.target["street"].value,
      city: e.target["city"].value,
      zipCode: e.target["zipCode"].value,
    };

    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          address: {
            city: data.city,
            street: data.street,
            zipCode: data.zipCode,
          },
        },
        { merge: true }
      );

      console.log("Profile and address updated");
      setSuccess("Profil został zaktualizowany pomyślnie!");
      setLoading(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.code === "permission-denied") {
        setError(
          "Brak uprawnień do zapisu danych. Sprawdź reguły bezpieczeństwa Firestore."
        );
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profil użytkownika
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Zarządzaj swoimi danymi profilowymi
            </p>
          </div>

          {user.photoURL && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src={user.photoURL}
                  alt="Zdjęcie profilowe"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {error && (
            <Alert color="failure" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="success" className="mb-4">
              {success}
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="displayName" value="Nazwa wyświetlana" />
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <TextInput
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="pl-10 py-3 px-3"
                  placeholder="Twoja nazwa"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" value="Adres email (tylko do odczytu)" />
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-10 py-3 px-3 bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="photoURL" value="URL zdjęcia profilowego" />
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="h-5 w-5 text-gray-400" />
                </div>
                <TextInput
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) =>
                    setFormData({ ...formData, photoURL: e.target.value })
                  }
                  className="pl-10 py-3 px-3"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Wklej URL do zdjęcia profilowego
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Adres
              </h3>

              <div>
                <Label htmlFor="street" value="Ulica" />
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextInput
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    className="pl-10 py-3 px-3"
                    placeholder="Nazwa ulicy"
                    disabled={loadingAddress}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="city" value="Miasto" />
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextInput
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="pl-10 py-3 px-3"
                    placeholder="Nazwa miasta"
                    disabled={loadingAddress}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="zipCode" value="Kod pocztowy" />
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextInput
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="pl-10 py-3 px-3"
                    placeholder="00-000"
                    disabled={loadingAddress}
                  />
                </div>
              </div>
            </div>

            {loadingAddress && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ładowanie danych adresowych...
                </p>
              </div>
            )}

            <Button
              type="submit"
              color="blue"
              className="w-full mt-6"
              disabled={loading || loadingAddress}
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
