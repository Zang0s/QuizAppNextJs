"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import QuestionRenderer from "../../components/QuestionRenderer";
import { Button, Card, Spinner, Alert } from "flowbite-react";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mode, setMode] = useState("take");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, "quizzes", params.id));
        if (quizDoc.exists()) {
          setQuiz({ id: quizDoc.id, ...quizDoc.data() });
          setAnswers(new Array(quizDoc.data().questions.length).fill(null));
        } else {
          setQuiz(null);
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoadingQuiz(false);
      }
    };

    if (params.id) {
      loadQuiz();
    }
  }, [params.id]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      setMode("view");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setMode("view");
  };

  if (loading || loadingQuiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">Quiz nie został znaleziony.</Alert>
        <Button color="light" onClick={() => router.push("/")} className="mt-4">
          Powrót do strony głównej
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {quiz.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pytanie {currentQuestionIndex + 1} z {quiz.questions.length}
            </p>
            {user && user.uid === quiz.authorId && (
              <Button
                color="light"
                size="sm"
                onClick={() => router.push(`/quiz/edit/${params.id}`)}
              >
                Edytuj quiz
              </Button>
            )}
          </div>
        </Card>

        {!showResults ? (
          <>
            <QuestionRenderer
              question={currentQuestion}
              onSubmit={handleAnswer}
              isReadOnly={false}
              userAnswer={answers[currentQuestionIndex]}
            />

            <div className="flex justify-between mt-6">
              <Button
                color="light"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Poprzednie
              </Button>
              {isLastQuestion ? (
                <Button color="blue" onClick={handleSubmitQuiz}>
                  Zakończ quiz
                </Button>
              ) : (
                <Button color="blue" onClick={handleNext}>
                  Następne
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Wyniki quizu
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Oto Twoje odpowiedzi na wszystkie pytania:
              </p>
            </Card>

            {quiz.questions.map((question, index) => (
              <div key={index}>
                <QuestionRenderer
                  question={question}
                  isReadOnly={true}
                  userAnswer={answers[index]}
                />
              </div>
            ))}

            <div className="flex gap-4 justify-center">
              <Button color="light" onClick={() => router.push("/quiz/browse")}>
                Przeglądaj inne quizy
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setAnswers(new Array(quiz.questions.length).fill(null));
                }}
              >
                Rozwiąż ponownie
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
