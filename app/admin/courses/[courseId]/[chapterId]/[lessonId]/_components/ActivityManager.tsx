"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2, Loader2 } from "lucide-react";
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
  createActivity,
  updateActivity,
  deleteActivity,
  reorderActivities,
  createActivityResource,
  updateActivityResource,
  deleteActivityResource,
  reorderActivityResources,
  getActivitiesData, // added
} from "../actions";
import { ActivityEditor } from "./ActivityEditor";

type ActivityData = {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string;
  position: number;
  resources: Array<{
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

interface ActivityManagerProps {
  lessonId: string;
  initialActivities: ActivityData[];
  onActivityUpdate?: (activities: ActivityData[]) => void;
}

export function ActivityManager({ lessonId, initialActivities, onActivityUpdate }: ActivityManagerProps) {
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
        reorderActivities({
          lessonId: lessonId,
          activities: updated.map((a) => ({ id: a.id, position: a.position })),
        });

        return updated;
      });
    }
  }

  async function handleDeleteActivity(activityId: string) {
    const { data: result, error } = await tryCatch(
      deleteActivity({ activityId, lessonId })
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to delete activity");
    } else {
      toast.success(result?.message);
      setActivities((prev: any[]) => prev.filter((a) => a.id !== activityId));
    }
  }

  async function handleActivitySaved() {
    const { data: activitiesData } = await tryCatch(getActivitiesData(lessonId));
    if (activitiesData) {
      setActivities(activitiesData || []);
      if (onActivityUpdate) {
        onActivityUpdate(activitiesData);
      }
    }
    setEditingActivityId(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Activities</h4>
            <p className="text-xs text-muted-foreground">
              {activities.length} activit{activities.length !== 1 ? "ies" : "y"} added
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
          <ActivityEditor
            lessonId={lessonId}
            onSave={handleActivitySaved}
            onCancel={() => setEditingActivityId(null)}
          />
        )}

        {activities.length === 0 && editingActivityId !== "new" && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No activities added yet. Click "Add Activity" to get started.
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
                  <SortableActivity
                    key={activity.id}
                    activity={activity}
                    onEdit={() => setEditingActivityId(activity.id)}
                    onDelete={() => handleDeleteActivity(activity.id)}
                    isEditing={editingActivityId === activity.id}
                    onSaveEdit={handleActivitySaved}
                    onCancelEdit={() => setEditingActivityId(null)}
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

function SortableActivity({
  activity,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  lessonId,
}: {
  activity: any;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
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
        <ActivityEditor
          lessonId={lessonId}
          activity={activity}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
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
          <p className="font-medium text-sm">{activity.title}</p>
        </div>
        {activity.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.shortDescription}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {activity.resources.length} resource{activity.resources.length !== 1 ? "s" : ""}
        </p>
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