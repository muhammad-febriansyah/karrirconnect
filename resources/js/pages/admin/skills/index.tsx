import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { skillsColumns, type Skill as SkillType } from '@/components/tables/skills-columns';
import { Plus } from 'lucide-react';

interface Props {
    skills: {
        data: SkillType[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function SkillsIndex({ skills }: Props) {
    return (
        <AppLayout>
            <Head title="Manajemen Skills" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Skills</h1>
                        <p className="text-gray-600">Kelola skills yang tersedia untuk pengguna</p>
                    </div>
                    <Link href="/admin/skills/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Skill
                        </Button>
                    </Link>
                </div>

                {/* Skills Data Table */}
                <DataTable 
                    columns={skillsColumns} 
                    data={skills.data} 
                    searchKey="name"
                    searchPlaceholder="Cari skills..."
                    initialColumnVisibility={{
                        category: false,
                        users_count: false
                    }}
                />
            </div>
        </AppLayout>
    );
}