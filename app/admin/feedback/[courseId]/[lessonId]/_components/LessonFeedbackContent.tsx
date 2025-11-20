"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Trophy, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getStudentFeedbackData } from "../actions";
import { toast } from "sonner";

interface LessonFeedbackContentProps {
  lessonId: string;
  hasQuiz: boolean;
  hasFeedback: boolean;
}

const ITEMS_PER_PAGE = 10;

export function LessonFeedbackContent({
  lessonId,
  hasQuiz,
  hasFeedback,
}: LessonFeedbackContentProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents(1);
  }, []);

  async function loadStudents(pageNum: number) {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await getStudentFeedbackData(lessonId, pageNum, ITEMS_PER_PAGE);
        
        if (pageNum === 1) {
          setStudents(result.students);
        } else {
          setStudents((prev) => [...prev, ...result.students]);
        }
        
        setHasMore(result.hasMore);
        setPage(pageNum);
      } catch (error) {
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    });
  }

  function handleLoadMore() {
    loadStudents(page + 1);
  }

  if (isLoading && students.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <User className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No student submissions yet for this lesson.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {students.map((student) => (
        <Card key={student.userId}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <User className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>{student.userName}</CardTitle>
                <CardDescription className="mt-2">
                  Email: {student.userEmail}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Last activity: {new Date(student.latestSubmission).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasFeedback && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="size-4 text-blue-600" />
                  <h4 className="font-semibold">Feedback</h4>
                </div>
                {student.feedback ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Submitted on{" "}
                      {new Date(student.feedback.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">{student.feedback.content}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No feedback submitted yet
                  </p>
                )}
              </div>
            )}

            {hasFeedback && hasQuiz && <Separator />}

            {hasQuiz && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-4 text-purple-600" />
                  <h4 className="font-semibold">Quiz Results</h4>
                </div>
                {student.quizSubmission ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${
                            student.quizSubmission.percentage >= 70
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {student.quizSubmission.percentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {student.quizSubmission.score}
                          </span>{" "}
                          out of{" "}
                          <span className="font-medium">
                            {student.quizSubmission.totalQuestions}
                          </span>{" "}
                          correct
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted on{" "}
                          {new Date(student.quizSubmission.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No quiz submission yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isPending}
            variant="outline"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}