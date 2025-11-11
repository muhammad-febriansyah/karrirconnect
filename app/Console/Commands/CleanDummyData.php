<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanDummyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:clean-dummy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean dummy data from seeders (keeps master data like settings, categories, templates)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('no-interaction') && !$this->confirm('This will delete dummy data from users, companies, news, and success stories. Continue?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $this->info('Starting to clean dummy data...');

        // Disable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clean job invitation messages first
        $this->info('Cleaning job invitation messages...');
        \DB::table('job_invitation_messages')->truncate();
        $this->line('✓ Job invitation messages cleaned');

        // Clean job invitations
        $this->info('Cleaning job invitations...');
        \DB::table('job_invitations')->truncate();
        $this->line('✓ Job invitations cleaned');

        // Clean job applications
        $this->info('Cleaning job applications...');
        \DB::table('job_applications')->truncate();
        $this->line('✓ Job applications cleaned');

        // Clean job listings
        $this->info('Cleaning job listings...');
        \DB::table('job_listings')->truncate();
        $this->line('✓ Job listings cleaned');

        // Clean notifications
        $this->info('Cleaning notifications...');
        \DB::table('notifications')->truncate();
        $this->line('✓ Notifications cleaned');

        // Clean point transactions
        $this->info('Cleaning point transactions...');
        \DB::table('point_transactions')->truncate();
        $this->line('✓ Point transactions cleaned');

        // Clean saved jobs
        $this->info('Cleaning saved jobs...');
        \DB::table('saved_jobs')->truncate();
        $this->line('✓ Saved jobs cleaned');

        // Clean user activity logs
        $this->info('Cleaning user activity logs...');
        \DB::table('user_activity_logs')->truncate();
        $this->line('✓ User activity logs cleaned');

        // Clean contact messages
        $this->info('Cleaning contact messages...');
        \DB::table('contact_messages')->truncate();
        $this->line('✓ Contact messages cleaned');

        // Clean news/blog
        $this->info('Cleaning news/blog...');
        \DB::table('news')->truncate();
        $this->line('✓ News cleaned');

        // Clean success stories
        $this->info('Cleaning success stories...');
        \DB::table('success_stories')->truncate();
        $this->line('✓ Success stories cleaned');

        // Clean companies
        $this->info('Cleaning companies...');
        \DB::table('companies')->truncate();
        $this->line('✓ Companies cleaned');

        // Clean user profiles (except admin)
        $this->info('Cleaning user profiles...');
        \DB::table('user_profiles')
            ->whereNotIn('user_id', function($query) {
                $query->select('id')
                    ->from('users')
                    ->where('email', 'admin@karirconnect.com');
            })
            ->delete();
        $this->line('✓ User profiles cleaned (admin preserved)');

        // Clean users (except admin)
        $this->info('Cleaning users...');
        \DB::table('users')
            ->where('email', '!=', 'admin@karirconnect.com')
            ->delete();
        $this->line('✓ Users cleaned (admin preserved)');

        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->newLine();
        $this->info('✓ Dummy data cleaned successfully!');
        $this->info('Master data preserved: Settings, Job Categories, Skills, Point Packages, WhatsApp Templates');

        return 0;
    }
}
