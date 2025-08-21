
export interface JobListing {
    id: number;
    title: string;
    description: string;
    requirements?: string;
    location: string;
    employment_type: EmploymentType;
    experience_level: ExperienceLevel;
    salary_min?: number;
    salary_max?: number;
    salary_currency: string;
    is_remote: boolean;
    is_featured: boolean;
    is_active: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    company_id: number;
    job_category_id: number;
    company?: Company;
    jobCategory?: JobCategory;
    skills?: Skill[];
}

export interface JobCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobApplication {
    id: number;
    job_listing_id: number;
    user_id: number;
    cover_letter?: string;
    resume_path?: string;
    status: ApplicationStatus;
    admin_notes?: string;
    applied_at: string;
    reviewed_at?: string;
    reviewed_by?: number;
    created_at: string;
    updated_at: string;
    jobListing?: JobListing;
    user?: User;
    reviewer?: User;
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';

export interface JobListingCreateRequest {
    title: string;
    description: string;
    requirements?: string;
    location: string;
    employment_type: EmploymentType;
    experience_level: ExperienceLevel;
    salary_min?: number;
    salary_max?: number;
    salary_currency: string;
    is_remote: boolean;
    is_featured: boolean;
    is_active: boolean;
    expires_at?: string;
    company_id: number;
    job_category_id: number;
    skill_ids?: number[];
}

export interface JobCategoryCreateRequest {
    name: string;
    description?: string;
    icon?: string;
    is_active: boolean;
}

export interface ApplicationStatusUpdate {
    status: ApplicationStatus;
    admin_notes?: string;
}