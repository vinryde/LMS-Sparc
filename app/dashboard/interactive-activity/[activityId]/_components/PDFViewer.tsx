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
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | Blob | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isIOS, setIsIOS] = useState(false);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
    
    // Enhanced iOS detection
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    const isiOS = /iphone|ipad|ipod/.test(userAgent) || 
                  /iphone|ipad|ipod/.test(platform) ||
                  !!(navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));
    
    setIsIOS(isiOS);
    
    if (isiOS) {
      setDebugInfo(prev => prev + "\n🔴 iOS DETECTED - Using optimized settings");
      // Lower scale for iOS to reduce memory
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
        setDebugInfo(prev => prev + `\n✅ Blob loaded: ${blob.size} bytes`);
      } catch (err) {
        console.error("PDF fetch error:", err);
        const msg = err instanceof Error ? err.message : "Failed to load PDF";
        setErrorMsg(msg);
        setDebugInfo(prev => prev + `\n❌ Fetch Error: ${msg}`);
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
          const fullWidth = container.clientWidth - 40;
          setContainerWidth(fullWidth);
        }
      }, 200);
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
    setDebugInfo(prev => prev + `\n✅ Doc Loaded: ${numPages} pages`);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF Load Error:", error);
    setErrorMsg(error.message);
    setLoading(false);
    setDebugInfo(prev => prev + `\n❌ Doc Load Error: ${error.message}`);
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.4));

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
              <span className="text-xs text-orange-600 dark:text-orange-400 ml-2">
                📱 Mobile: Showing limited pages
              </span>
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
            <p>Scale: {scale}</p>
            <p>Pages: {numPages}</p>
          </div>
        </details>
      </div>

      {/* PDF Viewer */}
      <div 
        id="pdf-container"
        className="flex-1 bg-muted/30 rounded-lg border flex flex-col items-center p-5 w-full overflow-auto"
      >
        {errorMsg ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-10 text-destructive p-4 text-center">
            <p className="font-bold">Failed to load document.</p>
            <p className="text-sm">{errorMsg}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : isMounted && pdfFile ? (
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
            {isIOS ? (
              // iOS: Render only first 3 pages to avoid memory crash
              Array.from(new Array(Math.min(numPages, 3)), (el, index) => (
                <div key={`page_${index + 1}`} className="w-full max-w-4xl mb-4">
                  <Page 
                    pageNumber={index + 1}
                    scale={scale}
                    renderMode="canvas"
                    className="shadow-lg bg-white mx-auto"
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    devicePixelRatio={1} // Force low DPI on iOS to save memory
                    loading={
                      <div className="flex items-center gap-2 p-8 bg-white min-h-[400px] justify-center">
                        <Loader2 className="animate-spin" />
                        Loading page {index + 1}...
                      </div>
                    }
                    onLoadSuccess={(page) => {
                      setDebugInfo(prev => prev + `\n✅ Page ${page.pageNumber} loaded`);
                    }}
                    onRenderSuccess={(page) => {
                      setDebugInfo(prev => prev + `\n🎨 Page ${page.pageNumber} rendered!`);
                    }}
                    onRenderError={(err) => {
                      console.error(`Page ${index + 1} render error:`, err);
                      setDebugInfo(prev => prev + `\n❌ Page ${index + 1} error: ${err.message}`);
                    }}
                  />
                  {index < Math.min(numPages, 3) - 1 && (
                    <div className="h-px bg-border my-4" />
                  )}
                </div>
              ))
            ) : (
              // Desktop: Render all pages for scrolling
              Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="w-full max-w-4xl mb-4">
                  <Page 
                    pageNumber={index + 1}
                    scale={scale}
                    renderMode="canvas"
                    className="shadow-lg bg-white mx-auto"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div className="flex items-center gap-2 p-8 bg-white min-h-[400px] justify-center">
                        <Loader2 className="animate-spin" />
                        Loading page {index + 1}...
                      </div>
                    }
                    onLoadSuccess={(page) => {
                      setDebugInfo(prev => prev + `\n✅ Page ${page.pageNumber} loaded`);
                    }}
                    onRenderSuccess={(page) => {
                      setDebugInfo(prev => prev + `\n🎨 Page ${page.pageNumber} rendered!`);
                    }}
                    onRenderError={(err) => {
                      console.error(`Page ${index + 1} render error:`, err);
                      setDebugInfo(prev => prev + `\n❌ Page ${index + 1} error: ${err.message}`);
                    }}
                  />
                  {index < numPages - 1 && (
                    <div className="h-px bg-border my-4" />
                  )}
                </div>
              ))
            )}
            
            {isIOS && numPages > 3 && (
              <div className="mt-8 p-4 bg-orange-100 dark:bg-orange-900 rounded-lg text-center max-w-md">
                <p className="font-semibold text-orange-800 dark:text-orange-200">
                  📱 Mobile Limitation
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  Showing 3 of {numPages} pages to prevent crashes on mobile devices. 
                  For full document access, please view on a desktop computer.
                </p>
              </div>
            )}
          </Document>
        ) : (
          <div className="flex items-center gap-2 mt-10">
            <Loader2 className="animate-spin" /> Initializing PDF Viewer...
          </div>
        )}
      </div>

      {/* iOS-specific styling */}
      <style jsx global>{`
        .react-pdf__Page__textContent {
          user-select: text;
          -webkit-user-select: text;
        }
        
        .react-pdf__Page__canvas {
          width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}