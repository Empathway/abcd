export interface Subscriber {
    id: string;
    name: string;
    email: string;
    subscriptionDate: string;
    status: "Active" | "Inactive" | "Pending";
    source: "Website" | "Manual" | "Import" | "API";
    tags: string[];
    lastActivity: string;
}
  
export interface SubscriberFormData {
    name: string;
    email: string;
    status: Subscriber['status'];
    source: Subscriber['source'];
    tags: string[];
}
  
export interface FilterState {
    searchTerm: string;
    statusFilter: string;
    sourceFilter: string;
}
  
export interface SubscriberStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
}
  
export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
  