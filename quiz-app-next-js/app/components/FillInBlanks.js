"use client";

import { Select, Label, Button } from "flowbite-react";
import { useState } from "react";

export default function FillInBlanks({
  question,
  onSubmit,
  isReadOnly = false,
  userAnswer = null,
}) {
  const countFields = () => {
    if (!question.content) return 0;
    const matches = question.content.match(/\{(\d+)\}/g);
    if (!matches) return 0;
    const indices = matches.map((m) => parseInt(m.match(/\d+/)[0]));
    return indices.length > 0 ? Math.max(...indices) + 1 : 0;
  };

  const normalizeUserAnswer = (answer) => {
    if (!answer) return new Array(countFields()).fill("");
    if (Array.isArray(answer)) {
      return answer.map((a) =>
        typeof a === "string" && a !== "" ? parseInt(a) : a
      );
    }
    return new Array(countFields()).fill("");
  };

  const [answers, setAnswers] = useState(normalizeUserAnswer(userAnswer));

  const handleFieldChange = (fieldIndex, value) => {
    if (isReadOnly) return;
    const newAnswers = [...answers];
    newAnswers[fieldIndex] = value;
    setAnswers(newAnswers);
    const normalizedAnswers = newAnswers.map((a) =>
      typeof a === "string" && a !== "" ? parseInt(a) : a
    );
    if (onSubmit) {
      onSubmit(normalizedAnswers);
    }
  };

  const renderContent = () => {
    const contentText = question.content || question.title || "";
    if (!contentText) return null;

    const parts = [];
    let lastIndex = 0;
    const placeholderRegex = /\{(\d+)\}/g;
    let match;

    while ((match = placeholderRegex.exec(contentText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: contentText.substring(lastIndex, match.index),
        });
      }

      const fieldIndex = parseInt(match[1]);
      parts.push({
        type: "field",
        fieldIndex: fieldIndex,
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < contentText.length) {
      parts.push({
        type: "text",
        content: contentText.substring(lastIndex),
      });
    }

    if (parts.length === 0) {
      parts.push({
        type: "text",
        content: contentText,
      });
    }

    return parts;
  };

  const contentParts = renderContent();

  const hasOptions = question.options && question.options.length > 0;
  const hasPlaceholders =
    contentParts && contentParts.some((part) => part.type === "field");

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {question.title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {question.title}
        </h2>
      )}

      <div className="mb-6 text-gray-700 dark:text-gray-300">
        {!hasOptions && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Brak opcji do wyboru. Dodaj opcje w edytorze quizu.
            </p>
          </div>
        )}

        {!hasPlaceholders && question.content && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Brak placeholderów w treści. Użyj {`{0}`}, {`{1}`}, {`{2}`}{" "}
              itd. w treści pytania.
            </p>
          </div>
        )}

        {contentParts && contentParts.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 prose dark:prose-invert max-w-none">
            {contentParts.map((part, idx) => {
              if (part.type === "text") {
                return (
                  <span
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: part.content }}
                  />
                );
              } else {
                if (!hasOptions) {
                  return (
                    <span
                      key={idx}
                      className="inline-block px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded border border-red-300 dark:border-red-700"
                    >
                      [Brak opcji]
                    </span>
                  );
                }

                return (
                  <Select
                    key={idx}
                    value={
                      answers[part.fieldIndex] !== undefined &&
                      answers[part.fieldIndex] !== ""
                        ? answers[part.fieldIndex]
                        : ""
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        part.fieldIndex,
                        e.target.value === "" ? "" : parseInt(e.target.value)
                      )
                    }
                    disabled={isReadOnly}
                    required
                    className="inline-block w-auto min-w-[150px]"
                  >
                    <option value="">Wybierz...</option>
                    {question.options?.map((option, optIdx) => (
                      <option key={optIdx} value={optIdx}>
                        {typeof option === "string"
                          ? option
                          : option.text || option || `Opcja ${optIdx + 1}`}
                      </option>
                    ))}
                  </Select>
                );
              }
            })}
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html:
                question.content || question.title || "Brak treści pytania",
            }}
            className="prose dark:prose-invert max-w-none"
          />
        )}
      </div>


      {isReadOnly && userAnswer && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Twoje odpowiedzi:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {userAnswer.map((answerIdx, idx) => {
              const option = question.options?.[answerIdx];
              const optionText =
                typeof option === "string"
                  ? option
                  : option?.text || option || "Brak";
              const isCorrect =
                question.correctAnswers &&
                question.correctAnswers[idx] !== undefined &&
                question.correctAnswers[idx] === answerIdx;

              return (
                <li
                  key={idx}
                  className={`text-sm ${
                    isCorrect
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : question.correctAnswers &&
                        question.correctAnswers[idx] !== undefined
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Pole {idx + 1}: {optionText}
                  {isCorrect && " ✓"}
                  {question.correctAnswers &&
                    question.correctAnswers[idx] !== undefined &&
                    !isCorrect &&
                    ` (Poprawna: ${
                      typeof question.options?.[
                        question.correctAnswers[idx]
                      ] === "string"
                        ? question.options[question.correctAnswers[idx]]
                        : question.options?.[question.correctAnswers[idx]]
                            ?.text ||
                          question.options?.[question.correctAnswers[idx]] ||
                          "Brak"
                    })`}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
