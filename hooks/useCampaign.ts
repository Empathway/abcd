import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Campaign, CampaignFormData } from '@/types/campaign';
import { validateCampaignData } from '@/lib/utils/campaign-utils';

//I know, please dont tell me about it. I'll fix it later.
import { getCurrentDate } from '@/lib/utils/subscriber-utils';

/**
 * Custom hook for managing campaigns CRUD operations
 * @param {Campaign[]} initialData - Initial array of campaigns
 * @returns {object} - Object containing campaigns state and management functions
 */
export const useCampaigns = (initialData: Campaign[]) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new campaign
   * @param {CampaignFormData} formData - Form data for new campaign
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const createCampaign = useCallback(async (formData: CampaignFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateCampaignData(
        formData.name,
        formData.subject,
        formData.content,
        campaigns
      );

      if (validationError) {
        throw new Error(validationError);
      }

      const newCampaign: Campaign = {
        id: (campaigns.length + 1).toString(),
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        content: formData.content,
        templateId: formData.templateId,
        status: formData.scheduledDate ? "Scheduled" : "Draft",
        createdDate: getCurrentDate(),
        scheduledDate: formData.scheduledDate,
        totalRecipients: 0, // Will be calculated based on filters
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
        recipientFilters: formData.recipientFilters,
        createdBy: "Current User", // Replace with actual user
        tags: formData.tags,
      };

      setCampaigns(prev => [...prev, newCampaign]);
      toast.success("Campaign created successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  /**
   * Updates an existing campaign
   * @param {string} id - ID of campaign to update
   * @param {CampaignFormData} formData - Updated form data
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const updateCampaign = useCallback(async (id: string, formData: CampaignFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateCampaignData(
        formData.name,
        formData.subject,
        formData.content,
        campaigns,
        id
      );

      if (validationError) {
        throw new Error(validationError);
      }

      setCampaigns(prev => prev.map(campaign =>
        campaign.id === id
          ? {
              ...campaign,
              name: formData.name.trim(),
              subject: formData.subject.trim(),
              content: formData.content,
              templateId: formData.templateId,
              scheduledDate: formData.scheduledDate,
              recipientFilters: formData.recipientFilters,
              tags: formData.tags,
              status: formData.scheduledDate ? "Scheduled" : "Draft",
            }
          : campaign
      ));

      toast.success("Campaign updated successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  /**
   * Duplicates an existing campaign
   * @param {string} id - ID of campaign to duplicate
   * @returns {Promise<void>} - Promise that resolves when duplication is complete
   */
  const duplicateCampaign = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const campaign = campaigns.find(c => c.id === id);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const duplicatedCampaign: Campaign = {
        ...campaign,
        id: (campaigns.length + 1).toString(),
        name: `${campaign.name} (Copy)`,
        status: "Draft",
        createdDate: getCurrentDate(),
        scheduledDate: undefined,
        sentDate: undefined,
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
      };

      setCampaigns(prev => [...prev, duplicatedCampaign]);
      toast.success("Campaign duplicated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate campaign';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

  /**
   * Sends a campaign immediately
   * @param {string} id - ID of campaign to send
   * @returns {Promise<void>} - Promise that resolves when sending starts
   */
  const sendCampaign = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setCampaigns(prev => prev.map(campaign =>
        campaign.id === id
          ? {
              ...campaign,
              status: "Sending" as const,
              sentDate: getCurrentDate(),
            }
          : campaign
      ));

      // Simulate sending process
      setTimeout(() => {
        setCampaigns(prev => prev.map(campaign =>
          campaign.id === id
            ? {
                ...campaign,
                status: "Sent" as const,
                sentCount: campaign.totalRecipients,
              }
            : campaign
        ));
        toast.success("Campaign sent successfully");
      }, 2000);

      toast.success("Campaign sending started");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send campaign';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a campaign
   * @param {string} id - ID of campaign to delete
   * @returns {Promise<void>} - Promise that resolves when deletion is complete
   */
  const deleteCampaign = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast.success("Campaign deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete campaign';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    duplicateCampaign,
    sendCampaign,
    deleteCampaign,
  };
};
