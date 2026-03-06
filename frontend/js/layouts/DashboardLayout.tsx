import { usePage } from '@inertiajs/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppSidebar } from '@/components/AppSidebar';
import { NavUser } from '@/components/NavUser';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/shadcn/breadcrumb';
import { Separator } from '@/components/shadcn/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/shadcn/sidebar';
import { Message } from '@/lib/types';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

type PageProps = {
    user: { id: number; name: string; email: string; avatar: string } | null;
};

const defaultUser = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
};

const DashboardLayout = ({ children }) => {
    const { messages } = usePage().props as unknown as { messages: Message[] };
    const { user: rawUser } = usePage<PageProps>().props;
    const user = rawUser ?? defaultUser;

    useEffect(() => {
        messages?.forEach(({ message, level_tag }) => {
            if (level_tag === 'success') toast.success(message);
            else if (level_tag === 'error') toast.error(message);
            else if (level_tag === 'warning') toast.warning(message);
            else toast(message);
        });
    }, [messages]);

    return (
        <ThemeProvider storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        Polls
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto flex items-center gap-2">
                            <NavUser user={user} />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster position="top-right" />
        </ThemeProvider>
    );
};

export default (page) => <DashboardLayout>{page}</DashboardLayout>;
