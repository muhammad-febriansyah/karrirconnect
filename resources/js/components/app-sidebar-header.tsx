import { Breadcrumbs } from '@/components/breadcrumbs';
import { Notifications } from '@/components/notifications';
import { SidebarSearch } from '@/components/sidebar-search';
import { UserProfile } from '@/components/user-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useMenuItems } from '@/hooks/use-menu-items';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const { superAdminMenuGroups, companyAdminMenuGroups } = useMenuItems();
    const { auth } = usePage().props as { auth: { user: any } };
    
    // Determine which menu to use based on user role
    const user = auth.user;
    const menuGroups = user?.role === 'super_admin' ? superAdminMenuGroups : companyAdminMenuGroups;

    // Handle keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                
                {/* Search and Notifications */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Cari menu... (Ctrl+K)"
                            className="w-64 pl-10 pr-4 h-9 bg-background/60 border-border/60 hover:bg-background/80 focus:bg-background focus:border-border transition-all duration-200 cursor-pointer"
                            onClick={() => setSearchOpen(true)}
                            onFocus={() => setSearchOpen(true)}
                            readOnly
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                    
                    {/* Mobile Search Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 sm:hidden"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="h-4 w-4" />
                    </Button>

                    <Notifications />
                    <UserProfile />
                </div>
            </header>

            {/* Search Modal */}
            <SidebarSearch 
                menuItems={menuGroups}
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </>
    );
}
