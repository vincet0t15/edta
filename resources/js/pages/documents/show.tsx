import React from 'react';

const DocumentsShow = ({ document }) => {
    return (
        <div>
            <h1>{document.title}</h1>
            <div>{document.description}</div>
            <div>Type: {document.type?.name}</div>
            <div>Priority: {document.priority?.label}</div>
            <div>Status: {document.status?.label}</div>
            <div>Office: {document.office?.name}</div>

            <h2>Logs</h2>
            <ul>
                {document.logs.map(l => (
                    <li key={l.id}>{l.action} — {l.created_at}</li>
                ))}
            </ul>

            <h2>Attachments</h2>
            <ul>
                {document.attachments.map(a => (
                    <li key={a.id}><a href={route('documents.attachments.download', [document.id, a.id])}>{a.filename}</a></li>
                ))}
            </ul>
        </div>
    );
}

export default DocumentsShow;
