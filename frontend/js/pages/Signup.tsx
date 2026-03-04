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
import { Link } from '@inertiajs/react';

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
                                    <FieldDescription>
                                        We&apos;ll use this to contact you. We
                                        will not share your email with anyone
                                        else.
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                    />
                                    <FieldDescription>
                                        Must be at least 8 characters long.
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        required
                                    />
                                    <FieldDescription>
                                        Please confirm your password.
                                    </FieldDescription>
                                </Field>
                                <FieldGroup>
                                    <Field>
                                        <Button type="submit">
                                            Create Account
                                        </Button>
                                        <Button>Sign up with Google</Button>
                                        <FieldDescription className="px-6 text-center">
                                            Already have an account?
                                            <Link href="/login">Sign in</Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
