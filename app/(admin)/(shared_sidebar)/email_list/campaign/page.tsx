"use client";

import React, { useState } from "react";
import { 
  Search,
  Plus,
  Download,
  Send,
  Calendar,
  Users,
  Mail,
  TrendingUp,
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
import { Campaign, CampaignFormData } from '@/types/campaign';
import { Subscriber } from '@/types/subscriber';

// Hooks
import { useCampaigns } from '@/hooks/useCampaign';
import { useCampaignFilters } from '@/hooks/useCampaignFilters';
import { usePagination } from '@/hooks/usePagination';
import { useSubscribers } from '@/hooks/useSubscribers';

// Utils
import { 
  calculateCampaignStats,
  generateCampaignCsvContent,
} from '@/lib/utils/campaign-utils';

//Yes, I know; I dont want to hear about it. I'll fix it later ffs.
import { 
    getCurrentDate,
    downloadCsvFile 
} from '@/lib/utils/subscriber-utils';

import { toast } from 'sonner';

// Components
import { CampaignTable } from '@/components/campaign/CampaignTable';
import { CampaignForm } from '@/components/campaign/CampaignForm';

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series - Week 1",
    subject: "Welcome to our newsletter!",
    content: "Thank you for subscribing to our newsletter...",
    status: "Sent",
    createdDate: "2025-08-01",
    sentDate: "2025-08-01",
    totalRecipients: 1250,
    sentCount: 1250,
    openCount: 425,
    clickCount: 85,
    bounceCount: 12,
    unsubscribeCount: 3,
    recipientFilters: {
      statuses: ["Active"],
      sources: ["Website"],
      tags: ["Newsletter"]
    },
    createdBy: "John Doe",
    tags: ["Welcome", "Newsletter"]
  },
  {
    id: "2",
    name: "Product Update - August 2025",
    subject: "Exciting new features just launched!",
    content: "We're thrilled to announce our latest product updates...",
    status: "Draft",
    createdDate: "2025-08-10",
    totalRecipients: 2100,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    unsubscribeCount: 0,
    recipientFilters: {
      statuses: ["Active"],
      sources: [],
      tags: ["Newsletter", "Premium"]
    },
    createdBy: "Jane Smith",
    tags: ["Product", "Update"]
  },
  {
    id: "3",
    name: "Summer Sale 2025",
    subject: "50% off everything - Limited time!",
    content: "Don't miss out on our biggest sale of the year...",
    status: "Scheduled",
    createdDate: "2025-08-05",
    scheduledDate: "2025-08-20T10:00",
    totalRecipients: 5200,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    bounceCount: 0,
    unsubscribeCount: 0,
    recipientFilters: {
      statuses: ["Active"],
      sources: ["Website", "Manual"],
      tags: ["Marketing"]
    },
    createdBy: "Marketing Team",
    tags: ["Sale", "Marketing"]
  }
];

// Mock subscriber data (reusing from previous component)
const mockSubscribers: Subscriber[] = [
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
  // ... add more mock subscribers as needed
];

/**
 * Main component for managing email campaigns
 * @returns {React.ReactElement} - SendCampaign component
 */
export default function SendCampaign(): React.ReactElement {
  // Initialize hooks
  const campaignManager = useCampaigns(mockCampaigns);
  const subscriberManager = useSubscribers(mockSubscribers);
  const filterManager = useCampaignFilters(campaignManager.campaigns);
  const paginationManager = usePagination(10);

  // Local state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    subject: "",
    content: "",
    recipientFilters: {
      statuses: [],
      sources: [],
      tags: []
    },
    tags: []
  });

  // Derived data
  const stats = calculateCampaignStats(campaignManager.campaigns);
  const pagination = paginationManager.paginationState(filterManager.filteredCampaigns.length);
  const paginatedCampaigns = paginationManager.getPaginatedItems(filterManager.filteredCampaigns);

  // Handler functions
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

  const handleDateFilterChange = (value: string) => {
    filterManager.updateDateFilter(value);
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  const handleClearFilters = () => {
    filterManager.clearFilters();
    if (pagination.currentPage !== 1) {
      paginationManager.resetPagination();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      content: "",
      recipientFilters: {
        statuses: [],
        sources: [],
        tags: []
      },
      tags: []
    });
  };

  const handleCreateCampaign = async () => {
    const success = await campaignManager.createCampaign(formData);
    if (success) {
      setShowCreateDialog(false);
      resetForm();
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      templateId: campaign.templateId,
      scheduledDate: campaign.scheduledDate,
      recipientFilters: campaign.recipientFilters,
      tags: campaign.tags
    });
    setShowEditDialog(true);
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaign) return;
    
    const success = await campaignManager.updateCampaign(editingCampaign.id, formData);
    if (success) {
      setShowEditDialog(false);
      setEditingCampaign(null);
      resetForm();
    }
  };

  const handleExportCampaigns = () => {
    try {
      if (filterManager.filteredCampaigns.length === 0) {
        toast.error("No campaigns to export.");
        return;
      }

      const csvContent = generateCampaignCsvContent(filterManager.filteredCampaigns);
      const filename = `campaigns-${getCurrentDate()}.csv`;
      
      downloadCsvFile(csvContent, filename);
      toast.success(`${filterManager.filteredCampaigns.length} campaigns exported successfully`);
    } catch (error) {
      console.error('Error exporting campaigns:', error);
      toast.error('Failed to export campaigns');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your email marketing campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCampaigns}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Send className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Campaigns</CardTitle>
            <Mail className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            <p className="text-xs text-muted-foreground">Successfully sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Email opens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Emails sent</p>
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
                  placeholder="Search campaigns by name, subject, or tags..."
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Sending">Sending</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterManager.filters.dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Dates</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Campaigns ({filterManager.filteredCampaigns.length} {filterManager.filteredCampaigns.length !== campaignManager.campaigns.length && `of ${campaignManager.campaigns.length}`})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignTable
            campaigns={paginatedCampaigns}
            onEdit={handleEditCampaign}
            onDuplicate={campaignManager.duplicateCampaign}
            onSend={campaignManager.sendCampaign}
            onDelete={campaignManager.deleteCampaign}
            onPreview={(campaign) => {
              // Handle preview - could open a modal with email preview
              console.log('Preview campaign:', campaign);
            }}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginationManager.previousPage()}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {paginationManager.getVisiblePages(pagination.totalPages).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pagination.currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8"
                      onClick={() => paginationManager.goToPage(pageNum, pagination.totalPages)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginationManager.nextPage(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <CampaignForm
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Campaign"
        description="Create a new email campaign to engage with your subscribers."
        formData={formData}
        onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        onSubmit={handleCreateCampaign}
        onCancel={() => {
          setShowCreateDialog(false);
          resetForm();
        }}
        isLoading={campaignManager.isLoading}
        submitText="Create Campaign"
        subscribers={subscriberManager.subscribers}
      />

      {/* Edit Campaign Dialog */}
      <CampaignForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Campaign"
        description="Update your campaign details and settings."
        formData={formData}
        onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        onSubmit={handleUpdateCampaign}
        onCancel={() => {
          setShowEditDialog(false);
          setEditingCampaign(null);
          resetForm();
        }}
        isLoading={campaignManager.isLoading}
        submitText="Update Campaign"
        subscribers={subscriberManager.subscribers}
      />
    </div>
  );
}
