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
import { Textarea } from '@/components/ui/textarea';
import type {
    DocumentType,
    DocumentTypeCreateRequest,
} from '@/types/document-type.d';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, SubmitEventHandler } from 'react';
import { toast } from 'sonner';

interface EditDocumentTypeProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentType;
}

export function EditDocumentType({
    isOpen,
    onClose,
    documentType,
}: EditDocumentTypeProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<DocumentTypeCreateRequest>({
            name: documentType.name,
            code: documentType.code,
            description: documentType.description,
        });

    const onChangeInput: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmit: SubmitEventHandler = (e) => {
        e.preventDefault();
        put(route('document-types.update', documentType.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-md sm:max-w-sm">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Document Type</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document type details by providing the
                            required information. This will update the system
                            records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                name="name"
                                placeholder="e.g. Leave Request"
                                onChange={onChangeInput}
                                value={data.name}
                            />
                            <span className="text-orange-600">
                                {errors.name}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input
                                name="code"
                                placeholder="e.g. LR"
                                onChange={onChangeInput}
                                value={data.code}
                            />
                            <span className="text-orange-600">
                                {errors.code}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Textarea
                                name="description"
                                placeholder="Enter description..."
                                onChange={onChangeInput}
                                value={data.description || ''}
                            />
                            <span className="text-orange-600">
                                {errors.description}
                            </span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Document Type
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
