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
import { Checkbox } from '@/components/ui/checkbox';
import type { RetentionPolicyCreateRequest } from '@/types/retention-policy';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import retentionPolicies from '@/routes/retention-policies';

interface CreateRetentionPolicyDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateRetentionPolicyDialog({
    isOpen,
    onClose,
}: CreateRetentionPolicyDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<RetentionPolicyCreateRequest>({
            code: '',
            name: '',
            description: '',
            archive_after_months: undefined,
            delete_after_years: undefined,
            is_permanent: false,
        });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value, type } = e.target;
        const numericFields = ['archive_after_months', 'delete_after_years'];

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setData({
                ...data,
                [name]: checked,
            });
        } else {
            setData({
                ...data,
                [name]:
                    numericFields.includes(name) && value
                        ? parseInt(value, 10)
                        : value,
            });
        }
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(retentionPolicies.store().url, {
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
                        <DialogTitle>Create Retention Policy</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new retention policy by providing the required
                            details. This will be included in the system
                            records.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input
                                name="code"
                                placeholder="e.g. SHORT_TERM"
                                onChange={onChangeInput}
                            />
                            <span className="text-orange-600">
                                {errors.code}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                name="name"
                                placeholder="e.g. Short Term"
                                onChange={onChangeInput}
                            />
                            <span className="text-orange-600">
                                {errors.name}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                name="description"
                                placeholder="e.g. Documents retained for 6 months"
                                onChange={onChangeInput}
                            />
                            <span className="text-orange-600">
                                {errors.description}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="archive_after_months">
                                Archive After (Months)
                            </Label>
                            <Input
                                name="archive_after_months"
                                type="number"
                                placeholder="e.g. 6"
                                onChange={onChangeInput}
                            />
                            <span className="text-orange-600">
                                {errors.archive_after_months}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="delete_after_years">
                                Delete After (Years)
                            </Label>
                            <Input
                                name="delete_after_years"
                                type="number"
                                placeholder="e.g. 1"
                                onChange={onChangeInput}
                            />
                            <span className="text-orange-600">
                                {errors.delete_after_years}
                            </span>
                        </Field>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_permanent"
                                name="is_permanent"
                                checked={data.is_permanent}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        is_permanent: e.target.checked,
                                    })
                                }
                            />
                            <Label
                                htmlFor="is_permanent"
                                className="cursor-pointer"
                            >
                                Is Permanent
                            </Label>
                        </div>
                        <span className="text-orange-600">
                            {errors.is_permanent}
                        </span>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create Policy
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
