import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import type { SharedData } from '@/types';

type FlashMessages = SharedData['flash'];

interface FlashSnapshot {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
}

export function useFlashToasts() {
    const { flash } = usePage<SharedData>().props;
    const lastFlash = useRef<FlashSnapshot>({});

    useEffect(() => {
        if (!flash) {
            return;
        }

        const { success, error, warning } = flash as FlashMessages;

        if (success && success !== lastFlash.current.success) {
            toast.success(success);
        }

        if (error && error !== lastFlash.current.error) {
            toast.error(error);
        }

        if (warning && warning !== lastFlash.current.warning) {
            toast.warning?.(warning);
        }

        lastFlash.current = {
            success: success ?? null,
            error: error ?? null,
            warning: warning ?? null,
        };
    }, [flash?.success, flash?.error, flash?.warning]);
}
