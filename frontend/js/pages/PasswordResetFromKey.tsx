import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/card';
import { Field, FieldGroup, FieldLabel } from '@/components/shadcn/field';
import { Form, Link, usePage } from '@inertiajs/react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';

const PasswordResetFromKey = () => {
    const { token_fail } = usePage().props as unknown as {
        token_fail?: boolean;
    };

    if (token_fail) {
        return (
            <div className="flex h-full items-center px-4 sm:px-0">
                <div className="w-full max-w-lg mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invalid reset link</CardTitle>
                            <CardDescription>
                                This password reset link is invalid or has
                                expired. Please request a new one.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/forgot-password">
                                    Request new link
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full items-center px-4 sm:px-0">
            <div className="w-full max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Change password</CardTitle>
                        <CardDescription>
                            Enter your new password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form action="" method="post">
                            {({ processing, errors }) => (
                                <FieldGroup>
                                    {errors.general && (
                                        <div className="text-sm text-red-400">
                                            {errors.general}
                                        </div>
                                    )}
                                    <Field>
                                        <FieldLabel htmlFor="password1">
                                            New password
                                        </FieldLabel>
                                        <Input
                                            id="password1"
                                            name="password1"
                                            type="password"
                                            required
                                        />
                                        {errors.password1 && (
                                            <div className="mt-1 text-xs text-red-400">
                                                {errors.password1}
                                            </div>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="password2">
                                            Confirm new password
                                        </FieldLabel>
                                        <Input
                                            id="password2"
                                            name="password2"
                                            type="password"
                                            required
                                        />
                                        {errors.password2 && (
                                            <div className="mt-1 text-xs text-red-400">
                                                {errors.password2}
                                            </div>
                                        )}
                                    </Field>
                                    <Field className="flex flex-col gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full sm:w-auto"
                                        >
                                            {processing && (
                                                <Spinner data-icon="inline-start" />
                                            )}
                                            Change password
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href="/login">Cancel</Link>
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PasswordResetFromKey;
