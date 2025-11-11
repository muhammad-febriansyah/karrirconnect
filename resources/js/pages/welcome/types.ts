export interface Company {
    id: number;
    name: string;
    description: string;
    logo: string | null;
    website: string;
    industry: string;
    size: string;
    location: string;
    is_verified: boolean;
    active_jobs_count: number;
    total_job_posts: number;
}

export interface JobCategory {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    jobs_count: number;
}

export interface JobListing {
    id: number;
    slug: string;
    title: string;
    company: {
        id: number;
        name: string;
        logo: string | null;
        location: string;
    };
    category: {
        id: number;
        name: string;
        slug: string;
    };
    location: string;
    employment_type: string;
    work_arrangement: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    salary_negotiable: boolean;
    featured: boolean;
    created_at: string;
    application_deadline: string | null;
    applications_count: number;
    positions_available: number;
    remaining_positions: number;
}

export interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    author: {
        id: number;
        name: string;
        avatar: string | null;
    };
    published_at: string;
}

export interface SuccessStory {
    id: number;
    name: string;
    position: string;
    company: string;
    story: string;
    location: string | null;
    experience_years: number | null;
    salary_before: number | null;
    salary_after: number | null;
    salary_increase_percentage: number | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Statistics {
    total_jobs: number;
    total_companies: number;
    total_candidates: number;
    featured_jobs: number;
}

export interface Settings {
    site_name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
    thumbnail: string | null;
    hero_image: string | null;
    hero_title: string | null;
    hero_subtitle: string | null;
    social: {
        x?: string;
        linkedin?: string;
        instagram?: string;
        facebook?: string;
        tiktok?: string;
    };
    keywords: string;
}

export interface AboutUs {
    id: number;
    title: string;
    description: string;
    vision: string;
    mission: string;
    values: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    features: string[];
    stats: Array<{
        number: string;
        label: string;
        icon: string;
    }>;
    team: Array<{
        name: string;
        position: string;
        bio: string;
        image: string | null;
    }>;
    contact: {
        email: string[];
        phone: string[];
        address: string[];
    };
    cta_title: string;
    cta_description: string;
    is_active: boolean;
}

export interface HomePageProps {
    settings?: Settings;
    statistics: Statistics;
    featuredJobs: JobListing[];
    topCompanies: Company[];
    jobCategories: JobCategory[];
    latestNews: NewsArticle[];
    successStories: SuccessStory[];
    aboutUs: AboutUs | null;
    [key: string]: any;
}
