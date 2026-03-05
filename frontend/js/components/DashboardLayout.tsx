import { usePage } from '@inertiajs/react';
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

type PageProps = {
    user: { id: number; name: string; email: string; avatar: string } | null;
};

const defaultUser = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
};

const DashboardLayout = ({ children }) => {
    const { user: rawUser } = usePage<PageProps>().props;
    const user = rawUser ?? defaultUser;
    return (
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
                    <div className="ml-auto">
                        <NavUser user={user} />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default (page) => <DashboardLayout>{page}</DashboardLayout>;
