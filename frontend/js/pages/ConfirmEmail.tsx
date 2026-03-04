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
        <div className="flex mt-14 w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirm Email Address</CardTitle>
                            {error ? (
                                <CardDescription className="text-red-400">
                                    {error}
                                </CardDescription>
                            ) : (
                                <CardDescription>
                                    Please confirm that <strong>{email}</strong> is an email
                                    address for user <strong>{username}</strong>.
                                </CardDescription>
                            )}
                        </CardHeader>
                        {!error && (
                            <CardContent>
                                <Form action="" method="post">
                                    {({ processing }) => (
                                        <Button type="submit" disabled={processing}>
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
        </div>
    );
};

export default ConfirmEmail;
