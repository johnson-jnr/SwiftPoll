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
import { Link } from '@inertiajs/react';
import { Input } from '@/components/shadcn/input';

const ForgotPassword = () => {
    return (
        <div className="flex mt-14 w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Forgot your password?</CardTitle>
                            <CardDescription>
                                Enter your email and we&apos;ll send you a link
                                to reset your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <Button type="submit">
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
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
