"use client";

import Link from "next/link";
import { useAuth } from "./lib/AuthContext";
import { Button, Card } from "flowbite-react";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Witaj w Quiz App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Twórz, edytuj i rozwiązuj quizy z różnymi typami pytań
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : user ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Utwórz nowy quiz
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Stwórz własny quiz z różnymi typami pytań: pojedynczy wybór,
                wielokrotny wybór, uzupełnianie i dopasowanie par.
              </p>
              <Link href="/quiz/create">
                <Button color="blue" className="w-full">
                  Utwórz Quiz
                </Button>
              </Link>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Moje quizy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Zarządzaj swoimi quizami - edytuj, usuń lub zobacz statystyki.
              </p>
              <Link href="/quiz/my-quizzes">
                <Button color="light" className="w-full">
                  Zobacz Moje Quizy
                </Button>
              </Link>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Przeglądaj quizy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Znajdź i rozwiązuj quizy stworzone przez innych użytkowników.
              </p>
              <Link href="/quiz/browse">
                <Button color="light" className="w-full">
                  Przeglądaj
                </Button>
              </Link>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Typy pytań
              </h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                <li>• Pojedynczy wybór</li>
                <li>• Wielokrotny wybór</li>
                <li>• Uzupełnianie pól</li>
                <li>• Dopasowanie par</li>
              </ul>
            </Card>
          </div>
        ) : (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Zaloguj się, aby rozpocząć
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Zaloguj się lub zarejestruj, aby móc tworzyć i rozwiązywać
                quizy.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/public/user/signin">
                  <Button color="blue">Zaloguj się</Button>
                </Link>
                <Link href="/public/user/register">
                  <Button color="light">Rejestracja</Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
