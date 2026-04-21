import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Document } from '@/types/document';

export default function DocumentsIndex() {
    const { documents, filters } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');

    const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            Inertia.get(route('documents.index'), { search }, { preserveState: true, replace: true });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <a href={route('documents.create')} className="btn btn-primary">+ Create</a>
                </div>
                <div>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={onSearch}
                        placeholder="Search by title or tracking number"
                        className="input"
                    />
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Tracking</th>
                        <th>Title</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Office</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.data.map((doc: Document) => (
                        <tr key={doc.id}>
                            <td>{doc.tracking_number}</td>
                            <td>{doc.title}</td>
                            <td>{doc.document_priority_id}</td>
                            <td>{doc.current_status_id}</td>
                            <td>{doc.current_office_id}</td>
                            <td>{doc.created_at}</td>
                            <td>
                                <a href={route('documents.show', doc.id)} className="btn btn-link">View</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                {/* pagination */}
            </div>
        </div>
    );
}
