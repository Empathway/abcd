import { Campaign, CampaignStats, CampaignFilters } from '@/types/campaign';
import { Subscriber } from '@/types/subscriber';

/**
 * Validates campaign form data
 * @param {string} name - Campaign name
 * @param {string} subject - Email subject
 * @param {string} content - Email content
 * @param {Campaign[]} existingCampaigns - Array of existing campaigns
 * @param {string} excludeId - ID to exclude from duplicate check (for updates)
 * @returns {string | null} - Error message if validation fails, null if valid
 */
export const validateCampaignData = (
  name: string,
  subject: string,
  content: string,
  existingCampaigns: Campaign[],
  excludeId?: string
): string | null => {
  try {
    if (!name.trim()) {
      return "Campaign name is required.";
    }

    if (!subject.trim()) {
      return "Email subject is required.";
    }

    if (!content.trim()) {
      return "Email content is required.";
    }

    const nameExists = existingCampaigns.some(
      c => c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
    );

    if (nameExists) {
      return "A campaign with this name already exists.";
    }

    return null;
  } catch (error) {
    console.error('Error validating campaign data:', error);
    return "Validation error occurred.";
  }
};

/**
 * Calculates statistics from campaigns array
 * @param {Campaign[]} campaigns - Array of campaigns to analyze
 * @returns {CampaignStats} - Statistics object
 */
export const calculateCampaignStats = (campaigns: Campaign[]): CampaignStats => {
  try {
    const stats = campaigns.reduce((acc, campaign) => {
      acc.total++;
      acc.totalRecipients += campaign.totalRecipients;
      
      switch (campaign.status) {
        case 'Draft':
          acc.draft++;
          break;
        case 'Scheduled':
          acc.scheduled++;
          break;
        case 'Sent':
          acc.sent++;
          break;
        case 'Failed':
          acc.failed++;
          break;
      }
      
      return acc;
    }, { 
      total: 0, 
      draft: 0, 
      scheduled: 0, 
      sent: 0, 
      failed: 0, 
      totalRecipients: 0,
      avgOpenRate: 0,
      avgClickRate: 0
    });

    // Calculate average rates
    const sentCampaigns = campaigns.filter(c => c.status === 'Sent' && c.sentCount > 0);
    if (sentCampaigns.length > 0) {
      const totalOpenRate = sentCampaigns.reduce((sum, c) => sum + (c.openCount / c.sentCount * 100), 0);
      const totalClickRate = sentCampaigns.reduce((sum, c) => sum + (c.clickCount / c.sentCount * 100), 0);
      
      stats.avgOpenRate = totalOpenRate / sentCampaigns.length;
      stats.avgClickRate = totalClickRate / sentCampaigns.length;
    }

    return stats;
  } catch (error) {
    console.error('Error calculating campaign stats:', error);
    return { 
      total: 0, 
      draft: 0, 
      scheduled: 0, 
      sent: 0, 
      failed: 0, 
      totalRecipients: 0,
      avgOpenRate: 0,
      avgClickRate: 0
    };
  }
};

/**
 * Filters subscribers based on campaign criteria
 * @param {Subscriber[]} subscribers - Array of all subscribers
 * @param {CampaignFilters} filters - Campaign recipient filters
 * @returns {Subscriber[]} - Filtered subscribers array
 */
export const getFilteredRecipients = (
  subscribers: Subscriber[], 
  filters: CampaignFilters
): Subscriber[] => {
  try {
    let filtered = [...subscribers];

    // Filter by status
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(s => filters.statuses.includes(s.status));
    }

    // Filter by source
    if (filters.sources.length > 0) {
      filtered = filtered.filter(s => filters.sources.includes(s.source));
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(s => 
        s.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(s => {
        const subDate = new Date(s.subscriptionDate);
        return subDate >= startDate && subDate <= endDate;
      });
    }

    return filtered;
  } catch (error) {
    console.error('Error filtering recipients:', error);
    return subscribers;
  }
};

/**
 * Gets CSS class for campaign status badge
 * @param {string} status - Campaign status
 * @returns {string} - CSS class string
 */
export const getCampaignStatusBadgeClass = (status: string): string => {
  const variants = {
    Draft: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    Scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Sending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Sent: "bg-green-100 text-green-800 hover:bg-green-200",
    Paused: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    Failed: "bg-red-100 text-red-800 hover:bg-red-200",
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

/**
 * Formats campaign metrics for display
 * @param {number} numerator - Numerator value
 * @param {number} denominator - Denominator value
 * @returns {string} - Formatted percentage string
 */
export const formatRate = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0%';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
};

/**
 * Generates campaign CSV export content
 * @param {Campaign[]} campaigns - Array of campaigns to export
 * @returns {string} - CSV formatted string
 */
export const generateCampaignCsvContent = (campaigns: Campaign[]): string => {
  try {
    const headers = [
      "Name", "Subject", "Status", "Created Date", "Sent Date", 
      "Recipients", "Sent", "Opens", "Clicks", "Open Rate", "Click Rate"
    ];
    
    const rows = campaigns.map(c => [
      c.name,
      c.subject,
      c.status,
      c.createdDate,
      c.sentDate || '',
      c.totalRecipients.toString(),
      c.sentCount.toString(),
      c.openCount.toString(),
      c.clickCount.toString(),
      formatRate(c.openCount, c.sentCount),
      formatRate(c.clickCount, c.sentCount)
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
  } catch (error) {
    console.error('Error generating campaign CSV content:', error);
    throw new Error('Failed to generate CSV content');
  }
};
