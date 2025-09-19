import { useState } from "react"
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  UserPlus,
  PackagePlus,
  FilePlus2,
  FileText,
  UserCog,
  ArrowBigLeft,
  Dot,
  CircleDot,
  DotIcon,
  Users,
  Users2
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"

export default function Header({ onMenuClick }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const routeTitles = {
    '/leadform': {
        title: 'Lead Management System ',
        buttonTextColor: 'text-white',
        iconColor: 'stroke-blue-700 h-3 w-8 text-blue-600',
        // icons:Users2,
      //   pageSubtitle: 'Manage your customers here.',
     
      },
      '/leadform/addlead': {
        title: 'Add New Lead',
        buttonTextColor: 'text-white',
        iconColor: 'stroke-blue-700 h-3 w-8 text-blue-600',
        // icons:Users2,
        pageSubtitle: 'Capture and manage your potential customers.',
     
      },
    '/customersList/customers': {
      title: 'AddCustomers',
      buttonTextColor: 'text-white',
      iconColor: 'stroke-white',
    //   pageSubtitle: 'Manage your customers here.',
    },
    '/customersList': {
        title: 'Customers Management',
        buttonTextColor: 'text-white',
        iconColor: 'stroke-white',
        pageSubtitle: 'Manage your customers here.',
      },
    '/vendorlist/vender': {
      title: 'Create Vendor',
      buttonTextColor: 'text-yellow-100',
      iconColor: 'stroke-yellow-100',
    },
    '/vendorlist': {
        title: 'Vendor Management',
        buttonTextColor: 'text-yellow-100',
        iconColor: 'stroke-yellow-100',
        pageSubtitle: 'Manage your vendors and their information.',
      },
        
    '/userList':  {
      title: 'User Management',
      buttonTextColor: 'text-green-200',
      iconColor: 'stroke-green-200',
    },

    '/employee': {
      title: 'Employee Management',
      buttonTextColor: 'text-green-200',
      iconColor: 'stroke-green-200',
    },
    '/employee/addemployee': {
      title: 'Add Employee',
      buttonTextColor: 'text-pink-200',
      iconColor: 'stroke-pink-200',
    },
    '/sale/product-service': {
      title: 'Product Management',
      buttonTextColor: 'text-purple-100',
      iconColor: 'stroke-purple-100',
      // pageSubtitle:"Fill in the details to add a new product to your inventory"
    },
    '/sale/addproduct': {
      title: 'Add New Product',
      buttonTextColor: 'text-purple-100',
      iconColor: 'stroke-purple-100',
      pageSubtitle:"Fill in the details to add a new product to your inventory"
    },
    '/sale/invoice': {
      title: 'Invoice',
      pageSubtitle: 'Saturday, August 2, 2025 at 05:29 PM',
      buttonTextColor: 'text-cyan-200',
      iconColor: 'stroke-cyan-200',
    },
    '/sale/invoice/addInvoice': {
      title: 'Create Invoice',
      pageSubtitle: 'Saturday, August 2, 2025 at 05:29 PM',
      buttonTextColor: 'text-cyan-200',
      iconColor: 'stroke-cyan-200',
    //   pageSubtitle:'Generate professional invoices for your clients',
    },
    '/ticket/ticket-list': {
      title: 'Support Tickets',
      buttonText: 'Create Ticket',
      buttonHref: '/ticket/ticket-list/create-ticket',
      buttonIcon: Plus,
      buttonColor: 'from-indigo-600 to-indigo-400',
      buttonTextColor: 'text-white',
      iconColor: 'stroke-white',
    },
    '/ticket/ticket-list/create-ticket': {
      title: 'Create Support Ticket',
      buttonText: 'Back To Tickets',
      buttonHref: '/ticket/ticket-list',
      buttonIcon: ArrowBigLeft,
      buttonColor: 'from-gray-400 to-gray-400',
      buttonTextColor: 'text-black',
      iconColor: 'stroke-black',
    },

    // '/ticket/ticket-details/:ticketId': {
    //   title: 'Ticket #',
    //   buttonTextColor: 'text-white',
    //   iconColor: 'stroke-white',
    // },

    '/ticket/assign-ticket': {
      title: 'Assign Tickets',
    //   buttonText: 'Back To Tickets',
    //   buttonHref: '/ticket/ticket-list',
    //   buttonIcon: ArrowBigLeft,
      buttonColor: 'from-gray-400 to-gray-400',
      buttonTextColor: 'text-black',
      iconColor: 'stroke-black',
      pageSubtitle: 'Manage and assign support tickets to team members',
    },
    '/attendance/markAttendance': {
      title: 'Mark Attendence',
      buttonText: 'Ready to Mark IN',
      buttonHref: '/ticket/ticket-list',
      buttonIcon: DotIcon,
      buttonColor: 'from-gray-100 to-gray-100',
      buttonTextColor: 'text-black',
      iconColor: 'stroke-green-400',
      iconSize: 'w-6 h-6',  
      pageSubtitle: 'Saturday, August 2, 2025 at 05:29 PM',
    },
    '/attendance/dashboard': {
      title: 'Attendance Dashboard',
    //   buttonText: 'Refresh',
      buttonHref: '/ticket/ticket-list',
      buttonIcon: DotIcon,
      buttonColor: 'from-gray-100 to-gray-100',
      buttonTextColor: 'text-black',
      iconColor: 'stroke-green-400',
      iconSize: 'w-6 h-6',  
    //   pageSubtitle: 'Saturday, August 2, 2025 at 05:29 PM',
    },

    '/attendance/daily-report': {
        title: 'Daily Attendance Sheet ',
      //   buttonText: 'Refresh',
        buttonHref: '/ticket/ticket-list',
        buttonIcon: DotIcon,
        buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        pageSubtitle: 'January 8, 2024 - Total: 150 employees',
      },
      '/attendance/monthly-report': {
        title: 'Monthly Attendance Sheet ',
      //   buttonText: 'Refresh',
        buttonHref: '/ticket/ticket-list',
        buttonIcon: DotIcon,
        buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        pageSubtitle: 'Track and manage employee attendance records',
      },
      '/attendance/wfh-report': {
        title: 'WFH Approval List ',
      //   buttonText: 'Refresh',
        buttonHref: '/ticket/ticket-list',
        buttonIcon: DotIcon,
        buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        pageSubtitle: 'Manage work from home requests and approvals',
      },
    //   '/attendance/attendance-entry': {
    //     title: 'Manual Attendance Entry ',
    //   //   buttonText: 'Refresh',
    //   icons:Users,
    //     buttonHref: '/ticket/ticket-list',
    //     buttonIcon: DotIcon,
    //     buttonColor: 'from-gray-100 to-gray-100',
    //     buttonTextColor: 'text-black',
    //     iconColor: 'stroke-green-400',
    //     iconSize: 'w-6 h-6',  
    //     pageSubtitle: 'Add or edit attendance records manually',
    //   },

    '/mark-attendance/my-report': {
        title: 'My Attendance Entry ',
      //   buttonText: 'Refresh',
      // icons:Users,
        buttonHref: '/ticket/ticket-list',
        buttonIcon: DotIcon,
        buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        pageSubtitle: 'View your monthly attendance in calendar format',
      },

      '/leave-management/apply-leave': {
        title: 'Apply for Leave',
      //   buttonText: 'Refresh',
      icons:Users,
        buttonHref: '/ticket/ticket-list',
        buttonIcon: DotIcon,
        buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        pageSubtitle: 'Submit your leave application with proper documentation',
      },
      '/leave-management/leavelist': {
        title: 'Leave Management',
      //   buttonText: 'Refresh',
      icons:Users,
        buttonHref: '/ticket/ticket-list',
        // buttonIcon: DotIcon,
        // buttonColor: 'from-gray-100 to-gray-100',
        buttonTextColor: 'text-black',
        iconColor: 'stroke-green-400',
        iconSize: 'w-6 h-6',  
        // pageSubtitle: 'Submit your leave application with proper documentation',
      },

      '/purchase/purchasetable': {
        title: 'Purchase Order',
       pageSubtitle: 'Manage your purchase orders and track their status',
      },
      '/purchase/purchase-order': {
        title: 'Create Purchase Order',
       pageSubtitle: 'Generate and manage purchase orders for your vendors',
      },
      '/purchase/invoices/all': {
        title: 'Create Purchase Invoice',
       pageSubtitle: 'Manage and track your incoming invoices',
      },
      '/purchase/invoices/allinvoictable': {
        title: 'All Invoice',
      //  pageSubtitle: 'Manage and track your incoming invoices',
      },
      '/purchase/expenses': {
        title: 'Expenses ',
      //  pageSubtitle: 'Enter details for your expense records',
      },
      
      '/purchase/addexpenses': {
        title: 'Add New Expenses ',
       pageSubtitle: 'Enter details for your expense records',
      },
      '/payroll/salary-structure': {
        title: 'Salary Structure',
      //  pageSubtitle: 'Manage and track your incoming invoices',
      },

      '/payroll/monthly-salary': {
        title: 'Monthly Salary Sheet',
      //  pageSubtitle: 'Manage and track your incoming invoices',
      },

      '/payroll/generate-salary': {
        title: 'Generate Salary',
      //  pageSubtitle: 'Manage and track your incoming invoices',
      },

      '/payroll/reports': {
        title: 'SalaryReports',
      //  pageSubtitle: 'Manage and track your incoming invoices',
      },
  }

  const routeData = routeTitles[currentPath] || {}
  const pageTitle = routeData.title || ''
  const pageSubtitle = routeData.pageSubtitle || ''
  const ButtonIcon = routeData.buttonIcon || Plus
  const buttonText = routeData.buttonText
  const buttonHref = routeData.buttonHref
  const buttonColor = routeData.buttonColor || 'from-indigo-600 to-cyan-600'
  const buttonTextColor = routeData.buttonTextColor || 'text-white'
  const iconColor = routeData.iconColor || 'stroke-white'
  const iconSize = routeData.iconSize || 'w-4 h-4'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 ">
        {/* Mobile menu button */}
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Page Title and Subtitle */}
        {/* <div className="flex-1 lg:flex-none">
          <div className="ml-auto lg:ml-64 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            {pageSubtitle && (
              <p className="text-sm text-gray-600 mt-1">{pageSubtitle}</p>
            )}
          </div>
        </div> */}
        {/* Page Title and Subtitle */}
<div className="flex-1 lg:flex-none">
  <div className="ml-auto lg:ml-10 flex flex-col justify-center">
    <div className="flex items-center space-x-2">
      {routeData.icons && (
        <routeData.icons className={`w-6 h-6 ${iconColor}`} />
      )}
      <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
    </div>
    {pageSubtitle && (
      <p className="text-sm text-gray-600 mt-1">{pageSubtitle}</p>
    )}
  </div>
</div>


        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Show button if buttonText and buttonHref exist */}
          {buttonText && buttonHref && (
            <Link
              to={buttonHref}
              className={`ml-4 px-4 py-2 bg-gradient-to-r ${buttonColor} rounded-xl hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-md flex items-center ${buttonTextColor}`}
            >
              <ButtonIcon className={`${iconSize} mr-2 ${iconColor}`} />
              {buttonText}
            </Link>
          )}

          {/* Search Input */}
          {/* <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div> */}

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
                <div className="text-sm font-medium text-gray-900">Sagar </div>
                <div className="text-xs text-gray-500">Sagar@Technfest.com</div>
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
                      <div className="text-sm font-medium text-gray-900"> Sagar Mohite</div>
                      <div className="text-xs text-gray-500">Sagar@technfest.com</div>
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
