import { useState } from 'react';
import { format } from 'timeago.js';
import { MoreHorizontalIcon } from 'lucide-react';
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

interface Poll {
    title: string;
    description: string;
    active: boolean;
    created_at: string;
    total_vote: number;
}

const PollDialog = ({ poll }: { poll: Poll }) => {
    const [isActive, setIsActive] = useState(poll.active);
    const [oneVotePerIp, setOneVotePerIp] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontalIcon size={16} />
                </button>
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
                                        <p className="truncate">{poll.title}</p>
                                    </TableCell>
                                    <TableCell>
                                        {poll.active ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell>
                                        {format(poll.created_at)}
                                    </TableCell>
                                    <TableCell>{poll.total_vote}</TableCell>
                                    <TableCell>
                                        <PollDialog poll={poll} />
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
