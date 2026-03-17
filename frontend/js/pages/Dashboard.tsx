import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { addMonths } from 'date-fns';
import { DatePickerTime } from '@/components/DatePickerTime';
import { format } from 'timeago.js';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/shadcn/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/shadcn/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/shadcn/dialog';
import { Switch } from '@/components/shadcn/switch';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Poll } from '@/lib/types';
import { Link, useForm } from '@inertiajs/react';
import { useTitle } from '@/hooks/useTitle';
import { Spinner } from '@/components/shadcn/spinner';

const PollDialog = ({ poll }: { poll: Poll }) => {
    const [open, setOpen] = useState(false);
    const { data, setData, clearErrors, errors, put, processing } = useForm<{
        id: number | undefined;
        is_draft: boolean;
        allow_one_vote_per_ip: boolean;
        allow_public_results: boolean;
        start_date: Date | undefined;
        end_date: Date | undefined;
    }>({
        id: poll.id,
        is_draft: poll.is_draft,
        allow_one_vote_per_ip: poll.allow_one_vote_per_ip,
        allow_public_results: poll.allow_public_results,
        start_date: poll.start_date ? new Date(poll.start_date) : undefined,
        end_date: poll.end_date ? new Date(poll.end_date) : undefined,
    });

    const now = new Date();
    const isStartDisabled =
        !poll.is_draft && !!poll.start_date && new Date(poll.start_date) <= now;
    const isEndDisabled =
        !poll.is_draft && !!poll.end_date && new Date(poll.end_date) <= now;

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/${poll.public_id}/settings/`, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-20 px-2 text-xs justify-center"
                >
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent hideClose>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{poll.title}</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {poll.description}
                    </p>
                    <div className="flex flex-col gap-4 py-2 my-4">
                        <DatePickerTime
                            label="Start Date"
                            defaultToCurrentTime
                            hint={
                                isStartDisabled
                                    ? "Poll already started, field can't be updated."
                                    : undefined
                            }
                            description={`The date and time the poll opens and starts accepting responses.\nA poll start date can be scheduled a maximum of 6 months from now.\nNo start date means the poll goes live immediately if published.`}
                            error={errors.start_date}
                            value={data.start_date}
                            onChange={(v) => setData('start_date', v)}
                            minDate={new Date()}
                            maxDate={addMonths(new Date(), 6)}
                            disabled={isStartDisabled}
                        />
                        <DatePickerTime
                            label="End Date"
                            hint={
                                isEndDisabled
                                    ? "Poll already ended, field can't be updated."
                                    : undefined
                            }
                            description={
                                'The date and time the poll closes and stops accepting responses. \nNo end date means the poll runs indefinitely.'
                            }
                            error={errors.end_date}
                            value={data.end_date}
                            onChange={(v) => setData('end_date', v)}
                            minDate={new Date()}
                            maxDate={addMonths(new Date(), 12)}
                            disabled={isEndDisabled}
                        />
                        {/* <div className="flex items-center justify-between">
                            <Label htmlFor={`ip-${poll.title}`}>
                                Allow only one vote per IP-Address
                            </Label>
                            <Switch
                                id={`ip-${poll.title}`}
                                checked={data.allow_one_vote_per_ip}
                                onCheckedChange={(v) =>
                                    setData('allow_one_vote_per_ip', v)
                                }
                            />
                            {errors.allow_one_vote_per_ip && (
                                <div className="mt-1 text-xs text-red-400 whitespace-pre-line">
                                    {errors.allow_one_vote_per_ip}
                                </div>
                            )}
                        </div> */}

                        <div className="flex items-center justify-between">
                            <Label htmlFor={`is_draft-${poll.title}`}>
                                Publish Poll
                            </Label>
                            <Switch
                                id={`is_draft-${poll.title}`}
                                checked={!data.is_draft}
                                onCheckedChange={(v) => setData('is_draft', !v)}
                            />
                            {errors.is_draft && (
                                <div className="mt-1 text-xs text-red-400 whitespace-pre-line">
                                    {errors.is_draft}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor={`results-${poll.title}`}>
                                Allow public to view results
                            </Label>
                            <Switch
                                id={`results-${poll.title}`}
                                checked={data.allow_public_results}
                                onCheckedChange={(v) =>
                                    setData('allow_public_results', v)
                                }
                            />
                            {errors.allow_public_results && (
                                <div className="mt-1 text-xs text-red-400 whitespace-pre-line">
                                    {errors.allow_public_results}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-1">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" onClick={() => clearErrors()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner data-icon="inline-start" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Dashboard = ({
    polls,
    total_votes,
}: {
    polls: Poll[];
    total_votes: number;
}) => {
    const stats = [
        {
            title: 'Total Polls',
            value: polls.length,
            description: 'Total number of polls you have created',
        },
        {
            title: 'Live Polls',
            value: polls.filter((p) => p.active).length,
            description: 'Polls currently accepting responses',
        },
        {
            title: 'Total Votes',
            value: total_votes,
            description: 'All votes received across your polls',
        },
    ];

    useTitle('Dashboard');

    return (
        <div className="p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className="bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card"
                    >
                        <CardHeader>
                            <CardDescription>{stat.title}</CardDescription>
                            <CardTitle className="text-3xl font-semibold tabular-nums">
                                {stat.value}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="text-sm text-muted-foreground">
                            {stat.description}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Card className="mt-14">
                <CardHeader>
                    <CardTitle>Your Polls</CardTitle>
                </CardHeader>
                <CardContent>
                    {!polls.length ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <p className="text-muted-foreground">
                                You have not created any polls yet.
                            </p>
                            <Button asChild>
                                <Link href="/"> Create a poll now </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Draft</TableHead>
                                    <TableHead>Date Created</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Number of Votes</TableHead>
                                    <TableHead>Live</TableHead>

                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {polls.map((poll, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium max-w-50">
                                            <span className="truncate block">
                                                {poll.title}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {poll.is_draft ? 'Yes' : 'No'}
                                        </TableCell>

                                        <TableCell>
                                            {format(poll.created_at)}
                                        </TableCell>

                                        <TableCell>
                                            {poll.start_date
                                                ? format(poll.start_date)
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {poll.end_date
                                                ? format(poll.end_date)
                                                : '—'}
                                        </TableCell>

                                        <TableCell>{poll.total_vote}</TableCell>

                                        <TableCell>
                                            {poll.active ? 'Yes' : 'No'}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="relative h-6 w-20 px-2 text-xs justify-center group"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/${poll.public_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View
                                                        <ExternalLink
                                                            size={10}
                                                            className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="relative h-6 w-20 px-2 text-xs justify-center group"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/${poll.public_id}/result`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Result
                                                        <ExternalLink
                                                            size={10}
                                                            className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </a>
                                                </Button>
                                                <PollDialog
                                                    key={`${poll.public_id}-${poll.start_date}-${poll.end_date}-${poll.is_draft}`}
                                                    poll={poll}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
