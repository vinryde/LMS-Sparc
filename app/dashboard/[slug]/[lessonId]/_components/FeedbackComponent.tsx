"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Send, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { submitFeedback } from "../actions";
import { cn } from "@/lib/utils";

interface FeedbackComponentProps {
  feedback: {
    id: string;
    title: string;
    description: string | null;
    submissions: Array<{
      id: string;
      content: string;
      createdAt: Date;
    }>;
  };
  slug: string;
}

export function FeedbackComponent({ feedback, slug }: FeedbackComponentProps) {
  const hasSubmitted = feedback.submissions.length > 0;
  const submission = feedback.submissions[0];

  const [feedbackContent, setFeedbackContent] = useState(
    hasSubmitted ? submission.content : ""
  );
  const [isPending, startTransition] = useTransition();

  async function handleSubmitFeedback() {
    if (!feedbackContent.trim()) {
      toast.error("Please enter your feedback before submitting");
      return;
    }

    if (feedbackContent.trim().length < 10) {
      toast.error("Feedback must be at least 10 characters long");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        submitFeedback(feedback.id, feedbackContent.trim(), slug)
      );

      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to submit feedback");
      } else {
        toast.success(result?.message || "Feedback submitted successfully!");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{feedback.title}</CardTitle>
              {feedback.description && (
                <CardDescription className="mt-1">
                  {feedback.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasSubmitted && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="size-4 text-green-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Thank you for your feedback!
                </p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                  Submitted on {new Date(submission.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="feedback-content">
              Your Feedback {hasSubmitted && "(Read-only)"}
            </Label>
            <Textarea
              id="feedback-content"
              placeholder={
                hasSubmitted
                  ? ""
                  : "Share your thoughts about this lesson... What did you learn? What could be improved?"
              }
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              className="min-h-[150px]"
              disabled={hasSubmitted || isPending}
              readOnly={hasSubmitted}
            />
            <p className="text-xs text-muted-foreground">
              {hasSubmitted 
                ? "You have already submitted feedback for this lesson"
                : "Minimum 10 characters required"}
            </p>
          </div>

          {!hasSubmitted && (
            <Button
              onClick={handleSubmitFeedback}
              disabled={isPending || !feedbackContent.trim() || feedbackContent.trim().length < 10}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}