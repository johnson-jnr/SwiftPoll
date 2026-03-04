import { useForm } from '@inertiajs/react';
import PollOptions from '@/components/PollOptions';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Spinner } from '@/components/shadcn/spinner';
export default function Index() {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            title: '',
            description: '',
            options: ['', ''] as string[],
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

    return (
        <div className="max-w-lg mx-auto mt-20">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label>
                        Title:
                        <Input
                            className="mt-2"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Type your Title"
                        />
                    </label>
                    {errors.title && (
                        <div className="mt-1 text-xs text-red-400">
                            {errors.title}
                        </div>
                    )}
                </div>

                <div>
                    <label>
                        Description (optional):
                        <Textarea
                            className="mt-2"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Type your Description"
                        />
                    </label>
                    {errors.description && (
                        <div className="mt-1 text-xs text-red-400">
                            {errors.description}
                        </div>
                    )}
                </div>

                <div>
                    <PollOptions
                        options={data.options}
                        onChange={(options) => setData('options', options)}
                    />
                    {errors.options && (
                        <div className="mt-1 text-xs text-red-400">
                            {errors.options}
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing && <Spinner data-icon="inline-start" />}
                    Create Poll
                </Button>
            </form>
        </div>
    );
}
