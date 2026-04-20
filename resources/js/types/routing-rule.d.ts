export type RoutingRule = {
    id: number;
    document_type_id: number;
    office_id: number;
    order: number;
    is_initial_recipient: boolean;
    documentType?: {
        id: number;
        name: string;
        code: string;
        description?: string | null;
    };
    office?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    updated_at: string;
};

export type RoutingRuleCreateRequest = {
    document_type_id: number;
    office_id: number;
    order: number;
    is_initial_recipient: boolean;
};
