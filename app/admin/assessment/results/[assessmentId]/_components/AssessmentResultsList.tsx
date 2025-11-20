"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Submission {
  id: string;
  knowledgeScore: number;
  knowledgeTotal: number;
  knowledgePercentage: number;
  completed: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AssessmentResultsListProps {
  assessmentId: string;
  initialSubmissions: Submission[];
  initialHasMore: boolean;
}

const ITEMS_PER_PAGE = 20;

export function AssessmentResultsList({
  assessmentId,
  initialSubmissions,
  initialHasMore,
}: AssessmentResultsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  async function loadMore() {
    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const response = await fetch(
          `/api/admin/assessment/results/${assessmentId}?page=${nextPage}&limit=${ITEMS_PER_PAGE}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to load more submissions");
        }

        const data = await response.json();
        setSubmissions((prev) => [...prev, ...data.submissions]);
        setHasMore(data.hasMore);
        setPage(nextPage);
      } catch (error) {
        toast.error("Failed to load more submissions");
      }
    });
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <User className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No submissions yet for this assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">
                    {submission.user.name || submission.user.email.split("@")[0]}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {submission.user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    submission.knowledgePercentage >= 70
                      ? "bg-green-500/10 text-green-600 border-green-200"
                      : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                  )}
                >
                  {submission.knowledgePercentage}% Score
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(submission.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Knowledge Score: {submission.knowledgeScore} / {submission.knowledgeTotal} correct
              </div>
              <Link
                href={`/admin/assessment/results/${assessmentId}/${submission.user.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View Details
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={loadMore}
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