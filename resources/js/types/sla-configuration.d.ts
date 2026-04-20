export type SLAConfiguration = {
    id: number;
    document_type_id: number;
    document_priority_id: number;
    response_hours: number;
    resolution_hours: number;
    documentType?: {
        id: number;
        name: string;
        code: string;
        description?: string | null;
    };
    documentPriority?: {
        id: number;
        code: string;
        label: string;
        level?: number;
        sla_hours?: number;
        badge_color?: string;
        order?: number;
    };
    created_at: string;
    updated_at: string;
};

export type SLAConfigurationCreateRequest = {
    document_type_id: number;
    document_priority_id: number;
    response_hours: number;
    resolution_hours: number;
};
