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
import type { DocumentPriority } from '@/types/document-priority';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteDocumentPriorityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    priority: DocumentPriority;
}

export function DeleteDocumentPriorityDialog({ isOpen, onClose, priority }: DeleteDocumentPriorityDialogProps) {
    const onSubmit = () => {
        router.delete(route('document-priorities.destroy', priority.id), {
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
                        This action cannot be undone. This will permanently delete the document priority <span className="font-bold">{priority.label}</span> from our servers.
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
