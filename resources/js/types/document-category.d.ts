export type DocumentCategory = {
    id: number;
    code: string;
    name: string;
    description?: string;
    order?: number;
    created_at: string;
    updated_at: string;
};

export type DocumentCategoryCreateRequest = {
    code: string;
    name: string;
    description?: string;
    order?: number;
};
