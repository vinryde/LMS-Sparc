"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- POLYFILL FOR iOS < 17.4 & OLDER BROWSERS ---
if (typeof Promise.withResolvers === "undefined") {
  // @ts-expect-error This is a polyfill for older environments
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
// ------------------------------------------------

// Worker Setup
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFCanvasProps {
  documentKey: string;
}

export default function PDFCanvas({ documentKey }: PDFCanvasProps) {
  const documentUrl = useConstructUrl(documentKey);
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const options = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
  }), []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    function handleResize() {
      const container = document.getElementById('pdf-container');
      if (container) {
        // 40px accounts for the padding (p-5 = 20px * 2)
        const newWidth = container.clientWidth - 40;
        setContainerWidth(newWidth);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id="pdf-container"
      className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center p-5 relative w-full min-h-[500px]"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        file={documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        loading={
          <div className="flex flex-col items-center gap-4 mt-20">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading Document...</p>
          </div>
        }
        error={
          <div className="flex flex-col items-center gap-2 mt-20 text-destructive">
            <div className="font-bold text-lg">Unable to load document</div>
            <p className="text-sm opacity-80">Please check your connection or try again later.</p>
          </div>
        }
        className="w-full flex flex-col items-center"
      >
        {numPages > 0 && Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth || undefined}
            className="mb-4 shadow-lg bg-white"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="h-[500px] w-full bg-white animate-pulse rounded mb-4" />
            }
          />
        ))}
      </Document>
    </div>
  );
}