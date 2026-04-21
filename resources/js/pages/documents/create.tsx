import React from 'react';
import { useForm } from '@inertiajs/inertia-react';

const DocumentsCreate = ({ types, priorities, offices, retentionPolicies }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        document_type_id: null,
        priority_id: null,
        current_office_id: null,
        retention_policy_id: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('documents.store'));
    }

    return (
        <div>
            <h1>Create Document</h1>
            <form onSubmit={submit}>
                <div>
                    <label>Title</label>
                    <input value={data.title} onChange={e => setData('title', e.target.value)} />
                    {errors.title && <div>{errors.title}</div>}
                </div>
                <div>
                    <label>Type</label>
                    <select value={data.document_type_id || ''} onChange={e => setData('document_type_id', e.target.value || null)}>
                        <option value="">-- Choose --</option>
                        {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <button type="submit" disabled={processing}>Create</button>
                </div>
            </form>
        </div>
    );
};

export default DocumentsCreate;
