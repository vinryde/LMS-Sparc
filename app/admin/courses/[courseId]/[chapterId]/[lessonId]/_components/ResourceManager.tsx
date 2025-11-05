"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Loader2, FileText, Link as LinkIcon, Image as ImageIcon, File } from "lucide-react";
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
  createResource,
  updateResource,
  deleteResource,
  reorderResources,
  getResourcesData,
} from "../actions";
import { Uploader } from "@/components/file-uploader/Uploader";
import { cn } from "@/lib/utils";

type ResourceType = "TEXT" | "LINK" | "IMAGE" | "DOCUMENT";

type ResourceData = {
  id: string;
  title: string;
  type: ResourceType;
  position: number;
  textContent?: string | null;
  linkUrl?: string | null;
  imageKey?: string | null;
  documentKey?: string | null;
} | null;

interface ResourceManagerProps {
  lessonId: string;
  initialResources: ResourceData[];
  onResourceUpdate?: (resources: ResourceData[]) => void;
}

export function ResourceManager({ lessonId, initialResources, onResourceUpdate }: ResourceManagerProps) {
  const [resources, setResources] = useState<any[]>(initialResources || []);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialResources) {
      setResources(initialResources || []);
    }
  }, [initialResources]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setResources((items: any[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        const updated = reordered.map((item, index) => ({
          ...item,
          position: index + 1,
        }));

        // Save to backend
        reorderResources({
          lessonId: lessonId,
          resources: updated.map((r) => ({ id: r.id, position: r.position })),
        });

        return updated;
      });
    }
  }

  async function handleDeleteResource(resourceId: string) {
    const { data: result, error } = await tryCatch(
      deleteResource({ resourceId, lessonId })
    );

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to delete resource");
    } else {
      toast.success(result?.message);
      setResources((prev: any[]) => prev.filter((r) => r.id !== resourceId));
    }
  }

  async function handleResourceSaved() {
    const { data: resourceData } = await tryCatch(getResourcesData(lessonId));
    if (resourceData) {
      setResources(resourceData || []);
      if (onResourceUpdate) {
        onResourceUpdate(resourceData);
      }
    }
    setEditingResourceId(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <p className="text-xs text-muted-foreground">
              {resources.length} resource{resources.length !== 1 ? "s" : ""} added
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setEditingResourceId("new")}
            variant="outline"
            disabled={editingResourceId === "new"}
          >
            <Plus className="size-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {editingResourceId === "new" && (
          <ResourceEditor
            lessonId={lessonId}
            onSave={handleResourceSaved}
            onCancel={() => setEditingResourceId(null)}
          />
        )}

        {resources.length === 0 && editingResourceId !== "new" && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No resources added yet. Click "Add Resource" to get started.
            </p>
          </div>
        )}

        {resources.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={resources.map((r: any) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {resources.map((resource: any) => (
                  <SortableResource
                    key={resource.id}
                    resource={resource}
                    onEdit={() => setEditingResourceId(resource.id)}
                    onDelete={() => handleDeleteResource(resource.id)}
                    isEditing={editingResourceId === resource.id}
                    onSaveEdit={handleResourceSaved}
                    onCancelEdit={() => setEditingResourceId(null)}
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

function SortableResource({
  resource,
  onEdit,
  onDelete,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  lessonId,
}: {
  resource: any;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  lessonId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: resource.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <ResourceEditor
          lessonId={lessonId}
          resource={resource}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      </div>
    );
  }

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "TEXT":
        return <FileText className="size-4 text-blue-600" />;
      case "LINK":
        return <LinkIcon className="size-4 text-green-600" />;
      case "IMAGE":
        return <ImageIcon className="size-4 text-purple-600" />;
      case "DOCUMENT":
        return <File className="size-4 text-orange-600" />;
    }
  };

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
          {getResourceIcon(resource.type)}
          <p className="font-medium text-sm">{resource.title}</p>
          <span className="text-xs text-muted-foreground">({resource.type})</span>
        </div>
        {resource.type === "TEXT" && resource.textContent && (
          <p className="text-sm text-muted-foreground line-clamp-2">{resource.textContent}</p>
        )}
        {resource.type === "LINK" && resource.linkUrl && (
          <a href={resource.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
            {resource.linkUrl}
          </a>
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

function ResourceEditor({
  lessonId,
  resource,
  onSave,
  onCancel,
}: {
  lessonId: string;
  resource?: any;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(resource?.title || "");
  const [type, setType] = useState<ResourceType>(resource?.type || "TEXT");
  const [textContent, setTextContent] = useState(resource?.textContent || "");
  const [linkUrl, setLinkUrl] = useState(resource?.linkUrl || "");
  const [imageKey, setImageKey] = useState(resource?.imageKey || "");
  const [documentKey, setDocumentKey] = useState(resource?.documentKey || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (type === "TEXT" && !textContent.trim()) {
      toast.error("Text content is required");
      return;
    }

    if (type === "LINK" && !linkUrl.trim()) {
      toast.error("Link URL is required");
      return;
    }

    if (type === "IMAGE" && !imageKey) {
      toast.error("Image is required");
      return;
    }

    if (type === "DOCUMENT" && !documentKey) {
      toast.error("Document is required");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      type,
      lessonId,
      textContent: type === "TEXT" ? textContent.trim() : undefined,
      linkUrl: type === "LINK" ? linkUrl.trim() : undefined,
      imageKey: type === "IMAGE" ? imageKey : undefined,
      documentKey: type === "DOCUMENT" ? documentKey : undefined,
    };

    const { data: result, error } = resource
      ? await tryCatch(updateResource(payload, resource.id))
      : await tryCatch(createResource(payload));

    if (error || result?.status === "error") {
      toast.error(result?.message || "Failed to save resource");
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
          {resource ? "Edit Resource" : "New Resource"}
        </h4>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resource-type">Resource Type *</Label>
        <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TEXT">Text</SelectItem>
            <SelectItem value="LINK">Link</SelectItem>
            <SelectItem value="IMAGE">Image</SelectItem>
            <SelectItem value="DOCUMENT">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resource-title">Title *</Label>
        <Input
          id="resource-title"
          placeholder="Enter resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
        />
      </div>

      {type === "TEXT" && (
        <div className="space-y-2">
          <Label htmlFor="text-content">Text Content *</Label>
          <Textarea
            id="text-content"
            placeholder="Enter text content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[100px]"
            disabled={isSaving}
          />
        </div>
      )}

      {type === "LINK" && (
        <div className="space-y-2">
          <Label htmlFor="link-url">Link URL *</Label>
          <Input
            id="link-url"
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            disabled={isSaving}
          />
        </div>
      )}

      {type === "IMAGE" && (
        <div className="space-y-2">
          <Label>Image *</Label>
          <Uploader
            value={imageKey}
            onChange={setImageKey}
            fileTypeAccepted="image"
          />
        </div>
      )}

      {type === "DOCUMENT" && (
        <div className="space-y-2">
          <Label>Document *</Label>
          <Uploader
            value={documentKey}
            onChange={setDocumentKey}
            fileTypeAccepted="document"
          />
        </div>
      )}

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
            <>{resource ? "Update" : "Create"} Resource</>
          )}
        </Button>
      </div>
    </div>
  );
}