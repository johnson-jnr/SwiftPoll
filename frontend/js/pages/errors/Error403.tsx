import { Button } from '@/components/shadcn/button';
import { Link } from '@inertiajs/react';

const Error403 = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h1 className="text-8xl font-bold text-muted-foreground/30">403</h1>
        <h2 className="text-2xl font-semibold">Access denied</h2>
        <p className="text-muted-foreground max-w-sm">
            You don't have permission to view this page.
        </p>
        <Button asChild>
            <Link href="/">Go Home</Link>
        </Button>
    </div>
);

export default Error403;
