
import { useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  Plus,
  Copy,
  Star,
  Archive,
  UserPlus,
  User,
  Shield,
  Bell,
  Puzzle,
  X,
  Menu,
} from "lucide-react"

export default function Sidebar({ isOpen, onClose }) {
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }))
  }

  const menuItems = [
    // {
    //   name: "Overview",
    //   icon: LayoutDashboard,
    //   href: "/dashboard",
    // },
    // {
    //   name: "Analytics",
    //   icon: BarChart3,
    //   submenu: [
    //     { name: "Reports", icon: FileText, href: "/analytics/reports" },
    //     { name: "Statistics", icon: TrendingUp, href: "/analytics/statistics" },
    //     { name: "Real-time Data", icon: Clock, href: "/analytics/realtime" },
    //   ],
    // },
    // {
    //   name: "Projects",
    //   icon: FolderOpen,
    //   badge: "12",
    //   submenu: [
    //     { name: "Create New", icon: Plus, href: "/projects/new" },
    //     { name: "All Projects", icon: Copy, href: "/projects" },
    //     { name: "Favorites", icon: Star, href: "/projects/favorites" },
    //     { name: "Archived", icon: Archive, href: "/projects/archived" },
    //   ],
    // },
    {
      name: "Customers",
      icon: Users,
      href: "/customers",
    //   active: true,
    },
    {
      name: "Vendor",
      icon: UserPlus,
      href: "/vender",
    },
    {
        name: "Employee",
        icon: Users,
        href: "/employee",
        // active: true,
      },
    // {
    //   name: "Messages",
    //   icon: MessageSquare,
    //   href: "/messages",
    //   badge: "3",
    //   badgeColor: "bg-red-100 text-red-600",
    // },
    // {
    //   name: "Settings",
    //   icon: Settings,
    //   submenu: [
    //     { name: "Profile", icon: User, href: "/settings/profile" },
    //     { name: "Security", icon: Shield, href: "/settings/security" },
    //     { name: "Notifications", icon: Bell, href: "/settings/notifications" },
    //     { name: "Integrations", icon: Puzzle, href: "/settings/integrations" },
    //   ],
    // },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl shadow-indigo-500/10 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Dashboard</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="w-full text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 justify-between"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto mr-2 bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {expandedMenus[item.name] ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </button>
                  {expandedMenus[item.name] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <subItem.icon className="mr-2 h-4 w-4" />
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.badge && (
                    <span
                      className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                        item.badgeColor || "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/help"
            className="text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Help & Support
          </a>
        </div>
      </nav>
    </div>
  )
}
