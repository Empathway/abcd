"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Users, 
  Settings, 
  BarChart3,
  Tags,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Mail,
  UserPlus,
  Send,
  Archive
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "main"
  },
  {
    title: "Blogs",
    icon: FileText,
    section: "main",
    isDropdown: true,
    children: [
      {
        title: "All Posts",
        href: "/admin/posts",
        icon: FileText,
      },
      {
        title: "Add New Post",
        href: "/new_blogs",
        icon: Plus,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Tags,
      },
      {
        title: "Tags",
        href: "/admin/tags", 
        icon: Tags,
      },
      {
        title: "Comments",
        href: "/admin/comments",
        icon: MessageSquare,
      }
    ]
  },
  {
    title: "Email List",
    icon: Mail,
    section: "main",
    isDropdown: true,
    children: [
      {
        title: "Subscribers",
        href: "/email_list/subscribers",
        icon: Users,
      },
      {
        title: "Campaign",
        href: "/email_list/campaign",
        icon: Send,
      },
    ]
  },
  // Commented out for later use
  // {
  //   title: "Users",
  //   href: "/admin/users",
  //   icon: Users,
  //   section: "future",
  //   disabled: true
  // },
  // {
  //   title: "Analytics",
  //   href: "/admin/analytics",
  //   icon: BarChart3,
  //   section: "future",
  //   disabled: true
  // },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  //   section: "future",
  //   disabled: true
  // }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({
    "Blogs": true  // Blogs dropdown open by default
  });
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (children: any[]) => {
    return children.some(child => isActiveRoute(child.href));
  };

  const toggleDropdown = (title: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "main":
        return "Overview";
      case "blog":
        return "Blog Management";
      case "future":
        return "Coming Soon";
      default:
        return "";
    }
  };

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarItems>);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 bg-surface border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">Empathway</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section} className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {getSectionTitle(section)}
                </h3>
                <ul className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    
                    if (item.isDropdown) {
                      const isOpen = dropdownOpen[item.title];
                      const isActive = isDropdownActive(item.children || []);
                      
                      return (
                        <li key={item.title}>
                          <button
                            onClick={() => toggleDropdown(item.title)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </div>
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <ul className="mt-1 ml-4 space-y-1">
                              {item.children?.map((child) => {
                                const ChildIcon = child.icon;
                                const isChildActive = isActiveRoute(child.href);
                                
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                        isChildActive
                                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                      )}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <ChildIcon className="w-4 h-4" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    }
                    
                    // Regular menu item
                    const isActive = isActiveRoute(item.href || '');
                    
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href || '#'}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-surface border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
