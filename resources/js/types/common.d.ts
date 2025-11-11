import type { Errors, ErrorBag } from '@inertiajs/core';

export interface PageProps {
    auth?: { user: any };
    [key: string]: any;
}

export interface FormData {
    [key: string]: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ValidationError {
    [key: string]: string[];
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface Skill {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    searchable?: boolean;
}

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    [key: string]: string | number | boolean | null | undefined;
}

export interface Setting {
    id?: number;
    site_name?: string;
    keyword?: string;
    email?: string;
    address?: string;
    phone?: string;
    description?: string;
    x?: string;
    linkedin?: string;
    yt?: string;
    ig?: string;
    fb?: string;
    tiktok?: string;
    fee?: number;
    logo?: string;
    thumbnail?: string;
    created_at?: string;
    updated_at?: string;
}
