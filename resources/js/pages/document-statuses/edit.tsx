import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DocumentStatus, DocumentStatusCreateRequest } from '@/types/document-status';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

import documentStatuses from '@/routes/document-statuses';

interface EditDocumentStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    status: DocumentStatus;
}

export function EditDocumentStatusDialog({ isOpen, onClose, status }: EditDocumentStatusDialogProps) {
    const { data, setData, put, reset, errors, processing } = useForm<DocumentStatusCreateRequest>({
        code: status.code,
        label: status.label,
        description: status.description || '',
        badge_color: status.badge_color || '',
        order: status.order,
    });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: name === 'order' && value ? parseInt(value, 10) : value,
        });
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(documentStatuses.update(status.id).url, {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm rounded-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Document Status</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document status details by providing the required information. This will update the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. DRAFT" onChange={onChangeInput} value={data.code} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="label">Label</Label>
                            <Input name="label" placeholder="e.g. Draft" onChange={onChangeInput} value={data.label} />
                            <span className="text-orange-600">{errors.label}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" placeholder="e.g. Document is in draft state" onChange={onChangeInput} value={data.description} />
                            <span className="text-orange-600">{errors.description}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="badge_color">Badge Color</Label>
                            <Input name="badge_color" placeholder="e.g. blue" onChange={onChangeInput} value={data.badge_color} />
                            <span className="text-orange-600">{errors.badge_color}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="order">Order</Label>
                            <Input name="order" type="number" placeholder="e.g. 1" onChange={onChangeInput} value={data.order || ''} />
                            <span className="text-orange-600">{errors.order}</span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
