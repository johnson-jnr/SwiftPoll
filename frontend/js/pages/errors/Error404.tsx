import { Button } from '@/components/shadcn/button';

const Error404 = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h1 className="text-8xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground max-w-sm">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
            <a href="/">Go Home</a>
        </Button>
    </div>
);

export default Error404;
