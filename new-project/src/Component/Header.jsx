import { useState } from "react"
import { Menu, Search, Bell, ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react"
import { useLocation } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)


  const location = useLocation();
  const currentPath = location.pathname;
  
  const routeTitles = {
    '/customers': 'Customers',
    '/vender': 'Vendor',
    '/employee': 'Employee Management',

    // Add more here as needed
  };
  
  const pageTitle = routeTitles[currentPath] || '';
  
  
  

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Page Title */}
        <div className="flex-1 lg:flex-none">
          {/* <h1 className="text-2xl font-bold text-gray-900 ml-4 lg:ml-65">Add Customer</h1> */}
          <h1 className="text-2xl font-bold text-gray-900 ml-4 lg:ml-64">{pageTitle}</h1>

        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <img
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500"
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">john@example.com</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-indigo-500/10 border border-gray-100 z-50 animate-slide-down">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src="/placeholder.svg?height=40&width=40"
                      alt="Profile"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-xs text-gray-500">john@example.com</div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-3 h-4 w-4" />
                    Your Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <HelpCircle className="mr-3 h-4 w-4" />
                    Help Center
                  </a>
                  <div className="border-t border-gray-100 my-2"></div>
                  <a href="/" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
