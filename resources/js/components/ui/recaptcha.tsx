import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        grecaptcha: any;
    }
}

interface ReCaptchaProps {
    siteKey: string;
    onChange: (token: string | null) => void;
    size?: 'compact' | 'normal';
    theme?: 'light' | 'dark';
    className?: string;
}

export default function ReCaptcha({ 
    siteKey, 
    onChange, 
    size = 'normal', 
    theme = 'light',
    className = '' 
}: ReCaptchaProps) {
    const captchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Load reCAPTCHA script if not already loaded
        if (!window.grecaptcha) {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                renderCaptcha();
            };
            document.head.appendChild(script);
        } else {
            renderCaptcha();
        }

        return () => {
            // Cleanup
            if (widgetIdRef.current !== null && window.grecaptcha) {
                try {
                    window.grecaptcha.reset(widgetIdRef.current);
                } catch (e) {
                    // Ignore errors during cleanup
                }
            }
        };
    }, [siteKey]);

    const renderCaptcha = () => {
        if (captchaRef.current && window.grecaptcha && window.grecaptcha.render) {
            try {
                widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
                    sitekey: siteKey,
                    callback: (token: string) => {
                        onChange(token);
                    },
                    'expired-callback': () => {
                        onChange(null);
                    },
                    'error-callback': () => {
                        onChange(null);
                    },
                    size: size,
                    theme: theme,
                });
            } catch (error) {
                console.error('Error rendering reCAPTCHA:', error);
            }
        } else {
            // Retry after a short delay
            setTimeout(renderCaptcha, 100);
        }
    };

    const reset = () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
            window.grecaptcha.reset(widgetIdRef.current);
            onChange(null);
        }
    };

    // Expose reset method
    useEffect(() => {
        if (captchaRef.current) {
            (captchaRef.current as any).reset = reset;
        }
    }, []);

    return (
        <div className={className}>
            <div ref={captchaRef}></div>
        </div>
    );
}