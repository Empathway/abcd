import { Subscriber, SubscriberStats } from '@/types/subscriber';

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
};

/**
 * Validates subscriber form data
 * @param {string} name - Subscriber name
 * @param {string} email - Subscriber email
 * @param {Subscriber[]} existingSubscribers - Array of existing subscribers
 * @param {string} excludeId - ID to exclude from duplicate check (for updates)
 * @returns {string | null} - Error message if validation fails, null if valid
 */
export const validateSubscriberData = (
  name: string,
  email: string,
  existingSubscribers: Subscriber[],
  excludeId?: string
): string | null => {
  try {
    if (!name.trim() || !email.trim()) {
      return "Name and Email are required.";
    }

    if (!validateEmail(email)) {
      return "Please enter a valid email address.";
    }

    const emailExists = existingSubscribers.some(
      s => s.email.toLowerCase() === email.toLowerCase() && s.id !== excludeId
    );

    if (emailExists) {
      return "A subscriber with this email already exists.";
    }

    return null;
  } catch (error) {
    console.error('Error validating subscriber data:', error);
    return "Validation error occurred.";
  }
};

/**
 * Generates CSV content from subscribers array
 * @param {Subscriber[]} subscribers - Array of subscribers to export
 * @returns {string} - CSV formatted string
 */
export const generateCsvContent = (subscribers: Subscriber[]): string => {
  try {
    const headers = ["Name", "Email", "Status", "Source", "Subscription Date", "Last Activity", "Tags"];
    const rows = subscribers.map(s => [
      s.name,
      s.email,
      s.status,
      s.source,
      s.subscriptionDate,
      s.lastActivity,
      s.tags.join("; ")
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
  } catch (error) {
    console.error('Error generating CSV content:', error);
    throw new Error('Failed to generate CSV content');
  }
};

/**
 * Downloads CSV file to user's device
 * @param {string} content - CSV content to download
 * @param {string} filename - Name of the file to download
 */
export const downloadCsvFile = (content: string, filename: string): void => {
  try {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV file:', error);
    throw new Error('Failed to download CSV file');
  }
};

/**
 * Calculates statistics from subscribers array
 * @param {Subscriber[]} subscribers - Array of subscribers to analyze
 * @returns {SubscriberStats} - Statistics object
 */
export const calculateStats = (subscribers: Subscriber[]): SubscriberStats => {
  try {
    return subscribers.reduce((stats, subscriber) => {
      stats.total++;
      switch (subscriber.status) {
        case 'Active':
          stats.active++;
          break;
        case 'Inactive':
          stats.inactive++;
          break;
        case 'Pending':
          stats.pending++;
          break;
      }
      return stats;
    }, { total: 0, active: 0, inactive: 0, pending: 0 });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return { total: 0, active: 0, inactive: 0, pending: 0 };
  }
};

/**
 * Gets CSS class for status badge
 * @param {string} status - Subscriber status
 * @returns {string} - CSS class string
 */
export const getStatusBadgeClass = (status: string): string => {
  const variants = {
    Active: "bg-green-100 text-green-800 hover:bg-green-200",
    Inactive: "bg-red-100 text-red-800 hover:bg-red-200",
    Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  };
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

/**
 * Gets CSS class for source badge
 * @param {string} source - Subscriber source
 * @returns {string} - CSS class string
 */
export const getSourceBadgeClass = (source: string): string => {
  const variants = {
    Website: "bg-blue-100 text-blue-800",
    Manual: "bg-purple-100 text-purple-800",
    Import: "bg-orange-100 text-orange-800",
    API: "bg-cyan-100 text-cyan-800",
  };
  return variants[source as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

/**
 * Generates current date in YYYY-MM-DD format
 * @returns {string} - Current date string
 */
export const getCurrentDate = (): string => {
  try {
    return new Date().toISOString().split("T")[0];
  } catch (error) {
    console.error('Error getting current date:', error);
    return '';
  }
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>} - Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy to clipboard');
  }
};
