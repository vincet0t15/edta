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
import type { DocumentCategory, DocumentCategoryCreateRequest } from '@/types/document-category';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface EditDocumentCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: DocumentCategory;
}

export function EditDocumentCategoryDialog({ isOpen, onClose, category }: EditDocumentCategoryDialogProps) {
    const { data, setData, put, reset, errors, processing } = useForm<DocumentCategoryCreateRequest>({
        code: category.code,
        name: category.name,
        description: category.description || '',
        order: category.order,
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
        put(route('document-categories.update', category.id), {
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
                        <DialogTitle>Edit Document Category</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the document category details by providing the required information. This will update the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. REPORT" onChange={onChangeInput} value={data.code} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="e.g. Report" onChange={onChangeInput} value={data.name} />
                            <span className="text-orange-600">{errors.name}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" placeholder="e.g. Official reports" onChange={onChangeInput} value={data.description} />
                            <span className="text-orange-600">{errors.description}</span>
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
                            Update Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
