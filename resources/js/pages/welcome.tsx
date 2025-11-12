import ModernFooter from '@/components/modern-footer';
import ModernNavbar from '@/components/modern-navbar';
import { Head, usePage } from '@inertiajs/react';
import HeroSection from '@/pages/welcome/sections/HeroSection';
import AboutSection from '@/pages/welcome/sections/AboutSection';
import JobCategoriesSection from '@/pages/welcome/sections/JobCategoriesSection';
import FeaturedJobsSection from '@/pages/welcome/sections/FeaturedJobsSection';
import SuccessStoriesSection from '@/pages/welcome/sections/SuccessStoriesSection';
import CallToActionSection from '@/pages/welcome/sections/CallToActionSection';
import type { HomePageProps } from '@/pages/welcome/types';

export default function Welcome() {
    const { settings, statistics, featuredJobs, jobCategories, successStories, aboutUs } = usePage<HomePageProps>().props;

    const siteName = settings?.site_name || 'KarirConnect';
    const siteDescription =
        settings?.description || 'Platform karir terpercaya yang menghubungkan talenta dengan peluang terbaik';

    return (
        <>
            <Head title={`${siteName} - Temukan Karir Impian Anda`} />

            <div className="relative min-h-screen overflow-x-hidden bg-white">
                <ModernNavbar currentPage="home" />

                <HeroSection
                    settings={settings}
                    statistics={statistics}
                    siteName={siteName}
                    siteDescription={siteDescription}
                />

                {aboutUs && <AboutSection aboutUs={aboutUs} />}

                <JobCategoriesSection jobCategories={jobCategories} />

                <FeaturedJobsSection featuredJobs={featuredJobs} statistics={statistics} />

                <SuccessStoriesSection successStories={successStories} statistics={statistics} />

                <CallToActionSection statistics={statistics} />

                <ModernFooter
                    siteName={siteName}
                    siteDescription={siteDescription}
                    statistics={statistics}
                    settings={settings}
                />
            </div>
        </>
    );
}
