import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
} from '@/components/shadcn/card';
import { Form, usePage } from '@inertiajs/react';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';

const ConfirmEmail = () => {
    const { error, email, username } = usePage().props as {
        error?: string;
        email?: string;
        username?: string;
    };

    return (
        <div className="flex h-full items-center px-4 sm:px-0">
            <div className="w-full max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Confirm Email Address</CardTitle>
                        {error ? (
                            <CardDescription className="text-red-400">
                                {error}
                            </CardDescription>
                        ) : (
                            <CardDescription>
                                Please confirm that <strong>{email}</strong> is
                                an email address for user{' '}
                                <strong>{username}</strong>.
                            </CardDescription>
                        )}
                    </CardHeader>
                    {!error && (
                        <CardContent>
                            <Form action="" method="post">
                                {({ processing }) => (
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing && (
                                            <Spinner data-icon="inline-start" />
                                        )}
                                        Confirm
                                    </Button>
                                )}
                            </Form>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ConfirmEmail;
