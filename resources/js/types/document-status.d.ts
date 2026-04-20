export type DocumentStatus = {
    id: number;
    code: string;
    label: string;
    description?: string;
    order?: number;
    badge_color?: string;
    created_at: string;
    updated_at: string;
};

export type DocumentStatusCreateRequest = {
    code: string;
    label: string;
    description?: string;
    badge_color?: string;
    order?: number;
};
