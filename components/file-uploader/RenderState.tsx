import { cn } from "@/lib/utils";
import {
  CloudUploadIcon,
  ImageIcon,
  XIcon,
  Loader2Icon,
  FileTextIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground cursor-pointer",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4 cursor-pointer">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive cursor-pointer" />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <p className="text-sm mt-3 text-muted-foreground">
        Click or drag to retry
      </p>
      <Button className="mt-4" type="button">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
  fileName,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video" | "document";
  fileName?: string;
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "video" ? (
        <video
          src={previewUrl}
          controls
          className="rounded-md w-full h-full object-contain"
        />
      ) : fileType === "image" ? (
        <Image
          src={previewUrl}
          alt="Uploaded file"
          fill
          className="object-contain p-2 rounded-md"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-3">
            <FileTextIcon className="size-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {fileName || "Uploaded Document"}
          </p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline mt-1"
          >
            Open Document
          </a>
        </div>
      )}

      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  const isDocument =
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <div className="text-center flex justify-center items-center flex-col">
      <div className="flex items-center justify-center size-12 rounded-full bg-muted mb-3">
        {isDocument ? (
          <FileTextIcon className="size-6 text-primary" />
        ) : (
          <CloudUploadIcon className="size-6 text-primary" />
        )}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        Uploading... {progress}%
      </p>
      <p className="text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
