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
import type { DocumentPriority, DocumentPriorityCreateRequest } from '@/types/document-priority';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface EditDocumentPriorityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    priority: DocumentPriority;
}

export function EditDocumentPriorityDialog({ isOpen, onClose, priority }: EditDocumentPriorityDialogProps) {
    const { data, setData, put, reset, errors, processing } = useForm<DocumentPriorityCreateRequest>({
        code: priority.code,
        label: priority.label,
        level: priority.level,
        sla_hours: priority.sla_hours,
        badge_color: priority.badge_color || '',
        order: priority.order,
    });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        const numericFields = ['level', 'sla_hours', 'order'];
        setData({
            ...data,
            [name]: numericFields.includes(name) && value ? parseInt(value, 10) : value,
        });
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('document-priorities.update', priority.id), {
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
                        <DialogTitle>Edit Document Priority</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document priority details by providing the required information. This will update the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. HIGH" onChange={onChangeInput} value={data.code} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="label">Label</Label>
                            <Input name="label" placeholder="e.g. High Priority" onChange={onChangeInput} value={data.label} />
                            <span className="text-orange-600">{errors.label}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="level">Level</Label>
                            <Input name="level" type="number" placeholder="e.g. 1" onChange={onChangeInput} value={data.level || ''} />
                            <span className="text-orange-600">{errors.level}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="sla_hours">SLA Hours</Label>
                            <Input name="sla_hours" type="number" placeholder="e.g. 24" onChange={onChangeInput} value={data.sla_hours || ''} />
                            <span className="text-orange-600">{errors.sla_hours}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="badge_color">Badge Color</Label>
                            <Input name="badge_color" placeholder="e.g. red" onChange={onChangeInput} value={data.badge_color} />
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
                            Update Priority
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
