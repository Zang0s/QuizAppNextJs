"use client";

import { useState, Suspense } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card, TextInput, Label, Alert } from "flowbite-react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";

function SignInFormContent() {
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target["email"].value;
    const password = e.target["password"].value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
              router.push("/public/user/verify");
              setLoading(false);
            } else {
              const redirectPath = returnUrl || "/";
              router.push(redirectPath);
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);

            let userFriendlyMessage = "Wystąpił błąd podczas logowania.";
            switch (errorCode) {
              case "auth/user-not-found":
                userFriendlyMessage =
                  "Użytkownik o podanym adresie email nie istnieje.";
                break;
              case "auth/wrong-password":
                userFriendlyMessage = "Nieprawidłowe hasło.";
                break;
              case "auth/invalid-credential":
                userFriendlyMessage =
                  "Nieprawidłowy adres email lub hasło. Sprawdź wprowadzone dane.";
                break;
              case "auth/invalid-email":
                userFriendlyMessage = "Nieprawidłowy adres email.";
                break;
              case "auth/user-disabled":
                userFriendlyMessage = "Konto użytkownika zostało wyłączone.";
                break;
              case "auth/too-many-requests":
                userFriendlyMessage =
                  "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.";
                break;
              default:
                userFriendlyMessage = errorMessage;
            }
            setError(userFriendlyMessage);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setError("Wystąpił błąd podczas ustawiania sesji.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Zaloguj się
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Wprowadź swoje dane, aby uzyskać dostęp do konta
          </p>
        </div>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" value="Adres email" />
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pl-10"
                placeholder="twoj@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" value="Hasło" />
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            color="blue"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nie masz konta?{" "}
            <Link
              href="/public/user/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SignInFormContent />
    </Suspense>
  );
}
