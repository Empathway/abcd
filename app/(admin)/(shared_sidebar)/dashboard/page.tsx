import { Card } from "@/components/ui/card";
import { FileText, Eye, MessageSquare, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Posts",
    value: "24",
    change: "+3 this month",
    icon: FileText,
    positive: true
  },
  {
    title: "Total Views",
    value: "12.4K",
    change: "+18% from last month",
    icon: Eye,
    positive: true
  },
  {
    title: "Comments",
    value: "89",
    change: "+12% from last month",
    icon: MessageSquare,
    positive: true
  },
  {
    title: "Engagement",
    value: "8.2%",
    change: "+2.1% from last month",
    icon: TrendingUp,
    positive: true
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back! Here's an overview of your blog's performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-surface-subtle rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">New post published</p>
              <p className="text-xs text-text-secondary">"10 Tips for Better Blog Writing" - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-subtle rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Post updated</p>
              <p className="text-xs text-text-secondary">"Getting Started with React" - 5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-surface-subtle rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">New comment received</p>
              <p className="text-xs text-text-secondary">On "Understanding TypeScript" - 1 day ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border rounded-lg hover:bg-surface-hover transition-colors duration-200">
            <FileText className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">Write New Post</h3>
            <p className="text-sm text-text-secondary">Create a new blog post</p>
          </button>
          <button className="p-4 text-left border rounded-lg hover:bg-surface-hover transition-colors duration-200">
            <Eye className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">View All Posts</h3>
            <p className="text-sm text-text-secondary">Manage existing content</p>
          </button>
          <button className="p-4 text-left border rounded-lg hover:bg-surface-hover transition-colors duration-200">
            <MessageSquare className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-medium text-text-primary">Review Comments</h3>
            <p className="text-sm text-text-secondary">Moderate user feedback</p>
          </button>
        </div>
      </Card>
    </div>
  );
}