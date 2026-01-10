"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  documentKey: string;
  title: string;
  description: string | null;
  backLink: string;
}

export function PDFViewer({ documentKey, title, description, backLink }: PDFViewerProps) {
  const documentUrl = useConstructUrl(documentKey);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Simple responsive width handler
  useEffect(() => {
    function handleResize() {
      const container = document.getElementById('pdf-container');
      if (container) {
        const isDesktop = window.innerWidth >= 1024; // lg breakpoint
        const fullWidth = container.clientWidth - 40; // 40px for padding
        setContainerWidth(isDesktop ? fullWidth * 0.9 : fullWidth);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div 
        id="pdf-container"
        className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center p-5 relative w-full"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={documentUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center gap-2 mt-10">
              <Loader2 className="animate-spin" /> Loading PDF...
            </div>
          }
          error={
            <div className="text-destructive mt-10 font-medium">
              Failed to load document.
            </div>
          }
          className="w-full flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              width={containerWidth}
              className="mb-4 shadow-lg bg-white"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}