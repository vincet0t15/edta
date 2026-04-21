import React, { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';

export default function DocumentsShow() {
    const { document, statuses, offices } = usePage().props as any;
    const [toStatus, setToStatus] = useState('');
    const [targetOffice, setTargetOffice] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const handleTransition = (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('to_status', toStatus);
        if (note) form.append('note', note);
        if (targetOffice) form.append('target_office_id', String(targetOffice));

        fetch(route('documents.transition', document.id), {
            method: 'POST',
            body: form,
            headers: {
                'X-CSRF-TOKEN': (document as any).csrf_token || (window as any).Laravel?.csrfToken || '',
            },
        }).then(() => {
            window.location.reload();
        });
    };

    return (
        <div>
            <h1>{document.title}</h1>
            <p>Tracking: {document.tracking_number}</p>

            <h2>Actions</h2>
            <form onSubmit={handleTransition}>
                <div>
                    <label>To Status</label>
                    <select value={toStatus} onChange={(e) => setToStatus(e.target.value)}>
                        <option value="">-- Select --</option>
                        {statuses.map((s: any) => (
                            <option key={s.id} value={s.code}>{s.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Target Office (optional)</label>
                    <select value={targetOffice ?? ''} onChange={(e) => setTargetOffice(e.target.value ? Number(e.target.value) : null)}>
                        <option value="">-- None --</option>
                        {offices.map((o: any) => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </div>

                <div className="mt-4">
                    <button className="btn btn-primary" type="submit">Apply Transition</button>
                </div>
            </form>

            <h2>Timeline</h2>
            <div>
                {document.logs.map((log: any) => (
                    <div key={log.id}>
                        <div><strong>{log.action}</strong> by {log.user?.name ?? 'System'} at {log.created_at}</div>
                        <div>{JSON.stringify(log.payload)}</div>
                    </div>
                ))}
            </div>

            <h2>Attachments</h2>
            <div>
        {document.attachments?.map((a: any) => (
                    <div key={a.id}>
                        <a href={`/documents/${document.id}/attachments/${a.id}/download`}>{a.filename}</a>
                    </div>
                ))}

                <form method="post" encType="multipart/form-data" action={route('documents.attachments.upload', document.id)}>
                    <input type="hidden" name="_token" value={(document as any).csrf_token || (window as any).Laravel?.csrfToken || ''} />
                    <input type="file" name="file" />
                    <button type="submit" className="btn">Upload</button>
                </form>
            </div>
        </div>
    );
}
