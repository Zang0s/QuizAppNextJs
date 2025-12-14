"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button, Card, TextInput, Label, Alert } from "flowbite-react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";

export default function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return null;
  }

  const auth = getAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    setRegisterError("");
    setLoading(true);

    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const confirmPassword = e.target["confirmPassword"].value;

    if (password !== confirmPassword) {
      setRegisterError("Hasła nie są identyczne.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setRegisterError("Hasło musi mieć co najmniej 6 znaków.");
      setLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered!");
        router.push("/");
        setLoading(false);
      })
      .catch((error) => {
        setRegisterError(error.message);
        console.dir(error);
        setLoading(false);

        let userFriendlyMessage = "Wystąpił błąd podczas rejestracji.";
        switch (error.code) {
          case "auth/email-already-in-use":
            userFriendlyMessage =
              "Adres email jest już używany przez inne konto.";
            break;
          case "auth/invalid-email":
            userFriendlyMessage = "Nieprawidłowy adres email.";
            break;
          case "auth/operation-not-allowed":
            userFriendlyMessage = "Operacja rejestracji nie jest dozwolona.";
            break;
          case "auth/weak-password":
            userFriendlyMessage = "Hasło jest zbyt słabe.";
            break;
          default:
            userFriendlyMessage = error.message;
        }
        setRegisterError(userFriendlyMessage);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Utwórz konto
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Wypełnij formularz, aby utworzyć nowe konto
          </p>
        </div>

        {registerError && (
          <Alert color="failure" className="mb-4">
            {registerError}
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
                autoComplete="new-password"
                required
                className="pl-10"
                placeholder="Minimum 6 znaków"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" value="Potwierdź hasło" />
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="pl-10"
                placeholder="Powtórz hasło"
              />
            </div>
          </div>

          <Button
            type="submit"
            color="blue"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Masz już konto?{" "}
            <Link
              href="/public/user/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
