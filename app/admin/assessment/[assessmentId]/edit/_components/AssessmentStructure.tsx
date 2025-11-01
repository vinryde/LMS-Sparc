"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminAssessmentType } from "@/app/data/admin/admin-get-assessment";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { NewSectionModal } from "./NewSectionModal";
import { NewQuestionModal } from "./NewQuestionModal";
import { DeleteSection } from "./DeleteSection";
import { DeleteQuestion } from "./DeleteQuestion";

interface iAppProps {
  data: NonNullable<AdminAssessmentType>;
}

export function AssessmentStructure({ data }: iAppProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.sections.forEach((section) => {
      initial[section.id] = true;
    });
    return initial;
  });

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <CardTitle>Assessment Sections</CardTitle>
        <NewSectionModal assessmentId={data.id} />
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {data.sections.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No sections added yet. Click "Add Section" to get started.
            </p>
          </div>
        ) : (
          data.sections.map((section) => (
            <Card key={section.id}>
              <Collapsible
                open={openSections[section.id]}
                onOpenChange={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between p-3 border-b border-border">
                  <div className="flex items-center gap-2 flex-1">
                    <CollapsibleTrigger asChild>
                      <Button size="icon" variant="ghost">
                        {openSections[section.id] ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{section.title}</p>
                        <Badge
                          variant="outline"
                          className={getSectionTypeBadgeColor(section.type)}
                        >
                          {getSectionTypeLabel(section.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.questions.length} question
                        {section.questions.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <DeleteSection sectionId={section.id} assessmentId={data.id} />
                </div>

                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    {section.questions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                          {qIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{question.text}</p>
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, oIndex) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span className="text-muted-foreground">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>
                                <span
                                  className={
                                    section.type === "KNOWLEDGE" && option.isCorrect
                                      ? "text-green-600 font-medium"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {option.text}
                                </span>
                                {section.type === "KNOWLEDGE" && option.isCorrect && (
                                  <span className="text-xs text-green-600 font-semibold">
                                    (Correct)
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <DeleteQuestion
                          questionId={question.id}
                          sectionId={section.id}
                        />
                      </div>
                    ))}

                    <NewQuestionModal
                      sectionId={section.id}
                      sectionType={section.type}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}