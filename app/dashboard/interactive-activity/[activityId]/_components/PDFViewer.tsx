"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import of the heavy PDF component with SSR disabled
// This works because we are inside a "use client" file
const PDFCanvas = dynamic(() => import("./PDFCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center justify-center p-5 min-h-[500px] text-muted-foreground gap-2">
      <Loader2 className="size-6 animate-spin" />
      <p>Initializing PDF Viewer...</p>
    </div>
  ),
});

interface PDFViewerProps {
  documentKey: string;
  title: string;
  description: string | null;
  backLink: string;
}

export function PDFViewer({ documentKey, title, description, backLink }: PDFViewerProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background pl-6 pr-6 pb-6">
      {/* Back Button Area */}
      <div className="py-4 shrink-0">
        <Button asChild variant="outline">
          <Link href={backLink} className="flex items-center gap-2">
            <ArrowLeft className="size-4 mr-2" />
            Back to Lesson
          </Link>
        </Button>
      </div>

      {/* Header Area */}
      <div className="space-y-3 pt-3 mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <FileText className="size-8 text-primary" />
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-lg">{description}</p>
        )}
      </div>

      {/* PDF Viewer Area */}
      <PDFCanvas documentKey={documentKey} />
    </div>
  );
}