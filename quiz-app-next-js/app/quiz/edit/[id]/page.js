"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../lib/AuthContext";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Button,
  Card,
  TextInput,
  Textarea,
  Label,
  Select,
  Spinner,
  Alert,
} from "flowbite-react";
import QuestionEditor from "../../../components/QuestionEditor";

export default function EditQuiz() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && params.id) {
      loadQuiz();
    }
  }, [user, params.id]);

  const loadQuiz = async () => {
    if (!user || !params.id) return;

    try {
      const quizDoc = await getDoc(doc(db, "quizzes", params.id));
      if (quizDoc.exists()) {
        const quizData = { id: quizDoc.id, ...quizDoc.data() };
        setQuiz(quizData);

        if (quizData.authorId !== user.uid) {
          setError("Nie masz uprawnień do edycji tego quizu.");
          setLoadingQuiz(false);
          return;
        }

        setQuizTitle(quizData.title || "");
        setQuizDescription(quizData.description || "");
        setQuestions(quizData.questions || []);
      } else {
        setError("Quiz nie został znaleziony.");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      setError("Błąd podczas ładowania quizu: " + error.message);
    } finally {
      setLoadingQuiz(false);
    }
  };

  if (loading || loadingQuiz) {
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert color="failure">{error}</Alert>
          <div className="mt-4">
            <Button color="light" onClick={() => router.push("/quiz/my-quizzes")}>
              Wróć do moich quizów
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert color="failure">Quiz nie został znaleziony.</Alert>
          <div className="mt-4">
            <Button color="light" onClick={() => router.push("/quiz/my-quizzes")}>
              Wróć do moich quizów
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const addQuestion = (type) => {
    const baseQuestion = {
      type,
      title: "",
      content: "",
    };

    if (type === "single-choice" || type === "multiple-choice") {
      baseQuestion.options = [{ text: "", type: "text" }];
      if (type === "single-choice") {
        baseQuestion.correctAnswer = null;
      } else {
        baseQuestion.correctAnswers = [];
      }
    } else if (type === "fill-in-blanks") {
      baseQuestion.options = [];
    } else if (type === "matching-pairs") {
      baseQuestion.leftItems = [];
      baseQuestion.rightItems = [];
      baseQuestion.correctPairs = [];
    }

    setQuestions([...questions, baseQuestion]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const removeUndefined = (obj) => {
    if (obj === null || obj === undefined) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj
        .map((item) => removeUndefined(item))
        .filter((item) => item !== undefined);
    }
    if (typeof obj === "object") {
      const cleaned = {};
      for (const key in obj) {
        if (obj[key] !== undefined) {
          cleaned[key] = removeUndefined(obj[key]);
        }
      }
      return cleaned;
    }
    return obj;
  };

  const handleSave = async () => {
    if (!quizTitle.trim()) {
      alert("Proszę podać tytuł quizu");
      return;
    }

    if (questions.length === 0) {
      alert("Proszę dodać przynajmniej jedno pytanie");
      return;
    }

    setSaving(true);
    try {
      const quizData = {
        title: quizTitle,
        description: quizDescription || "",
        questions: questions.map((q) => removeUndefined(q)),
        updatedAt: new Date(),
        authorId: quiz.authorId,
        authorEmail: quiz.authorEmail,
        createdAt: quiz.createdAt,
      };

      const cleanedQuizData = removeUndefined(quizData);

      await updateDoc(doc(db, "quizzes", params.id), cleanedQuizData);
      console.log("Quiz updated successfully");
      router.push(`/quiz/${params.id}`);
    } catch (error) {
      console.error("Error updating quiz:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let errorMessage = "Błąd podczas aktualizacji quizu.";
      if (error.code === "permission-denied") {
        errorMessage =
          "Brak uprawnień do zapisu. Sprawdź reguły bezpieczeństwa Firestore w Firebase Console.";
      } else if (error.code === "unavailable") {
        errorMessage =
          "Firestore nie jest dostępne. Sprawdź czy Firestore jest włączone w Firebase Console.";
      } else {
        errorMessage = `Błąd: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Edytuj quiz
        </h1>

        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="quiz-title" value="Tytuł quizu *" />
              <TextInput
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Np. Quiz z matematyki"
                required
                className="py-3 px-3"
              />
            </div>
            <div>
              <Label htmlFor="quiz-description" value="Opis quizu" />
              <Textarea
                id="quiz-description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Krótki opis quizu..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Pytania ({questions.length})
            </h2>
            <Select
              onChange={(e) => e.target.value && addQuestion(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Dodaj pytanie...
              </option>
              <option value="single-choice">Pojedynczy wybór</option>
              <option value="multiple-choice">Wielokrotny wybór</option>
              <option value="fill-in-blanks">Uzupełnianie pól</option>
              <option value="matching-pairs">Dopasowanie par</option>
            </Select>
          </div>

          {questions.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nie dodano jeszcze żadnych pytań. Wybierz typ pytania z listy
                powyżej.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={index}
                  question={question}
                  index={index}
                  onUpdate={(updated) => updateQuestion(index, updated)}
                  onRemove={() => removeQuestion(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <Button color="light" onClick={() => router.push(`/quiz/${params.id}`)}>
            Anuluj
          </Button>
          <Button
            color="blue"
            onClick={handleSave}
            disabled={saving || !quizTitle.trim() || questions.length === 0}
          >
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </div>
      </div>
    </div>
  );
}

