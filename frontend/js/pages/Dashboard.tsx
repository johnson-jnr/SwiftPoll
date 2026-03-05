import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
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

const PollDialog = ({ poll }: { poll: Poll }) => {
    const [isActive, setIsActive] = useState(poll.active);
    const [oneVotePerIp, setOneVotePerIp] = useState(false);
    const [showResults, setShowResults] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-20 px-2 text-xs justify-center"
                >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{poll.title}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {poll.description}
                </p>
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`active-${poll.title}`}>
                            Poll Active
                        </Label>
                        <Switch
                            id={`active-${poll.title}`}
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`ip-${poll.title}`}>
                            Allow only one vote per IP-Address
                        </Label>
                        <Switch
                            id={`ip-${poll.title}`}
                            checked={oneVotePerIp}
                            onCheckedChange={setOneVotePerIp}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`results-${poll.title}`}>
                            Allow public to view results
                        </Label>
                        <Switch
                            id={`results-${poll.title}`}
                            checked={showResults}
                            onCheckedChange={setShowResults}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => console.log('foo')}>
                        Save Changes
                    </Button>
                </DialogFooter>
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
            title: 'Active Polls',
            value: polls.filter((p) => p.active).length,
            description: 'Polls currently accepting responses',
        },
        {
            title: 'Total Votes',
            value: total_votes,
            description: 'All votes received across your polls',
        },
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
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
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Your Polls</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Number of Votes</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {polls.map((poll, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium max-w-40">
                                        <span className="truncate block">
                                            {poll.title}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {poll.active ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell>
                                        {format(poll.created_at)}
                                    </TableCell>
                                    <TableCell>{poll.total_vote}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <PollDialog poll={poll} />
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
