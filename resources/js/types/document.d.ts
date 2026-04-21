export type Document = {
    id: number;
    title: string;
    description?: string;
    document_type_id?: number | null;
    priority_id?: number | null;
    current_status_id?: number | null;
    current_office_id?: number | null;
    retention_policy_id?: number | null;
    sla_response_due_at?: string | null;
    sla_resolution_due_at?: string | null;
    submitted_at?: string | null;
    responded_at?: string | null;
    resolved_at?: string | null;
    created_at?: string;
    updated_at?: string;
};
