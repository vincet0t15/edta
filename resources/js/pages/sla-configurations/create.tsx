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
import type { SLAConfigurationCreateRequest } from '@/types/sla-configuration';
import type { DocumentType } from '@/types/document-type';
import type { DocumentPriority } from '@/types/document-priority';
import { useForm } from '@inertiajs/react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface CreateSLAConfigurationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    documentTypes: DocumentType[];
    documentPriorities: DocumentPriority[];
}

export function CreateSLAConfigurationDialog({
    isOpen,
    onClose,
    documentTypes,
    documentPriorities,
}: CreateSLAConfigurationDialogProps) {
    const { data, setData, post, reset, errors, processing } =
        useForm<SLAConfigurationCreateRequest>({
            document_type_id: 0,
            document_priority_id: 0,
            response_hours: 24,
            resolution_hours: 72,
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
        post(route('sla-configurations.store'), {
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
                        <DialogTitle>Create SLA Configuration</DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a new SLA configuration by providing the required details. This will be included in the system records.
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
                                        <SelectItem key={dt.id} value={dt.id.toString()}>
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
                            <Label htmlFor="document_priority_id">
                                Priority
                            </Label>
                            <Select
                                value={data.document_priority_id.toString()}
                                onValueChange={(value) =>
                                    setData({
                                        ...data,
                                        document_priority_id: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentPriorities.map((dp) => (
                                        <SelectItem key={dp.id} value={dp.id.toString()}>
                                            {dp.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-orange-600">
                                {errors.document_priority_id}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="response_hours">
                                Response Hours
                            </Label>
                            <Input
                                type="number"
                                name="response_hours"
                                placeholder="e.g. 24"
                                min="1"
                                onChange={onChangeInput}
                                value={data.response_hours}
                            />
                            <span className="text-orange-600">
                                {errors.response_hours}
                            </span>
                        </Field>
                        <Field>
                            <Label htmlFor="resolution_hours">
                                Resolution Hours
                            </Label>
                            <Input
                                type="number"
                                name="resolution_hours"
                                placeholder="e.g. 72"
                                min="1"
                                onChange={onChangeInput}
                                value={data.resolution_hours}
                            />
                            <span className="text-orange-600">
                                {errors.resolution_hours}
                            </span>
                        </Field>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Create SLA Configuration
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
