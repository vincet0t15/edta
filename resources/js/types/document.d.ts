export type Attachment = {
    id: number;
    filename: string;
    path: string;
    size?: number;
    mime?: string;
    uploaded_by?: number;
    created_at: string;
};

export type Document = {
    id: number;
    tracking_number: string;
    title: string;
    description?: string | null;
    document_type_id?: number | null;
    document_category_id?: number | null;
    document_priority_id?: number | null;
    current_status_id?: number | null;
    current_office_id?: number | null;
    retention_policy_id?: number | null;
    created_by?: number | null;
    is_public?: boolean;
    due_date_response?: string | null;
    due_date_resolution?: string | null;
    responded_at?: string | null;
    resolved_at?: string | null;
    metadata?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    attachments?: Attachment[];
};

export type DocumentCreateRequest = {
    title: string;
    description?: string;
    document_type_id?: number | null;
    document_category_id?: number | null;
    document_priority_id?: number | null;
    retention_policy_id?: number | null;
    is_public?: boolean;
    submit?: boolean;
};

export type DocumentUpdateRequest = Omit<DocumentCreateRequest, 'submit'>;
