import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
} from '@/components/shadcn/card';
import { Field, FieldGroup, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { Form, Link } from '@inertiajs/react';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { getCsrfToken } from '@/lib/utils';

const Login = () => {
    return (
        <div className="flex mt-14 w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
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
                                                    name="login"
                                                    placeholder="m@example.com"
                                                />
                                                {errors.login && (
                                                    <div className="mt-1 text-xs text-red-400">
                                                        {errors.login}
                                                    </div>
                                                )}
                                            </Field>
                                            <Field>
                                                <div className="flex items-center">
                                                    <FieldLabel htmlFor="password">
                                                        Password
                                                    </FieldLabel>
                                                    <Link
                                                        href="/forgot-password"
                                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                />
                                                {errors.password && (
                                                    <div className="mt-1 text-xs text-red-400">
                                                        {errors.password}
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
                                                    Login
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
                                    Login with Google
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?
                                <Link
                                    href="/signup"
                                    className="ml-1 underline underline-offset-4 hover:text-primary"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
