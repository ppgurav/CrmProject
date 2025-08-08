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
  Receipt,
  FileSearch,
  Banknote,
  CircleDollarSign,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const currentPath = location.pathname
  const [openSections, setOpenSections] = useState({})

  const menuSections = [
    {
      title: "📁 Master Data",
      items: [
        { name: "Lead", icon: Users, href: "/leadform" },
        { name: "Customers", icon: Users, href: "/customersList" },
        { name: "Vendor", icon: UserPlus, href: "/vendorlist" },
        { name: "Employee", icon: Users, href: "/employee" },
        { name: "Product/Service", icon: Package, href: "/sale/product-service" },
      ],
    },
    {
      title: "💰 Sales",
      items: [{ name: "Invoice", icon: FileText, href: "/sale/invoice" }],
    },
    {
      title: "📦 Purchase & Expenses",
      items: [
        { name: "Purchase Order", icon: Receipt, href: "/purchase/purchasetable" },
        {
          name: "Vendor Invoices",
          icon: FileSearch,
          children: [
            { name: "All Invoices", href: "/purchase/invoices/allinvoictable", icon: FileText },
            // { name: "Paid", href: "/purchase/invoices/paid", icon: Check },
            // { name: "Unpaid", href: "/purchase/invoices/unpaid", icon: X },
            { name: "Expenses", icon: Banknote, href: "/purchase/expenses" },
          ],
        },
        // { name: "Expenses", icon: Banknote, href: "/purchase/expenses" },
      ],
    },
    {
      title: "🎫 Ticketing",
      items: [
        { name: "Support Ticket", icon: MessagesSquare, href: "/ticket/ticket-list" },
        { name: "Assign Ticket", icon: UserCheck, href: "/ticket/assign-ticket" },
      ],
    },
    {
      title: "👨‍💼 Employee",
      items: [],
    },
    {
      title: "🔸 Attendance",
      items: [
        { name: "Dashboard", icon: Users, href: "/attendance/dashboard" },
        { name: "Daily Sheet", icon: FileEdit, href: "/attendance/daily-report" },
        { name: "Monthly Sheet", icon: Files, href: "/attendance/monthly-report" },
        { name: "Report", icon: ClipboardList, href: "/attendance/report" },
        { name: "WFH List", icon: File, href: "/attendance/wfh-report" },
        { name: "Attendance Entry", icon: Check, href: "/attendance/attendance-entry" },
        { name: "Mark Attendance", icon: CheckCheck, href: "/attendance/markAttendance" },
        { name: "Mark Attendance Calendar", icon: CalendarPlus, href: "/mark-attendance/my-report" },
      ],
    },
    {
      title: "🔸 Leave Management",
      items: [
        { name: "Leave Application", icon: CalendarPlus, href: "/leave-management/leavelist" },
      ],
    },
    {
      title: "🔸 Payroll",
      items: [
        { name: "Salary Structure", icon: ClipboardList, href: "/payroll/salary-structure" },
        { name: "Monthly Salary Sheet", icon: Files, href: "/payroll/monthly-salary" },
        { name: "Generate Salary", icon: CircleDollarSign, href: "/payroll/generate-salary" },
        { name: "Salary Reports", icon: FileText, href: "/payroll/reports" },
      ],
    },
  ]

  useEffect(() => {
    const newOpenSections = {}
    menuSections.forEach((section) => {
      const shouldBeOpen = section.items.some((item) => {
        if (item.children) {
          return item.children.some((child) => currentPath.startsWith(child.href))
        }
        return currentPath.startsWith(item.href)
      })
      newOpenSections[section.title] = shouldBeOpen
    })
    setOpenSections(newOpenSections)
  }, [currentPath])

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-2xl shadow-indigo-500/10 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Header */}
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

      {/* Scrollable Nav */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        <nav className="mt-6 px-3 space-y-4">
          {menuSections.map((section) => {
            const isOpenSection = openSections[section.title]
            const hasItems = section.items.length > 0

            return (
              <div key={section.title}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isOpenSection
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (hasItems) toggleSection(section.title)
                  }}
                >
                  <span>{section.title}</span>
                  {hasItems && (
                    <ChevronRight
                      className={`h-4 w-4 transform transition-transform duration-300 ${
                        isOpenSection ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  )}
                </button>

                {/* Section Items */}
                {hasItems && (
                  <div
                    className={`ml-4 overflow-hidden transition-all duration-300 ${
                      isOpenSection ? "max-h-[999px] mt-2" : "max-h-0"
                    }`}
                  >
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isItemActive =
                          currentPath === item.href || currentPath.startsWith(item.href)

                        if (item.children) {
                          return (
                            <div key={item.name}>
                              <div className="text-gray-500 text-xs font-medium mt-2 mb-1">{item.name}</div>
                              <div className="ml-2 space-y-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className={`group flex items-center px-2 py-2 text-sm rounded-lg transition ${
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
                            </div>
                          )
                        }

                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-3 py-2 text-sm rounded-lg transition ${
                              isItemActive
                                ? "bg-indigo-100 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Bottom Help Section */}
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
    </div>
  )
}
