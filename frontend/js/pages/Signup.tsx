import { Button } from '@/components/shadcn/button';
import {
    Card,
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
} from '@/components/shadcn/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { Spinner } from '@/components/shadcn/spinner';
import { Form, Link } from '@inertiajs/react';
import { getCsrfToken } from '@/lib/utils';

const Signup = () => {
    return (
        <div className="flex mt-14 w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                            Enter your information below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form action="" method="post">
                            {({ processing, errors }) => (
                                <div>
                                    {errors.general && (
                                        <div className="mb-4 text-sm text-red-400 whitespace-pre-line">
                                            {errors.general}
                                        </div>
                                    )}
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="m@example.com"
                                                required
                                            />
                                            {errors.email && (
                                                <div className="mb-4 text-sm text-red-400 whitespace-pre-line">
                                                    {errors.email}
                                                </div>
                                            )}
                                            <FieldDescription>
                                                We&apos;ll use this to contact
                                                you. We will not share your
                                                email with anyone else.
                                            </FieldDescription>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password1"
                                                required
                                            />
                                            {errors.password1 && (
                                                <div className="mb-4 text-sm text-red-400 whitespace-pre-line">
                                                    {errors.password1}
                                                </div>
                                            )}
                                            <FieldDescription>
                                                Must be at least 8 characters
                                                long.
                                            </FieldDescription>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="confirm-password">
                                                Confirm Password
                                            </FieldLabel>
                                            <Input
                                                id="confirm-password"
                                                name="password2"
                                                type="password"
                                                required
                                            />
                                            {errors.password2 && (
                                                <div className="mb-4 text-sm text-red-400 whitespace-pre-line">
                                                    {errors.password2}
                                                </div>
                                            )}
                                            <FieldDescription>
                                                Please confirm your password.
                                            </FieldDescription>
                                        </Field>
                                        <Field>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <Spinner data-icon="inline-start" />
                                                )}
                                                Create Account
                                            </Button>
                                        </Field>
                                    </FieldGroup>
                                </div>
                            )}
                        </Form>
                        <form
                            method="post"
                            action="/accounts/google/login/"
                            className="mt-2"
                        >
                            <input
                                type="hidden"
                                name="csrfmiddlewaretoken"
                                value={getCsrfToken()}
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full"
                            >
                                Sign up with Google
                            </Button>
                        </form>
                        <FieldDescription className="mt-4 px-6 text-center">
                            Already have an account?
                            <Link href="/login">Sign in</Link>
                        </FieldDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
