"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { Button, Card } from "flowbite-react";
import { useEffect } from "react";

export default function LogoutForm() {
  const router = useRouter();

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Wylogowywanie...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Trwa wylogowywanie z konta.
            </p>
            <form onSubmit={onSubmit}>
              <Button type="submit" color="failure" className="w-full">
                Wyloguj się
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
