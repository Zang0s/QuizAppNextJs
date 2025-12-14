"use client";

import { useState } from "react";
import {
  Button,
  Card,
  TextInput,
  Textarea,
  Label,
  Select,
  Checkbox,
} from "flowbite-react";

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
}) {
  const [localQuestion, setLocalQuestion] = useState(question);

  const updateField = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const updateOption = (optionIndex, field, value) => {
    const updatedOptions = [...localQuestion.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value,
    };
    const updated = { ...localQuestion, options: updatedOptions };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const addOption = () => {
    const newOption = { text: "", type: "text" };
    const updatedOptions = [...(localQuestion.options || []), newOption];
    const updated = { ...localQuestion, options: updatedOptions };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const removeOption = (optionIndex) => {
    const updatedOptions = localQuestion.options.filter(
      (_, i) => i !== optionIndex
    );
    const updated = { ...localQuestion, options: updatedOptions };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const setCorrectAnswer = (answerIndex) => {
    if (localQuestion.type === "single-choice") {
      updateField("correctAnswer", answerIndex);
    } else if (localQuestion.type === "multiple-choice") {
      const current = localQuestion.correctAnswers || [];
      const updated = current.includes(answerIndex)
        ? current.filter((i) => i !== answerIndex)
        : [...current, answerIndex];
      updateField("correctAnswers", updated);
    }
  };

  const updateMatchingPair = (side, index, value) => {
    const key = side === "left" ? "leftItems" : "rightItems";
    const items = [...(localQuestion[key] || [])];
    if (index < items.length) {
      items[index] =
        typeof value === "string" ? { text: value, type: "text" } : value;
    } else {
      items.push(
        typeof value === "string" ? { text: value, type: "text" } : value
      );
    }
    const updated = { ...localQuestion, [key]: items };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const addMatchingItem = (side) => {
    const key = side === "left" ? "leftItems" : "rightItems";
    const items = [...(localQuestion[key] || []), { text: "", type: "text" }];
    const updated = { ...localQuestion, [key]: items };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const removeMatchingItem = (side, index) => {
    const key = side === "left" ? "leftItems" : "rightItems";
    const items = localQuestion[key].filter((_, i) => i !== index);
    const updated = { ...localQuestion, [key]: items };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const setCorrectPair = (leftIndex, rightIndex) => {
    const pairs = [...(localQuestion.correctPairs || [])];
    pairs[leftIndex] = rightIndex;
    const updated = { ...localQuestion, correctPairs: pairs };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Pytanie {index + 1}:{" "}
          {localQuestion.type === "single-choice"
            ? "Pojedynczy wybór"
            : localQuestion.type === "multiple-choice"
            ? "Wielokrotny wybór"
            : localQuestion.type === "fill-in-blanks"
            ? "Uzupełnianie pól"
            : "Dopasowanie par"}
        </h3>
        <Button color="failure" size="sm" onClick={onRemove}>
          Usuń
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label value="Tytuł pytania" />
          <TextInput
            value={localQuestion.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Np. Pytanie 1"
          />
        </div>

        <div>
          <Label value="Treść pytania (HTML)" />
          <Textarea
            value={localQuestion.content || ""}
            onChange={(e) => updateField("content", e.target.value)}
            placeholder="Możesz użyć HTML, np. &lt;p&gt;Tekst&lt;/p&gt; lub &lt;strong&gt;Pogrubiony&lt;/strong&gt;. Dla uzupełniania użyj {0}, {1}, itd. jako miejsca na pola."
            rows={4}
          />
        </div>

        {(localQuestion.type === "single-choice" ||
          localQuestion.type === "multiple-choice") && (
          <>
            <div>
              <Label value="Opcje odpowiedzi" />
              <div className="space-y-2 mt-2">
                {(localQuestion.options || []).map((option, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center">
                    <div className="flex-1 flex gap-2">
                      <Select
                        value={option.type || "text"}
                        onChange={(e) =>
                          updateOption(optIdx, "type", e.target.value)
                        }
                        className="w-32"
                      >
                        <option value="text">Tekst</option>
                        <option value="image">Obraz</option>
                      </Select>
                      {option.type === "text" ? (
                        <TextInput
                          value={option.text || ""}
                          onChange={(e) =>
                            updateOption(optIdx, "text", e.target.value)
                          }
                          placeholder={`Opcja ${optIdx + 1}`}
                          className="flex-1"
                        />
                      ) : (
                        <TextInput
                          value={option.imageUrl || ""}
                          onChange={(e) =>
                            updateOption(optIdx, "imageUrl", e.target.value)
                          }
                          placeholder="URL obrazu"
                          className="flex-1"
                        />
                      )}
                    </div>
                    <Checkbox
                      checked={
                        localQuestion.type === "single-choice"
                          ? localQuestion.correctAnswer === optIdx
                          : (localQuestion.correctAnswers || []).includes(
                              optIdx
                            )
                      }
                      onChange={() => setCorrectAnswer(optIdx)}
                    />
                    <Label className="text-sm">Poprawna</Label>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => removeOption(optIdx)}
                    >
                      Usuń
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                color="light"
                size="sm"
                onClick={addOption}
                className="mt-2"
              >
                + Dodaj opcję
              </Button>
            </div>
          </>
        )}

        {localQuestion.type === "fill-in-blanks" && (
          <>
            <div>
              <Label value="Lista opcji do wyboru" />
              <div className="space-y-2 mt-2">
                {(localQuestion.options || []).map((option, optIdx) => (
                  <div key={optIdx} className="flex gap-2 items-center">
                    <TextInput
                      value={
                        typeof option === "string" ? option : option.text || ""
                      }
                      onChange={(e) => {
                        const options = [...(localQuestion.options || [])];
                        options[optIdx] = e.target.value;
                        updateField("options", options);
                      }}
                      placeholder={`Opcja ${optIdx + 1}`}
                      className="flex-1"
                    />
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => {
                        const options = (localQuestion.options || []).filter(
                          (_, i) => i !== optIdx
                        );
                        updateField("options", options);
                        if (localQuestion.correctAnswers) {
                          const updatedCorrectAnswers =
                            localQuestion.correctAnswers
                              .map((ans) => {
                                if (Array.isArray(ans)) {
                                  return ans.map((fieldIdx) =>
                                    fieldIdx > optIdx ? fieldIdx - 1 : fieldIdx
                                  );
                                }
                                return ans > optIdx ? ans - 1 : ans;
                              })
                              .filter((ans) => {
                                if (Array.isArray(ans)) {
                                  return ans.every(
                                    (idx) => idx >= 0 && idx < options.length
                                  );
                                }
                                return ans >= 0 && ans < options.length;
                              });
                          updateField("correctAnswers", updatedCorrectAnswers);
                        }
                      }}
                    >
                      Usuń
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                color="light"
                size="sm"
                onClick={() => {
                  const options = [...(localQuestion.options || []), ""];
                  updateField("options", options);
                }}
                className="mt-2"
              >
                + Dodaj opcję
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Label
                value="✅ Poprawne odpowiedzi"
                className="text-base font-semibold mb-2 block"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Dla każdego pola {`{0}`}, {`{1}`}, {`{2}`} itd. w treści pytania
                wybierz poprawną opcję z listy powyżej.
                <br />
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                  💡 Przykład: Jeśli w treści jest "Stolica Polski to {`{0}`}",
                  a opcja "Warszawa" jest na pozycji 0 w liście, wybierz
                  "Warszawa" dla pola {`{0}`}.
                </span>
              </div>
              <div className="space-y-2 mt-2">
                {(() => {
                  const countFields = () => {
                    const contentText =
                      localQuestion.content || localQuestion.title || "";
                    if (!contentText) return 0;
                    const matches = contentText.match(/\{(\d+)\}/g);
                    if (!matches) return 0;
                    const indices = matches.map((m) =>
                      parseInt(m.match(/\d+/)[0])
                    );
                    return indices.length > 0 ? Math.max(...indices) + 1 : 0;
                  };
                  const numFields = countFields();
                  const correctAnswers = localQuestion.correctAnswers || [];
                  const hasOptions =
                    localQuestion.options && localQuestion.options.length > 0;

                  if (numFields === 0) {
                    return (
                      <div className="text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        ⚠️ Nie znaleziono placeholderów w treści. Dodaj {`{0}`},{" "}
                        {`{1}`} itd. w treści pytania, aby móc ustawić poprawne
                        odpowiedzi.
                      </div>
                    );
                  }

                  if (!hasOptions) {
                    return (
                      <div className="text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        ⚠️ Najpierw dodaj opcje do wyboru powyżej, aby móc
                        ustawić poprawne odpowiedzi.
                      </div>
                    );
                  }

                  return Array.from({ length: numFields }, (_, fieldIdx) => {
                    const placeholderInContent = (
                      localQuestion.content ||
                      localQuestion.title ||
                      ""
                    ).includes(`{${fieldIdx}}`);
                    return (
                      <div
                        key={fieldIdx}
                        className="flex gap-2 items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                      >
                        <Label className="w-32 font-medium">
                          Pole {`{${fieldIdx}}`}:
                          {!placeholderInContent && (
                            <span className="text-xs text-red-500 ml-1 block">
                              (nie znaleziono)
                            </span>
                          )}
                        </Label>
                        <Select
                          value={
                            correctAnswers[fieldIdx] !== undefined &&
                            correctAnswers[fieldIdx] !== null
                              ? correctAnswers[fieldIdx]
                              : ""
                          }
                          onChange={(e) => {
                            const newCorrectAnswers = [...correctAnswers];
                            if (e.target.value === "") {
                              newCorrectAnswers[fieldIdx] = undefined;
                            } else {
                              newCorrectAnswers[fieldIdx] = parseInt(
                                e.target.value
                              );
                            }
                            updateField("correctAnswers", newCorrectAnswers);
                          }}
                          className="flex-1"
                        >
                          <option value="">Wybierz opcję...</option>
                          {(localQuestion.options || []).map(
                            (option, optIdx) => (
                              <option key={optIdx} value={optIdx}>
                                [{optIdx}]{" "}
                                {typeof option === "string"
                                  ? option
                                  : option.text ||
                                    option ||
                                    `Opcja ${optIdx + 1}`}
                              </option>
                            )
                          )}
                        </Select>
                        {correctAnswers[fieldIdx] !== undefined &&
                          correctAnswers[fieldIdx] !== null && (
                            <span className="text-lg text-green-600 dark:text-green-400">
                              ✓
                            </span>
                          )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Użyj {`{0}`}, {`{1}`}, {`{2}`} itd. w treści pytania, aby oznaczyć
              miejsca na pola.
            </div>
          </>
        )}

        {localQuestion.type === "matching-pairs" && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label value="Elementy lewe" />
                <div className="space-y-2 mt-2">
                  {(localQuestion.leftItems || []).map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <TextInput
                        value={
                          typeof item === "string" ? item : item.text || ""
                        }
                        onChange={(e) =>
                          updateMatchingPair("left", idx, e.target.value)
                        }
                        placeholder={`Element ${idx + 1}`}
                        className="flex-1"
                      />
                      <Button
                        color="failure"
                        size="sm"
                        onClick={() => removeMatchingItem("left", idx)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => addMatchingItem("left")}
                  className="mt-2"
                >
                  + Dodaj element
                </Button>
              </div>
              <div>
                <Label value="Elementy prawe" />
                <div className="space-y-2 mt-2">
                  {(localQuestion.rightItems || []).map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <TextInput
                        value={
                          typeof item === "string" ? item : item.text || ""
                        }
                        onChange={(e) =>
                          updateMatchingPair("right", idx, e.target.value)
                        }
                        placeholder={`Opcja ${idx + 1}`}
                        className="flex-1"
                      />
                      <Button
                        color="failure"
                        size="sm"
                        onClick={() => removeMatchingItem("right", idx)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => addMatchingItem("right")}
                  className="mt-2"
                >
                  + Dodaj element
                </Button>
              </div>
            </div>
            <div>
              <Label value="Poprawne dopasowania" />
              <div className="space-y-2 mt-2">
                {(localQuestion.leftItems || []).map((_, leftIdx) => (
                  <div key={leftIdx} className="flex items-center gap-2">
                    <span className="w-32 text-sm text-gray-700 dark:text-gray-300">
                      {typeof localQuestion.leftItems[leftIdx] === "string"
                        ? localQuestion.leftItems[leftIdx]
                        : localQuestion.leftItems[leftIdx]?.text ||
                          `Element ${leftIdx + 1}`}
                    </span>
                    <span>→</span>
                    <Select
                      value={localQuestion.correctPairs?.[leftIdx] ?? ""}
                      onChange={(e) =>
                        setCorrectPair(leftIdx, parseInt(e.target.value))
                      }
                      className="flex-1"
                    >
                      <option value="">Wybierz...</option>
                      {(localQuestion.rightItems || []).map(
                        (rightItem, rightIdx) => (
                          <option key={rightIdx} value={rightIdx}>
                            {typeof rightItem === "string"
                              ? rightItem
                              : rightItem?.text || `Opcja ${rightIdx + 1}`}
                          </option>
                        )
                      )}
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
