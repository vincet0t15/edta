import Heading from '@/components/heading';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { FilterProps } from '@/types/filter';
import type { RetentionPolicy } from '@/types/retention-policy';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateRetentionPolicyDialog } from './create';
import { DeleteRetentionPolicyDialog } from './delete';
import { EditRetentionPolicyDialog } from './edit';
import { dashboard } from '@/routes';

interface IndexProps {
    policies: PaginatedDataResponse<RetentionPolicy>;
    filters: FilterProps;
}

export default function RetentionPoliciesIndex({ policies, filters }: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<RetentionPolicy | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (policy: RetentionPolicy) => {
        setSelectedPolicy(policy);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (policy: RetentionPolicy) => {
        setSelectedPolicy(policy);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const queryString = data.search
                ? { search: data.search }
                : undefined;

            router.get('retention-policies.index', queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Retention Policies" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Retention Policy Management"
                    description="Overview and maintenance of all retention policy entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Policy
                    </Button>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search the policies..."
                                className="w-full pl-8"
                                value={data.search}
                                onChange={(e) =>
                                    setData({ search: e.target.value })
                                }
                                onKeyDown={handleSearchKeyDown}
                            />
                            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Code
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Archive (Months)
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Delete (Years)
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {policies.data.length > 0 ? (
                                policies.data.map((policy) => (
                                    <TableRow
                                        key={policy.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm">
                                            {policy.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {policy.code ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {policy.archive_after_months ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {policy.is_permanent ? (
                                                <span className="font-semibold text-blue-600">Permanent</span>
                                            ) : policy.delete_after_years ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                onClick={() =>
                                                    handleEditClick(policy)
                                                }
                                                title="Edit"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() =>
                                                    handleDeleteClick(policy)
                                                }
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <Pagination data={policies} />
                </div>

                {openCreateDialog && (
                    <CreateRetentionPolicyDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                    />
                )}

                {openEditDialog && selectedPolicy && (
                    <EditRetentionPolicyDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        policy={selectedPolicy}
                    />
                )}

                {openDeleteDialog && selectedPolicy && (
                    <DeleteRetentionPolicyDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        policy={selectedPolicy}
                    />
                )}
            </div>
        </>
    );
}

RetentionPoliciesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Retention Policies',
            href: '',
        },
    ],
};
