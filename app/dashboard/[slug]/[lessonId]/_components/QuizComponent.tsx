"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Trophy, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { submitQuizCompletion } from "../actions";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useConfetti } from "@/hooks/use-confetti";

interface QuizComponentProps {
  quiz: {
    id: string;
    title: string;
    questions: Array<{
      id: string;
      text: string;
      position: number;
      options: Array<{
        id: string;
        text: string;
        position: number;
      }>;
      userAnswers: Array<{
        id: string;
        selectedOptionId: string;
      }>;
    }>;
    submissions: Array<{
      id: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      createdAt: Date;
    }>;
  };
  slug: string;
}

export function QuizComponent({ quiz, slug }: QuizComponentProps) {
  const hasSubmitted = quiz.submissions.length > 0;
  const submission = quiz.submissions[0];
  const { triggerConfetti } = useConfetti();

  // Initialize answers from saved state (if page refreshed before submission)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    quiz.questions.forEach((q) => {
      if (q.userAnswers[0]) {
        initial[q.id] = q.userAnswers[0].selectedOptionId;
      }
    });
    return initial;
  });

  const [isPending, startTransition] = useTransition();
  const [showResults, setShowResults] = useState(hasSubmitted);
  const [results, setResults] = useState<any>(
    hasSubmitted
      ? {
          score: submission.score,
          totalQuestions: submission.totalQuestions,
          percentage: submission.percentage,
        }
      : null
  );

  const allQuestionsAnswered = quiz.questions.every((q) => selectedAnswers[q.id]);

  function handleSelectAnswer(questionId: string, optionId: string) {
    if (hasSubmitted) {
      toast.error("You have already submitted this quiz");
      return;
    }
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmitQuiz() {
    if (!allQuestionsAnswered) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    startTransition(async () => {
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const { data: result, error } = await tryCatch(
        submitQuizCompletion(quiz.id, answers, slug)
      );

      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to submit quiz");
      } else {
        toast.success(result?.message || "Quiz submitted successfully!");
        if (result.data) {
          setResults(result.data);
          setShowResults(true);
          
          // Trigger confetti if passed
          if (result.data.percentage >= 70) {
            triggerConfetti();
          }
        }
      }
    });
  }

  // Results View
  if (showResults && results) {
    // Get user answers with correct/incorrect status
    const questionsWithResults = quiz.questions.map((question) => {
      const userAnswerId = selectedAnswers[question.id] || 
        question.userAnswers[0]?.selectedOptionId;
      
      return {
        ...question,
        userSelectedId: userAnswerId,
      };
    });

    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={cn(
                "rounded-full p-6",
                results.percentage >= 70 ? "bg-green-500/10" : "bg-yellow-500/10"
              )}>
                <Trophy className={cn(
                  "size-12",
                  results.percentage >= 70 ? "text-green-600" : "text-yellow-600"
                )} />
              </div>
            </div>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <p className="text-sm text-muted-foreground">
              {hasSubmitted && submission && (
                <>Submitted on {new Date(submission.createdAt).toLocaleDateString()}</>
              )}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className={cn(
                "text-5xl font-bold",
                results.percentage >= 70 ? "text-green-600" : "text-yellow-600"
              )}>
                {results.percentage}%
              </div>
              <p className="text-muted-foreground">
                {results.score} out of {results.totalQuestions} correct
              </p>
            </div>

            <Progress value={results.percentage} className="h-3" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.score}
                </div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.totalQuestions - results.score}
                </div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>

            {results.percentage >= 70 ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Great job! You passed the quiz! 🎉
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                  Keep learning! Review the material and try again in the next lesson.
                </p>
              </div>
            )}

            <Button
              onClick={() => setShowResults(false)}
              className="w-full"
              variant="outline"
            >
              Review Answers
            </Button>
          </CardContent>
        </Card>

        {/* Review Section - Show correct/incorrect answers */}
        {!showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Answer Review</h3>
            {questionsWithResults.map((question, qIndex) => {
              // Find if answer was correct
              const correctOption = question.options.find(
                (opt) => opt.id === question.userSelectedId
              );
              
              // We need to fetch correct answer info - for now show selected
              return (
                <Card key={question.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                        {qIndex + 1}
                      </div>
                      <CardTitle className="text-lg font-semibold flex-1">
                        {question.text}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => {
                        const isSelected = option.id === question.userSelectedId;

                        return (
                          <div
                            key={option.id}
                            className={cn(
                              "flex items-center space-x-3 p-3 rounded-lg border-2",
                              isSelected && "border-primary bg-primary/5"
                            )}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            <span className="flex-1">{option.text}</span>
                            {isSelected && (
                              <span className="text-xs font-semibold text-primary">
                                Your Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Quiz Taking View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">
            {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        {allQuestionsAnswered && !hasSubmitted && (
          <Button onClick={handleSubmitQuiz} disabled={isPending} size="lg">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
                Submit Quiz
              </>
            )}
          </Button>
        )}
      </div>

      {!allQuestionsAnswered && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="size-4 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Answer all {quiz.questions.length} questions to submit the quiz
          </p>
        </div>
      )}

      {hasSubmitted && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle2 className="size-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">
            You have already submitted this quiz. Scroll down to see your results.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {quiz.questions.map((question, qIndex) => {
          const isAnswered = !!selectedAnswers[question.id];

          return (
            <Card
              key={question.id}
              className={cn(
                "transition-all",
                isAnswered && "border-primary/50",
                hasSubmitted && "opacity-60"
              )}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full font-semibold shrink-0",
                    isAnswered ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {qIndex + 1}
                  </div>
                  <CardTitle className="text-lg font-semibold flex-1">
                    {question.text}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[question.id] === option.id;

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all",
                          isSelected && "border-primary bg-primary/5",
                          !hasSubmitted && "cursor-pointer hover:bg-accent",
                          hasSubmitted && "cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (!hasSubmitted) {
                            handleSelectAnswer(question.id, option.id);
                          }
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked && !hasSubmitted) {
                              handleSelectAnswer(question.id, option.id);
                            }
                          }}
                          disabled={hasSubmitted}
                          id={`${question.id}-${option.id}`}
                          className="pointer-events-none"
                        />
                        <Label
                          htmlFor={`${question.id}-${option.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allQuestionsAnswered && !hasSubmitted && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-green-600" />
                  <span className="font-medium">All questions answered!</span>
                </div>
                <Button onClick={handleSubmitQuiz} disabled={isPending} size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}