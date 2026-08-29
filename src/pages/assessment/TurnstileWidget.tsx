import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }
      ) => string;
      reset: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire: () => void;
}

// Renders Cloudflare's Turnstile challenge widget. Loaded via a plain
// <script> tag (rather than an npm package) since it's one small widget on
// one screen - not worth a new dependency for.
const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onToken, onExpire }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    const renderWidget = () => {
      if (renderedRef.current || !containerRef.current || !window.turnstile || !siteKey) return;
      renderedRef.current = true;
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': onExpire
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      window.onTurnstileLoad = renderWidget;
      return;
    }

    window.onTurnstileLoad = renderWidget;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="flex justify-center" />;
};

export default TurnstileWidget;
