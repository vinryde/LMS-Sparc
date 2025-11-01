"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  createOrUpdateQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  getQuizData,
} from "../actions";
import { QuestionEditor } from "./QuestionEditor";

type QuizData = {
  id: string;
  title: string;
  position: number;
  questions: Array<{
    id: string;
    text: string;
    position: number;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      position: number;
    }>;
  }>;
} | null;

interface QuizManagerProps {
  lessonId: string;
  initialQuiz: QuizData;
  onQuizUpdate?: (quiz: QuizData) => void;
}

export function QuizManager({ lessonId, initialQuiz, onQuizUpdate }: QuizManagerProps) {
  const [quizTitle, setQuizTitle] = useState(initialQuiz?.title || "");
  const [quizId, setQuizId] = useState<string | null>(initialQuiz?.id || null);
  const [questions, setQuestions] = useState<any[]>(initialQuiz?.questions || []);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update state when initialQuiz changes
  useEffect(() => {
    if (initialQuiz) {
      setQuizTitle(initialQuiz.title || "");
      setQuizId(initialQuiz.id || null);
      setQuestions(initialQuiz.questions || []);
    }
  }, [initialQuiz]);

  async function handleSaveQuiz() {
    if (!quizTitle.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    setIsCreatingQuiz(true);
    const { data: result, error } = await tryCatch(
      createOrUpdateQuiz({ title: quizTitle, lessonId }, lessonId)
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save quiz");
    } else {
      toast.success(result?.message);
      
      // Refetch quiz data to get the ID if it was just created
      if (!quizId) {
        const { data: quizData } = await tryCatch(getQuizData(lessonId));
        if (quizData) {
          setQuizId(quizData.id);
          if (onQuizUpdate) {
            onQuizUpdate(quizData);
          }
        }
      }
    }
    setIsCreatingQuiz(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items: any[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        const updated = reordered.map((item, index) => ({
          ...item,
          position: index + 1,
        }));

        // Save to backend
        reorderQuestions({
          quizId: quizId!,
          questions: updated.map((q) => ({ id: q.id, position: q.position })),
        });

        return updated;
      });
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!quizId) return;

    const { data: result, error } = await tryCatch(
      deleteQuestion({ questionId, quizId })
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to delete question");
    } else {
      toast.success(result?.message);
      setQuestions((prev: any[]) => prev.filter((q) => q.id !== questionId));
    }
  }

  async function handleQuestionSaved() {
    // Refetch quiz data to get updated questions
    const { data: quizData } = await tryCatch(getQuizData(lessonId));
    if (quizData) {
      setQuestions(quizData.questions || []);
      if (onQuizUpdate) {
        onQuizUpdate(quizData);
      }
    }
    setEditingQuestionId(null);
  }

  return (
    <div className="space-y-6">
      {/* Quiz Title */}
      <div className="space-y-2">
        <Label htmlFor="quiz-title">Quiz Title</Label>
        <div className="flex gap-2">
          <Input
            id="quiz-title"
            placeholder="Enter quiz title (e.g., 'Lesson Quiz', 'Knowledge Check')"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSaveQuiz} disabled={isCreatingQuiz}>
            {isCreatingQuiz ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>{quizId ? "Update" : "Create"} Quiz</>
            )}
          </Button>
        </div>
        {!quizId && (
          <p className="text-xs text-muted-foreground">
            Create a quiz first before adding questions
          </p>
        )}
      </div>

      {quizId && (
        <>
          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Questions</h4>
                <p className="text-xs text-muted-foreground">
                  {questions.length} question{questions.length !== 1 ? "s" : ""} added
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setEditingQuestionId("new")}
                variant="outline"
                disabled={editingQuestionId === "new"}
              >
                <Plus className="size-4 mr-2" />
                Add Question
              </Button>
            </div>

            {editingQuestionId === "new" && (
              <QuestionEditor
                quizId={quizId}
                onSave={handleQuestionSaved}
                onCancel={() => setEditingQuestionId(null)}
              />
            )}

            {questions.length === 0 && editingQuestionId !== "new" && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No questions added yet. Click "Add Question" to get started.
                </p>
              </div>
            )}

            {questions.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map((q: any) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {questions.map((question: any) => (
                      <SortableQuestion
                        key={question.id}
                        question={question}
                        onEdit={() => setEditingQuestionId(question.id)}
                        onDelete={() => handleDeleteQuestion(question.id)}
                        isEditing={editingQuestionId === question.id}
                        onSaveEdit={handleQuestionSaved}
                        onCancelEdit={() => setEditingQuestionId(null)}
                        quizId={quizId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SortableQuestion({
  question,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  quizId,
}: {
  question: any;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  quizId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <QuestionEditor
          quizId={quizId}
          question={question}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="cursor-grab active:cursor-grabbing shrink-0"
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </Button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{question.text}</p>
        <div className="mt-2 space-y-1">
          {question.options.map((option: any, index: number) => (
            <div key={option.id} className="flex items-center gap-2 text-sm">
              <span className={option.isCorrect ? "text-green-600 font-medium" : "text-muted-foreground"}>
                {String.fromCharCode(65 + index)}. {option.text}
              </span>
              {option.isCorrect && (
                <span className="text-xs text-green-600 font-semibold">(Correct)</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}