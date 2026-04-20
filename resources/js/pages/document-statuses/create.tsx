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
import type { DocumentStatusCreateRequest } from '@/types/document-status';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface CreateDocumentStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateDocumentStatusDialog({ isOpen, onClose }: CreateDocumentStatusDialogProps) {
    const { data, setData, post, reset, errors, processing } = useForm<DocumentStatusCreateRequest>({
        code: '',
        label: '',
        description: '',
        badge_color: '',
        order: undefined,
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
        post(route('document-statuses.store'), {
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
                        <DialogTitle>Create Document Status</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new document status by providing the required details. This will be included in the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. DRAFT" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="label">Label</Label>
                            <Input name="label" placeholder="e.g. Draft" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.label}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" placeholder="e.g. Document is in draft state" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.description}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="badge_color">Badge Color</Label>
                            <Input name="badge_color" placeholder="e.g. blue" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.badge_color}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="order">Order</Label>
                            <Input name="order" type="number" placeholder="e.g. 1" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.order}</span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
