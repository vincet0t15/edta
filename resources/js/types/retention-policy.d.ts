export type RetentionPolicy = {
    id: number;
    code: string;
    name: string;
    description?: string;
    archive_after_months?: number;
    delete_after_years?: number;
    is_permanent?: boolean;
    created_at: string;
    updated_at: string;
};

export type RetentionPolicyCreateRequest = {
    code: string;
    name: string;
    description?: string;
    archive_after_months?: number;
    delete_after_years?: number;
    is_permanent?: boolean;
};
