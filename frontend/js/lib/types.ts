export type PollOption = {
    id?: number;
    text: string;
};

export interface Poll {
    id?: number;
    title: string;
    description: string;
    active: boolean;
    created_at: string;
    total_vote: number;
    public_id: string;
}
