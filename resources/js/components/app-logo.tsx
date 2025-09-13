import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className = "h-8 w-auto max-w-[120px]" }: AppLogoProps) {
    const { settings } = usePage<SharedData>().props;

    return (
        <>
            {settings.logo ? (
                <img src={`/storage/${settings.logo}`} alt={settings.site_name || 'Logo'} className={`object-contain object-left ${className}`} />
            ) : (
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            )}
            {/* <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {settings.site_name || 'KarirConnect'}
                </span>
            </div> */}
        </>
    );
}
