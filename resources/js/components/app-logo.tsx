import { resolveAssetUrl } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className = 'h-8 w-auto max-w-[120px]' }: AppLogoProps) {
    const { settings } = usePage<SharedData>().props;
    const logoSrc = resolveAssetUrl(settings.logo);

    return (
        <>
            {logoSrc ? (
                <img src={logoSrc} alt={settings.site_name || 'Logo'} className={`object-contain object-left ${className}`} />
            ) : (
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            )}
        </>
    );
}
