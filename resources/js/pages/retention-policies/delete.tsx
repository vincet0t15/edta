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
import type { RetentionPolicy } from '@/types/retention-policy';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteRetentionPolicyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    policy: RetentionPolicy;
}

export function DeleteRetentionPolicyDialog({ isOpen, onClose, policy }: DeleteRetentionPolicyDialogProps) {
    const onSubmit = () => {
        router.delete(route('retention-policies.destroy', policy.id), {
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
                        This action cannot be undone. This will permanently delete the retention policy <span className="font-bold">{policy.name}</span> from our servers.
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
