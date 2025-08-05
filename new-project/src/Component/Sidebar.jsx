import { useLocation, Link } from "react-router-dom"
import {
  Users,
  UserPlus,
  HelpCircle,
  X,
  Menu,
  BadgeDollarSign,
  Package,
  FileText,
  ClipboardList,
  Ticket,
  MessagesSquare,
  UserCheck,
  ChevronRight,
  CalendarPlus,
  File,
  Files,
  FileEdit,
  Check,
  CheckCheck,
} from "lucide-react"
import { useState } from "react"

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const currentPath = location.pathname

  const [openMenus, setOpenMenus] = useState({})

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const menuItems = [
    {
      name: "Lead",
      icon: Users,
      href: "/leadform",
    },
    {
      name: "Customers",
      icon: Users,
      href: "/customersList",
    },
    {
      name: "Vendor",
      icon: UserPlus,
      href: "/vendorlist",
    },
    
    {
      name: "Employee",
      icon: Users,
      href: "/employee",
    },
    {
      name: "Sale",
      icon: BadgeDollarSign,
      href: "/sale",
      children: [
        {
          name: "Product/Service",
          href: "/sale/product-service",
          icon: Package,
        },
        {
          name: "Invoice",
          href: "/sale/invoice",
          icon: FileText,
        },
      ],
    },
    {
      name: "Ticket",
      icon: Ticket,
      href: "/ticket",
      children: [
        {
          name: "Support Ticket",
          href: "/ticket/ticket-list",
          icon: MessagesSquare,
        },
        // {
        //   name: "Ticket Detail",
        //   href: "/ticket/ticket-details/:ticketId",
        //   icon: FileText,
        // },
        {
          name: "Assign Ticket",
          href: "/ticket/assign-ticket",
          icon: UserCheck,
        },
      ],
    },
    {
      name: "Attendance",
      icon: ClipboardList,
      href: "/attendance",
      children: [
        {
          name: "Dashboard",
          href: "/attendance/dashboard",
          icon: Users,
        },
        {
          name: "Daily Sheet",
          href: "/attendance/daily-report",
          icon: FileEdit,
        },
        {
          name: "Monthly Sheet",
          href: "/attendance/monthly-report",
          icon: Files,
        },
        {
          name: "Report",
          href: "/attendance/report",
          icon: ClipboardList,
        },
        {
          name: "WFH List",
          href: "/attendance/wfh-report",
          icon: File,
        },
        {
          name: "Attendance Entry",
          href: "/attendance/attendance-entry",
          icon: Check,
        },
        {
          name: "Mark Attendance",
          href: "/attendance/markAttendance",
          icon: CheckCheck,
        },
        {
          name: "Mark Attendance Calendar",
          icon: CalendarPlus,
          href: "/mark-attendance/my-report",
        },
      ],
    },

    {
      name: "Leave Management",
      icon: ClipboardList,
      href: "/leave-management",
      children: [
        // {
        //   name: "Leave Application",
        //   href: "/leave-management/apply-leave",
        //   icon: CalendarPlus,
        // },
        {
            name: "Leave Application",
            href: "/leave-management/leavelist",
            icon: CalendarPlus,
          },
      ],
    },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl shadow-indigo-500/10 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
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
          {menuItems.map((item) => {
            const isActive = currentPath.startsWith(item.href)
            const hasChildren = Array.isArray(item.children)
            const isMenuOpen = openMenus[item.name]

            if (hasChildren) {
              // Parent item with children: clickable div to toggle submenu
              return (
                <div key={item.name}>
                  <div
                    onClick={() => toggleMenu(item.name)}
                    className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.name}</span>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                        isMenuOpen ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </div>

                  {isMenuOpen && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 mt-1 ${
                            currentPath === child.href
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <child.icon className="mr-2 h-4 w-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            } else {
              // No children: make entire block a Link for full clickable area
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            }
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/help"
            className="text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Help & Support
          </Link>
        </div>
      </nav>
    </div>
  )
}
