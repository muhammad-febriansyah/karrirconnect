export interface Company {
    id: number;
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    location?: string;
    logo?: string;
    industry?: string;
    size?: CompanySize;
    company_size?: CompanySize;
    slug?: string;
    admin_user_id?: number;
    verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
    verification_documents?: any;
    verification_data?: any;
    social_links?: any;
    is_verified: boolean;
    is_active: boolean;
    job_posting_points?: number;
    total_job_posts?: number;
    active_job_posts?: number;
    max_active_jobs?: number;
    points_last_updated?: string;
    created_at: string;
    updated_at: string;
    user_id?: number;
    user?: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        role: string;
        is_active: boolean;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
    };
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface CompanyCreateRequest {
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    location?: string;
    industry?: string;
    company_size?: CompanySize;
    logo?: File | null;
    social_links?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    admin_user_id?: number;
    verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
    is_verified: boolean;
    is_active: boolean;
    user_id?: number;
    [key: string]: any;
}

export interface CompanyUpdateRequest {
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    industry?: string;
    company_size?: CompanySize;
    is_verified: boolean;
    is_active: boolean;
    [key: string]: any;
}

export interface CompanyFilters {
    search?: string;
    industry?: string;
    company_size?: CompanySize;
    verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
    status?: 'active' | 'inactive';
}