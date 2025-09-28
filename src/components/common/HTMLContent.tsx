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
        // Add styles for better HTML content rendering
        lineHeight: '1.6',
      }}
    />
  );
};

export default HTMLContent;