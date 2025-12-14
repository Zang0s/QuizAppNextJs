"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  Button,
  Card,
  TextInput,
  Textarea,
  Label,
  Select,
} from "flowbite-react";
import QuestionEditor from "../../components/QuestionEditor";

export default function CreateQuiz() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/public/user/signin");
    return null;
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
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const cleanedQuizData = removeUndefined(quizData);

      const docRef = await addDoc(collection(db, "quizzes"), cleanedQuizData);
      console.log("Quiz saved successfully with ID:", docRef.id);
      router.push(`/quiz/${docRef.id}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let errorMessage = "Błąd podczas zapisywania quizu.";
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
          Utwórz nowy quiz
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
          <Button color="light" onClick={() => router.push("/")}>
            Anuluj
          </Button>
          <Button
            color="blue"
            onClick={handleSave}
            disabled={saving || !quizTitle.trim() || questions.length === 0}
          >
            {saving ? "Zapisywanie..." : "Zapisz quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
}
