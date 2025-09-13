import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useMenuItems } from '@/hooks/use-menu-items';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: any } };
    const user = auth.user;
    const { superAdminMenuGroups, companyAdminMenuGroups } = useMenuItems();

    // Check user role
    const isSuperAdmin = user && user.role === 'super_admin';
    const isCompanyAdmin = user && user.role === 'company_admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo className={`${isCompanyAdmin ? 'h-6 w-auto max-w-[100px]' : 'h-8 w-auto max-w-[160px]'}`} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isSuperAdmin && <NavAdmin groups={superAdminMenuGroups} />}
                {isCompanyAdmin && <NavAdmin groups={companyAdminMenuGroups} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
