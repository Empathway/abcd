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
import { Switch } from "@/components/ui/switch";
import { FileText, Settings, Eye, Calendar } from "lucide-react";
import { BlogFormData } from '@/types/blog';

interface BlogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: BlogFormData;
  onFormDataChange: (updates: Partial<BlogFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText: string;
}

/**
 * Comprehensive form component for creating/editing blog posts
 * @param {BlogFormProps} props - Component props
 * @returns {React.ReactElement} - BlogForm component
 */
export const BlogForm: React.FC<BlogFormProps> = ({
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
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const availableCategories = [
    'Technology', 'Business', 'Design', 'Marketing', 'Programming', 
    'Tutorial', 'News', 'Opinion', 'Review', 'Guide'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Publish
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="post-title">Title *</Label>
                <Input
                  id="post-title"
                  value={formData.title}
                  onChange={(e) => onFormDataChange({ title: e.target.value })}
                  placeholder="Enter your blog post title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="post-excerpt">Excerpt *</Label>
                <Textarea
                  id="post-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => onFormDataChange({ excerpt: e.target.value })}
                  placeholder="Write a brief summary of your post (50+ characters)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length}/50 characters minimum
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="post-content">Content *</Label>
                <Textarea
                  id="post-content"
                  value={formData.content}
                  onChange={(e) => onFormDataChange({ content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={15}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => onFormDataChange({ featuredImage: e.target.value || undefined })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...formData.categories, category]
                            : formData.categories.filter(c => c !== category);
                          onFormDataChange({ categories: newCategories });
                        }}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="post-tags">Tags</Label>
                <Input
                  id="post-tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => onFormDataChange({ 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Private Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Only you can see this post
                  </p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => onFormDataChange({ isPrivate: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Featured Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight this post on your blog
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => onFormDataChange({ isFeatured: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input
                  id="seo-title"
                  value={formData.seoTitle || ''}
                  onChange={(e) => onFormDataChange({ seoTitle: e.target.value || undefined })}
                  placeholder="Custom title for search engines"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the main title. Recommended: 50-60 characters.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={formData.metaDescription || ''}
                  onChange={(e) => onFormDataChange({ metaDescription: e.target.value || undefined })}
                  placeholder="Brief description for search engine results"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-160 characters. Leave empty to use excerpt.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="publish" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="post-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => onFormDataChange({ status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'Scheduled' && (
                <div className="grid gap-2">
                  <Label htmlFor="scheduled-date">Scheduled Publish Date</Label>
                  <Input
                    id="scheduled-date"
                    type="datetime-local"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => onFormDataChange({ scheduledDate: e.target.value || undefined })}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
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
