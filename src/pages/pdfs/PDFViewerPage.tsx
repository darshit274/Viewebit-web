import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, ShoppingCartIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { pdfsService } from '../../services/pdfs';
import type { PdfDetail, PdfAccessInfo } from '../../services/pdfs';
import SecureBase64PdfViewer from '../../components/pdf/SecureBase64PdfViewer';

interface PreviewState {
  isPreview?: boolean;
  previewPages?: number;
}

const PDFViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viewerRef = useRef<HTMLDivElement>(null);

  const [pdf, setPdf] = useState<PdfDetail | null>(null);
  const [accessInfo, setAccessInfo] = useState<PdfAccessInfo | null>(null);
  const [secureContent, setSecureContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const previewState = (location.state || {}) as PreviewState;
  const isPreviewMode = !!previewState.isPreview;

  // Deterrence only (matches the mobile app's posture) — not real DRM, just makes
  // right-click-save/select/drag a bit less convenient inside the viewer.
  useEffect(() => {
    const node = viewerRef.current;
    if (!node) return;

    const block = (e: Event) => e.preventDefault();
    node.addEventListener('contextmenu', block);
    node.addEventListener('dragstart', block);
    node.addEventListener('selectstart', block);

    return () => {
      node.removeEventListener('contextmenu', block);
      node.removeEventListener('dragstart', block);
      node.removeEventListener('selectstart', block);
    };
  }, [secureContent]);

  useEffect(() => {
    if (!id) {
      setError('PDF ID is required');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const detail = await pdfsService.getPdfById(id);
        if (cancelled) return;
        setPdf(detail);

        const isFree = detail.is_free === true || detail.access_level === 'free';

        if (!isFree && !isPreviewMode) {
          const access = await pdfsService.checkAccess(id);
          if (cancelled) return;
          setAccessInfo(access);
          if (!access.hasAccess) {
            setIsLoading(false);
            return; // Never call /secure without confirmed access.
          }
        }

        const secure = await pdfsService.getSecureContent(id);
        if (cancelled) return;
        setSecureContent(secure.content);
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setError('PDF not found. It may have been removed or is no longer available.');
        } else {
          setError('Failed to load this document. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, isPreviewMode]);

  const handlePurchase = () => {
    if (!pdf) return;
    navigate('/payment', {
      state: {
        type: 'pdf',
        item: pdf,
        amount: pdf.discount_percentage
          ? (pdf.price || 0) * (1 - pdf.discount_percentage / 100)
          : pdf.price || 0,
        currency: pdf.currency || 'INR',
        title: `Purchase ${pdf.title}`,
        description: pdf.description,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading secure PDF viewer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/pdfs')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to PDFs
          </button>
        </div>
      </div>
    );
  }

  const showPaywall = pdf && accessInfo && !accessInfo.hasAccess && !secureContent;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/pdfs')} className="text-white hover:text-gray-300 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">{pdf?.title || 'Secure PDF Viewer'}</span>
            </div>
          </div>
          <span className="text-sm text-gray-400">🔒 Protected Content</span>
        </div>
      </div>

      {!showPaywall && (
        <div className="bg-yellow-600 text-yellow-100 p-2 text-center text-sm">
          This content is protected — downloading and printing are disabled.
        </div>
      )}

      {showPaywall ? (
        <div className="flex items-center justify-center py-24 px-4">
          <div className="max-w-md text-center">
            <div className="bg-primary-600 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{pdf!.title}</h3>
            <p className="text-sm text-gray-300 mb-6">
              {accessInfo!.showEnrollButton
                ? 'Enroll to get access to this document.'
                : accessInfo!.canPurchase
                ? 'Purchase this document to view it in full.'
                : 'You do not have access to this document.'}
            </p>
            {accessInfo!.showEnrollButton ? (
              <button onClick={() => navigate('/tests')} className="btn-primary">
                Enroll Now
              </button>
            ) : accessInfo!.canPurchase ? (
              <button onClick={handlePurchase} className="btn-primary inline-flex items-center">
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Purchase
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div ref={viewerRef} className="p-6" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
          {secureContent && (
            <SecureBase64PdfViewer
              base64Content={secureContent}
              title={pdf?.title}
              maxPages={isPreviewMode ? previewState.previewPages : undefined}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewerPage;
