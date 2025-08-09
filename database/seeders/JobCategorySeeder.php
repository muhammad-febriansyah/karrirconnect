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
                'icon' => '💻',
                'is_active' => true,
            ],
            [
                'name' => 'Finance & Banking',
                'description' => 'Financial analysis, banking, accounting, and investment opportunities',
                'slug' => 'finance-banking',
                'icon' => '💰',
                'is_active' => true,
            ],
            [
                'name' => 'Healthcare & Medical',
                'description' => 'Medical professionals, healthcare administration, and pharmaceutical roles',
                'slug' => 'healthcare-medical',
                'icon' => '🏥',
                'is_active' => true,
            ],
            [
                'name' => 'Marketing & Sales',
                'description' => 'Digital marketing, sales representatives, business development positions',
                'slug' => 'marketing-sales',
                'icon' => '📈',
                'is_active' => true,
            ],
            [
                'name' => 'Engineering',
                'description' => 'Civil, mechanical, electrical, and other engineering disciplines',
                'slug' => 'engineering',
                'icon' => '🔧',
                'is_active' => true,
            ],
            [
                'name' => 'Design & Creative',
                'description' => 'Graphic design, UI/UX, creative writing, and artistic positions',
                'slug' => 'design-creative',
                'icon' => '🎨',
                'is_active' => true,
            ],
            [
                'name' => 'Education & Training',
                'description' => 'Teaching, training, educational administration, and academic research',
                'slug' => 'education-training',
                'icon' => '📚',
                'is_active' => true,
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR management, recruitment, employee relations, and organizational development',
                'slug' => 'human-resources',
                'icon' => '👥',
                'is_active' => true,
            ],
            [
                'name' => 'Operations & Logistics',
                'description' => 'Supply chain, logistics, operations management, and process improvement',
                'slug' => 'operations-logistics',
                'icon' => '📦',
                'is_active' => true,
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Customer support, client relations, and service-oriented positions',
                'slug' => 'customer-service',
                'icon' => '📞',
                'is_active' => true,
            ],
            [
                'name' => 'Manufacturing',
                'description' => 'Production, quality control, factory management, and industrial roles',
                'slug' => 'manufacturing',
                'icon' => '🏭',
                'is_active' => true,
            ],
            [
                'name' => 'Legal & Compliance',
                'description' => 'Legal counseling, compliance, regulatory affairs, and legal administration',
                'slug' => 'legal-compliance',
                'icon' => '⚖️',
                'is_active' => true,
            ],
            [
                'name' => 'Construction',
                'description' => 'Building construction, project management, architecture, and skilled trades',
                'slug' => 'construction',
                'icon' => '🏗️',
                'is_active' => true,
            ],
            [
                'name' => 'Media & Communications',
                'description' => 'Journalism, public relations, content creation, and communications',
                'slug' => 'media-communications',
                'icon' => '📺',
                'is_active' => true,
            ],
            [
                'name' => 'Agriculture & Food',
                'description' => 'Farming, food production, agricultural research, and food service',
                'slug' => 'agriculture-food',
                'icon' => '🌱',
                'is_active' => true,
            ]
        ];

        foreach ($categories as $category) {
            \App\Models\JobCategory::create($category);
        }
    }
}
