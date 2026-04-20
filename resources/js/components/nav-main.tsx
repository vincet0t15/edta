import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup } from '@/types';
import { Link } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    // Icon color mapping for better visual appeal
    const getIconColor = (href: string) => {
        const colorMap: Record<string, string> = {
            '/dashboard': 'text-blue-500',
            '/offices': 'text-teal-500',
            '/document-types': 'text-sky-500',
        };

        return colorMap[href] || 'text-slate-500';
    };

    return (
        <div className="space-y-3">
            {items.map((group) => {
                // Get gradient colors for each section title
                const getSectionGradient = (title: string) => {
                    const gradientMap: Record<string, string> = {
                        General: 'from-blue-500 to-cyan-500',
                        Settings: 'from-slate-500 to-gray-500',
                    };
                    return gradientMap[title] || 'from-slate-500 to-gray-500';
                };

                return (
                    <SidebarGroup key={group.title} className="px-2 py-0">
                        <SidebarGroupLabel className="px-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-200">{group.title}</span>
                            </div>
                        </SidebarGroupLabel>
                        <SidebarMenu className="ml-2 gap-1">
                            {group.children?.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isCurrentUrl(item.href)} tooltip={{ children: item.title }} className="">
                                        <Link href={item.href} prefetch preserveState preserveScroll>
                                            {item.icon && <item.icon className={`h-4 w-4 ${getIconColor(item.href)}`} />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </div>
    );
}
