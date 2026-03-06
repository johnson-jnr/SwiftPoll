import {
    Card,
    CardHeader,
    CardDescription,
    CardAction,
    CardContent,
    CardTitle,
    CardFooter,
} from '@/components/shadcn/card';
import PollMenu from '@/components/PollMenu';
import { Button } from '@/components/shadcn/button';
import { ArrowLeft } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { format } from 'timeago.js';
import { POLL_PALETTE } from '@/lib/pollColors';
import PollPieChart from '@/components/PollPieChart';

const PollResult = ({ public_id, poll }) => {
    const author = poll.user ? `user #${poll.user.username}` : 'a guest';

    return (
        <>
            <Head title={poll.title} />
            <div className="max-w-4xl mx-auto mt-20">
                <Card>
                    <CardHeader className="relative z-10">
                        <div>
                            <CardTitle className="text-xl">
                                {poll.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                by {author} · {format(poll.created_at)}
                            </CardDescription>
                        </div>
                        <CardAction>
                            <PollMenu poll={poll} showResults={false} />
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-8">
                            {/* Left: progress bars */}
                            <div className="space-y-5">
                                {poll.options.map(
                                    (
                                        option: {
                                            id: number;
                                            text: string;
                                            vote_count: number;
                                        },
                                        i: number,
                                    ) => {
                                        const pct =
                                            poll.total_vote > 0
                                                ? (option.vote_count /
                                                      poll.total_vote) *
                                                  100
                                                : 0;
                                        const color =
                                            POLL_PALETTE[
                                                i % POLL_PALETTE.length
                                            ];
                                        return (
                                            <div
                                                key={option.id}
                                                className="space-y-1.5"
                                            >
                                                <div className="flex justify-between text-sm">
                                                    <span>{option.text}</span>
                                                    <span className="text-muted-foreground">
                                                        {pct % 1 === 0
                                                            ? pct
                                                            : pct.toFixed(2)}
                                                        % ({option.vote_count}{' '}
                                                        votes)
                                                    </span>
                                                </div>
                                                <div className="bg-white border relative h-5 w-full overflow-hidden rounded-full">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                                <Separator />
                                <p className="text-sm text-muted-foreground">
                                    Total votes: {poll.total_vote}
                                </p>
                            </div>

                            {/* Right: pie chart — pulled up to visually center on full card height */}
                            <div className="-mt-20">
                                <PollPieChart
                                    options={poll.options}
                                    totalVotes={poll.total_vote}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" asChild>
                            <Link href={`/${public_id}`}>
                                <ArrowLeft /> Back to Poll
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default PollResult;
