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
import type { SLAConfiguration } from '@/types/sla-configuration';
import type { DocumentType } from '@/types/document-type';
import type { DocumentPriority } from '@/types/document-priority';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateSLAConfigurationDialog } from './create';
import { DeleteSLAConfigurationDialog } from './delete';
import { EditSLAConfigurationDialog } from './edit';
import Dashboard from '../dashboard';
import { dashboard } from '@/routes';

interface IndexProps {
    slaConfigurations: PaginatedDataResponse<SLAConfiguration>;
    documentTypes: DocumentType[];
    documentPriorities: DocumentPriority[];
    filters: FilterProps;
}

export default function SLAConfigurationsIndex({
    slaConfigurations,
    documentTypes,
    documentPriorities,
    filters,
}: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedSLAConfiguration, setSelectedSLAConfiguration] =
        useState<SLAConfiguration | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (slaConfiguration: SLAConfiguration) => {
        setSelectedSLAConfiguration(slaConfiguration);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (slaConfiguration: SLAConfiguration) => {
        setSelectedSLAConfiguration(slaConfiguration);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const queryString = data.search
                ? { search: data.search }
                : undefined;

            router.get('sla-configurations.index', queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="SLA Configurations" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="SLA Configuration Management"
                    description="Overview and maintenance of all SLA configuration entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create SLA Configuration
                    </Button>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search the SLA configurations..."
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
                                    Document Type
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Priority
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Response Hours
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Resolution Hours
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slaConfigurations.data.length > 0 ? (
                                slaConfigurations.data.map(
                                    (slaConfiguration) => (
                                        <TableRow
                                            key={slaConfiguration.id}
                                            className="text-sm hover:bg-muted/30"
                                        >
                                            <TableCell className="text-sm">
                                                {slaConfiguration.documentType
                                                    ?.name ?? (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {slaConfiguration.documentPriority
                                                    ?.label ?? (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {slaConfiguration.response_hours}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {slaConfiguration.resolution_hours}
                                            </TableCell>

                                            <TableCell className="flex items-center justify-end gap-2 text-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            slaConfiguration
                                                        )
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
                                                        handleDeleteClick(
                                                            slaConfiguration
                                                        )
                                                    }
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
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
                    <Pagination data={slaConfigurations} />
                </div>

                {openCreateDialog && (
                    <CreateSLAConfigurationDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                        documentTypes={documentTypes}
                        documentPriorities={documentPriorities}
                    />
                )}

                {openEditDialog && selectedSLAConfiguration && (
                    <EditSLAConfigurationDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        slaConfiguration={selectedSLAConfiguration}
                        documentTypes={documentTypes}
                        documentPriorities={documentPriorities}
                    />
                )}

                {openDeleteDialog && selectedSLAConfiguration && (
                    <DeleteSLAConfigurationDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        slaConfiguration={selectedSLAConfiguration}
                    />
                )}
            </div>
        </>
    );
}

SLAConfigurationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'SLA Configurations',
            href: '',
        },
    ],
};
