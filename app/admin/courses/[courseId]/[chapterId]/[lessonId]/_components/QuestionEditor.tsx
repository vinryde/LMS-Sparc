"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { createQuestion, updateQuestion } from "../actions";

type OptionType = {
  id?: string;
  text: string;
  isCorrect: boolean;
  position?: number;
};

type QuestionType = {
  id: string;
  text: string;
  position: number;
  options: OptionType[];
};

interface QuestionEditorProps {
  quizId: string;
  question?: QuestionType;
  onSave: () => void;
  onCancel: () => void;
}

export function QuestionEditor({ quizId, question, onSave, onCancel }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(question?.text || "");
  const [options, setOptions] = useState<OptionType[]>(
    question?.options || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  );
  const [isSaving, setIsSaving] = useState(false);

  function addOption() {
    if (options.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    setOptions([...options, { text: "", isCorrect: false }]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    setOptions(options.filter((_: OptionType, i: number) => i !== index));
  }

  function updateOption(index: number, field: keyof OptionType, value: string | boolean) {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  }

  async function handleSave() {
    // Validation
    if (!questionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    const filledOptions = options.filter((opt: OptionType) => opt.text.trim());
    
    if (filledOptions.length < 2) {
      toast.error("At least 2 options are required");
      return;
    }

    const hasCorrect = filledOptions.some((opt: OptionType) => opt.isCorrect);
    if (!hasCorrect) {
      toast.error("At least one option must be marked as correct");
      return;
    }

    // Check for duplicate options
    const optionTexts = filledOptions.map(opt => opt.text.trim().toLowerCase());
    const hasDuplicates = optionTexts.length !== new Set(optionTexts).size;
    if (hasDuplicates) {
      toast.error("Options must be unique");
      return;
    }

    setIsSaving(true);
    const payload = {
      text: questionText.trim(),
      quizId,
      options: filledOptions.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect,
      })),
    };

    const { data: result, error } = question
      ? await tryCatch(updateQuestion(payload, question.id))
      : await tryCatch(createQuestion(payload));

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save question");
      setIsSaving(false);
    } else {
      toast.success(result?.message);
      setIsSaving(false);
      onSave();
    }
  }

  return (
    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {question ? "Edit Question" : "New Question"}
        </h4>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-text">Question Text *</Label>
        <Input
          id="question-text"
          placeholder="Enter your question (e.g., What is renewable energy?)"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Answer Options *</Label>
          <span className="text-xs text-muted-foreground">
            {options.filter((opt) => opt.text.trim()).length} of {options.length} filled
          </span>
        </div>
        
        <div className="space-y-2">
          {options.map((option: OptionType, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium w-6 text-muted-foreground">
                {String.fromCharCode(65 + index)}.
              </span>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => updateOption(index, "text", e.target.value)}
                className="flex-1"
                disabled={isSaving}
              />
              <div className="flex items-center gap-2 shrink-0">
                <Checkbox
                  checked={option.isCorrect}
                  onCheckedChange={(checked) =>
                    updateOption(index, "isCorrect", !!checked)
                  }
                  disabled={isSaving}
                  id={`option-${index}-correct`}
                />
                <Label 
                  htmlFor={`option-${index}-correct`}
                  className="text-xs cursor-pointer"
                >
                  Correct
                </Label>
              </div>
              {options.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  disabled={isSaving}
                  type="button"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
            disabled={isSaving}
            type="button"
          >
            <Plus className="size-4 mr-2" />
            Add Option (Max 6)
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground">
          * Mark at least one option as correct. Multiple correct answers are allowed.
        </p>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSaving}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          type="button"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>{question ? "Update" : "Create"} Question</>
          )}
        </Button>
      </div>
    </div>
  );
}