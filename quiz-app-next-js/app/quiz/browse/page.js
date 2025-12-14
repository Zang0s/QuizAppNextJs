"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Button, Card, Spinner, TextInput } from "flowbite-react";
import Link from "next/link";

export default function BrowseQuizzes() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadQuizzes = useCallback(async () => {
    try {
      const q = query(
        collection(db, "quizzes"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const quizzesList = [];
      querySnapshot.forEach((doc) => {
        quizzesList.push({ id: doc.id, ...doc.data() });
      });
      setQuizzes(quizzesList);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoadingQuizzes(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description &&
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || loadingQuizzes) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Przeglądaj quizy
        </h1>

        <div className="mb-6">
          <TextInput
            type="text"
            placeholder="Szukaj quizów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md py-3 px-3"
          />
        </div>

        {filteredQuizzes.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Nie znaleziono quizów pasujących do wyszukiwania."
                  : "Brak dostępnych quizów."}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {quiz.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {quiz.questions?.length || 0} pytań • Autor:{" "}
                      {quiz.authorEmail || "Nieznany"} •
                      {quiz.createdAt?.toDate?.().toLocaleDateString("pl-PL") ||
                        "Nieznana data"}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Link href={`/quiz/${quiz.id}`}>
                      <Button color="blue" size="sm">
                        Rozwiąż quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
