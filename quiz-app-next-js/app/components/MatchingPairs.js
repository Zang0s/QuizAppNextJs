"use client";

import { Select, Label, Button } from "flowbite-react";
import { useState } from "react";

export default function MatchingPairs({
  question,
  onSubmit,
  isReadOnly = false,
  userAnswer = null,
}) {
  const [matches, setMatches] = useState(
    userAnswer || question.leftItems?.map(() => "") || []
  );

  const handleMatchChange = (leftIndex, rightIndex) => {
    if (isReadOnly) return;
    const newMatches = [...matches];
    newMatches[leftIndex] = rightIndex !== "" ? parseInt(rightIndex) : "";
    setMatches(newMatches);
    if (onSubmit) {
      onSubmit(newMatches);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {question.title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {question.title}
        </h2>
      )}

      {question.content && (
        <div
          className="mb-6 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />
      )}

      <div className="space-y-4 mb-6">
        {question.leftItems?.map((leftItem, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex-1">
              {leftItem.type === "image" && leftItem.imageUrl ? (
                <div className="relative w-full max-w-xs h-32">
                  <img
                    src={leftItem.imageUrl}
                    alt={leftItem.text || `Element ${index + 1}`}
                    className="object-contain rounded"
                  />
                </div>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {leftItem.text || leftItem}
                </span>
              )}
            </div>
            <span className="text-gray-500 dark:text-gray-400">→</span>
            <Select
              value={matches[index] !== "" ? matches[index] : ""}
              onChange={(e) => handleMatchChange(index, e.target.value)}
              disabled={isReadOnly}
              required
              className="flex-1 min-w-[200px]"
            >
              <option value="">Wybierz dopasowanie...</option>
              {question.rightItems?.map((rightItem, rightIdx) => (
                <option
                  key={rightIdx}
                  value={rightIdx}
                  disabled={
                    !isReadOnly &&
                    matches.includes(rightIdx) &&
                    matches[index] !== rightIdx
                  }
                >
                  {rightItem.type === "image"
                    ? `Obraz ${rightIdx + 1}`
                    : rightItem.text || rightItem}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      {isReadOnly && userAnswer && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Twoje dopasowania:
          </p>
          <ul className="space-y-2">
            {userAnswer.map((rightIdx, leftIdx) => (
              <li
                key={leftIdx}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="font-medium">
                  {question.leftItems[leftIdx]?.text ||
                    question.leftItems[leftIdx] ||
                    `Element ${leftIdx + 1}`}
                </span>
                {" → "}
                <span>
                  {question.rightItems[rightIdx]?.text ||
                    question.rightItems[rightIdx] ||
                    `Opcja ${rightIdx + 1}`}
                </span>
                {question.correctPairs && (
                  <span
                    className={`ml-2 ${
                      question.correctPairs[leftIdx] === rightIdx
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {question.correctPairs[leftIdx] === rightIdx ? "✓" : "✗"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
