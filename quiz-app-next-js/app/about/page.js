"use client";

import { Card } from "flowbite-react";
import { FaCode, FaUser, FaInfoCircle } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            O aplikacji
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Quiz App - Twórz i rozwiązuj quizy z różnymi typami pytań
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <FaInfoCircle className="text-3xl text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                O aplikacji
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Quiz App to nowoczesna aplikacja webowa umożliwiająca tworzenie
              i rozwiązywanie quizów z różnymi typami pytań. Aplikacja została
              zbudowana z wykorzystaniem najnowszych technologii webowych.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Funkcjonalności:
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Tworzenie quizów z różnymi typami pytań</li>
                <li>Rozwiązywanie quizów</li>
                <li>Zarządzanie własnymi quizami</li>
                <li>Przeglądanie dostępnych quizów</li>
                <li>System autentykacji użytkowników</li>
                <li>Weryfikacja adresu email</li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <FaCode className="text-3xl text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Technologie
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Frontend:
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Next.js 16</li>
                  <li>React 19</li>
                  <li>Tailwind CSS</li>
                  <li>Flowbite React</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Backend:
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Firebase Authentication</li>
                  <li>Cloud Firestore</li>
                  <li>Firebase Hosting</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Testy:
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Playwright (E2E)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-3xl text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Autor
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Olaf Ciuła
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Projekt na zaliczenie
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Wersja aplikacji: 1.0.0
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rok: 2025
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

