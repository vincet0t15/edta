import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { DocumentCreateRequest } from '@/types/document';

export default function DocumentsCreate() {
    const { data, setData, post, processing, errors } = useForm<DocumentCreateRequest>({
        title: '',
        description: '',
        document_type_id: null,
        document_category_id: null,
        document_priority_id: null,
        retention_policy_id: null,
        is_public: false,
        submit: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('documents.store'));
    };

    return (
        <div>
            <h1>Create Document</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Title</label>
                    <input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                </div>

                <div className="mt-4">
                    <button className="btn btn-primary" type="submit" disabled={processing}>Save</button>
                    <button className="btn ml-2" type="button" onClick={() => setData('submit', true)}>Submit</button>
                </div>
            </form>
        </div>
    );
}
