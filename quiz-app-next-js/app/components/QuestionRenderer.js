"use client";

import SingleChoice from "./SingleChoice";
import MultipleChoice from "./MultipleChoice";
import FillInBlanks from "./FillInBlanks";
import MatchingPairs from "./MatchingPairs";

export default function QuestionRenderer({
  question,
  onSubmit,
  isReadOnly = false,
  userAnswer = null,
}) {
  if (!question || !question.type) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Błąd: Nieprawidłowy typ pytania
        </p>
      </div>
    );
  }

  const commonProps = {
    question,
    onSubmit,
    isReadOnly,
    userAnswer,
  };

  switch (question.type) {
    case "single-choice":
      return <SingleChoice {...commonProps} />;

    case "multiple-choice":
      return <MultipleChoice {...commonProps} />;

    case "fill-in-blanks":
      return <FillInBlanks {...commonProps} />;

    case "matching-pairs":
      return <MatchingPairs {...commonProps} />;

    default:
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-600 dark:text-yellow-400">
            Nieobsługiwany typ pytania: {question.type}
          </p>
        </div>
      );
  }
}
