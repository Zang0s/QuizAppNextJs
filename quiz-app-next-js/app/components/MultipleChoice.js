"use client";

import { Checkbox, Label, Button } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";

export default function MultipleChoice({
  question,
  onSubmit,
  isReadOnly = false,
  userAnswer = null,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState(userAnswer || []);

  const handleToggle = (index) => {
    if (isReadOnly) return;
    const newAnswers = selectedAnswers.includes(index)
      ? selectedAnswers.filter((i) => i !== index)
      : [...selectedAnswers, index];
    setSelectedAnswers(newAnswers);
    if (onSubmit) {
      onSubmit(newAnswers);
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
        {question.options?.map((option, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Checkbox
              id={`option-${index}`}
              checked={selectedAnswers.includes(index)}
              onChange={() => handleToggle(index)}
              disabled={isReadOnly}
              className="mt-1"
            />
            <Label
              htmlFor={`option-${index}`}
              className="flex-1 cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                {option.type === "image" && option.imageUrl ? (
                  <div className="relative w-full max-w-md h-48">
                    <Image
                      src={option.imageUrl}
                      alt={option.text || `Opcja ${index + 1}`}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                ) : null}
                {option.text && (
                  <span className="text-gray-900 dark:text-white">
                    {option.text}
                  </span>
                )}
              </div>
            </Label>
          </div>
        ))}
      </div>

      {isReadOnly && userAnswer && userAnswer.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Twoje odpowiedzi:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {userAnswer.map((idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {question.options[idx]?.text || `Opcja ${idx + 1}`}
              </li>
            ))}
          </ul>
          {question.correctAnswers && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Poprawne odpowiedzi:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {question.correctAnswers.map((idx) => (
                  <li
                    key={idx}
                    className={`text-sm ${
                      userAnswer.includes(idx)
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {question.options[idx]?.text || `Opcja ${idx + 1}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
