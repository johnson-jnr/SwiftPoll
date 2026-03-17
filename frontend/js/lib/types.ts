export type PollOption = {
    id?: number;
    text: string;
};

export interface Poll {
    id?: number;
    title: string;
    description: string;
    active: boolean;
    is_draft: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    total_vote: number;
    public_id: string;
    options: any;
    user: any;
    allow_one_vote_per_ip: boolean;
    allow_public_results: boolean;
}

export type Message = { message: string; level_tag: string };
