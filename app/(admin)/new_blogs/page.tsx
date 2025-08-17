"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Image,
  Video,
  Link,
  Save,
  Eye,
  ArrowLeft,
  Calendar as CalendarIcon,
  Upload,
  FileText,
  Hash,
  Type,
  Palette,
  Plus,
  Minus,
  Undo2,
  Redo2,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  FileImage,
  Globe,
  Tag,
  Users,
  BarChart3,
  Clock,
  Star,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  MoreHorizontal,
  Maximize2,
  Copy,
  Trash2,
  Edit3,
  Database,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface BlogEditorProps {
  isEditing?: boolean;
  postId?: string;
}

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  featuredImage: string;
  socialImage: string;
  socialTitle: string;
  socialDescription: string;
  status: string;
  visibility: string;
  password?: string;
  categories: string[];
  tags: string[];
  authorId: string;
  commentsEnabled: boolean;
  publishAt?: Date;
  expiresAt?: Date;
  allowPingbacks: boolean;
  customFields: Record<string, any>;
}

interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'code' | 'list' | 'table' | 'embed' | 'cta' | 'separator';
  content: any;
  styles?: Record<string, any>;
}

interface EditorState {
  selectedTool: string | null;
  currentBlock: string | null;
  showPreview: boolean;
  sidebarCollapsed: boolean;
  wordCount: number;
  readTime: number;
  lastSaved?: Date;
  isDirty: boolean;
}

export default function AdvancedBlogEditor({ isEditing = false, postId }: BlogEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Fix hydration error by managing client-side URL
  const [mounted, setMounted] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    featuredImage: "",
    socialImage: "",
    socialTitle: "",
    socialDescription: "",
    status: "draft",
    visibility: "public",
    categories: [],
    tags: [],
    authorId: "",
    commentsEnabled: true,
    publishAt: undefined,
    expiresAt: undefined,
    allowPingbacks: true,
    customFields: {}
  });

  const [editorState, setEditorState] = useState<EditorState>({
    selectedTool: null,
    currentBlock: null,
    showPreview: false,
    sidebarCollapsed: false,
    wordCount: 0,
    readTime: 0,
    isDirty: false
  });

  const [newTag, setNewTag] = useState("");
  const [showSEOPanel, setShowSEOPanel] = useState(false);
  const [showSocialPanel, setShowSocialPanel] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  // Handle hydration and get current URL
  useEffect(() => {
    setMounted(true);
    setCurrentOrigin(window.location.origin);
  }, []);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (editorState.isDirty) {
      handleSaveDraft();
      setEditorState(prev => ({ ...prev, lastSaved: new Date(), isDirty: false }));
    }
  }, [editorState.isDirty]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [autoSave]);

  // Word count and read time calculation
  useEffect(() => {
    const text = formData.content.replace(/<[^>]*>/g, ''); // Strip HTML
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed

    setEditorState(prev => ({ ...prev, wordCount, readTime }));
  }, [formData.content]);

  const formatTools = [
    { icon: Bold, name: "bold", tooltip: "Bold (Ctrl+B)", shortcut: "Ctrl+B" },
    { icon: Italic, name: "italic", tooltip: "Italic (Ctrl+I)", shortcut: "Ctrl+I" },
    { icon: Underline, name: "underline", tooltip: "Underline (Ctrl+U)", shortcut: "Ctrl+U" },
    { icon: Strikethrough, name: "strikethrough", tooltip: "Strikethrough", shortcut: "" },
  ];

  const alignmentTools = [
    { icon: AlignLeft, name: "align-left", tooltip: "Align Left" },
    { icon: AlignCenter, name: "align-center", tooltip: "Align Center" },
    { icon: AlignRight, name: "align-right", tooltip: "Align Right" },
    { icon: AlignJustify, name: "align-justify", tooltip: "Justify" },
  ];

  const contentTools = [
    { icon: Type, name: "heading", tooltip: "Heading" },
    { icon: List, name: "bullet-list", tooltip: "Bullet List" },
    { icon: ListOrdered, name: "numbered-list", tooltip: "Numbered List" },
    { icon: Quote, name: "blockquote", tooltip: "Quote" },
    { icon: Code, name: "code", tooltip: "Inline Code" },
    { icon: Code2, name: "code-block", tooltip: "Code Block" },
    { icon: Image, name: "image", tooltip: "Insert Image" },
    { icon: Video, name: "video", tooltip: "Insert Video" },
    { icon: Link, name: "link", tooltip: "Insert Link" },
    { icon: Database, name: "table", tooltip: "Insert Table" },
  ];

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    toast.success("Draft saved successfully");
    setEditorState(prev => ({ ...prev, lastSaved: new Date(), isDirty: false }));
  };

  const handlePublish = () => {
    if (!formData.title.trim()) {
      toast.error("Please add a title before publishing");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please add content before publishing");
      return;
    }
    
    console.log("Publishing post:", formData);
    toast.success("Post published successfully!");
    router.push("/dashboard");
  };

  const handleSchedule = (date: Date) => {
    setFormData({ ...formData, publishAt: date, status: "scheduled" });
    setShowScheduler(false);
    toast.success(`Post scheduled for ${format(date, "PPpp")}`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
        setEditorState(prev => ({ ...prev, isDirty: true }));
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setEditorState(prev => ({ ...prev, isDirty: true }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title // Auto-populate meta title
    }));
    setEditorState(prev => ({ ...prev, isDirty: true }));
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (formData.title.length > 0) score += 20;
    if (formData.metaDescription.length > 0) score += 20;
    if (formData.focusKeyword.length > 0) score += 20;
    if (formData.content.includes(formData.focusKeyword)) score += 20;
    if (formData.featuredImage.length > 0) score += 20;
    return score;
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const previewDevices = [
    { icon: Monitor, name: "Desktop", width: "100%" },
    { icon: Tablet, name: "Tablet", width: "768px" },
    { icon: Smartphone, name: "Mobile", width: "375px" },
  ];

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return <div className="min-h-screen bg-background animate-pulse" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{editorState.wordCount} words</span>
                <span>{editorState.readTime} min read</span>
                {editorState.lastSaved && (
                  <span>Saved {format(editorState.lastSaved, "HH:mm")}</span>
                )}
                {editorState.isDirty && (
                  <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                    Unsaved
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveDraft}
              disabled={!editorState.isDirty}
              className="hover:bg-gray-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Popover open={showScheduler} onOpenChange={setShowScheduler}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={formData.publishAt}
                  onSelect={(date) => date && handleSchedule(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Post Preview</DialogTitle>
                  <div className="flex space-x-2">
                    {previewDevices.map((device) => (
                      <Button
                        key={device.name}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <device.icon className="w-3 h-3 mr-1" />
                        {device.name}
                      </Button>
                    ))}
                  </div>
                </DialogHeader>
                <div className="flex-1 bg-gray-100 rounded-lg p-4 overflow-auto">
                  <div className="bg-white mx-auto rounded-lg shadow-sm p-6 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">
                      {formData.title || "Post Title"}
                    </h1>
                    <div 
                      className="prose max-w-none text-gray-700" 
                      dangerouslySetInnerHTML={{
                        __html: formData.content || "Your content will appear here..."
                      }} 
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handlePublish}
              size="sm"
            >
              {formData.status === "scheduled" ? "Schedule" : "Publish"}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t px-4 lg:px-6 py-2 bg-gray-50">
          <div className="flex items-center space-x-1 overflow-x-auto">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200" title="Undo">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200" title="Redo">
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Format Tools */}
            <div className="flex items-center space-x-1">
              {formatTools.map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-gray-200",
                    editorState.selectedTool === tool.name && "bg-blue-100 text-blue-700"
                  )}
                  onClick={() => setEditorState(prev => ({ 
                    ...prev, 
                    selectedTool: prev.selectedTool === tool.name ? null : tool.name 
                  }))}
                  title={tool.tooltip}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Alignment Tools */}
            <div className="flex items-center space-x-1">
              {alignmentTools.map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-gray-200",
                    editorState.selectedTool === tool.name && "bg-blue-100 text-blue-700"
                  )}
                  onClick={() => setEditorState(prev => ({ 
                    ...prev, 
                    selectedTool: prev.selectedTool === tool.name ? null : tool.name 
                  }))}
                  title={tool.tooltip}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Content Tools */}
            <div className="flex items-center space-x-1">
              {contentTools.map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-gray-200",
                    editorState.selectedTool === tool.name && "bg-blue-100 text-blue-700"
                  )}
                  onClick={() => setEditorState(prev => ({ 
                    ...prev, 
                    selectedTool: prev.selectedTool === tool.name ? null : tool.name 
                  }))}
                  title={tool.tooltip}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-gray-200 whitespace-nowrap">
              <Plus className="w-4 h-4 mr-1" />
              Block
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Main Editor */}
        <div className="flex-1 max-w-4xl mx-auto p-4 lg:p-6 overflow-y-auto">
          {/* Title */}
          <div className="mb-8">
            <Input
              placeholder="Add your title..."
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-2xl lg:text-4xl font-bold border-0 px-0 py-4 h-auto placeholder:text-gray-400 focus-visible:ring-0 bg-transparent text-gray-900 resize-none"
            />
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                {currentOrigin}/blog/{formData.slug || "post-url"}
              </span>
            </div>
          </div>

          {/* Content Editor */}
          <Card className="min-h-[600px] shadow-sm border-gray-200">
            <CardContent className="p-6">
              <Textarea
                ref={editorRef}
                placeholder="Start writing your story..."
                value={formData.content}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, content: e.target.value }));
                  setEditorState(prev => ({ ...prev, isDirty: true }));
                }}
                className="min-h-[500px] border-0 p-0 resize-none focus-visible:ring-0 text-base leading-relaxed bg-transparent text-gray-900 placeholder:text-gray-400"
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="mt-6 shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a compelling excerpt that will appear in previews..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="h-24 border-gray-200 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                maxLength={160}
              />
              <div className="mt-2 text-xs text-gray-500">
                {formData.excerpt.length}/160 characters
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className={cn(
          "border-l bg-white transition-all duration-200 overflow-y-auto",
          editorState.sidebarCollapsed ? "w-12" : "w-80 lg:w-96"
        )}>
          <div className="p-4 border-b bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorState(prev => ({ 
                ...prev, 
                sidebarCollapsed: !prev.sidebarCollapsed 
              }))}
              className="w-full justify-start hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              {!editorState.sidebarCollapsed && "Post Settings"}
            </Button>
          </div>

          {!editorState.sidebarCollapsed && (
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="p-4 space-y-6">
                {/* Publish Settings */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">Publish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-gray-700">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Draft
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Published
                            </div>
                          </SelectItem>
                          <SelectItem value="scheduled">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Scheduled
                            </div>
                          </SelectItem>
                          <SelectItem value="pending">
                            <div className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Pending Review
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visibility" className="text-gray-700">Visibility</Label>
                      <Select 
                        value={formData.visibility} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                      >
                        <SelectTrigger className="border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Private
                            </div>
                          </SelectItem>
                          <SelectItem value="password">
                            <div className="flex items-center">
                              <Hash className="w-4 h-4 mr-2" />
                              Password Protected
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.visibility === "password" && (
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password..."
                          className="border-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label htmlFor="comments" className="text-sm text-gray-700">Allow Comments</Label>
                      <Switch
                        id="comments"
                        checked={formData.commentsEnabled}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, commentsEnabled: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                      <div className="text-xs text-gray-500">
                        Select or create categories for better organization
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="Add tags (press Enter)..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="text-sm border-gray-200"
                      />
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-red-100 hover:text-red-700 bg-gray-100 text-gray-700"
                              onClick={() => removeTag(tag)}
                            >
                              {tag}
                              <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-900">Featured Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <FileImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600 mb-3">
                        Drag & drop or click to upload
                      </p>
                      <Button variant="outline" size="sm" className="text-xs border-gray-200 hover:bg-gray-50">
                        <Upload className="w-3 h-3 mr-1" />
                        Choose File
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Collapsible open={showSEOPanel} onOpenChange={setShowSEOPanel}>
                  <Card className="shadow-sm border-gray-200">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium flex items-center text-gray-900">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            SEO
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <div className={cn("text-xs font-medium", getSEOScoreColor(calculateSEOScore()))}>
                              {calculateSEOScore()}/100
                            </div>
                            {showSEOPanel ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="focusKeyword" className="text-xs text-gray-700">Focus Keyword</Label>
                          <Input
                            id="focusKeyword"
                            value={formData.focusKeyword}
                            onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                            placeholder="Primary keyword for this post"
                            className="text-sm border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metaTitle" className="text-xs text-gray-700">SEO Title</Label>
                          <Input
                            id="metaTitle"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                            placeholder="Optimized title for search engines"
                            maxLength={60}
                            className="text-sm border-gray-200"
                          />
                          <div className="text-xs text-gray-500">
                            {formData.metaTitle.length}/60 characters
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metaDescription" className="text-xs text-gray-700">Meta Description</Label>
                          <Textarea
                            id="metaDescription"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                            placeholder="Description that appears in search results"
                            maxLength={160}
                            className="h-16 text-sm border-gray-200"
                          />
                          <div className="text-xs text-gray-500">
                            {formData.metaDescription.length}/160 characters
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="canonicalUrl" className="text-xs text-gray-700">Canonical URL</Label>
                          <Input
                            id="canonicalUrl"
                            value={formData.canonicalUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                            placeholder="https://example.com/canonical-url"
                            className="text-sm border-gray-200"
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Social Media */}
                <Collapsible open={showSocialPanel} onOpenChange={setShowSocialPanel}>
                  <Card className="shadow-sm border-gray-200">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <CardTitle className="text-sm font-medium flex items-center justify-between text-gray-900">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Social Media
                          </div>
                          {showSocialPanel ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="socialTitle" className="text-xs text-gray-700">Social Title</Label>
                          <Input
                            id="socialTitle"
                            value={formData.socialTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, socialTitle: e.target.value }))}
                            placeholder="Title for social media shares"
                            className="text-sm border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="socialDescription" className="text-xs text-gray-700">Social Description</Label>
                          <Textarea
                            id="socialDescription"
                            value={formData.socialDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, socialDescription: e.target.value }))}
                            placeholder="Description for social media shares"
                            className="h-16 text-sm border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-700">Social Image</Label>
                          <div className="border border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                            <FileImage className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <Button variant="ghost" size="sm" className="text-xs hover:bg-gray-50">
                              Upload Social Image
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* Advanced Settings */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center text-gray-900">
                      <Zap className="w-4 h-4 mr-2" />
                      Advanced
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pingbacks" className="text-xs text-gray-700">Allow Pingbacks</Label>
                      <Switch
                        id="pingbacks"
                        checked={formData.allowPingbacks}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowPingbacks: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiresAt" className="text-xs text-gray-700">Post Expiration</Label>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        value={formData.expiresAt ? format(formData.expiresAt, "yyyy-MM-dd'T'HH:mm") : ""}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          expiresAt: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                        className="text-sm border-gray-200"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </aside>
      </div>
    </div>
  );
}
