export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId?: string;
  status: "Draft" | "Scheduled" | "Sending" | "Sent" | "Paused" | "Failed";
  createdDate: string;
  scheduledDate?: string;
  sentDate?: string;
  totalRecipients: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  recipientFilters: CampaignFilters;
  createdBy: string;
  tags: string[];
}

export interface CampaignFilters {
  statuses: string[];
  sources: string[];
  tags: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
  templateId?: string;
  scheduledDate?: string;
  recipientFilters: CampaignFilters;
  tags: string[];
}

export interface CampaignStats {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
  failed: number;
  totalRecipients: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  thumbnail?: string;
  createdDate: string;
  lastModified: string;
  isDefault: boolean;
}
