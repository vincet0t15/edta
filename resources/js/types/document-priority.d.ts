export type DocumentPriority = {
    id: number;
    code: string;
    label: string;
    level?: number;
    sla_hours?: number;
    badge_color?: string;
    order?: number;
    created_at: string;
    updated_at: string;
};

export type DocumentPriorityCreateRequest = {
    code: string;
    label: string;
    level?: number;
    sla_hours?: number;
    badge_color?: string;
    order?: number;
};
