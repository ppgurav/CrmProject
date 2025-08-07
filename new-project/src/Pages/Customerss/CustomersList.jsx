import { useState, useEffect, useMemo } from "react"
import { z } from "zod"
import { Search, Building2, CheckCircle, Building, Plus, Download, Eye, Edit, Trash2, X, AlertTriangle, Phone, Mail, MapPin, Tag } from 'lucide-react'
import { useNavigate } from "react-router-dom"

// Zod schema for customer validation
const customerSchema = z.object({
  id: z.number(),
  fullName: z.string().min(1, "Full name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  alternateNumber: z
    .string()
    .regex(/^\d{10}$/, "Alternate number must be 10 digits")
    .optional()
    .or(z.literal("")),
  customerType: z.string().min(1, "Customer type is required"),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional()
    .or(z.literal("")),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  address: z.string().min(1, "Address is required"),
  remarks: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  lastContact: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  status: z.string().min(1, "Status is required"),
})

export default function CustomersList() {
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

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Total Customers */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
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
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4">
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
                        {customer.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
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
                              {customer.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
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
                Showing <span>{startIndex + 1}</span> to{" "}
                <span>{Math.min(endIndex, filteredCustomers.length)}</span> of{" "}
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
                          {selectedCustomer.customerType.charAt(0).toUpperCase() + selectedCustomer.customerType.slice(1)}
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
                            selectedCustomer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
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
                  Are you sure you want to delete <span className="font-semibold">{customerToDelete.fullName}</span>? This
                  will permanently remove their record from the system.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
