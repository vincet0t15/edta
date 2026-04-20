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
import routingRules from '@/routes/routing-rules';
import type { RoutingRule } from '@/types/routing-rule';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteRoutingRuleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    routingRule: RoutingRule;
}

export function DeleteRoutingRuleDialog({
    isOpen,
    onClose,
    routingRule,
}: DeleteRoutingRuleDialogProps) {
    const onSubmit = () => {
        router.delete(routingRules.destroy(routingRule.id).url, {
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
                        delete the routing rule for{' '}
                        <span className="font-bold">
                            {routingRule.documentType?.name}
                        </span>{' '}
                        -{' '}
                        <span className="font-bold">
                            {routingRule.office?.name}
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
