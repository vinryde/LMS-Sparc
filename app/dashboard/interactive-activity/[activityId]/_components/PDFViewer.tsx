"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Polyfill for Promise.withResolvers
if (typeof Promise.withResolvers === 'undefined') {
 
  Promise.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Polyfill for URL.parse
if (typeof URL.parse === 'undefined') {
  
  URL.parse = function (url: string, base?: string) {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}

// Set up the worker for react-pdf
// Use local shim to ensure polyfills are loaded before worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker.mjs?v=5.4.296';

const pdfOptions = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/',
  disableRange: true,
};

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
  const [isMounted, setIsMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | Blob | null>(null);
  const [pixelRatio, setPixelRatio] = useState<number>(1);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
    // Cap pixel ratio at 1 for mobile to avoid canvas memory limits, 2 for desktop high-DPI
    setPixelRatio(checkMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    
    // Fetch the PDF in the main thread to avoid Worker CORS/Fetch issues
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        // Ensure blob is treated as PDF
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        setPdfFile(pdfBlob);
        setDebugInfo(prev => prev + `\nBlob loaded: ${blob.size} bytes`);
      } catch (err) {
        console.error("Main thread PDF fetch error:", err);
        const msg = err instanceof Error ? err.message : "Failed to load PDF file";
        setErrorMsg(msg);
        setDebugInfo(prev => prev + `\nFetch Error: ${msg}`);
        setLoading(false);
      }
    };

    fetchPdf();

    let resizeTimeout: NodeJS.Timeout;

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const container = document.getElementById('pdf-container');
        if (container) {
          const isDesktop = window.innerWidth >= 1024; // lg breakpoint
          const fullWidth = container.clientWidth - 40; // 40px for padding
          
          // Only update if width actually changed significantly (>5px) to prevent loop
          setContainerWidth(prev => {
             const newWidth = isDesktop ? fullWidth * 0.9 : fullWidth;
             if (Math.abs(prev - newWidth) < 5) return prev;
             
             // Calculate scale based on a standard A4 width (approx 600px)
             // Ensure minimum scale of 0.6 on mobile to prevent text culling
             const targetScale = newWidth / 600; 
             setScale(targetScale < 0.6 && !isDesktop ? 0.6 : targetScale);
             return newWidth;
          });
        }
      }, 200); // Debounce resize by 200ms
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [documentUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setDebugInfo(prev => prev + `\nDoc Loaded: ${numPages} pages`);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF Load Error:", error);
    setErrorMsg(error.message);
    setLoading(false);
    setDebugInfo(prev => prev + `\nDoc Load Error: ${error.message}`);
  }

  function onPageLoadSuccess(page: any) {
    setDebugInfo(prev => prev + `\nPage ${page.pageNumber} Loaded`);
  }

  function onPageRenderSuccess(page: any) {
    setDebugInfo(prev => prev + `\nPage ${page.pageNumber} Rendered`);
  }

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
        
        {/* Debug Info Panel - Visible only if there are errors or loading issues */}
        <details className="text-xs text-muted-foreground bg-muted p-2 rounded mt-2">
          <summary>Debug Info (Click to expand)</summary>
          <pre className="whitespace-pre-wrap mt-2">{debugInfo}</pre>
        </details>
      
        {/* Mobile Text Layer Fallback Styles */}
        <style jsx global>{`
          .react-pdf__Page__textContent {
            user-select: text;
            -webkit-user-select: text;
            pointer-events: auto;
          }
          /* On mobile, force text layer to be visible (black) to compensate for missing canvas text */
          ${isMobile ? `
            .react-pdf__Page__textContent span {
              color: black !important;
              opacity: 1 !important;
            }
          ` : ''}
        `}</style>
      </div>

      {/* PDF Viewer Area */}
      <div 
        id="pdf-container"
        className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center p-5 relative w-full overflow-auto"
        onContextMenu={(e) => e.preventDefault()}
      >
        {isMounted && pdfFile ? (
          <Document
            file={pdfFile}
            options={pdfOptions}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center gap-2 mt-10">
                <Loader2 className="animate-spin" /> Loading PDF...
              </div>
            }
            error={
              <div className="text-destructive mt-10 font-medium p-4 text-center">
                <p>Failed to load document.</p>
                {errorMsg && <p className="text-sm mt-2 text-muted-foreground">{errorMsg}</p>}
              </div>
            }
            className="w-full flex flex-col items-center"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}_${scale}_${pixelRatio}`} 
                pageNumber={index + 1} 
                scale={scale}
                devicePixelRatio={pixelRatio}
                className="mb-4 shadow-lg bg-white"
                renderTextLayer={true} 
                renderAnnotationLayer={!isMobile}
                onLoadSuccess={onPageLoadSuccess}
                onRenderSuccess={onPageRenderSuccess}
                onGetTextSuccess={(text) => {
                  setDebugInfo(prev => prev + `\nPage ${index + 1} Text Items: ${text.items.length}`);
                }}
                onGetTextError={(err) => {
                  console.error(`Page ${index + 1} text error:`, err);
                  setDebugInfo(prev => prev + `\nPage ${index + 1} Text Error: ${err.message}`);
                }}
                onRenderError={(err) => {
                  console.error(`Page ${index + 1} render error:`, err);
                  setDebugInfo(prev => prev + `\nPage ${index + 1} Render Error: ${err.message}`);
                }}
              />
            ))}
          </Document>
        ) : (
          <div className="flex items-center gap-2 mt-10">
            <Loader2 className="animate-spin" /> Initializing PDF Viewer...
          </div>
        )}
      </div>
    </div>
  );
}