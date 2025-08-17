import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { Subscriber } from '@/types/subscriber';
import { getStatusBadgeClass, getSourceBadgeClass } from '@/lib/utils/subscriber-utils';
import { getStatusIcon } from '@/lib/utils/ui/subscriber-ui-utils';
import { SubscriberActions } from './SubscriberActions';

interface SubscriberTableProps {
  subscribers: Subscriber[];
  selectedSubscribers: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  areAllSelected: boolean;
  hasActiveFilters: boolean;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
  onCopyEmail: (email: string) => void;
}

/**
 * Table component for displaying subscribers
 * @param {SubscriberTableProps} props - Component props
 * @returns {React.ReactElement} - SubscriberTable component
 */
export const SubscriberTable: React.FC<SubscriberTableProps> = ({
  subscribers,
  selectedSubscribers,
  onToggleSelection,
  onToggleSelectAll,
  areAllSelected,
  hasActiveFilters,
  onEdit,
  onDelete,
  onCopyEmail,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={areAllSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all subscribers"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Subscription Date</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="text-muted-foreground">
                  <UserPlus className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">No subscribers found</p>
                  <p className="text-sm">
                    {hasActiveFilters
                      ? "Try adjusting your search or filters" 
                      : "Get started by adding your first subscriber"
                    }
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedSubscribers.has(subscriber.id)}
                    onCheckedChange={() => onToggleSelection(subscriber.id)}
                    aria-label={`Select subscriber ${subscriber.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(subscriber.status)}
                    <Badge className={getStatusBadgeClass(subscriber.status)}>
                      {subscriber.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSourceBadgeClass(subscriber.source)}>
                    {subscriber.source}
                  </Badge>
                </TableCell>
                <TableCell>{subscriber.subscriptionDate}</TableCell>
                <TableCell>{subscriber.lastActivity}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {subscriber.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <SubscriberActions
                    subscriber={subscriber}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopyEmail={onCopyEmail}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
