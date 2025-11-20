import { adminGetUserAssessmentResults } from "@/app/data/admin/admin-get-assessment-results";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Trophy, User, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Params = Promise<{ assessmentId: string; userId: string }>;

export default async function UserAssessmentResultsPage({ params }: { params: Params }) {
  const { assessmentId, userId } = await params;
  const data = await adminGetUserAssessmentResults(assessmentId, userId);

  if (!data) {
    return notFound();
  }

  const { assessment, submission, userAnswers } = data;

  // Create a map of user answers for quick lookup
  const answersMap = new Map(
    userAnswers.map((answer) => [answer.questionId, answer])
  );

  // Separate sections by type
  const knowledgeSection = assessment.sections.find((s) => s.type === "KNOWLEDGE");
  const attitudeSections = assessment.sections.filter((s) => s.type === "ATTITUDE");
  const behaviourSections = assessment.sections.filter((s) => s.type === "BEHAVIOUR");

  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`/admin/assessment/results/${assessmentId}`}
      >
        <ArrowLeft className="size-4" />
        <span>Back to Results</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
        <p className="text-muted-foreground">Student Assessment Results</p>
      </div>

      {/* Student Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <User className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {submission.user.name || submission.user.email.split("@")[0]}
                </CardTitle>
                <CardDescription>{submission.user.email}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Submitted on</p>
              <p className="font-medium">
                {new Date(submission.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Knowledge Score Card */}
      {knowledgeSection && (
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full",
                  submission.knowledgePercentage >= 70
                    ? "bg-green-500/10"
                    : "bg-yellow-500/10"
                )}
              >
                <Trophy
                  className={cn(
                    "size-6",
                    submission.knowledgePercentage >= 70
                      ? "text-green-600"
                      : "text-yellow-600"
                  )}
                />
              </div>
              <div>
                <CardTitle>Knowledge Assessment Results</CardTitle>
                <CardDescription>
                  Section: {knowledgeSection.title}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div
                  className={cn(
                    "text-3xl font-bold mb-1",
                    submission.knowledgePercentage >= 70
                      ? "text-green-600"
                      : "text-yellow-600"
                  )}
                >
                  {submission.knowledgePercentage}%
                </div>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {submission.knowledgeScore}
                </div>
                <p className="text-xs text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-muted-foreground mb-1">
                  {submission.knowledgeTotal}
                </div>
                <p className="text-xs text-muted-foreground">Total Questions</p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "w-full justify-center py-2 text-sm",
                submission.knowledgePercentage >= 70
                  ? "bg-green-500/10 text-green-600 border-green-200"
                  : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
              )}
            >
              {submission.knowledgePercentage >= 70 ? "Passed" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Attitude Assessment Sections */}
      {attitudeSections.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Attitude Assessment</h2>
          {attitudeSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="bg-purple-500/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                    Attitude
                  </Badge>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {section.questions.map((question, qIndex) => {
                  const userAnswer = answersMap.get(question.id);
                  const selectedOption = question.options.find(
                    (opt) => opt.id === userAnswer?.selectedOptionId
                  );

                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-sm shrink-0">
                          {qIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-3">{question.text}</p>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => {
                              const isSelected = option.id === userAnswer?.selectedOptionId;
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg border-2 text-sm",
                                    isSelected
                                      ? "border-primary bg-primary/5 font-medium"
                                      : "border-muted"
                                  )}
                                >
                                  <span className="text-muted-foreground">
                                    {String.fromCharCode(65 + oIndex)}.
                                  </span>
                                  <span className="flex-1">{option.text}</span>
                                  {isSelected && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {qIndex < section.questions.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Behaviour Assessment Sections */}
      {behaviourSections.length > 0 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold">Behaviour Assessment</h2>
          {behaviourSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="bg-green-500/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">
                    Behaviour
                  </Badge>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {section.questions.map((question, qIndex) => {
                  const userAnswer = answersMap.get(question.id);
                  const selectedOption = question.options.find(
                    (opt) => opt.id === userAnswer?.selectedOptionId
                  );

                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-sm shrink-0">
                          {qIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-3">{question.text}</p>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => {
                              const isSelected = option.id === userAnswer?.selectedOptionId;
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg border-2 text-sm",
                                    isSelected
                                      ? "border-primary bg-primary/5 font-medium"
                                      : "border-muted"
                                  )}
                                >
                                  <span className="text-muted-foreground">
                                    {String.fromCharCode(65 + oIndex)}.
                                  </span>
                                  <span className="flex-1">{option.text}</span>
                                  {isSelected && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {qIndex < section.questions.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}