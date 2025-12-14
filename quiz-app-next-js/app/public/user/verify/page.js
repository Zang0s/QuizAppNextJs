"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  signOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
  reload,
} from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Card, Alert, Button } from "flowbite-react";
import { FaEnvelope, FaCheckCircle, FaRedo, FaSync } from "react-icons/fa";
import Link from "next/link";

export default function VerifyEmail() {
  const { user } = useAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }

    if (currentUser && !isLoggedOut) {
      signOut(auth)
        .then(() => {
          console.log("User signed out after registration");
          setIsLoggedOut(true);
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    }
  }, [isLoggedOut]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setResendError("");

    const auth = getAuth();
    const email = userEmail || prompt("Podaj adres email:");

    if (!email) {
      setResendError("Adres email jest wymagany.");
      setResendLoading(false);
      return;
    }

    try {
      const password = prompt("Podaj hasło, aby ponownie zalogować się i wysłać email:");
      if (!password) {
        setResendError("Hasło jest wymagane.");
        setResendLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;

      if (currentUser) {
        await sendEmailVerification(currentUser);
        setResendSuccess(true);
        setUserEmail(currentUser.email);
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      let errorMessage = "Wystąpił błąd podczas wysyłania emaila.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Użytkownik nie został znaleziony.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Nieprawidłowe hasło.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Nieprawidłowy adres email lub hasło.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Zbyt wiele prób. Spróbuj ponownie później.";
      }
      setResendError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckLoading(true);
    setResendError("");

    const auth = getAuth();
    const email = userEmail || prompt("Podaj adres email:");

    if (!email) {
      setResendError("Adres email jest wymagany.");
      setCheckLoading(false);
      return;
    }

    try {
      const password = prompt("Podaj hasło, aby sprawdzić status weryfikacji:");
      if (!password) {
        setResendError("Hasło jest wymagane.");
        setCheckLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      const currentUser = auth.currentUser;

      if (currentUser) {
        await reload(currentUser);
        const updatedUser = auth.currentUser;

        if (updatedUser.emailVerified) {
          setIsVerified(true);
          setResendSuccess(true);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setResendError("Email nadal nie jest zweryfikowany. Sprawdź skrzynkę pocztową lub zweryfikuj ręcznie w Firebase Console.");
        }
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      let errorMessage = "Wystąpił błąd podczas sprawdzania weryfikacji.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Użytkownik nie został znaleziony.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Nieprawidłowe hasło.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Nieprawidłowy adres email lub hasło.";
      }
      setResendError(errorMessage);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleManualVerify = async () => {
    setVerifyLoading(true);
    setResendError("");
    setResendSuccess(false);

    const email = userEmail || prompt("Podaj adres email:");
    if (!email) {
      setResendError("Adres email jest wymagany.");
      setVerifyLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd podczas weryfikacji.");
      }

      setResendSuccess(true);
      setIsVerified(true);
      setTimeout(() => {
        router.push("/public/user/signin");
      }, 2000);
    } catch (error) {
      console.error("Error verifying email:", error);
      setResendError(
        error.message ||
          "Nie można zweryfikować emaila. Upewnij się, że Firebase Admin SDK jest skonfigurowany."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

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

          {resendSuccess && (
            <Alert color="success" className="mb-4">
              Email weryfikacyjny został ponownie wysłany!
            </Alert>
          )}

          {resendError && (
            <Alert color="failure" className="mb-4">
              {resendError}
            </Alert>
          )}

          {isVerified && (
            <Alert color="success" className="mb-4">
              Email został zweryfikowany! Przekierowywanie...
            </Alert>
          )}

          <div className="space-y-2">
            {userEmail && (
              <>
                <Button
                  color="light"
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={resendLoading || checkLoading || verifyLoading}
                >
                  <FaRedo className="mr-2" />
                  {resendLoading
                    ? "Wysyłanie..."
                    : "Wyślij ponownie email weryfikacyjny"}
                </Button>
                <Button
                  color="blue"
                  className="w-full"
                  onClick={handleCheckVerification}
                  disabled={resendLoading || checkLoading || verifyLoading}
                >
                  <FaSync className="mr-2" />
                  {checkLoading
                    ? "Sprawdzanie..."
                    : "Sprawdź status weryfikacji"}
                </Button>
                <Button
                  color="blue"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleManualVerify}
                  disabled={resendLoading || checkLoading || verifyLoading}
                >
                  <FaCheckCircle className="mr-2" />
                  {verifyLoading
                    ? "Weryfikowanie..."
                    : "Zweryfikuj email ręcznie"}
                </Button>
              </>
            )}
          </div>

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
