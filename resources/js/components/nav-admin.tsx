import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavGroup {
    label: string;
    items: NavItem[];
}

export function NavAdmin({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();

    // Better active state logic - exact match first, then starts with for parent routes
    const isActive = (itemHref: string) => {
        const currentUrl = page.url;
        
        // Exact match first
        if (currentUrl === itemHref) {
            return true;
        }
        
        // Special handling for verification review route - should not activate companies menu
        if (currentUrl.includes('/companies/verification/review') && itemHref === '/admin/companies') {
            return false;
        }
        
        // For parent routes, check if current URL starts with item href
        // but exclude cases where another route has the same prefix
        if (currentUrl.startsWith(itemHref)) {
            // Special handling for point routes to avoid conflict
            if (itemHref === '/company/points' && currentUrl.startsWith('/company/points/')) {
                return false; // /company/points should not be active when on /company/points/packages
            }
            
            // For other routes, use startsWith but ensure it's followed by / or end of string
            return currentUrl === itemHref || currentUrl.startsWith(itemHref + '/');
        }
        
        return false;
    };

    return (
        <>
            {groups.map((group, groupIndex) => (
                <SidebarGroup key={groupIndex} className="px-2 py-0">
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }} className="group">
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
