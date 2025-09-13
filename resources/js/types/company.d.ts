export interface Company {
    id: number;
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    logo?: string;
    industry?: string;
    company_size?: CompanySize;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
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
    industry?: string;
    company_size?: CompanySize;
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
    verification_status?: 'verified' | 'unverified';
    status?: 'active' | 'inactive';
}