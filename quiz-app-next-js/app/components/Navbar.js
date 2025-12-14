"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "flowbite-react";

export default function Navbar() {
  const [user, loading] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center text-xl font-semibold text-gray-900 dark:text-white"
            >
              Quiz App
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white border-b-2 border-blue-500"
              >
                Strona główna
              </Link>
              {user && (
                <>
                  <Link
                    href="/quiz/create"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Utwórz Quiz
                  </Link>
                  <Link
                    href="/quiz/my-quizzes"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Moje Quizy
                  </Link>
                  <Link
                    href="/quiz/browse"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Przeglądaj Quizy
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link href="/protected/user/profile">
                  <Button color="light" size="sm">
                    Profil
                  </Button>
                </Link>
                <Link href="/quiz/create">
                  <Button color="blue" size="sm">
                    Utwórz Quiz
                  </Button>
                </Link>
                <Link href="/quiz/my-quizzes">
                  <Button color="light" size="sm">
                    Moje Quizy
                  </Button>
                </Link>
                <Button color="failure" size="sm" onClick={handleSignOut}>
                  Wyloguj
                </Button>
              </>
            ) : (
              <>
                <Link href="/public/user/signin">
                  <Button color="blue" size="sm">
                    Zaloguj
                  </Button>
                </Link>
                <Link href="/public/user/register">
                  <Button color="light" size="sm">
                    Rejestracja
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Otwórz menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20"
            >
              Strona główna
            </Link>
            {user && (
              <>
                <Link
                  href="/quiz/create"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Utwórz Quiz
                </Link>
                <Link
                  href="/quiz/my-quizzes"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Moje Quizy
                </Link>
                <Link
                  href="/quiz/browse"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Przeglądaj Quizy
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1 px-2">
              {loading ? (
                <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <Link
                    href="/protected/user/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/public/user/signin"
                    className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Zaloguj
                  </Link>
                  <Link
                    href="/public/user/register"
                    className="block px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    Rejestracja
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
