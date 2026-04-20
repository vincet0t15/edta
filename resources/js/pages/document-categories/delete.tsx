import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import documentCategories from '@/routes/document-categories';
import type { DocumentCategory } from '@/types/document-category';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteDocumentCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: DocumentCategory;
}

export function DeleteDocumentCategoryDialog({
    isOpen,
    onClose,
    category,
}: DeleteDocumentCategoryDialogProps) {
    const onSubmit = () => {
        router.delete(documentCategories.destroy(category.id).url, {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                onClose();
            },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rounded-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the document category{' '}
                        <span className="font-bold">{category.name}</span> from
                        our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
