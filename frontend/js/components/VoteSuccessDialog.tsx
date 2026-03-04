import { useState } from 'react';
import {
    Check,
    ChartNoAxesColumnIncreasing,
    Link as LinkIcon,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/shadcn/dialog';
import { Button, buttonVariants } from '@/components/shadcn/button';
import { Link } from '@inertiajs/react';

export default function VoteSuccessDialog({
    open,
    onOpenChange,
    pollId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pollId: string;
}) {
    const [copied, setCopied] = useState(false);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-center mb-2">
                        <div className="bg-green-100 rounded-full p-4">
                            <Check className="size-8 text-green-600 stroke-[2.5]" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Vote successful
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Thank you for participating in this poll. Your vote has
                        been counted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row gap-2 sm:justify-center">
                    <Link href={`/${pollId}/result`} className={buttonVariants({ className: 'flex-1' })}>
                        <ChartNoAxesColumnIncreasing /> Results
                    </Link>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={copyLink}
                    >
                        {copied ? (
                            <Check className="text-green-500" />
                        ) : (
                            <LinkIcon />
                        )}
                        {copied ? 'Copied!' : 'Poll Link'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
