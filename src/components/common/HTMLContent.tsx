import React from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  content: string;
  className?: string;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ content, className = '' }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    // Allow common formatting tags
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'blockquote', 'code', 'pre'
    ],
    // Allow common attributes
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'style',
      'title'
    ],
    // Allow data URLs for images (base64 images)
    ALLOW_DATA_ATTR: false
  });

  return (
    <div
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        lineHeight: '1.6',
        // Rich-text editors sometimes save runs of words joined by &nbsp;
        // instead of real spaces, which normally can't wrap and just
        // overflows the container. Force a break wherever needed so long
        // content never gets clipped.
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
      }}
    />
  );
};

// Plain-text preview of rich HTML content, for card summaries and other
// spots that need a short, reliably-wrappable snippet rather than the full
// formatted content. Goes through a detached DOM node (not DOMPurify's own
// string output, which re-serializes entities like &nbsp; rather than
// decoding them) so textContent gives back real, wrappable characters.
export const htmlToPlainText = (html: string): string => {
  const sanitized = DOMPurify.sanitize(html);
  const el = document.createElement('div');
  el.innerHTML = sanitized;
  const text = el.textContent || '';
  const NBSP = String.fromCharCode(160);
  return text.split(NBSP).join(' ').replace(/\s+/g, ' ').trim();
};

export default HTMLContent;
