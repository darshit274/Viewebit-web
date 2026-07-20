import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface SecureBase64PdfViewerProps {
  base64Content: string;
  title?: string;
  /** Caps navigable pages (e.g. a limited free preview of a premium document). */
  maxPages?: number;
}

/**
 * Renders a PDF (delivered as a base64 data URI) page-by-page to <canvas>.
 * This is UX-level deterrence, not real DRM — canvas has no built-in save/print
 * affordance, unlike a native PDF plugin or a blob-URL <iframe>, and no
 * download/share control is exposed anywhere in this component.
 */
const SecureBase64PdfViewer: React.FC<SecureBase64PdfViewerProps> = ({ base64Content, title, maxPages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const base64 = base64Content.includes(',') ? base64Content.split(',')[1] : base64Content;
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        loadingTaskRef.current = loadingTask;
        const pdf = await loadingTask.promise;
        if (cancelled) {
          loadingTask.destroy();
          return;
        }
        pdfDocRef.current = pdf;
        setNumPages(maxPages ? Math.min(pdf.numPages, maxPages) : pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        if (!cancelled) setError('Failed to load this document.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      loadingTaskRef.current?.destroy();
      pdfDocRef.current = null;
      loadingTaskRef.current = null;
    };
  }, [base64Content, maxPages]);

  useEffect(() => {
    const pdf = pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas || numPages === 0) return;

    let cancelled = false;

    const renderPage = async () => {
      renderTaskRef.current?.cancel();

      const page = await pdf.getPage(currentPage);
      if (cancelled) return;

      const containerWidth = containerRef.current?.clientWidth || 800;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const task = page.render({ canvas, canvasContext: context, viewport });
      renderTaskRef.current = task;
      try {
        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Failed to render page:', err);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
    };
  }, [currentPage, numPages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div>
      {!!maxPages && (
        <div className="text-center text-sm text-primary-700 bg-primary-50 rounded-md py-2 mb-3">
          Preview — showing {numPages} of {pdfDocRef.current?.numPages ?? numPages} pages
        </div>
      )}
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className="select-none bg-gray-100 rounded-lg overflow-hidden flex justify-center"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <canvas ref={canvasRef} aria-label={title} />
      </div>

      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {numPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SecureBase64PdfViewer;
