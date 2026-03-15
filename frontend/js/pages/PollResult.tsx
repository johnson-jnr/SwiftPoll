import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { ArrowLeft, Link as LinkIcon, Check, Radio } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTitle } from '@/hooks/useTitle';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { format } from 'timeago.js';
import { POLL_PALETTE } from '@/lib/pollColors';
import PollPieChart from '@/components/PollPieChart';
import { useState, useEffect } from 'react';

const PollResult = ({ public_id, poll }) => {
    const author = poll.user ? `user #${poll.user.username}` : 'a guest';
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState(poll.options);
    const [totalVote, setTotalVote] = useState(poll.total_vote);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(
            `${protocol}://${window.location.host}/ws/poll/${public_id}/`,
        );

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setOptions(data.options);
            setTotalVote(data.total_votes);
        };

        return () => ws.close();
    }, [public_id]);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    useTitle(poll.title);

    return (
        <div className="max-w-4xl mx-auto mt-8 sm:mt-20 px-4 sm:px-0">
            <div className="flex justify-end mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-300 bg-green-50 text-green-600 text-sm font-medium">
                    <Radio className="size-4" />
                    Live results
                </div>
            </div>
            <Card>
                <CardHeader className="relative z-10">
                    <div>
                        <CardTitle className="text-xl">{poll.title}</CardTitle>
                        <CardDescription className="mt-1">
                            by {author} · {format(poll.created_at)}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Left: progress bars */}
                        <div className="space-y-5">
                            {options.map(
                                (
                                    option: {
                                        id: number;
                                        text: string;
                                        vote_count: number;
                                    },
                                    i: number,
                                ) => {
                                    const pct =
                                        totalVote > 0
                                            ? (option.vote_count / totalVote) *
                                              100
                                            : 0;
                                    const color =
                                        POLL_PALETTE[i % POLL_PALETTE.length];
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
                                                        backgroundColor: color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                            <Separator />
                            <p className="text-sm text-muted-foreground">
                                Total votes: {totalVote}
                            </p>
                        </div>

                        {/* Right: pie chart — pulled up to visually center on full card height */}
                        <div className="relative sm:-top-24">
                            <PollPieChart
                                options={options}
                                totalVotes={totalVote}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/${public_id}`}>
                            <ArrowLeft /> Back to Poll
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={copyLink}>
                        {copied ? (
                            <Check className="text-green-500" />
                        ) : (
                            <LinkIcon />
                        )}
                        {copied ? 'Copied!' : 'Share Results'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PollResult;
