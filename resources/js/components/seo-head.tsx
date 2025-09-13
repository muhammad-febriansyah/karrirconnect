import { Head } from '@inertiajs/react';

interface SEOHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    keywords?: string;
}

export default function SEOHead({
    title,
    description,
    image,
    url,
    type = 'website',
    siteName,
    keywords
}: SEOHeadProps) {
    const currentUrl = url || window.location.href;
    const defaultImage = image || '/default-og-image.jpg';
    
    return (
        <Head>
            <title>{title}</title>
            
            {/* Basic Meta Tags */}
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={defaultImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            {siteName && <meta property="og:site_name" content={siteName} />}
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={defaultImage} />
        </Head>
    );
}