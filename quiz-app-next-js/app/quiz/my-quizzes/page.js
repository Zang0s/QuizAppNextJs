"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Button, Card, Spinner, Alert } from "flowbite-react";
import Link from "next/link";

export default function MyQuizzes() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuizzes();
    }
  }, [user]);

  const loadQuizzes = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "quizzes"),
        where("authorId", "==", user.uid)
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
  };

  const handleDelete = async (quizId) => {
    if (!confirm("Czy na pewno chcesz usunąć ten quiz?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Błąd podczas usuwania quizu");
    }
  };

  if (loading || loadingQuizzes) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    router.push("/public/user/signin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Moje quizy
          </h1>
          <Link href="/quiz/create">
            <Button color="blue">+ Utwórz nowy quiz</Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Nie masz jeszcze żadnych quizów.
              </p>
              <Link href="/quiz/create">
                <Button color="blue">Utwórz pierwszy quiz</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
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
                      {quiz.questions?.length || 0} pytań • Utworzono:{" "}
                      {quiz.createdAt?.toDate?.().toLocaleDateString("pl-PL") ||
                        "Nieznana data"}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/quiz/${quiz.id}`}>
                      <Button color="blue" size="sm">
                        Zobacz
                      </Button>
                    </Link>
                    <Link href={`/quiz/edit/${quiz.id}`}>
                      <Button color="light" size="sm">
                        Edytuj
                      </Button>
                    </Link>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
                    >
                      Usuń
                    </Button>
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
