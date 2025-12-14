"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Card, Alert, Button } from "flowbite-react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function VerifyEmail() {
  const { user } = useAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }

    const auth = getAuth();
    if (user && !isLoggedOut) {
      signOut(auth)
        .then(() => {
          console.log("User signed out after registration");
          setIsLoggedOut(true);
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    }
  }, [user, isLoggedOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <FaEnvelope className="text-6xl text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Weryfikacja adresu email
          </h1>
        </div>

        <Alert color="info" className="mb-4">
          <div className="flex items-start">
            <FaCheckCircle className="mt-1 mr-2" />
            <div>
              <p className="font-medium mb-2">
                Email nie został zweryfikowany.
              </p>
              <p className="text-sm">
                Kliknij na link w wiadomości email wysłanej na adres{" "}
                <strong>{userEmail || user?.email || "twój email"}</strong> aby
                zweryfikować swoje konto.
              </p>
            </div>
          </div>
        </Alert>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Po weryfikacji adresu email będziesz mógł w pełni korzystać z
            aplikacji.
          </p>

          <div className="flex gap-3">
            <Link href="/public/user/signin" className="flex-1">
              <Button color="blue" className="w-full">
                Przejdź do logowania
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button color="light" className="w-full">
                Strona główna
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
