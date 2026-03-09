import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/shadcn/sidebar';
import { IconInnerShadowTop, IconChartBar } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { ModeToggle } from '@/components/ModeToggle';

const navItems = [
    { title: 'Polls', url: '/dashboard/', isActive: true, icon: IconChartBar },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="h-16 justify-center">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href="/">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">
                                    Swift Poll
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.isActive}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 items-end">
                <ModeToggle />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
