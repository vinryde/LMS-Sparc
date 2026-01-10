"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Polyfills
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

if (typeof URL.parse === 'undefined') {
  URL.parse = function (url: string, base?: string) {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker.mjs?v=5.4.296';

const pdfOptions = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/',
  disableRange: true,
  disableStream: true,
  disableAutoFetch: true,
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
  const [isMounted, setIsMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | Blob | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isIOS, setIsIOS] = useState(false);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
    
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    const isiOS = /iphone|ipad|ipod/.test(userAgent) || 
                  /iphone|ipad|ipod/.test(platform) ||
                  !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));
    
    setIsIOS(isiOS);
    
    if (isiOS) {
      setDebugInfo(prev => prev + "\n🔴 DETECTED iOS - USING CUSTOM RENDERER");
      // Smaller scale for iOS to reduce memory usage
      setScale(0.6);
    } else {
      setDebugInfo(prev => prev + "\n✅ Desktop detected");
    }
    
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        setPdfFile(pdfBlob);
        setDebugInfo(prev => prev + `\nBlob loaded: ${blob.size} bytes`);
      } catch (err) {
        console.error("PDF fetch error:", err);
        const msg = err instanceof Error ? err.message : "Failed to load PDF";
        setErrorMsg(msg);
        setDebugInfo(prev => prev + `\nFetch Error: ${msg}`);
        setLoading(false);
      }
    };

    fetchPdf();
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

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));

  // Custom iOS Page Component
  const IOSPage = ({ pageNumber }: { pageNumber: number }) => {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<any>(null);

    useEffect(() => {
      if (!pdfFile) return;

      let cancelled = false;
      const renderPage = async () => {
        try {
          console.log(`⏳ Loading page ${pageNumber}...`);
          
          // Convert Blob to ArrayBuffer for pdf.js
          let pdfData: ArrayBuffer | string;
          if (pdfFile instanceof Blob) {
            pdfData = await pdfFile.arrayBuffer();
          } else {
            pdfData = pdfFile;
          }
          
          if (cancelled) return;
          
          console.log('PDF data prepared, loading document...');
          
          // Load PDF document with proper typing
          const loadingTask = pdfjs.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          
          if (cancelled) return;
          
          console.log(`PDF loaded, getting page ${pageNumber}...`);
          
          // Get specific page
          const page = await pdf.getPage(pageNumber);
          
          if (cancelled) return;
          
          console.log('Page retrieved, setting up canvas...');
          
          const canvas = canvasRef.current;
          if (!canvas) {
            console.error('Canvas not available');
            setPageError("Canvas not available");
            return;
          }

          const viewport = page.getViewport({ scale });
          const context = canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: false,
            desynchronized: true
          });

          if (!context) {
            console.error('Could not get canvas context');
            setPageError("Could not get canvas context");
            return;
          }

          // Set canvas dimensions with conservative pixel ratio for iOS
          const dpr = 1; // Force 1:1 ratio on iOS to save memory
          canvas.width = viewport.width * dpr;
          canvas.height = viewport.height * dpr;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          
          context.scale(dpr, dpr);

          console.log('Canvas configured, starting render...');

          // Render page with correct parameters
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
          };

          // Cancel any existing render task
          if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
          }

          renderTaskRef.current = page.render(renderContext);
          await renderTaskRef.current.promise;
          
          if (!cancelled) {
            console.log(`✅ Page ${pageNumber} rendered successfully`);
            setPageLoaded(true);
          }
        } catch (err: any) {
          if (!cancelled && err?.name !== 'RenderingCancelledException') {
            const errorMsg = err instanceof Error ? err.message : 'Render failed';
            console.error(`❌ Page ${pageNumber} error:`, errorMsg, err);
            setPageError(errorMsg);
          }
        }
      };

      renderPage();

      return () => {
        cancelled = true;
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }
      };
    }, [pageNumber, scale]); // Removed pdfFile from deps to prevent re-renders

    return (
      <div className="relative bg-white shadow-lg mb-4 rounded" style={{ minHeight: '400px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ backgroundColor: 'white' }}
        />
        {!pageLoaded && !pageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading page {pageNumber}...</p>
            </div>
          </div>
        )}
        {pageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200">
            <div className="text-center p-4">
              <p className="text-destructive font-bold">Failed to render page {pageNumber}</p>
              <p className="text-xs mt-1">{pageError}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pl-6 pr-6 pb-6">
      {/* Header */}
      <div className="py-4 shrink-0 space-y-4">
        <Button asChild variant="outline">
          <Link href={backLink} className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back to Capsule
          </Link>
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="size-8 text-primary" />
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>

        {/* Controls */}
        {numPages > 0 && (
          <div className="flex flex-wrap items-center gap-3 bg-muted/50 p-3 rounded-lg">
            <Button onClick={handleZoomOut} size="sm" variant="outline">
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <Button onClick={handleZoomIn} size="sm" variant="outline">
              <ZoomIn className="size-4" />
            </Button>
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <span className="text-sm font-medium">
              {numPages} {numPages === 1 ? 'page' : 'pages'}
            </span>
            
            {isIOS && (
              <Badge className="bg-blue-500">iOS Mode</Badge>
            )}
          </div>
        )}

        {/* Debug Panel */}
        <details className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <summary className="font-bold cursor-pointer">
            🔍 Debug Info
          </summary>
          <pre className="whitespace-pre-wrap mt-2 text-xs">{debugInfo}</pre>
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
            <p className="font-bold">Quick Check:</p>
            <p>iOS Detected: {isIOS ? '✅ YES' : '❌ NO'}</p>
            <p>Mode: {isIOS ? '🔴 Custom iOS Renderer' : '✅ Standard Canvas'}</p>
            <p>Scale: {scale}</p>
          </div>
        </details>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center p-5 w-full overflow-auto">
        {errorMsg ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-10 text-destructive p-4 text-center">
            <p className="font-bold">Failed to load document.</p>
            <p className="text-sm">{errorMsg}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : isMounted && pdfFile ? (
          <>
            {isIOS ? (
              // iOS: Use custom renderer
              <div className="w-full max-w-4xl">
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded text-sm text-center">
                  📱 iOS Optimized Mode: Rendering page by page to avoid memory issues
                </div>
                {/* Only render first page on iOS to save memory */}
                <IOSPage pageNumber={1} />
                {numPages > 1 && (
                  <div className="text-center p-4 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">
                      This document has {numPages} pages. Showing page 1 only on mobile devices.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      For full document access, please use a desktop browser or download the PDF.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Desktop: Use standard react-pdf
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
                    {errorMsg && <p className="text-sm mt-2">{errorMsg}</p>}
                  </div>
                }
                className="w-full flex flex-col items-center"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page 
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    renderMode="canvas"
                    className="mb-4 shadow-lg bg-white"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div className="flex items-center gap-2 p-8 bg-white">
                        <Loader2 className="animate-spin" />
                        Rendering page {index + 1}...
                      </div>
                    }
                  />
                ))}
              </Document>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 mt-10">
            <Loader2 className="animate-spin" /> Initializing PDF Viewer...
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}