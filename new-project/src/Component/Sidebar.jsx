import { useLocation, Link } from "react-router-dom"
import { Users, UserPlus, HelpCircle, X, Menu } from "lucide-react"

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    {
      name: "Customers",
      icon: Users,
      href: "/customers",
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
    },
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
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                currentPath === item.href
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
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
