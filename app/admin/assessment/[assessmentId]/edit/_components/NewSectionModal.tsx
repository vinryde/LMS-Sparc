"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assessmentSectionSchema, AssessmentSectionSchemaType, assessmentSectionTypes } from "@/lib/zodSchema";
import { tryCatch } from "@/hooks/try-catch";
import { createAssessmentSection } from "../../actions";

export function NewSectionModal({ assessmentId }: { assessmentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<AssessmentSectionSchemaType>({
    resolver: zodResolver(assessmentSectionSchema),
    defaultValues: {
      title: "",
      type: "KNOWLEDGE",
      assessmentId: assessmentId,
    },
  });

  async function onSubmit(values: AssessmentSectionSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createAssessmentSection(values));
      
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  }

  function getSectionTypeLabel(type: string) {
    switch (type) {
      case "KNOWLEDGE":
        return "Knowledge Level Assessment";
      case "ATTITUDE":
        return "Attitude Assessment";
      case "BEHAVIOUR":
        return "Behaviour Assessment";
      default:
        return type;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Assessment Section</DialogTitle>
          <DialogDescription>
            Create a new section for this assessment
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Knowledge Level Assessment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assessmentSectionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getSectionTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? "Creating..." : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}