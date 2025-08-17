import { useState } from 'react';
import { toast } from 'sonner';
import { Subscriber, SubscriberFormData } from '@/types/subscriber';
import { 
  generateCsvContent, 
  downloadCsvFile, 
  getCurrentDate, 
  copyToClipboard 
} from '@/lib/utils/subscriber-utils';

/**
 * Custom hook for all subscriber-related handlers
 * @param {Object} managers - Object containing all manager hooks
 * @returns {Object} - Object containing all handler functions and form state
 */
export const useSubscriberHandlers = (managers: {
  subscriberManager: any;
  filterManager: any;
  selectionManager: any;
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [formData, setFormData] = useState<SubscriberFormData>({
    name: "",
    email: "",
    status: "Active",
    source: "Manual",
    tags: []
  });

  /**
   * Updates form data with partial updates
   * @param {Partial<SubscriberFormData>} updates - Partial form data to update
   */
  const updateFormData = (updates: Partial<SubscriberFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      status: "Active",
      source: "Manual",
      tags: []
    });
  };

  /**
   * Handles adding a new subscriber
   */
  const handleAddSubscriber = async () => {
    try {
      const success = await managers.subscriberManager.addSubscriber(formData);
      if (success) {
        setShowAddDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    }
  };

  /**
   * Handles editing a subscriber
   * @param {Subscriber} subscriber - Subscriber to edit
   */
  const handleEditSubscriber = (subscriber: Subscriber) => {
    try {
      setEditingSubscriber(subscriber);
      setFormData({
        name: subscriber.name,
        email: subscriber.email,
        status: subscriber.status,
        source: subscriber.source,
        tags: subscriber.tags,
      });
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error preparing subscriber for edit:', error);
      toast.error('Failed to prepare subscriber for editing');
    }
  };

  /**
   * Handles updating a subscriber
   */
  const handleUpdateSubscriber = async () => {
    try {
      if (!editingSubscriber) return;

      const success = await managers.subscriberManager.updateSubscriber(editingSubscriber.id, formData);
      if (success) {
        setShowEditDialog(false);
        setEditingSubscriber(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
    }
  };

  /**
   * Handles deleting a single subscriber
   * @param {string} id - ID of subscriber to delete
   */
  const handleDeleteSubscriber = async (id: string) => {
    try {
      await managers.subscriberManager.deleteSubscriber(id);
      managers.selectionManager.clearSelection();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  /**
   * Handles deleting multiple selected subscribers
   */
  const handleDeleteSelected = async () => {
    try {
      await managers.subscriberManager.deleteMultipleSubscribers(managers.selectionManager.selectedSubscribers);
      managers.selectionManager.clearSelection();
    } catch (error) {
      console.error('Error deleting selected subscribers:', error);
    }
  };

  /**
   * Handles exporting subscribers to CSV
   */
  const handleExportSubscribers = async () => {
    try {
      if (managers.filterManager.filteredSubscribers.length === 0) {
        toast.error("No subscribers to export.");
        return;
      }

      const csvContent = generateCsvContent(managers.filterManager.filteredSubscribers);
      const filename = `subscribers-${getCurrentDate()}.csv`;
      
      downloadCsvFile(csvContent, filename);
      toast.success(`${managers.filterManager.filteredSubscribers.length} subscribers exported successfully`);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      toast.error('Failed to export subscribers');
    }
  };

  /**
   * Handles copying email to clipboard
   * @param {string} email - Email to copy
   */
  const handleCopyEmail = async (email: string) => {
    try {
      await copyToClipboard(email);
      toast.success('Email copied to clipboard');
    } catch (error) {
      console.error('Error copying email:', error);
      toast.error('Failed to copy email');
    }
  };

  /**
   * Handles clearing all filters
   */
  const handleClearFilters = () => {
    try {
      managers.filterManager.clearFilters();
      toast.success("Filters cleared");
    } catch (error) {
      console.error('Error clearing filters:', error);
      toast.error('Failed to clear filters');
    }
  };

  return {
    // State
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    editingSubscriber,
    formData,
    
    // Handlers
    updateFormData,
    resetForm,
    handleAddSubscriber,
    handleEditSubscriber,
    handleUpdateSubscriber,
    handleDeleteSubscriber,
    handleDeleteSelected,
    handleExportSubscribers,
    handleCopyEmail,
    handleClearFilters,
  };
};
