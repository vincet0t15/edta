import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';

import {
    Building2,
    Database,
    FileText,
    LayoutGrid,
    Settings,
    BookOpen,
    AlertCircle,
    Archive,
    Clock,
    GitBranch,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavGroup[] = [
    {
        title: 'General',
        icon: LayoutGrid,
        children: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },

    {
        title: 'Settings',
        icon: Settings,
        children: [
            {
                title: 'Offices',
                href: '/offices',
                icon: Building2,
            },
            {
                title: 'Document Types',
                href: '/document-types',
                icon: FileText,
            },
            {
                title: 'Document Statuses',
                href: '/document-statuses',
                icon: BookOpen,
            },
            {
                title: 'Priorities',
                href: '/document-priorities',
                icon: AlertCircle,
            },
            {
                title: 'Categories',
                href: '/document-categories',
                icon: Database,
            },
            {
                title: 'Retention Policies',
                href: '/retention-policies',
                icon: Archive,
            },
            {
                title: 'SLA Configuration',
                href: '/sla-configurations',
                icon: Clock,
            },
            {
                title: 'Routing Rules',
                href: '/routing-rules',
                icon: GitBranch,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
