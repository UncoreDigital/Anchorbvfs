import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Files,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming this exists, typical in shadcn

import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/admin/leads", icon: Mail },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Articles & Podcasts", href: "/admin/articles", icon: Files },
    { name: "Events", href: "/admin/events", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-playfair font-bold text-primary">
              Admin Panel
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
