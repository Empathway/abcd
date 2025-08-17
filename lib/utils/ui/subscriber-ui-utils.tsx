import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

/**
 * Gets status icon based on status
 * @param {string} status - Subscriber status
 * @returns {React.ReactElement | null} - Status icon component
 */
export const getStatusIcon = (status: string): React.ReactElement | null => {
  switch (status) {
    case "Active":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "Inactive":
      return <XCircle className="w-4 h-4 text-red-600" />;
    case "Pending":
      return <Eye className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
};
