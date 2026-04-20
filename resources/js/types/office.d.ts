export type Office = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
};

export type OfficeCreateRequest = {
    name: string;
    code: string;
};
