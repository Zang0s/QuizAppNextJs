"use client";

import { Radio, Label, Button } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";

export default function SingleChoice({
  question,
  onSubmit,
  isReadOnly = false,
  userAnswer = null,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);

  const handleAnswerChange = (answer) => {
    if (isReadOnly) return;
    setSelectedAnswer(answer);
    if (onSubmit) {
      onSubmit(answer);
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
            <Radio
              id={`option-${index}`}
              name="single-choice"
              value={index}
              checked={selectedAnswer === index}
              onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
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

      {isReadOnly && userAnswer !== null && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
            Twoja odpowiedź:{" "}
            {question.options[userAnswer]?.text || `Opcja ${userAnswer + 1}`}
          </p>
          {question.correctAnswer !== undefined && (
            <p
              className={`text-sm mt-2 ${
                userAnswer === question.correctAnswer
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {userAnswer === question.correctAnswer
                ? "✓ Poprawna odpowiedź"
                : `✗ Poprawna odpowiedź: ${
                    question.options[question.correctAnswer]?.text ||
                    `Opcja ${question.correctAnswer + 1}`
                  }`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
