import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Subscriber, SubscriberFormData } from '@/types/subscriber';
import { validateSubscriberData, getCurrentDate } from '@/lib/utils/subscriber-utils';

/**
 * Custom hook for managing subscribers CRUD operations
 * @param {Subscriber[]} initialData - Initial array of subscribers
 * @returns {object} - Object containing subscribers state and management functions
 */
export const useSubscribers = (initialData: Subscriber[]) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Adds a new subscriber
   * @param {SubscriberFormData} formData - Form data for new subscriber
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const addSubscriber = useCallback(async (formData: SubscriberFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateSubscriberData(
        formData.name,
        formData.email,
        subscribers
      );

      if (validationError) {
        throw new Error(validationError);
      }

      const newSubscriber: Subscriber = {
        id: (subscribers.length + 1).toString(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        subscriptionDate: getCurrentDate(),
        status: formData.status,
        source: formData.source,
        tags: formData.tags,
        lastActivity: getCurrentDate(),
      };

      setSubscribers(prev => [...prev, newSubscriber]);
      toast.success("Subscriber added successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add subscriber';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscribers]);

  /**
   * Updates an existing subscriber
   * @param {string} id - ID of subscriber to update
   * @param {SubscriberFormData} formData - Updated form data
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  const updateSubscriber = useCallback(async (id: string, formData: SubscriberFormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const validationError = validateSubscriberData(
        formData.name,
        formData.email,
        subscribers,
        id
      );

      if (validationError) {
        throw new Error(validationError);
      }

      setSubscribers(prev => prev.map(subscriber =>
        subscriber.id === id
          ? {
              ...subscriber,
              name: formData.name.trim(),
              email: formData.email.toLowerCase().trim(),
              status: formData.status,
              source: formData.source,
              tags: formData.tags,
            }
          : subscriber
      ));

      toast.success("Subscriber updated successfully");
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subscriber';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscribers]);

  /**
   * Deletes a single subscriber
   * @param {string} id - ID of subscriber to delete
   * @returns {Promise<void>} - Promise that resolves when deletion is complete
   */
  const deleteSubscriber = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast.success("Subscriber deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subscriber';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes multiple subscribers
   * @param {Set<string>} ids - Set of subscriber IDs to delete
   * @returns {Promise<void>} - Promise that resolves when deletion is complete
   */
  const deleteMultipleSubscribers = useCallback(async (ids: Set<string>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (ids.size === 0) {
        throw new Error("No subscribers selected.");
      }

      const count = ids.size;
      setSubscribers(prev => prev.filter(s => !ids.has(s.id)));
      toast.success(`${count} subscriber${count > 1 ? 's' : ''} deleted successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subscribers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    subscribers,
    isLoading,
    error,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    deleteMultipleSubscribers,
  };
};
