"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  createOrUpdateFeedback,
  deleteFeedback,
  getFeedbackData,
} from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FeedbackData = {
  id: string;
  title: string;
  description: string | null;
  _count: {
    submissions: number;
  };
} | null;

interface FeedbackManagerProps {
  lessonId: string;
  initialFeedback: FeedbackData;
  onFeedbackUpdate?: (feedback: FeedbackData) => void;
}

export function FeedbackManager({ lessonId, initialFeedback, onFeedbackUpdate }: FeedbackManagerProps) {
  const [feedbackTitle, setFeedbackTitle] = useState(initialFeedback?.title || "");
  const [feedbackDescription, setFeedbackDescription] = useState(initialFeedback?.description || "");
  const [feedbackId, setFeedbackId] = useState<string | null>(initialFeedback?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update state when initialFeedback changes
  useEffect(() => {
    if (initialFeedback) {
      setFeedbackTitle(initialFeedback.title || "");
      setFeedbackDescription(initialFeedback.description || "");
      setFeedbackId(initialFeedback.id || null);
    }
  }, [initialFeedback]);

  async function handleSaveFeedback() {
    if (!feedbackTitle.trim()) {
      toast.error("Feedback title is required");
      return;
    }

    setIsSaving(true);
    const { data: result, error } = await tryCatch(
      createOrUpdateFeedback({ 
        title: feedbackTitle, 
        description: feedbackDescription || undefined,
        lessonId 
      }, lessonId)
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save feedback");
    } else {
      toast.success(result?.message);
      
      // Refetch feedback data to get the ID if it was just created
      if (!feedbackId) {
        const { data: feedbackData } = await tryCatch(getFeedbackData(lessonId));
        if (feedbackData) {
          setFeedbackId(feedbackData.id);
          if (onFeedbackUpdate) {
            onFeedbackUpdate(feedbackData);
          }
        }
      }
    }
    setIsSaving(false);
  }

  async function handleDeleteFeedback() {
    if (!feedbackId) return;

    setIsDeleting(true);
    const { data: result, error } = await tryCatch(deleteFeedback(feedbackId));

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to delete feedback");
    } else {
      toast.success(result?.message);
      setFeedbackTitle("");
      setFeedbackDescription("");
      setFeedbackId(null);
      if (onFeedbackUpdate) {
        onFeedbackUpdate(null);
      }
    }
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback-title">Feedback Title *</Label>
          <Input
            id="feedback-title"
            placeholder="e.g., 'Share Your Thoughts', 'Lesson Feedback'"
            value={feedbackTitle}
            onChange={(e) => setFeedbackTitle(e.target.value)}
            className="flex-1"
          />
          <p className="text-xs text-muted-foreground">
            This title will be shown to students when they submit feedback
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-description">Description (Optional)</Label>
          <Textarea
            id="feedback-description"
            placeholder="Add instructions or context for students about what kind of feedback you're looking for..."
            value={feedbackDescription}
            onChange={(e) => setFeedbackDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Provide guidance to help students give meaningful feedback
          </p>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          {feedbackId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="size-4 mr-2" />
                  Delete Feedback
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the feedback form and all {initialFeedback?._count.submissions || 0} student submission(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteFeedback}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button onClick={handleSaveFeedback} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>{feedbackId ? "Update" : "Create"} Feedback</>
            )}
          </Button>
        </div>

        {feedbackId && initialFeedback && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Feedback Statistics</p>
            <p className="text-sm text-muted-foreground">
              {initialFeedback._count.submissions} student{initialFeedback._count.submissions !== 1 ? 's have' : ' has'} submitted feedback for this lesson
            </p>
          </div>
        )}
      </div>
    </div>
  );
}