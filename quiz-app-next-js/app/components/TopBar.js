"use client";

import Link from "next/link";
import { useAuth } from "../lib/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "flowbite-react";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";

export default function TopBar({ onMenuToggle, isMenuOpen }) {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
        <div className="flex-1 hidden lg:block"></div>
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <Image
                      src={user.photoURL}
                      alt="Zdjęcie profilowe"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
                  {user.displayName || user.email}
                </span>
              </div>
              <Link href="/protected/user/profile">
                <Button color="light" size="sm">
                  Profil
                </Button>
              </Link>
              <Link href="/protected/user/signout">
                <Button color="failure" size="sm" onClick={handleSignOut}>
                  <FaSignOutAlt className="mr-2" />
                  Wyloguj
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/public/user/signin">
                <Button color="blue" size="sm">
                  <FaSignInAlt className="mr-2" />
                  Zaloguj
                </Button>
              </Link>
              <Link href="/public/user/register">
                <Button color="light" size="sm">
                  <FaUserPlus className="mr-2" />
                  Rejestracja
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
