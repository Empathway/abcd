"use client";

import React from "react";
import { 
  Search,
  Plus,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
import { Subscriber } from '@/types/subscriber';

// Hooks
import { useSubscribers } from '@/hooks/useSubscribers';
import { useSubscriberFilters } from '@/hooks/useSubscriberFilters';
import { useSubscriberSelection } from '@/hooks/useSubscriberSelection';
import { usePagination } from '@/hooks/usePagination';
import { useSubscriberHandlers } from '@/hooks/useSubscriberHandlers';

// Utils
import { calculateStats } from '@/lib/utils/subscriber-utils';

// Components
import { SubscriberTable } from '@/components/email_list/SubscriberTable';
import { SubscriberForm } from '@/components/email_list/SubscriberForm';
import { PaginationControls } from '@/components/email_list/PaginationControls';

// Mock data
const mockData: Subscriber[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    subscriptionDate: "2025-01-15",
    status: "Active",
    source: "Website",
    tags: ["Newsletter", "Premium"],
    lastActivity: "2025-08-10"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subscriptionDate: "2025-02-20",
    status: "Active",
    source: "Manual",
    tags: ["Newsletter"],
    lastActivity: "2025-08-12"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    subscriptionDate: "2025-03-10",
    status: "Inactive",
    source: "Import",
    tags: ["Newsletter", "Marketing"],
    lastActivity: "2025-07-20"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    subscriptionDate: "2025-07-05",
    status: "Active",
    source: "Website",
    tags: ["Newsletter"],
    lastActivity: "2025-08-14"
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    subscriptionDate: "2025-04-12",
    status: "Active",
    source: "API",
    tags: ["Newsletter", "Tech"],
    lastActivity: "2025-08-13"
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    subscriptionDate: "2025-05-18",
    status: "Inactive",
    source: "Website",
    tags: ["Marketing"],
    lastActivity: "2025-06-15"
  }
];

/**
 * Main component for managing subscribers - Pure UI component with no business logic
 * @returns {React.ReactElement} - AllSubscribers component
 */
export default function AllSubscribers(): React.ReactElement {
  // Initialize all hooks
  const subscriberManager = useSubscribers(mockData);
  const filterManager = useSubscriberFilters(subscriberManager.subscribers);
  const selectionManager = useSubscriberSelection();
  const paginationManager = usePagination(10);
  
  // Get all handlers
  const handlers = useSubscriberHandlers({
    subscriberManager,
    filterManager,
    selectionManager,
  });

  // Derived data
  const stats = calculateStats(subscriberManager.subscribers);
  const pagination = paginationManager.paginationState(filterManager.filteredSubscribers.length);
  const paginatedSubscribers = paginationManager.getPaginatedItems(filterManager.filteredSubscribers);

  // Fixed: Handle filter changes with pagination reset to avoid infinite loops
  const handleSearchChange = (value: string) => {
    filterManager.updateSearchTerm(value);
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  const handleStatusFilterChange = (value: string) => {
    filterManager.updateStatusFilter(value);
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  const handleSourceFilterChange = (value: string) => {
    filterManager.updateSourceFilter(value);
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  const handleClearFilters = () => {
    handlers.handleClearFilters();
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Subscribers</h1>
          <p className="text-muted-foreground">
            Manage your email subscribers and track their engagement
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlers.handleExportSubscribers}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handlers.setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently subscribed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <XCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Unsubscribed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Eye className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
            {filterManager.hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or tags..."
                  value={filterManager.filters.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterManager.filters.statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterManager.filters.sourceFilter} onValueChange={handleSourceFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Import">Import</SelectItem>
                <SelectItem value="API">API</SelectItem>
              </SelectContent>
            </Select>
            {selectionManager.selectedSubscribers.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectionManager.selectedSubscribers.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectionManager.selectedSubscribers.size} subscriber{selectionManager.selectedSubscribers.size > 1 ? 's' : ''}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlers.handleDeleteSelected}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Subscribers ({filterManager.filteredSubscribers.length} {filterManager.filteredSubscribers.length !== subscriberManager.subscribers.length && `of ${subscriberManager.subscribers.length}`})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriberTable
            subscribers={paginatedSubscribers}
            selectedSubscribers={selectionManager.selectedSubscribers}
            onToggleSelection={selectionManager.toggleSubscriberSelection}
            onToggleSelectAll={() => selectionManager.toggleSelectAll(paginatedSubscribers)}
            areAllSelected={selectionManager.areAllSelected(paginatedSubscribers)}
            hasActiveFilters={filterManager.hasActiveFilters}
            onEdit={handlers.handleEditSubscriber}
            onDelete={handlers.handleDeleteSubscriber}
            onCopyEmail={handlers.handleCopyEmail}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationControls
              pagination={pagination}
              onPreviousPage={paginationManager.previousPage}
              onNextPage={() => paginationManager.nextPage(pagination.totalPages)}
              onGoToPage={(page) => paginationManager.goToPage(page, pagination.totalPages)}
              getVisiblePages={() => paginationManager.getVisiblePages(pagination.totalPages)}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Subscriber Dialog */}
      <SubscriberForm
        open={handlers.showAddDialog}
        onOpenChange={handlers.setShowAddDialog}
        title="Add New Subscriber"
        description="Add a new subscriber to your email list manually."
        formData={handlers.formData}
        onFormDataChange={handlers.updateFormData}
        onSubmit={handlers.handleAddSubscriber}
        onCancel={() => {
          handlers.setShowAddDialog(false);
          handlers.resetForm();
        }}
        isLoading={subscriberManager.isLoading}
        submitText="Add Subscriber"
      />

      {/* Edit Subscriber Dialog */}
      <SubscriberForm
        open={handlers.showEditDialog}
        onOpenChange={handlers.setShowEditDialog}
        title="Edit Subscriber"
        description="Update subscriber information and preferences."
        formData={handlers.formData}
        onFormDataChange={handlers.updateFormData}
        onSubmit={handlers.handleUpdateSubscriber}
        onCancel={() => {
          handlers.setShowEditDialog(false);
          handlers.resetForm();
        }}
        isLoading={subscriberManager.isLoading}
        submitText="Update Subscriber"
      />
    </div>
  );
}
