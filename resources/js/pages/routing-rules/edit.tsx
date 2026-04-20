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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type {
    RoutingRule,
    RoutingRuleCreateRequest,
} from '@/types/routing-rule';
import type { DocumentType } from '@/types/document-type';
import type { Office } from '@/types/office';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface EditRoutingRuleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    routingRule: RoutingRule;
    documentTypes: DocumentType[];
    offices: Office[];
}

export function EditRoutingRuleDialog({
    isOpen,
    onClose,
    routingRule,
    documentTypes,
    offices,
}: EditRoutingRuleDialogProps) {
    const { data, setData, put, reset, errors, processing } =
        useForm<RoutingRuleCreateRequest>({
            document_type_id: routingRule.document_type_id,
            office_id: routingRule.office_id,
            order: routingRule.order,
            is_initial_recipient: routingRule.is_initial_recipient,
        });

    const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value =
            e.target.type === 'number'
                ? parseInt(e.target.value)
                : e.target.value;
        setData({ ...data, [e.target.name]: value });
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(('routing-rules.update', routingRule.id), {
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
                        <DialogTitle>Edit Routing Rule</DialogTitle>
                        <DialogDescription className="text-xs">
                            Update the routing rule details by providing the
                            required information. This will update the system
                            records.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Field>
                            <Label htmlFor="document_type_id">
                                Document Type
                            </Label>
                            <Select
                                value={data.document_type_id.toString()}
                                onValueChange={(value) =>
                                    setData({
                                        ...data,
                                        document_type_id: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((dt) => (
                                        <SelectItem
                                            key={dt.id}
                                            value={dt.id.toString()}
                                        >
                                            {dt.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-orange-600">
                                {errors.document_type_id}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="office_id">Office</Label>
                            <Select
                                value={data.office_id.toString()}
                                onValueChange={(value) =>
                                    setData({
                                        ...data,
                                        office_id: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an office" />
                                </SelectTrigger>
                                <SelectContent>
                                    {offices.map((office) => (
                                        <SelectItem
                                            key={office.id}
                                            value={office.id.toString()}
                                        >
                                            {office.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-orange-600">
                                {errors.office_id}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="order">Order</Label>
                            <Input
                                type="number"
                                name="order"
                                placeholder="e.g. 1"
                                min="1"
                                onChange={onChangeInput}
                                value={data.order}
                            />
                            <span className="text-orange-600">
                                {errors.order}
                            </span>
                        </Field>
                        <Field>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_initial_recipient"
                                    checked={data.is_initial_recipient}
                                    onCheckedChange={(checked) =>
                                        setData({
                                            ...data,
                                            is_initial_recipient:
                                                checked === true,
                                        })
                                    }
                                />
                                <Label
                                    htmlFor="is_initial_recipient"
                                    className="cursor-pointer font-normal"
                                >
                                    Is Initial Recipient
                                </Label>
                            </div>
                            <span className="text-orange-600">
                                {errors.is_initial_recipient}
                            </span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Update Routing Rule
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
