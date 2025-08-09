import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { type NavItem } from '@/types';
import { router } from '@inertiajs/react';
import { Clock, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarSearchProps {
    menuItems: { label: string; items: NavItem[] }[];
    open: boolean;
    onClose: () => void;
}

export function SidebarSearch({ menuItems, open, onClose }: SidebarSearchProps) {
    const [search, setSearch] = useState('');

    // Mock recent actions - in a real app this would come from localStorage or API
    const recentActions = [
        { title: 'Dashboard', href: '/admin/dashboard', icon: menuItems.find(g => g.items.find(i => i.title === 'Dashboard'))?.items.find(i => i.title === 'Dashboard')?.icon },
        { title: 'Pengguna', href: '/admin/users', icon: menuItems.find(g => g.items.find(i => i.title === 'Pengguna'))?.items.find(i => i.title === 'Pengguna')?.icon },
        { title: 'Perusahaan', href: '/admin/companies', icon: menuItems.find(g => g.items.find(i => i.title === 'Perusahaan'))?.items.find(i => i.title === 'Perusahaan')?.icon },
    ];

    // Popular/suggested actions
    const popularActions = [
        { title: 'Dashboard', href: '/admin/dashboard', icon: menuItems.find(g => g.items.find(i => i.title === 'Dashboard'))?.items.find(i => i.title === 'Dashboard')?.icon },
        { title: 'Lamaran', href: '/admin/applications', icon: menuItems.find(g => g.items.find(i => i.title === 'Lamaran'))?.items.find(i => i.title === 'Lamaran')?.icon },
        { title: 'Berita', href: '/admin/news', icon: menuItems.find(g => g.items.find(i => i.title === 'Berita'))?.items.find(i => i.title === 'Berita')?.icon },
    ];

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose();
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [onClose]);

    const runCommand = (command: () => void) => {
        onClose();
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={onClose}>
            <CommandInput 
                placeholder="Cari menu..." 
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                <CommandEmpty>Tidak ada menu yang ditemukan.</CommandEmpty>

                {!search && (
                    <>
                        <CommandGroup heading="Terakhir Diakses">
                            {recentActions.filter(action => action.icon).map((action) => (
                                <CommandItem
                                    key={action.href}
                                    value={action.title}
                                    onSelect={() => runCommand(() => router.get(action.href))}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{action.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandGroup heading="Populer">
                            {popularActions.filter(action => action.icon).map((action) => (
                                <CommandItem
                                    key={`popular-${action.href}`}
                                    value={action.title}
                                    onSelect={() => runCommand(() => router.get(action.href))}
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    <span>{action.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />
                    </>
                )}

                {menuItems.map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                        {group.items.map((item) => (
                            <CommandItem
                                key={item.href}
                                value={`${item.title} ${group.label}`}
                                onSelect={() => runCommand(() => router.get(item.href))}
                            >
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span>{item.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
}
