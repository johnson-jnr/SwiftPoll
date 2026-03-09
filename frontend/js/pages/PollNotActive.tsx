import { LockKeyhole } from 'lucide-react';

const PollNotActive = () => (
    <div className="max-w-2xl mx-auto mt-16 sm:mt-20 text-center space-y-4 px-4 sm:px-0">
        <LockKeyhole className="mx-auto size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Poll is currently inactive</h1>
        <p className="text-muted-foreground">
            This poll is not accepting responses at the moment. Please check
            back later.
        </p>
    </div>
);

export default PollNotActive;
