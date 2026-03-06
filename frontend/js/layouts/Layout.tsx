import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Toaster } from '@/components/shadcn/sonner';
import { Message } from '@/lib/types';

const Layout = ({ children }) => {
    const { messages } = usePage().props as unknown as { messages: Message[] };

    useEffect(() => {
        messages?.forEach(({ message, level_tag }) => {
            if (level_tag === 'success') toast.success(message);
            else if (level_tag === 'error') toast.error(message);
            else if (level_tag === 'warning') toast.warning(message);
            else toast(message);
        });
    }, [messages]);

    return (
        <>
            <div className="min-h-screen grid grid-flow-row grid-rows-[auto_1fr_auto]">
                <Nav />
                <main className="container mx-auto">{children}</main>
                <Footer />
            </div>
            <Toaster position="top-right" />
        </>
    );
};

export default (page) => <Layout>{page}</Layout>;
