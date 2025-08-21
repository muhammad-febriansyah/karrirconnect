import type React from 'react';
import { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';

// Define available annotation actions
type AnnotationAction = 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';

// Custom TypeScript interface for supported props
interface HighlighterProps {
    children: React.ReactNode;
    action?: AnnotationAction;
    color?: string;
    strokeWidth?: number;
    animationDuration?: number;
    iterations?: number;
    padding?: number;
    multiline?: boolean;
}

export function Highlighter({
    children,
    action = 'highlight',
    color = '#ffd1dc', // Default pink color
    strokeWidth = 1.5,
    animationDuration = 600,
    iterations = 2,
    padding = 2,
    multiline = true,
}: HighlighterProps) {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            // Clear any existing annotations first
            const existingAnnotations = element.querySelectorAll('svg[data-rough-notation]');
            existingAnnotations.forEach(svg => svg.remove());

            // Wait for fonts and layout to be fully loaded
            const initializeAnnotation = () => {
                const annotation = annotate(element, {
                    type: action,
                    color,
                    strokeWidth,
                    animationDuration,
                    iterations,
                    padding,
                    multiline,
                });

                // Longer delay to ensure text is fully positioned
                const timer = setTimeout(() => {
                    annotation.show();
                }, 500);

                return { annotation, timer };
            };

            // Use requestAnimationFrame to ensure DOM is ready
            let rafId: number;
            let annotationData: { annotation: any; timer: NodeJS.Timeout } | null = null;

            const setupAnnotation = () => {
                rafId = requestAnimationFrame(() => {
                    // Additional check to ensure element is still mounted
                    if (element && element.offsetParent !== null) {
                        annotationData = initializeAnnotation();
                    }
                });
            };

            // Wait for fonts to load if available
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(setupAnnotation);
            } else {
                // Fallback for browsers without font loading API
                setTimeout(setupAnnotation, 200);
            }

            // Cleanup function
            return () => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                if (annotationData) {
                    clearTimeout(annotationData.timer);
                    try {
                        annotationData.annotation.hide();
                        annotationData.annotation.remove();
                    } catch (e) {
                        // Silently handle cleanup errors
                    }
                }
                // Also remove any remaining SVG elements
                if (element) {
                    const svgs = element.querySelectorAll('svg[data-rough-notation]');
                    svgs.forEach(svg => svg.remove());
                }
            };
        }
    }, [action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

    return (
        <span ref={elementRef} className="relative inline-block bg-transparent">
            {children}
        </span>
    );
}
