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
import type { RoutingRule } from '@/types/routing-rule';
import type { DocumentType } from '@/types/document-type';
import type { Office } from '@/types/office';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateRoutingRuleDialog } from './create';
import { DeleteRoutingRuleDialog } from './delete';
import { EditRoutingRuleDialog } from './edit';
import { dashboard } from '@/routes';

interface IndexProps {
    routingRules: PaginatedDataResponse<RoutingRule>;
    documentTypes: DocumentType[];
    offices: Office[];
    filters: FilterProps;
}

export default function RoutingRulesIndex({
    routingRules,
    documentTypes,
    offices,
    filters,
}: IndexProps) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedRoutingRule, setSelectedRoutingRule] =
        useState<RoutingRule | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleEditClick = (routingRule: RoutingRule) => {
        setSelectedRoutingRule(routingRule);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (routingRule: RoutingRule) => {
        setSelectedRoutingRule(routingRule);
        setOpenDeleteDialog(true);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const queryString = data.search
                ? { search: data.search }
                : undefined;

            router.get('routing-rules.index', queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Routing Rules" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Routing Rule Management"
                    description="Overview and maintenance of all routing rule entries."
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Create Routing Rule
                    </Button>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search the routing rules..."
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
                                    Office
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Order
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Is Initial Recipient
                                </TableHead>
                                <TableHead className="text-right font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routingRules.data.length > 0 ? (
                                routingRules.data.map((routingRule) => (
                                    <TableRow
                                        key={routingRule.id}
                                        className="text-sm hover:bg-muted/30"
                                    >
                                        <TableCell className="text-sm">
                                            {routingRule.documentType?.name ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {routingRule.office?.name ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {routingRule.order}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {routingRule.is_initial_recipient ? (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20 ring-inset">
                                                    No
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="flex items-center justify-end gap-2 text-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                onClick={() =>
                                                    handleEditClick(routingRule)
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
                                                        routingRule,
                                                    )
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
                    <Pagination data={routingRules} />
                </div>

                {openCreateDialog && (
                    <CreateRoutingRuleDialog
                        isOpen={openCreateDialog}
                        onClose={() => setOpenCreateDialog(false)}
                        documentTypes={documentTypes}
                        offices={offices}
                    />
                )}

                {openEditDialog && selectedRoutingRule && (
                    <EditRoutingRuleDialog
                        isOpen={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        routingRule={selectedRoutingRule}
                        documentTypes={documentTypes}
                        offices={offices}
                    />
                )}

                {openDeleteDialog && selectedRoutingRule && (
                    <DeleteRoutingRuleDialog
                        isOpen={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                        routingRule={selectedRoutingRule}
                    />
                )}
            </div>
        </>
    );
}

RoutingRulesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Routing Rules',
            href: '',
        },
    ],
};
