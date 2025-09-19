// import { useState, useEffect, useMemo } from "react"
// import { z } from "zod"
// import { Search, Building2, CheckCircle, Building, Plus, Download, Eye, Edit, Trash2, X, AlertTriangle, Phone, Mail, MapPin, Tag } from 'lucide-react'
// import { useNavigate } from "react-router-dom"

// // Zod schema for customer validation
// const customerSchema = z.object({
//   id: z.number(),
//   fullName: z.string().min(1, "Full name is required"),
//   companyName: z.string().min(1, "Company name is required"),
//   email: z.string().email("Invalid email address"),
//   mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
//   alternateNumber: z
//     .string()
//     .regex(/^\d{10}$/, "Alternate number must be 10 digits")
//     .optional()
//     .or(z.literal("")),
//   customerType: z.string().min(1, "Customer type is required"),
//   gstNumber: z
//     .string()
//     .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
//     .optional()
//     .or(z.literal("")),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
//   pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
//   address: z.string().min(1, "Address is required"),
//   remarks: z.string().optional(),
//   tags: z.array(z.string()).optional(),
//   createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
//   lastContact: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
//   status: z.string().min(1, "Status is required"),
// })

// export default function CustomersList() {
//   // Sample customer data
  
//   const [customers, setCustomers] = useState([
//     {
//       id: 1,
//       fullName: "Rajesh Kumar",
//       companyName: "Tech Solutions Pvt Ltd",
//       email: "rajesh@techsolutions.com",
//       mobile: "9876543210",
//       alternateNumber: "9876543211",
//       customerType: "client",
//       gstNumber: "27ABCDE1234F1Z5",
//       state: "maharashtra",
//       city: "Mumbai",
//       pincode: "400001",
//       address: "123 Business Park, Andheri East, Mumbai",
//       remarks: "Premium client with multiple projects",
//       tags: ["VIP", "Premium", "Long-term"],
//       createdDate: "2023-01-15",
//       lastContact: "2024-01-20",
//       status: "active",
//     },
//     {
//       id: 2,
//       fullName: "Priya Sharma",
//       companyName: "Digital Marketing Hub",
//       email: "priya@digitalmarketing.com",
//       mobile: "9876543212",
//       alternateNumber: "",
//       customerType: "lead",
//       gstNumber: "",
//       state: "delhi",
//       city: "New Delhi",
//       pincode: "110001",
//       address: "456 Connaught Place, New Delhi",
//       remarks: "Interested in digital marketing services",
//       tags: ["Hot Lead", "Marketing"],
//       createdDate: "2024-01-10",
//       lastContact: "2024-01-25",
//       status: "active",
//     },
//     {
//       id: 3,
//       fullName: "Amit Patel",
//       companyName: "Gujarat Traders",
//       email: "amit@gujarattraders.com",
//       mobile: "9876543213",
//       alternateNumber: "9876543214",
//       customerType: "reseller",
//       gstNumber: "24FGHIJ5678K1Z9",
//       state: "gujarat",
//       city: "Ahmedabad",
//       pincode: "380001",
//       address: "789 Commercial Street, Ahmedabad",
//       remarks: "Bulk orders, good payment history",
//       tags: ["Bulk", "Reseller", "Reliable"],
//       createdDate: "2022-08-20",
//       lastContact: "2024-01-18",
//       status: "active",
//     },
//     {
//       id: 4,
//       fullName: "Sneha Reddy",
//       companyName: "South India Exports",
//       email: "sneha@southindiaexports.com",
//       mobile: "9876543215",
//       alternateNumber: "",
//       customerType: "partner",
//       gstNumber: "36KLMNO9012P1Z3",
//       state: "telangana",
//       city: "Hyderabad",
//       pincode: "500001",
//       address: "321 Export House, Hyderabad",
//       remarks: "Strategic partner for south region",
//       tags: ["Partner", "Export", "Strategic"],
//       createdDate: "2023-03-12",
//       lastContact: "2024-01-22",
//       status: "active",
//     },
//     {
//       id: 5,
//       fullName: "Vikram Singh",
//       companyName: "Punjab Industries",
//       email: "vikram@punjabiindustries.com",
//       mobile: "9876543216",
//       alternateNumber: "9876543217",
//       customerType: "vendor",
//       gstNumber: "03QRSTU3456V1Z7",
//       state: "punjab",
//       city: "Ludhiana",
//       pincode: "141001",
//       address: "654 Industrial Area, Ludhiana",
//       remarks: "Raw material supplier",
//       tags: ["Vendor", "Industrial", "Supplier"],
//       createdDate: "2023-06-05",
//       lastContact: "2024-01-15",
//       status: "inactive",
//     },
//     {
//       id: 6,
//       fullName: "Kavya Nair",
//       companyName: "Kerala Spices Co",
//       email: "kavya@keralaspices.com",
//       mobile: "9876543218",
//       alternateNumber: "",
//       customerType: "client",
//       gstNumber: "32WXYZAB789C1Z1",
//       state: "kerala",
//       city: "Kochi",
//       pincode: "682001",
//       address: "987 Spice Market, Kochi",
//       remarks: "Regular orders for spice products",
//       tags: ["Regular", "Spices", "Export"],
//       createdDate: "2023-09-18",
//       lastContact: "2024-01-24",
//       status: "active",
//     },
//   ])

//   // Table state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [entriesPerPage, setEntriesPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [customerTypeFilter, setCustomerTypeFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [sortColumn, setSortColumn] = useState("")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [selectedCustomers, setSelectedCustomers] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // Modal state
//   const [customerModalOpen, setCustomerModalOpen] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [selectedCustomer, setSelectedCustomer] = useState(null)
//   const [customerToDelete, setCustomerToDelete] = useState(null)

//   // Filter and sort customers
//   const filteredCustomers = useMemo(() => {
//     const filtered = customers.filter((customer) => {
//       const matchesSearch =
//         customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.mobile.includes(searchTerm)
//       const matchesCustomerType = !customerTypeFilter || customer.customerType === customerTypeFilter
//       const matchesStatus = !statusFilter || customer.status === statusFilter
//       return matchesSearch && matchesCustomerType && matchesStatus
//     })

//     // Sort customers
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue
//         switch (sortColumn) {
//           case "fullName":
//             aValue = a.fullName.toLowerCase()
//             bValue = b.fullName.toLowerCase()
//             break
//           case "companyName":
//             aValue = a.companyName.toLowerCase()
//             bValue = b.companyName.toLowerCase()
//             break
//           case "customerType":
//             aValue = a.customerType.toLowerCase()
//             bValue = b.customerType.toLowerCase()
//             break
//           case "createdDate":
//             aValue = new Date(a.createdDate)
//             bValue = new Date(b.createdDate)
//             break
//           case "lastContact":
//             aValue = new Date(a.lastContact)
//             bValue = new Date(b.lastContact)
//             break
//           case "status":
//             aValue = a.status
//             bValue = b.status
//             break
//           default:
//             return 0
//         }
//         if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
//         if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
//         return 0
//       })
//     }
//     return filtered
//   }, [customers, searchTerm, customerTypeFilter, statusFilter, sortColumn, sortDirection])

//   // Pagination
//   const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage)
//   const startIndex = (currentPage - 1) * entriesPerPage
//   const endIndex = startIndex + entriesPerPage
//   const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

//   // Helper functions
//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortColumn(column)
//       setSortDirection("asc")
//     }
//   }

//   const handleSelectAll = (checked) => {
//     setSelectAll(checked)
//     if (checked) {
//       setSelectedCustomers(currentCustomers.map((customer) => customer.id))
//     } else {
//       setSelectedCustomers([])
//     }
//   }

//   const handleSelectCustomer = (id, checked) => {
//     if (checked) {
//       setSelectedCustomers([...selectedCustomers, id])
//     } else {
//       setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id))
//       setSelectAll(false)
//     }
//   }

//   const viewCustomer = (id) => {
//     const customer = customers.find((cust) => cust.id === id)
//     setSelectedCustomer(customer)
//     setCustomerModalOpen(true)
//   }

//   const deleteCustomer = (id) => {
//     const customer = customers.find((cust) => cust.id === id)
//     setCustomerToDelete(customer)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (customerToDelete) {
//       setCustomers(customers.filter((cust) => cust.id !== customerToDelete.id))
//       setDeleteModalOpen(false)
//       setCustomerToDelete(null)
//     }
//   }

//   const exportCustomers = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Name,Company,Email,Mobile,Customer Type,GST Number,City,State,Status\n" +
//       filteredCustomers
//         .map(
//           (customer) =>
//             `"${customer.fullName}","${customer.companyName}","${customer.email}","${customer.mobile}","${customer.customerType}","${customer.gstNumber}","${customer.city}","${customer.state}","${customer.status}"`,
//         )
//         .join("\n")
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "customers.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const navigate = useNavigate()
//   const handleAddCustomer = () => {
//     // Navigate to add customer page
//     console.log("Navigate to add customer page")
//     navigate("/customersList/customers")
//   }

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, customerTypeFilter, statusFilter])

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//       {/* Main Content Area */}
//       <main className="p-6 ml-4 ">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
//           {/* Total Customers */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4 ">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Customers</p>
//                 <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">+12</span> this month
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center ">
//                 <Building2 className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           {/* Active Customers */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {customers.filter((customer) => customer.status === "active").length}
//                 </p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">83%</span> active rate
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center ">
//                 <CheckCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           {/* Clients */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Clients</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {customers.filter((customer) => customer.customerType === "client").length}
//                 </p>
//                 <p className="text-sm text-blue-600 mt-1">
//                   <span className="font-medium">Primary</span> revenue
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <Building className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           {/* New Leads */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 ">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">New Leads</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {customers.filter((customer) => customer.customerType === "lead").length}
//                 </p>
//                 <p className="text-sm text-orange-600 mt-1">
//                   <span className="font-medium">This month</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                 <Building2 className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Filters and Actions */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             {/* Search and Filters */}
//             <div className="flex flex-col sm:flex-row gap-4 flex-1">
//               {/* Search */}
//               <div className="relative flex-1 max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Search customers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//               </div>
//               {/* Customer Type Filter */}
//               <select
//                 value={customerTypeFilter}
//                 onChange={(e) => setCustomerTypeFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Types</option>
//                 <option value="lead">Lead</option>
//                 <option value="client">Client</option>
//                 <option value="reseller">Reseller</option>
//                 <option value="partner">Partner</option>
//                 <option value="vendor">Vendor</option>
//               </select>
//               {/* Status Filter */}
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//             {/* Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={exportCustomers}
//                 className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//               >
//                 <Download className="inline-block w-5 h-5 mr-2" />
//                 Export
//               </button>
//               <button
//                 onClick={handleAddCustomer}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//               >
//                 <Plus className="inline-block w-5 h-5 mr-2" />
//                 Add Customer
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* Customer Table / Cards */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">All Customers</h3>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 <span>Showing</span>
//                 <select
//                   value={entriesPerPage}
//                   onChange={(e) => setEntriesPerPage(Number.parseInt(e.target.value))}
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 >
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <span>entries</span>
//               </div>
//             </div>
//           </div>
//           {/* Mobile Card View */}
//           <div className="md:hidden p-4 grid gap-4">
//             {currentCustomers.map((customer) => (
//               <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedCustomers.includes(customer.id)}
//                       onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
//                     />
//                     <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
//                       <span className="text-white font-medium text-sm">
//                         {customer.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
//                       </span>
//                     </div>
//                     <div className="ml-3">
//                       <div className="text-base font-medium text-gray-900">{customer.fullName}</div>
//                       <div className="text-sm text-gray-500">{customer.companyName}</div>
//                     </div>
//                   </div>
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
//                   <div className="flex items-center">
//                     <Phone className="w-4 h-4 mr-2 text-gray-400" />
//                     {customer.mobile}
//                   </div>
//                   <div className="flex items-center">
//                     <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                     <span className="truncate">{customer.email}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <MapPin className="w-4 h-4 mr-2 text-gray-400" />
//                     {customer.city}, {customer.state.charAt(0).toUpperCase() + customer.state.slice(1)}
//                   </div>
//                   <div>
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         customer.customerType === "client"
//                           ? "bg-blue-100 text-blue-800"
//                           : customer.customerType === "lead"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : customer.customerType === "partner"
//                               ? "bg-purple-100 text-purple-800"
//                               : customer.customerType === "reseller"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     onClick={() => viewCustomer(customer.id)}
//                     className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
//                     title="View Details"
//                     aria-label="View customer details"
//                   >
//                     <Eye className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
//                     title="Edit"
//                     aria-label="Edit customer"
//                   >
//                     <Edit className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => deleteCustomer(customer.id)}
//                     className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
//                     title="Delete"
//                     aria-label="Delete customer"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Desktop Table View */}
//           <div className="hidden md:block w-full overflow-x-auto">
//             <table className="min-w-full table-auto divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={(e) => handleSelectAll(e.target.checked)}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                     />
//                   </th>
//                   <th
//                     onClick={() => handleSort("fullName")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Customer
//                   </th>
//                   <th
//                     onClick={() => handleSort("companyName")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Company
//                   </th>
//                   <th
//                     onClick={() => handleSort("customerType")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Location
//                   </th>
//                   <th
//                     onClick={() => handleSort("lastContact")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Last Contact
//                   </th>
//                   <th
//                     onClick={() => handleSort("status")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentCustomers.map((customer) => (
//                   <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-4 py-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedCustomers.includes(customer.id)}
//                         onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
//                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                             <span className="text-white font-medium text-sm">
//                               {customer.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
//                           <div className="text-sm text-gray-500">{customer.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-900">
//                       <div>{customer.companyName}</div>
//                       {customer.gstNumber && <div className="text-xs text-gray-500">GST: {customer.gstNumber}</div>}
//                     </td>
//                     <td className="px-4 py-4 text-sm">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           customer.customerType === "client"
//                             ? "bg-blue-100 text-blue-800"
//                             : customer.customerType === "lead"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : customer.customerType === "partner"
//                                 ? "bg-purple-100 text-purple-800"
//                                 : customer.customerType === "reseller"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <Phone className="w-4 h-4 mr-1 text-gray-400" />
//                         {customer.mobile}
//                       </div>
//                       <div className="flex items-center mt-1">
//                         <Mail className="w-4 h-4 mr-1 text-gray-400" />
//                         <span className="truncate max-w-32">{customer.email}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1 text-gray-400" />
//                         {customer.city}
//                       </div>
//                       <div className="text-xs text-gray-400 capitalize">{customer.state}</div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-500">
//                       {new Date(customer.lastContact).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </td>
//                     <td className="px-4 py-4 text-sm">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm font-medium">
//                       <div className="flex items-center space-x-2 flex-wrap">
//                         <button
//                           onClick={() => viewCustomer(customer.id)}
//                           className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                           title="View Details"
//                           aria-label="View customer details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="Edit"
//                           aria-label="Edit customer"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteCustomer(customer.id)}
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                           title="Delete"
//                           aria-label="Delete customer"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* Pagination */}
//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing <span>{startIndex + 1}</span> to{" "}
//                 <span>{Math.min(endIndex, filteredCustomers.length)}</span> of{" "}
//                 <span>{filteredCustomers.length}</span> entries
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const page = i + 1
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-3 py-2 border rounded-lg ${
//                           page === currentPage
//                             ? "bg-indigo-600 text-white border-indigo-600"
//                             : "border-gray-300 text-gray-500 hover:bg-gray-50"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* Customer Details Modal */}
//       {customerModalOpen && selectedCustomer && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
//                   <button
//                     onClick={() => setCustomerModalOpen(false)}
//                     className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                     aria-label="Close customer details"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Basic Information */}
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
//                       <Building2 className="w-5 h-5 mr-2" />
//                       Basic Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Full Name</label>
//                         <p className="text-gray-900">{selectedCustomer.fullName}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Company Name</label>
//                         <p className="text-gray-900">{selectedCustomer.companyName}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Email</label>
//                         <p className="text-gray-900">{selectedCustomer.email}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Mobile</label>
//                         <p className="text-gray-900">{selectedCustomer.mobile}</p>
//                       </div>
//                       {selectedCustomer.alternateNumber && (
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Alternate Number</label>
//                           <p className="text-gray-900">{selectedCustomer.alternateNumber}</p>
//                         </div>
//                       )}
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Customer Type</label>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             selectedCustomer.customerType === "client"
//                               ? "bg-blue-100 text-blue-800"
//                               : selectedCustomer.customerType === "lead"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : selectedCustomer.customerType === "partner"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : selectedCustomer.customerType === "reseller"
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {selectedCustomer.customerType.charAt(0).toUpperCase() + selectedCustomer.customerType.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Address & GST Information */}
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
//                       <MapPin className="w-5 h-5 mr-2" />
//                       Address & GST Information
//                     </h4>
//                     <div className="space-y-3">
//                       {selectedCustomer.gstNumber && (
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">GST Number</label>
//                           <p className="text-gray-900">{selectedCustomer.gstNumber}</p>
//                         </div>
//                       )}
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Address</label>
//                         <p className="text-gray-900">{selectedCustomer.address}</p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">City</label>
//                           <p className="text-gray-900">{selectedCustomer.city}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">State</label>
//                           <p className="text-gray-900">
//                             {selectedCustomer.state.charAt(0).toUpperCase() + selectedCustomer.state.slice(1)}
//                           </p>
//                         </div>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Pincode</label>
//                         <p className="text-gray-900">{selectedCustomer.pincode}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Status</label>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             selectedCustomer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Additional Information */}
//                   <div className="md:col-span-2 space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Created Date</label>
//                         <p className="text-gray-900">{new Date(selectedCustomer.createdDate).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Last Contact</label>
//                         <p className="text-gray-900">{new Date(selectedCustomer.lastContact).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                     {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Tags</label>
//                         <div className="mt-2 flex flex-wrap gap-2">
//                           {selectedCustomer.tags.map((tag, index) => (
//                             <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
//                               <Tag className="w-3 h-3 mr-1" />
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {selectedCustomer.remarks && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Remarks</label>
//                         <p className="text-gray-900 mt-1">{selectedCustomer.remarks}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                     Edit Customer
//                   </button>
//                   <button
//                     onClick={() => setCustomerModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && customerToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
//                     <p className="text-sm text-gray-500">This action cannot be undone.</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mb-6">
//                   Are you sure you want to delete <span className="font-semibold">{customerToDelete.fullName}</span>? This
//                   will permanently remove their record from the system.
//                 </p>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setDeleteModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Building2,
  CheckCircle,
  Building,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Tag,
  ArrowLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Zod schema for customer validation
// const customerSchema = z.object({
//   id: z.number(),
//   fullName: z.string().min(1, "Full name is required"),
//   companyName: z.string().min(1, "Company name is required"),
//   email: z.string().email("Invalid email address"),
//   mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
//   alternateNumber: z
//     .string()
//     .regex(/^\d{10}$/, "Alternate number must be 10 digits")
//     .optional()
//     .or(z.literal("")),
//   customerType: z.string().min(1, "Customer type is required"),
//   gstNumber: z
//     .string()
//     .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
//     .optional()
//     .or(z.literal("")),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
//   pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
//   address: z.string().min(1, "Address is required"),
//   remarks: z.string().optional(),
//   tags: z.array(z.string()).optional(),
//   createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
//   lastContact: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
//   status: z.string().min(1, "Status is required"),
// })

export default function CustomersList({ onShowCustomerDetail }) {
  // Sample customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      fullName: "Rajesh Kumar",
      companyName: "Tech Solutions Pvt Ltd",
      email: "rajesh@techsolutions.com",
      mobile: "9876543210",
      alternateNumber: "9876543211",
      customerType: "client",
      gstNumber: "27ABCDE1234F1Z5",
      state: "maharashtra",
      city: "Mumbai",
      pincode: "400001",
      address: "123 Business Park, Andheri East, Mumbai",
      remarks: "Premium client with multiple projects",
      tags: ["VIP", "Premium", "Long-term"],
      createdDate: "2023-01-15",
      lastContact: "2024-01-20",
      status: "active",
    },
    {
      id: 2,
      fullName: "Priya Sharma",
      companyName: "Digital Marketing Hub",
      email: "priya@digitalmarketing.com",
      mobile: "9876543212",
      alternateNumber: "",
      customerType: "lead",
      gstNumber: "",
      state: "delhi",
      city: "New Delhi",
      pincode: "110001",
      address: "456 Connaught Place, New Delhi",
      remarks: "Interested in digital marketing services",
      tags: ["Hot Lead", "Marketing"],
      createdDate: "2024-01-10",
      lastContact: "2024-01-25",
      status: "active",
    },
    {
      id: 3,
      fullName: "Amit Patel",
      companyName: "Gujarat Traders",
      email: "amit@gujarattraders.com",
      mobile: "9876543213",
      alternateNumber: "9876543214",
      customerType: "reseller",
      gstNumber: "24FGHIJ5678K1Z9",
      state: "gujarat",
      city: "Ahmedabad",
      pincode: "380001",
      address: "789 Commercial Street, Ahmedabad",
      remarks: "Bulk orders, good payment history",
      tags: ["Bulk", "Reseller", "Reliable"],
      createdDate: "2022-08-20",
      lastContact: "2024-01-18",
      status: "active",
    },
    {
      id: 4,
      fullName: "Sneha Reddy",
      companyName: "South India Exports",
      email: "sneha@southindiaexports.com",
      mobile: "9876543215",
      alternateNumber: "",
      customerType: "partner",
      gstNumber: "36KLMNO9012P1Z3",
      state: "telangana",
      city: "Hyderabad",
      pincode: "500001",
      address: "321 Export House, Hyderabad",
      remarks: "Strategic partner for south region",
      tags: ["Partner", "Export", "Strategic"],
      createdDate: "2023-03-12",
      lastContact: "2024-01-22",
      status: "active",
    },
    {
      id: 5,
      fullName: "Vikram Singh",
      companyName: "Punjab Industries",
      email: "vikram@punjabiindustries.com",
      mobile: "9876543216",
      alternateNumber: "9876543217",
      customerType: "vendor",
      gstNumber: "03QRSTU3456V1Z7",
      state: "punjab",
      city: "Ludhiana",
      pincode: "141001",
      address: "654 Industrial Area, Ludhiana",
      remarks: "Raw material supplier",
      tags: ["Vendor", "Industrial", "Supplier"],
      createdDate: "2023-06-05",
      lastContact: "2024-01-15",
      status: "inactive",
    },
    {
      id: 6,
      fullName: "Kavya Nair",
      companyName: "Kerala Spices Co",
      email: "kavya@keralaspices.com",
      mobile: "9876543218",
      alternateNumber: "",
      customerType: "client",
      gstNumber: "32WXYZAB789C1Z1",
      state: "kerala",
      city: "Kochi",
      pincode: "682001",
      address: "987 Spice Market, Kochi",
      remarks: "Regular orders for spice products",
      tags: ["Regular", "Spices", "Export"],
      createdDate: "2023-09-18",
      lastContact: "2024-01-24",
      status: "active",
    },
  ])

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerToDelete, setCustomerToDelete] = useState(null)

  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm)
      const matchesCustomerType = !customerTypeFilter || customer.customerType === customerTypeFilter
      const matchesStatus = !statusFilter || customer.status === statusFilter
      return matchesSearch && matchesCustomerType && matchesStatus
    })

    // Sort customers
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue
        switch (sortColumn) {
          case "fullName":
            aValue = a.fullName.toLowerCase()
            bValue = b.fullName.toLowerCase()
            break
          case "companyName":
            aValue = a.companyName.toLowerCase()
            bValue = b.companyName.toLowerCase()
            break
          case "customerType":
            aValue = a.customerType.toLowerCase()
            bValue = b.customerType.toLowerCase()
            break
          case "createdDate":
            aValue = new Date(a.createdDate)
            bValue = new Date(b.createdDate)
            break
          case "lastContact":
            aValue = new Date(a.lastContact)
            bValue = new Date(b.lastContact)
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          default:
            return 0
        }
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [customers, searchTerm, customerTypeFilter, statusFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  // Helper functions
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedCustomers(currentCustomers.map((customer) => customer.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (id, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, id])
    } else {
      setSelectedCustomers(selectedCustomers.filter((customerId) => customerId !== id))
      setSelectAll(false)
    }
  }

  const viewCustomer = (id) => {
    const customer = customers.find((cust) => cust.id === id)
    setSelectedCustomer(customer)
    setCustomerModalOpen(true)
  }

  const showCustomerDetailsPage = (id) => {
    const customer = customers.find((cust) => cust.id === id)
    if (onShowCustomerDetail) {
      onShowCustomerDetail(customer)
    } else {
      setSelectedCustomer(customer)
      setShowCustomerDetails(true)
      setActiveTab("overview")
    }
  }

  const deleteCustomer = (id) => {
    const customer = customers.find((cust) => cust.id === id)
    setCustomerToDelete(customer)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((cust) => cust.id !== customerToDelete.id))
      setDeleteModalOpen(false)
      setCustomerToDelete(null)
    }
  }

  const exportCustomers = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Company,Email,Mobile,Customer Type,GST Number,City,State,Status\n" +
      filteredCustomers
        .map(
          (customer) =>
            `"${customer.fullName}","${customer.companyName}","${customer.email}","${customer.mobile}","${customer.customerType}","${customer.gstNumber}","${customer.city}","${customer.state}","${customer.status}"`,
        )
        .join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "customers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const navigate = useNavigate()
  const handleAddCustomer = () => {
    // Navigate to add customer page
    console.log("Navigate to add customer page")
    navigate("/customersList/customers")
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, customerTypeFilter, statusFilter])

  const CustomerDetailsPage = () => {
    if (!selectedCustomer) return null

    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowCustomerDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">{selectedCustomer.fullName}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700">New Transaction</button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                More
              </button>
              <button onClick={() => setShowCustomerDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 ml-6">Active Customers</h3>
              <div className="space-y-2 ml-3">
                {customers
                  .filter((c) => c.status === "active")
                  .map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => showCustomerDetailsPage(customer.id)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedCustomer.id === customer.id ? "bg-blue-50 border border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{customer.fullName}</div>
                          <div className="text-sm text-gray-500">₹0.00</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
              <div className="px-6">
                <nav className="flex space-x-8">
                  {["Overview", "Comments", "Transactions", "Mails", "Statement"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.toLowerCase()
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedCustomer.fullName}</h3>

                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xl font-semibold text-gray-600">
                            {selectedCustomer.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Mrs. {selectedCustomer.fullName}</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {selectedCustomer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {selectedCustomer.mobile}
                            </div>
                            {selectedCustomer.alternateNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {selectedCustomer.alternateNumber}
                              </div>
                            )}
                          </div>
                          <button className="mt-3 text-blue-600 text-sm hover:underline">Invite to Portal</button>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">ADDRESS</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Billing Address</h4>
                          <p className="text-gray-600 text-sm">
                            No Billing Address - <button className="text-blue-600 hover:underline">New Address</button>
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                          <p className="text-gray-600 text-sm">
                            No Shipping Address - <button className="text-blue-600 hover:underline">New Address</button>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">OTHER DETAILS</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Customer Type</label>
                          <p className="font-medium text-gray-900 capitalize">{selectedCustomer.customerType}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Default Currency</label>
                          <p className="font-medium text-gray-900">INR</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Portal Status</label>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-600 text-sm">Disabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-sm text-gray-500 mb-2">Payment due period</h3>
                      <p className="font-medium text-gray-900">Due on Receipt</p>
                    </div>

                    {/* Receivables */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receivables</h3>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">CURRENCY</p>
                          <p className="font-medium text-gray-900">INR- Indian Rupee</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">OUTSTANDING RECEIVABLES</p>
                          <p className="font-medium text-gray-900">₹0.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">UNUSED CREDITS</p>
                          <p className="font-medium text-gray-900">₹0.00</p>
                        </div>
                      </div>
                    </div>

                    {/* Income and Expense */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Income and Expense</h3>
                        <select className="text-sm border border-gray-300 rounded px-2 py-1">
                          <option>Last 6 Months</option>
                        </select>
                      </div>

                      <p className="text-xs text-gray-500 mb-4">
                        This chart is displayed in the organization's base currency.
                      </p>

                      {/* Simple Chart Representation */}
                      <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-center p-4">
                        <div className="flex items-end space-x-2 h-full">
                          {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, index) => (
                            <div key={month} className="flex flex-col items-center">
                              <div
                                className={`w-8 rounded-t ${index === 5 ? "bg-green-400 h-32" : "bg-gray-300 h-4"}`}
                              ></div>
                              <span className="text-xs text-gray-500 mt-1">{month}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-gray-900">Total Income ( Last 6 Months ) - ₹400.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-6">
                  {/* Comment Editor */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="border border-gray-300 rounded-lg">
                      {/* Toolbar */}
                      <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
                        <button className="px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100">
                          B
                        </button>
                        <button className="px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-100">
                          I
                        </button>
                        <button className="px-3 py-1 text-sm underline border border-gray-300 rounded hover:bg-gray-100">
                          U
                        </button>
                      </div>
                      {/* Text Area */}
                      <textarea
                        className="w-full h-32 p-3 border-none resize-none focus:outline-none"
                        placeholder="Write your comment here..."
                      ></textarea>
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        Add Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">ALL COMMENTS</h3>
                    <div className="text-center py-8">
                      <p className="text-gray-500">No comments yet.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="space-y-6">
                  {/* Go to transactions dropdown */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Go to transactions</h3>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Transaction Sections */}
                  <div className="space-y-4">
                    {[
                      "Invoices",
                      "Customer Payments",
                      "Payment Links",
                      "Quotes",
                      "Delivery Challans",
                      "Recurring Invoices",
                      "Estimates",
                    ].map((section) => (
                      <div key={section} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 text-gray-400 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900">{section}</h3>
                          </div>
                          <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            New
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "mails" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">System Mails</h3>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1">
                          <option>Link Email account</option>
                        </select>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="text-center py-12">
                      <svg
                        className="w-12 h-12 text-orange-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">No emails sent.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "statement" && (
                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-orange-400 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-orange-800 text-sm">
                        Your customers can view their statement by themselves at any time from the Customer Portal.
                      </span>
                      <button className="ml-auto text-blue-600 text-sm hover:underline">
                        Enable Now
                        <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <select className="border border-gray-300 rounded px-3 py-2">
                            <option>This Month</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Filter By:</span>
                          <select className="border border-gray-300 rounded px-3 py-2">
                            <option>All</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Send Email
                        </button>
                      </div>
                    </div>

                    {/* Statement Content */}
                    <div className="border-t pt-6">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          Customer Statement for {selectedCustomer.fullName}
                        </h2>
                        <p className="text-gray-600">From 01/09/2025 To 30/09/2025</p>
                      </div>

                      {/* Company Info */}
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-400 via-yellow-400 to-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">
                              <span className="text-red-500">FLAME</span>
                              <span className="text-gray-800"> TECHNO</span>
                            </h3>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p className="font-semibold">FLAME TECHNO</p>
                          <p>40/768</p>
                          <p>Shani Nagar</p>
                          <p>Pune Maharashtra 411017</p>
                          <p>India</p>
                          <p>9168219311</p>
                          <p>info.infrasystem@gmail.com</p>
                          <p>flametechno.in</p>
                        </div>
                      </div>

                      {/* Statement Table Area */}
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No transactions found for the selected period.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showCustomerDetails) {
    return <CustomerDetailsPage />
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 ">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Total Customers */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+12</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center ">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Active Customers */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.filter((customer) => customer.status === "active").length}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">83%</span> active rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center ">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Clients */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.filter((customer) => customer.customerType === "client").length}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Primary</span> revenue
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* New Leads */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.filter((customer) => customer.customerType === "lead").length}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  <span className="font-medium">This month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {/* Customer Type Filter */}
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="lead">Lead</option>
                <option value="client">Client</option>
                <option value="reseller">Reseller</option>
                <option value="partner">Partner</option>
                <option value="vendor">Vendor</option>
              </select>
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportCustomers}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Customer
              </button>
            </div>
          </div>
        </div>
        {/* Customer Table / Cards */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Customers</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Showing</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number.parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
          {/* Mobile Card View */}
          <div className="md:hidden p-4 grid gap-4">
            {currentCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
                    />
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {customer.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">{customer.fullName}</div>
                      <div className="text-sm text-gray-500">{customer.companyName}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {customer.mobile}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {customer.city}, {customer.state.charAt(0).toUpperCase() + customer.state.slice(1)}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.customerType === "client"
                          ? "bg-blue-100 text-blue-800"
                          : customer.customerType === "lead"
                            ? "bg-yellow-100 text-yellow-800"
                            : customer.customerType === "partner"
                              ? "bg-purple-100 text-purple-800"
                              : customer.customerType === "reseller"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => viewCustomer(customer.id)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                    title="View Details"
                    aria-label="View customer details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                    title="Edit"
                    aria-label="Edit customer"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                    title="Delete"
                    aria-label="Delete customer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    onClick={() => handleSort("fullName")}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Customer
                  </th>
                  <th
                    onClick={() => handleSort("companyName")}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Company
                  </th>
                  <th
                    onClick={() => handleSort("customerType")}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th
                    onClick={() => handleSort("lastContact")}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Last Contact
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {customer.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                            onClick={() => showCustomerDetailsPage(customer.id)}
                          >
                            {customer.fullName}
                          </div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div>{customer.companyName}</div>
                      {customer.gstNumber && <div className="text-xs text-gray-500">GST: {customer.gstNumber}</div>}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.customerType === "client"
                            ? "bg-blue-100 text-blue-800"
                            : customer.customerType === "lead"
                              ? "bg-yellow-100 text-yellow-800"
                              : customer.customerType === "partner"
                                ? "bg-purple-100 text-purple-800"
                                : customer.customerType === "reseller"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {customer.mobile}
                      </div>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="truncate max-w-32">{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {customer.city}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">{customer.state}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(customer.lastContact).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <button
                          onClick={() => viewCustomer(customer.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                          aria-label="View customer details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                          aria-label="Edit customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                          aria-label="Delete customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredCustomers.length)}</span> of{" "}
                <span>{filteredCustomers.length}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          page === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Customer Details Modal */}
      {customerModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
                  <button
                    onClick={() => setCustomerModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close customer details"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900">{selectedCustomer.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Name</label>
                        <p className="text-gray-900">{selectedCustomer.companyName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mobile</label>
                        <p className="text-gray-900">{selectedCustomer.mobile}</p>
                      </div>
                      {selectedCustomer.alternateNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Alternate Number</label>
                          <p className="text-gray-900">{selectedCustomer.alternateNumber}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer Type</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedCustomer.customerType === "client"
                              ? "bg-blue-100 text-blue-800"
                              : selectedCustomer.customerType === "lead"
                                ? "bg-yellow-100 text-yellow-800"
                                : selectedCustomer.customerType === "partner"
                                  ? "bg-purple-100 text-purple-800"
                                  : selectedCustomer.customerType === "reseller"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedCustomer.customerType.charAt(0).toUpperCase() +
                            selectedCustomer.customerType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Address & GST Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Address & GST Information
                    </h4>
                    <div className="space-y-3">
                      {selectedCustomer.gstNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">GST Number</label>
                          <p className="text-gray-900">{selectedCustomer.gstNumber}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">{selectedCustomer.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">City</label>
                          <p className="text-gray-900">{selectedCustomer.city}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">State</label>
                          <p className="text-gray-900">
                            {selectedCustomer.state.charAt(0).toUpperCase() + selectedCustomer.state.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pincode</label>
                        <p className="text-gray-900">{selectedCustomer.pincode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedCustomer.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Additional Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created Date</label>
                        <p className="text-gray-900">{new Date(selectedCustomer.createdDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Contact</label>
                        <p className="text-gray-900">{new Date(selectedCustomer.lastContact).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tags</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCustomer.remarks && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Remarks</label>
                        <p className="text-gray-900 mt-1">{selectedCustomer.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Edit Customer
                  </button>
                  <button
                    onClick={() => setCustomerModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{customerToDelete.fullName}</span>?
                  This will permanently remove their record from the system.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
