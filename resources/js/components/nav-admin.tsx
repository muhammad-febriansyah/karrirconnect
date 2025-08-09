import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavGroup {
    label: string;
    items: NavItem[];
}

export function NavAdmin({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();

    return (
        <>
            {groups.map((group, groupIndex) => (
                <SidebarGroup key={groupIndex} className="px-2 py-0">
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }} className="group">
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
