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
import type { DocumentType } from '@/types/document-type.d';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

import documentTypes from '@/routes/document-types';

interface DeleteDocumentTypeProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: DocumentType;
}

export function DeleteDocumentType({ isOpen, onClose, documentType }: DeleteDocumentTypeProps) {
    const onSubmit = () => {
        router.delete(documentTypes.destroy(documentType.id).url, {
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
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document type <span className="font-bold">{documentType.name}</span> from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
