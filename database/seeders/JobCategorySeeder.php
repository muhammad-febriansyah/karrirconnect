<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Information Technology',
                'description' => 'Software development, IT support, cybersecurity, and technology-related positions',
                'slug' => 'information-technology',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Finance & Banking',
                'description' => 'Financial analysis, banking, accounting, and investment opportunities',
                'slug' => 'finance-banking',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Healthcare & Medical',
                'description' => 'Medical professionals, healthcare administration, and pharmaceutical roles',
                'slug' => 'healthcare-medical',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Marketing & Sales',
                'description' => 'Digital marketing, sales representatives, business development positions',
                'slug' => 'marketing-sales',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Engineering',
                'description' => 'Civil, mechanical, electrical, and other engineering disciplines',
                'slug' => 'engineering',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Education & Training',
                'description' => 'Teaching positions, corporate training, and educational administration',
                'slug' => 'education-training',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR management, recruitment, employee relations, and talent acquisition',
                'slug' => 'human-resources',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Customer support, call center, and client relations positions',
                'slug' => 'customer-service',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Hospitality & Tourism',
                'description' => 'Hotels, restaurants, travel agencies, and tourism-related jobs',
                'slug' => 'hospitality-tourism',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Legal',
                'description' => 'Law firms, corporate legal departments, and paralegal positions',
                'slug' => 'legal',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Creative & Design',
                'description' => 'Graphic design, UX/UI, content creation, and creative services',
                'slug' => 'creative-design',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Manufacturing & Production',
                'description' => 'Factory operations, quality control, and production management',
                'slug' => 'manufacturing-production',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Logistics & Supply Chain',
                'description' => 'Transportation, warehouse management, and supply chain operations',
                'slug' => 'logistics-supply-chain',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Media & Communications',
                'description' => 'Journalism, public relations, broadcasting, and media production',
                'slug' => 'media-communications',
                'icon' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Agriculture & Food',
                'description' => 'Farming, food production, agricultural research, and food service',
                'slug' => 'agriculture-food',
                'icon' => null,
                'is_active' => true,
            ]
        ];

        foreach ($categories as $category) {
            \App\Models\JobCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
        
        $this->command->info('Job categories seeded successfully!');
    }
}
