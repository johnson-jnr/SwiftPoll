import { Button } from '@/components/shadcn/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/shadcn/field';
import { Form, Head, Link } from '@inertiajs/react';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { useState } from 'react';

const ForgotPassword = () => {
    const [sent, setSent] = useState(false);

    return (
        <>
            <Head title="Forgot Password" />
            <div className="flex mt-14 w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-lg">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Forgot your password?</CardTitle>
                                <CardDescription>
                                    Enter your email and we&apos;ll send you a
                                    link to reset your password
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sent ? (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-sm text-green-600">
                                            We have sent you an email. If you
                                            have not received it please check
                                            your spam folder.
                                        </p>
                                        <Button asChild variant="outline">
                                            <Link href="/login">
                                                Back to login
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <Form
                                        action=""
                                        method="post"
                                        onSuccess={() => setSent(true)}
                                    >
                                        {({ processing, errors }) => (
                                            <FieldGroup>
                                                {errors.general && (
                                                    <div className="text-sm text-red-400">
                                                        {errors.general}
                                                    </div>
                                                )}
                                                <Field>
                                                    <FieldLabel htmlFor="email">
                                                        Email
                                                    </FieldLabel>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <div className="mt-1 text-xs text-red-400">
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                </Field>
                                                <Field>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {processing && (
                                                            <Spinner data-icon="inline-start" />
                                                        )}
                                                        Send Reset Link
                                                    </Button>
                                                    <FieldDescription className="text-center">
                                                        Remember your password?
                                                        <Link
                                                            className="ml-1"
                                                            href="/login"
                                                        >
                                                            Back to login
                                                        </Link>
                                                    </FieldDescription>
                                                </Field>
                                            </FieldGroup>
                                        )}
                                    </Form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
