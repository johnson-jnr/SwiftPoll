import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardAction,
    CardContent,
    CardFooter,
} from '@/components/shadcn/card';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group';
import { Label } from '@/components/shadcn/label';
import { LockKeyhole } from 'lucide-react';
import { format } from 'timeago.js';
import PollMenu from '@/components/PollMenu';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import VoteSuccessDialog from '@/components/VoteSuccessDialog';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Poll } from '@/lib/types';

const PollDetail = ({ poll, public_id }: { poll: Poll; public_id: string }) => {
    const author = poll.user ? `user #${poll.user.username}` : 'a guest';
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        option: '',
    });

    const { errors } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/${public_id}/vote/`, {
            onSuccess() {
                setDialogOpen(true);
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-20">
            {errors.general && (
                <div className="mb-4 text-sm text-red-400 whitespace-pre-line">
                    {errors.general}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <Card className="">
                    <CardHeader>
                        <div>
                            <CardTitle className="text-xl">
                                {poll.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                by {author} · {format(poll.created_at)}
                            </CardDescription>
                        </div>
                        <CardAction>
                            <PollMenu poll={poll} />
                        </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Make a choice:
                        </p>
                        <RadioGroup
                            name="option"
                            value={data.option}
                            onValueChange={(value) => setData('option', value)}
                            className="space-y-3"
                        >
                            {poll.options.map((option) => {
                                const id = String(option.id);
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center space-x-3"
                                    >
                                        <RadioGroupItem value={id} id={id} />
                                        <Label
                                            htmlFor={id}
                                            className="font-normal cursor-pointer"
                                        >
                                            {option.text}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                        {errors.option && (
                            <div className="mt-1 text-xs text-red-400 whitespace-pre-line">
                                {errors.option}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            disabled={processing}
                            type="submit"
                            className="w-full"
                        >
                            {processing && <Spinner data-icon="inline-start" />}
                            Vote
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <VoteSuccessDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                pollId={public_id}
            />
            <p className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                <LockKeyhole className="size-4" /> One vote per IP-Address
                allowed.
            </p>
        </div>
    );
};

export default PollDetail;
