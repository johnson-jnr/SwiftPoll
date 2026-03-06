'use client';

import { useState } from 'react';
import {
    MoreVertical,
    Link as LinkIcon,
    ChartNoAxesColumnIncreasing,
    Check,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import { Link } from '@inertiajs/react';
import { Poll } from '@/lib/types';

export default function PollMenu({
    showResults = true,
    poll,
}: {
    showResults?: boolean;
    poll: Poll;
}) {
    const [copied, setCopied] = useState(false);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreVertical className="size-5 text-muted-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        copyLink();
                    }}
                >
                    {copied ? (
                        <Check className="text-green-500" />
                    ) : (
                        <LinkIcon />
                    )}
                    {copied ? 'Copied!' : 'Copy Poll Link'}
                </DropdownMenuItem>
                {poll && poll.allow_public_results && showResults && (
                    <DropdownMenuItem asChild>
                        <Link href={`/${poll.public_id}/result`}>
                            <ChartNoAxesColumnIncreasing /> Show Results
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
