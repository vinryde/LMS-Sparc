"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { createActivity, updateActivity } from "../actions";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, ActivitySchemaType } from "@/lib/zodSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ActivityResourceManager } from "./ActivityResourceManager";

export function ActivityEditor({
  lessonId,
  activity,
  onSave,
  onCancel,
}: {
  lessonId: string;
  activity?: any;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ActivitySchemaType>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: activity?.title || "",
      shortDescription: activity?.shortDescription || "",
      description: activity?.description || "",
      lessonId: lessonId,
    },
  });

  async function handleSave(values: ActivitySchemaType) {
    setIsSaving(true);

    const { data: result, error } = activity
      ? await tryCatch(updateActivity(values, activity.id))
      : await tryCatch(createActivity(values));

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save activity");
      setIsSaving(false);
    } else {
      toast.success(result?.message);
      setIsSaving(false);
      onSave();
    }
  }

  return (
    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {activity ? "Edit Activity" : "New Activity"}
        </h4>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter activity title"
                    {...field}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description for preview..."
                    {...field}
                    value={field.value || ""}
                    className="min-h-[80px]"
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Description *</FormLabel>
                <FormControl>
                  <RichTextEditor field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSaving}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>{activity ? "Update" : "Create"} Activity</>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {activity && (
        <div className="pt-4 border-t">
          <ActivityResourceManager
            activityId={activity.id}
            initialResources={activity.resources || []}
          />
        </div>
      )}
    </div>
  );
}