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
import type { DocumentStatus } from '@/types/document-status';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateDocumentStatusDialog } from './create';
import { DeleteDocumentStatusDialog } from './delete';
import { EditDocumentStatusDialog } from './edit';
import { dashboard } from '@/routes';

interface IndexProps {
    statuses: PaginatedDataResponse<DocumentStatus>;
    filters: FilterProps;
}

export default function DocumentStatusesIndex({ statuses, filters }: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (status: DocumentStatus) => {
        setSelectedStatus(status);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (status: DocumentStatus) => {
        setSelectedStatus(status);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const queryString = data.search
                ? { search: data.search }
                : undefined;

            router.get('document-statuses.index', queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Document Statuses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Document Status Management"
                    description="Overview and maintenance of all document status entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Status
                    </Button>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search the statuses..."
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
                                    Label
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Code
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Description
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statuses.data.length > 0 ? (
                                statuses.data.map((status) => (
                                    <TableRow
                                        key={status.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm">
                                            {status.label}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {status.code ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {status.description ?? (
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
                                                    handleEditClick(status)
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
                                                    handleDeleteClick(status)
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
                                        colSpan={4}
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
                    <Pagination data={statuses} />
                </div>

                {openCreateDialog && (
                    <CreateDocumentStatusDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                    />
                )}

                {openEditDialog && selectedStatus && (
                    <EditDocumentStatusDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        status={selectedStatus}
                    />
                )}

                {openDeleteDialog && selectedStatus && (
                    <DeleteDocumentStatusDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        status={selectedStatus}
                    />
                )}
            </div>
        </>
    );
}

DocumentStatusesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Document Statuses',
            href: '',
        },
    ],
};
