import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Mail } from "lucide-react";
import { CampaignFormData, CampaignFilters } from '@/types/campaign';
import { Subscriber } from '@/types/subscriber';

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: CampaignFormData;
  onFormDataChange: (updates: Partial<CampaignFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText: string;
  subscribers: Subscriber[];
}

/**
 * Comprehensive form component for creating/editing campaigns
 * @param {CampaignFormProps} props - Component props
 * @returns {React.ReactElement} - CampaignForm component
 */
export const CampaignForm: React.FC<CampaignFormProps> = ({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText,
  subscribers,
}) => {
  const [activeTab, setActiveTab] = useState('details');

  const availableStatuses = ['Active', 'Inactive', 'Pending'];
  const availableSources = ['Website', 'Manual', 'Import', 'API'];
  const availableTags = Array.from(
    new Set(subscribers.flatMap(s => s.tags))
  ).sort();

  const updateFilters = (updates: Partial<CampaignFilters>) => {
    onFormDataChange({
      recipientFilters: { ...formData.recipientFilters, ...updates }
    });
  };

  // Calculate recipient count based on current filters
  const filteredRecipients = subscribers.filter(subscriber => {
    const { recipientFilters } = formData;
    
    if (recipientFilters.statuses.length > 0 && !recipientFilters.statuses.includes(subscriber.status)) {
      return false;
    }
    
    if (recipientFilters.sources.length > 0 && !recipientFilters.sources.includes(subscriber.source)) {
      return false;
    }
    
    if (recipientFilters.tags.length > 0 && !subscriber.tags.some(tag => recipientFilters.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="recipients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recipients ({filteredRecipients.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ name: e.target.value })}
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email-subject">Email Subject *</Label>
                <Input
                  id="email-subject"
                  value={formData.subject}
                  onChange={(e) => onFormDataChange({ subject: e.target.value })}
                  placeholder="Enter email subject line"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email-content">Email Content *</Label>
                <Textarea
                  id="email-content"
                  value={formData.content}
                  onChange={(e) => onFormDataChange({ content: e.target.value })}
                  placeholder="Write your email content here..."
                  rows={10}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="campaign-tags">Tags</Label>
                <Input
                  id="campaign-tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => onFormDataChange({ 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4 mt-6">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {filteredRecipients.length} recipients selected
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Use the filters below to select which subscribers will receive this campaign.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Filter by Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={formData.recipientFilters.statuses.includes(status)}
                          onCheckedChange={(checked) => {
                            const newStatuses = checked
                              ? [...formData.recipientFilters.statuses, status]
                              : formData.recipientFilters.statuses.filter(s => s !== status);
                            updateFilters({ statuses: newStatuses });
                          }}
                        />
                        <Label htmlFor={`status-${status}`}>{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Filter by Source</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSources.map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${source}`}
                          checked={formData.recipientFilters.sources.includes(source)}
                          onCheckedChange={(checked) => {
                            const newSources = checked
                              ? [...formData.recipientFilters.sources, source]
                              : formData.recipientFilters.sources.filter(s => s !== source);
                            updateFilters({ sources: newSources });
                          }}
                        />
                        <Label htmlFor={`source-${source}`}>{source}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Filter by Tags</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={formData.recipientFilters.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            const newTags = checked
                              ? [...formData.recipientFilters.tags, tag]
                              : formData.recipientFilters.tags.filter(t => t !== tag);
                            updateFilters({ tags: newTags });
                          }}
                        />
                        <Badge variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Scheduling Options</span>
                </div>
                <p className="text-sm text-green-700">
                  Choose when to send your campaign. Leave empty to save as draft.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="scheduled-date">Scheduled Send Date (Optional)</Label>
                <Input
                  id="scheduled-date"
                  type="datetime-local"
                  value={formData.scheduledDate || ''}
                  onChange={(e) => onFormDataChange({ scheduledDate: e.target.value || undefined })}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground">
                  If no date is selected, the campaign will be saved as a draft.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
