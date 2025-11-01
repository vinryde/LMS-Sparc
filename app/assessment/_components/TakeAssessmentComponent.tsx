"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Send, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { submitAssessment } from "../actions";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { UserAssessmentType } from "@/app/data/assessment/get-assessment-for-user";

interface TakeAssessmentComponentProps {
  assessment: UserAssessmentType;
}

export function TakeAssessmentComponent({ assessment }: TakeAssessmentComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { triggerConfetti } = useConfetti();
  
  const hasSubmitted = assessment.submissions.length > 0;
  const submission = assessment.submissions[0];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    assessment.sections.forEach((section) => {
      section.questions.forEach((q) => {
        if (q.userAnswers[0]) {
          initial[q.id] = q.userAnswers[0].selectedOptionId;
        }
      });
    });
    return initial;
  });

  const [isPending, startTransition] = useTransition();
  const [showResults, setShowResults] = useState(hasSubmitted);
  const [results, setResults] = useState<any>(
    hasSubmitted
      ? {
          knowledgeScore: submission.knowledgeScore,
          knowledgeTotal: submission.knowledgeTotal,
          knowledgePercentage: submission.knowledgePercentage,
        }
      : null
  );

  const allQuestionsAnswered = assessment.sections.every((section) =>
    section.questions.every((q) => selectedAnswers[q.id])
  );

  const totalQuestions = assessment.sections.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  function handleSelectAnswer(questionId: string, optionId: string) {
    if (hasSubmitted) {
      toast.error("You have already submitted this assessment");
      return;
    }
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmitAssessment() {
    if (!allQuestionsAnswered) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    startTransition(async () => {
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }));

      const { data: result, error } = await tryCatch(
        submitAssessment(assessment.id, answers, courseId)
      );

      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to submit assessment");
      } else {
        toast.success(result?.message || "Assessment submitted successfully!");
        if (result.data) {
          setResults(result.data);
          setShowResults(true);
          triggerConfetti();
          // Redirect to dashboard after showing results
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        }
      }
    });
  }

  function getSectionTypeBadgeColor(type: string) {
    switch (type) {
      case "KNOWLEDGE":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "ATTITUDE":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "BEHAVIOUR":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "";
    }
  }

  function getSectionTypeLabel(type: string) {
    switch (type) {
      case "KNOWLEDGE":
        return "Knowledge Level";
      case "ATTITUDE":
        return "Attitude";
      case "BEHAVIOUR":
        return "Behaviour";
      default:
        return type;
    }
  }

  // Results View
  if (showResults && results) {
    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  "rounded-full p-6",
                  results.knowledgePercentage >= 70 ? "bg-green-500/10" : "bg-yellow-500/10"
                )}
              >
                <Trophy
                  className={cn(
                    "size-12",
                    results.knowledgePercentage >= 70 ? "text-green-600" : "text-yellow-600"
                  )}
                />
              </div>
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <p className="text-sm text-muted-foreground">
              {hasSubmitted && submission && (
                <>Submitted on {new Date(submission.createdAt).toLocaleDateString()}</>
              )}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div
                className={cn(
                  "text-5xl font-bold",
                  results.knowledgePercentage >= 70 ? "text-green-600" : "text-yellow-600"
                )}
              >
                {results.knowledgePercentage}%
              </div>
              <p className="text-muted-foreground">
                Knowledge Score: {results.knowledgeScore} out of {results.knowledgeTotal} correct
              </p>
            </div>

            <Progress value={results.knowledgePercentage} className="h-3" />

            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
              <p className="text-green-600 dark:text-green-400 font-medium">
                Thank you for completing the assessment! Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Taking View
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{assessment.title}</CardTitle>
          {assessment.description && (
            <p className="text-sm text-muted-foreground mt-2">{assessment.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">
                {answeredCount} / {totalQuestions} questions answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {!allQuestionsAnswered && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="size-4 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Answer all {totalQuestions} questions to submit the assessment
              </p>
            </div>
          )}

          {hasSubmitted && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="size-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">
                You have already submitted this assessment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {assessment.sections.map((section, sIndex) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">
                Section {sIndex + 1}: {section.title}
              </CardTitle>
              <Badge variant="outline" className={getSectionTypeBadgeColor(section.type)}>
                {getSectionTypeLabel(section.type)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {section.questions.map((question, qIndex) => {
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
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full font-semibold shrink-0",
                          isAnswered
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
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
          </CardContent>
        </Card>
      ))}

      {allQuestionsAnswered && !hasSubmitted && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-green-600" />
                  <span className="font-medium">All questions answered!</span>
                </div>
                <Button onClick={handleSubmitAssessment} disabled={isPending} size="lg">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Submit Assessment
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