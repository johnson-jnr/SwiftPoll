import { useForm } from '@inertiajs/react';
import { useTitle } from '@/hooks/useTitle';
import PollOptions from '@/components/PollOptions';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Spinner } from '@/components/shadcn/spinner';
import { Switch } from '@/components/shadcn/switch';
import { Label } from '@/components/shadcn/label';
import { Field, FieldLabel, FieldError } from '@/components/shadcn/field';
import { Card, CardContent } from '@/components/shadcn/card';
export default function Index() {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            title: '',
            description: '',
            options: ['', ''] as string[],
            allow_public_results: true,
            active: true,
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        const filled = data.options.filter((option) => option.trim());
        if (!filled.length) {
            setError('options', 'Please add at least one option.');
            return;
        }
        clearErrors('options');
        post('/');
    };

    useTitle('Create a Poll');

    return (
        <div className="max-w-xl mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Create a Poll</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                required
                                name="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Type your Title"
                            />
                            <FieldError>{errors.title}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">
                                Description (optional)
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Type your Description"
                            />
                            <FieldError>{errors.description}</FieldError>
                        </Field>

                        <Field>
                            <PollOptions
                                options={data.options}
                                onChange={(options) =>
                                    setData('options', options)
                                }
                            />
                            <FieldError>{errors.options}</FieldError>
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-4 pt-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="active">Poll Active</Label>
                            <Switch
                                id="active"
                                checked={data.active}
                                onCheckedChange={(v) => setData('active', v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="allow_public_results">
                                Allow public to view results
                            </Label>
                            <Switch
                                id="allow_public_results"
                                checked={data.allow_public_results}
                                onCheckedChange={(v) =>
                                    setData('allow_public_results', v)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={processing}
                >
                    {processing && <Spinner data-icon="inline-start" />}
                    Create Poll
                </Button>
            </form>
        </div>
    );
}
