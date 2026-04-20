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
import type { DocumentCategoryCreateRequest } from '@/types/document-category';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface CreateDocumentCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateDocumentCategoryDialog({ isOpen, onClose }: CreateDocumentCategoryDialogProps) {
    const { data, setData, post, reset, errors, processing } = useForm<DocumentCategoryCreateRequest>({
        code: '',
        name: '',
        description: '',
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
        post(route('document-categories.store'), {
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
                        <DialogTitle>Create Document Category</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new document category by providing the required details. This will be included in the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. REPORT" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="e.g. Report" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.name}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" placeholder="e.g. Official reports" onChange={onChangeInput} />
                            <span className="text-orange-600">{errors.description}</span>
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
                            Create Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
