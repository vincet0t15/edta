import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const DocumentsIndex = ({ documents }) => {
    return (
        <div>
            <h1>Documents</h1>
            <button onClick={() => Inertia.get(route('documents.create'))}>Create Document</button>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Office</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.data.map((d) => (
                        <tr key={d.id}>
                            <td>{d.title}</td>
                            <td>{d.type?.name}</td>
                            <td>{d.priority?.label}</td>
                            <td>{d.status?.label}</td>
                            <td>{d.office?.name}</td>
                            <td>
                                <a href={route('documents.show', d.id)}>View</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentsIndex;
