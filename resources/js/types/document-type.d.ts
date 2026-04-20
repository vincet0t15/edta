export type DocumentType = {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
};

export type DocumentTypeCreateRequest = {
    name: string;
    code: string;
    description?: string | null;
};
