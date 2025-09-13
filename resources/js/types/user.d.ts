export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
    is_active: boolean;
    email_verified_at: string | null;
    last_login_at?: string | null;
    created_at: string;
    updated_at: string;
    company_id?: number;
    profile?: UserProfile;
    company?: {
        id: number;
        name: string;
        description?: string;
        website?: string;
        email?: string;
        phone?: string;
        address?: string;
        logo?: string;
        industry?: string;
        company_size?: string;
        is_verified: boolean;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
}

export interface UserProfile {
    id: number;
    user_id: number;
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    current_position?: string;
    created_at: string;
    updated_at: string;
}

export type UserRole = 'user' | 'company_admin' | 'super_admin';

export interface UserCreateRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: UserRole;
    is_active: boolean;
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    current_position?: string;
    [key: string]: any;
}

export interface UserUpdateRequest {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: UserRole;
    is_active: boolean;
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    current_position?: string;
    [key: string]: any;
}

export interface UserFilters {
    search?: string;
    role?: UserRole;
    status?: 'active' | 'inactive';
    company?: string;
}