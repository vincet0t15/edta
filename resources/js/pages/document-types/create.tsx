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
import type { DocumentTypeCreateRequest } from '@/types/document-type.d';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import documentTypes from '@/routes/document-types';

interface CreateDocumentTypeProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateDocumentType({ isOpen, onClose }: CreateDocumentTypeProps) {
    const { data, setData, post, reset, errors, processing } = useForm<DocumentTypeCreateRequest>({
        name: '',
        code: '',
        description: null,
    });

    const onChangeInput: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(documentTypes.store().url, {
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
                        <DialogTitle>Create Document Type</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new document type by providing the required details. This will be included in the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="e.g. Leave Request" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.name}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. LR" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea name="description" placeholder="Enter description..." onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.description}</span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create Document Type
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
