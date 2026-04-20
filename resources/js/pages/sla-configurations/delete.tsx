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
import type { SLAConfiguration } from '@/types/sla-configuration';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteSLAConfigurationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    slaConfiguration: SLAConfiguration;
}

export function DeleteSLAConfigurationDialog({
    isOpen,
    onClose,
    slaConfiguration,
}: DeleteSLAConfigurationDialogProps) {
    const onSubmit = () => {
        router.delete(('sla-configurations.destroy', slaConfiguration.id), {
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
                        delete the SLA configuration for{' '}
                        <span className="font-bold">
                            {slaConfiguration.documentType?.name}
                        </span>{' '}
                        -{' '}
                        <span className="font-bold">
                            {slaConfiguration.documentPriority?.label}
                        </span>{' '}
                        from our servers.
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
