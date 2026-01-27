"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Loader2, File } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  createInteractiveActivity,
  updateInteractiveActivity,
  deleteInteractiveActivity,
  reorderInteractiveActivities,
  getInteractiveActivitiesData,
} from "../actions";
import { Uploader } from "@/components/file-uploader/Uploader";
import { InteractiveActivityResources } from "./Interactiveactivityresources";

type InteractiveActivityData = {
  id: string;
  title: string;
  description: string | null;
  documentKey: string;
  position: number;
  resources?: Array<{
    id: string;
    title: string;
    type: "TEXT" | "LINK" | "IMAGE" | "DOCUMENT";
    position: number;
    textContent: string | null;
    linkUrl: string | null;
    imageKey: string | null;
    documentKey: string | null;
  }>;
} | null;

interface InteractiveActivityManagerProps {
  lessonId: string;
  initialActivities: InteractiveActivityData[];
  onActivityUpdate?: (activities: InteractiveActivityData[]) => void;
}

export function InteractiveActivityManager({ lessonId, initialActivities, onActivityUpdate }: InteractiveActivityManagerProps) {
  const [activities, setActivities] = useState<any[]>(initialActivities || []);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities || []);
    }
  }, [initialActivities]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActivities((items: any[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        const updated = reordered.map((item, index) => ({
          ...item,
          position: index + 1,
        }));

        // Save to backend
        reorderInteractiveActivities({
          lessonId: lessonId,
          interactiveActivities: updated.map((a) => ({ id: a.id, position: a.position })),
        });

        return updated;
      });
    }
  }

  async function handleDeleteActivity(activityId: string) {
    const { data: result, error } = await tryCatch(
      deleteInteractiveActivity({ activityId, lessonId })
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to delete interactive activity");
    } else {
      toast.success(result?.message);
      setActivities((prev: any[]) => prev.filter((a) => a.id !== activityId));
    }
  }

  async function handleActivitySaved() {
    const { data: activityData } = await tryCatch(getInteractiveActivitiesData(lessonId));
    if (activityData) {
      setActivities(activityData || []);
      if (onActivityUpdate) {
        onActivityUpdate(activityData);
      }
    }
    setEditingActivityId(null);
  }

  // New function to refresh activities data including resources
  async function refreshActivities() {
    const { data: activityData } = await tryCatch(getInteractiveActivitiesData(lessonId));
    if (activityData) {
      setActivities(activityData || []);
      if (onActivityUpdate) {
        onActivityUpdate(activityData);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Interactive Activities</h4>
            <p className="text-xs text-muted-foreground">
              {activities.length} activity{activities.length !== 1 ? "ies" : ""} added
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setEditingActivityId("new")}
            variant="outline"
            disabled={editingActivityId === "new"}
          >
            <Plus className="size-4 mr-2" />
            Add Activity
          </Button>
        </div>

        {editingActivityId === "new" && (
          <InteractiveActivityEditor
            lessonId={lessonId}
            onSave={handleActivitySaved}
            onCancel={() => setEditingActivityId(null)}
            onRefresh={refreshActivities}
          />
        )}

        {activities.length === 0 && editingActivityId !== "new" && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No interactive activities added yet. Click "Add Activity" to get started.
            </p>
          </div>
        )}

        {activities.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activities.map((a: any) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {activities.map((activity: any) => (
                  <SortableInteractiveActivity
                    key={activity.id}
                    activity={activity}
                    onEdit={() => setEditingActivityId(activity.id)}
                    onDelete={() => handleDeleteActivity(activity.id)}
                    isEditing={editingActivityId === activity.id}
                    onSaveEdit={handleActivitySaved}
                    onCancelEdit={() => setEditingActivityId(null)}
                    onRefresh={refreshActivities}
                    lessonId={lessonId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function SortableInteractiveActivity({
  activity,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  onRefresh,
  lessonId,
}: {
  activity: any;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  lessonId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <InteractiveActivityEditor
          lessonId={lessonId}
          activity={activity}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="cursor-grab active:cursor-grabbing shrink-0"
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </Button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <File className="size-4 text-orange-600" />
          <p className="font-medium text-sm">{activity.title}</p>
        </div>
        {activity.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        )}
        {activity.resources && activity.resources.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {activity.resources.length} resource{activity.resources.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

function InteractiveActivityEditor({
  lessonId,
  activity,
  onSave,
  onCancel,
  onRefresh,
}: {
  lessonId: string;
  activity?: any;
  onSave: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}) {
  const [title, setTitle] = useState(activity?.title || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [documentKey, setDocumentKey] = useState(activity?.documentKey || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!documentKey) {
      toast.error("Document is required");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      documentKey,
      lessonId,
    };

    const { data: result, error } = activity
      ? await tryCatch(updateInteractiveActivity(payload, activity.id))
      : await tryCatch(createInteractiveActivity(payload));

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save interactive activity");
      setIsSaving(false);
    } else {
      toast.success(result?.message);
      setIsSaving(false);
      onSave();
    }
  }

  // Handler for when resources are updated
  async function handleResourceUpdate() {
    // Refresh the entire activities list to get updated resource counts
    await onRefresh();
  }

  return (
    <div className="space-y-4 p-4 border-2 border-dashed rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {activity ? "Edit Interactive Activity" : "New Interactive Activity"}
        </h4>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity-title">Title *</Label>
        <Input
          id="activity-title"
          placeholder="Enter activity title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity-description">Description (Optional)</Label>
        <Textarea
          id="activity-description"
          placeholder="Enter a small description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px]"
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label>Activity Document *</Label>
        <Uploader
          value={documentKey}
          onChange={setDocumentKey}
          fileTypeAccepted="document"
        />
      </div>

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
          onClick={handleSave} 
          disabled={isSaving}
          type="button"
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

      {/* Resources Section - Only show for existing activities */}
      {activity && (
        <InteractiveActivityResources
          activityId={activity.id}
          initialResources={activity.resources || []}
          onResourceUpdate={handleResourceUpdate}
        />
      )}
    </div>
  );
}