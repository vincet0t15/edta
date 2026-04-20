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
import type { RetentionPolicy, RetentionPolicyCreateRequest } from '@/types/retention-policy';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface EditRetentionPolicyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    policy: RetentionPolicy;
}

export function EditRetentionPolicyDialog({ isOpen, onClose, policy }: EditRetentionPolicyDialogProps) {
    const { data, setData, put, reset, errors, processing } = useForm<RetentionPolicyCreateRequest>({
        code: policy.code,
        name: policy.name,
        description: policy.description || '',
        archive_after_months: policy.archive_after_months,
        delete_after_years: policy.delete_after_years,
        is_permanent: policy.is_permanent || false,
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
                [name]: numericFields.includes(name) && value ? parseInt(value, 10) : value,
            });
        }
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(retentionPolicies.update(policy.id).url, {
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
                        <DialogTitle>Edit Retention Policy</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the retention policy details by providing the required information. This will update the system records.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Field>
                            <Label htmlFor="code">Code</Label>
                            <Input name="code" placeholder="e.g. SHORT_TERM" onChange={onChangeInput} value={data.code} />
                            <span className="text-orange-600">{errors.code}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="e.g. Short Term" onChange={onChangeInput} value={data.name} />
                            <span className="text-orange-600">{errors.name}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" placeholder="e.g. Documents retained for 6 months" onChange={onChangeInput} value={data.description} />
                            <span className="text-orange-600">{errors.description}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="archive_after_months">Archive After (Months)</Label>
                            <Input name="archive_after_months" type="number" placeholder="e.g. 6" onChange={onChangeInput} value={data.archive_after_months || ''} />
                            <span className="text-orange-600">{errors.archive_after_months}</span>
                        </Field>
                        <Field>
                            <Label htmlFor="delete_after_years">Delete After (Years)</Label>
                            <Input name="delete_after_years" type="number" placeholder="e.g. 1" onChange={onChangeInput} value={data.delete_after_years || ''} />
                            <span className="text-orange-600">{errors.delete_after_years}</span>
                        </Field>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_permanent"
                                name="is_permanent"
                                checked={data.is_permanent}
                                onChange={onChangeInput}
                            />
                            <Label htmlFor="is_permanent" className="cursor-pointer">Is Permanent</Label>
                        </div>
                        <span className="text-orange-600">{errors.is_permanent}</span>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Policy
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
