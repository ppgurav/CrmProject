
import { useState, useEffect, useMemo } from "react"
import { z } from "zod"
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
  PanelLeft,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Zod schema for vendor validation
const vendorSchema = z.object({
  id: z.number(),
  vendorName: z.string().min(1, "Vendor name is required"),
  contactPersonName: z.string().optional(),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  alternateNumber: z
    .string()
    .regex(/^\d{10}$/, "Alternate number must be 10 digits")
    .optional()
    .or(z.literal("")),
  emailAddress: z.string().email("Invalid email address").optional().or(z.literal("")),
  vendorType: z.string().min(1, "Vendor type is required"),
  status: z.string().min(1, "Status is required"),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional()
    .or(z.literal("")),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .optional()
    .or(z.literal("")),
  paymentTerms: z.string().optional(),
})

export default function VendorList() {
  // Sample vendor data
  const navigate = useNavigate()
  const handleAddVendor = () => {
    navigate("/vendorlist/vender")
  }

  const [vendors, setVendors] = useState([
    {
      id: 1,
      vendorName: "Tech Solutions Pvt Ltd",
      contactPersonName: "Rajesh Kumar",
      mobileNumber: "9876543210",
      alternateNumber: "9876543211",
      emailAddress: "rajesh@techsolutions.com",
      vendorType: "Supplier",
      status: "Active",
      gstNumber: "29ABCDE1234F1Z5",
      panNumber: "ABCDE1234F",
      address: "123 Tech Park, Electronic City",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560100",
      bankName: "State Bank of India",
      accountHolderName: "Tech Solutions Pvt Ltd",
      accountNumber: "12345678901234",
      ifscCode: "SBIN0001234",
      paymentTerms: "30 days credit",
    },
    {
      id: 2,
      vendorName: "Global Freight Services",
      contactPersonName: "Priya Sharma",
      mobileNumber: "9876543212",
      alternateNumber: "",
      emailAddress: "priya@globalfreight.com",
      vendorType: "Freight",
      status: "Active",
      gstNumber: "27FGHIJ5678K2Z9",
      panNumber: "FGHIJ5678K",
      address: "456 Logistics Hub, Whitefield",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560066",
      bankName: "HDFC Bank",
      accountHolderName: "Global Freight Services",
      accountNumber: "23456789012345",
      ifscCode: "HDFC0001234",
      paymentTerms: "15 days credit",
    },
    {
      id: 3,
      vendorName: "Creative Design Studio",
      contactPersonName: "Amit Patel",
      mobileNumber: "9876543213",
      alternateNumber: "9876543214",
      emailAddress: "amit@creativedesign.com",
      vendorType: "Service Provider",
      status: "Active",
      gstNumber: "24KLMNO9012P3Z7",
      panNumber: "KLMNO9012P",
      address: "789 Design Street, Koramangala",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560034",
      bankName: "ICICI Bank",
      accountHolderName: "Creative Design Studio",
      accountNumber: "34567890123456",
      ifscCode: "ICIC0001234",
      paymentTerms: "45 days credit",
    },
    {
      id: 4,
      vendorName: "Construction Materials Co",
      contactPersonName: "Sunita Reddy",
      mobileNumber: "9876543215",
      alternateNumber: "",
      emailAddress: "sunita@constructionmaterials.com",
      vendorType: "Contractor",
      status: "Active",
      gstNumber: "36QRSTU3456V4Z1",
      panNumber: "QRSTU3456V",
      address: "321 Industrial Area, Peenya",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560058",
      bankName: "Axis Bank",
      accountHolderName: "Construction Materials Co",
      accountNumber: "45678901234567",
      ifscCode: "UTIB0001234",
      paymentTerms: "60 days credit",
    },
    {
      id: 5,
      vendorName: "IT Consulting Group",
      contactPersonName: "Vikram Singh",
      mobileNumber: "9876543216",
      alternateNumber: "9876543217",
      emailAddress: "vikram@itconsulting.com",
      vendorType: "Consultant",
      status: "Inactive",
      gstNumber: "29WXYZAB789C5Z3",
      panNumber: "WXYZAB789C",
      address: "654 IT Corridor, Marathahalli",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560037",
      bankName: "Kotak Mahindra Bank",
      accountHolderName: "IT Consulting Group",
      accountNumber: "56789012345678",
      ifscCode: "KKBK0001234",
      paymentTerms: "30 days credit",
    },
    {
      id: 6,
      vendorName: "Office Supplies Hub",
      contactPersonName: "Meera Joshi",
      mobileNumber: "9876543218",
      alternateNumber: "",
      emailAddress: "meera@officesupplies.com",
      vendorType: "Supplier",
      status: "Active",
      gstNumber: "29DEFGH4567I6Z8",
      panNumber: "DEFGH4567I",
      address: "987 Commercial Street, MG Road",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560001",
      bankName: "Yes Bank",
      accountHolderName: "Office Supplies Hub",
      accountNumber: "67890123456789",
      ifscCode: "YESB0001234",
      paymentTerms: "15 days credit",
    },
  ])

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [vendorTypeFilter, setVendorTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedVendors, setSelectedVendors] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [vendorModalOpen, setVendorModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [vendorToDelete, setVendorToDelete] = useState(null)

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    const filtered = vendors.filter((vendor) => {
      const matchesSearch =
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesVendorType = !vendorTypeFilter || vendor.vendorType.toLowerCase() === vendorTypeFilter
      const matchesStatus = !statusFilter || vendor.status.toLowerCase() === statusFilter

      return matchesSearch && matchesVendorType && matchesStatus
    })

    // Sort vendors
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue
        switch (sortColumn) {
          case "vendorName":
            aValue = a.vendorName.toLowerCase()
            bValue = b.vendorName.toLowerCase()
            break
          case "vendorType":
            aValue = a.vendorType.toLowerCase()
            bValue = b.vendorType.toLowerCase()
            break
          case "contactPersonName":
            aValue = a.contactPersonName?.toLowerCase() || ""
            bValue = b.contactPersonName?.toLowerCase() || ""
            break
          case "city":
            aValue = a.city.toLowerCase()
            bValue = b.city.toLowerCase()
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
  }, [vendors, searchTerm, vendorTypeFilter, statusFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentVendors = filteredVendors.slice(startIndex, endIndex)

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
      setSelectedVendors(currentVendors.map((vendor) => vendor.id))
    } else {
      setSelectedVendors([])
    }
  }

  const handleSelectVendor = (id, checked) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, id])
    } else {
      setSelectedVendors(selectedVendors.filter((vendorId) => vendorId !== id))
      setSelectAll(false)
    }
  }

  const viewVendor = (id) => {
    const vendor = vendors.find((v) => v.id === id)
    setSelectedVendor(vendor)
    setVendorModalOpen(true)
  }

  const deleteVendor = (id) => {
    const vendor = vendors.find((v) => v.id === id)
    setVendorToDelete(vendor)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (vendorToDelete) {
      setVendors(vendors.filter((v) => v.id !== vendorToDelete.id))
      setDeleteModalOpen(false)
      setVendorToDelete(null)
    }
  }

  const exportVendors = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Vendor Name,Contact Person,Mobile,Email,Type,Status,City,State\n" +
      filteredVendors
        .map(
          (vendor) =>
            `"${vendor.vendorName}","${vendor.contactPersonName || ""}","${vendor.mobileNumber}","${vendor.emailAddress || ""}","${vendor.vendorType}","${vendor.status}","${vendor.city}","${vendor.state}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "vendors.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, vendorTypeFilter, statusFilter])

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6">
        {/* Page Title */}
        <div className="">
          {/* <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1> */}
          {/* <p className="text-gray-600 mt-2">Manage your vendors and their information</p> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Vendors */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+3</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Vendors */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {vendors.filter((vendor) => vendor.status === "Active").length}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">83%</span> active rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Vendor Types */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendor Types</p>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Suppliers</span> largest
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* New Vendors */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Vendors</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
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
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Vendor Type Filter */}
              <select
                value={vendorTypeFilter}
                onChange={(e) => setVendorTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="supplier">Supplier</option>
                <option value="service provider">Service Provider</option>
                <option value="freight">Freight</option>
                <option value="contractor">Contractor</option>
                <option value="consultant">Consultant</option>
                <option value="other">Other</option>
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
                onClick={exportVendors}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddVendor}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Vendor Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Vendors</h3>
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

          {/* <div className="block w-full overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    onClick={() => handleSort("vendorName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Vendor
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("vendorType")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Type
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("contactPersonName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th
                    onClick={() => handleSort("city")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Location
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={(e) => handleSelectVendor(vendor.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {vendor.vendorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                          <div className="text-sm text-gray-500">{vendor.gstNumber || "No GST"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vendor.vendorType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.contactPersonName || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {vendor.mobileNumber}
                        </div>
                        {vendor.emailAddress && (
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {vendor.emailAddress}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {vendor.city}, {vendor.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewVendor(vendor.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVendor(vendor.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <div className="w-full overflow-x-auto">
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
        <th onClick={() => handleSort("vendorName")} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
          Vendor 
        </th>
        <th onClick={() => handleSort("vendorType")} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
          Type 
        </th>
        <th onClick={() => handleSort("contactPersonName")} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
          Contact Person
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Contact Info
        </th>
        <th onClick={() => handleSort("city")} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
          Location
        </th>
        <th onClick={() => handleSort("status")} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
          Status
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentVendors.map((vendor) => (
        <tr key={vendor.id} className="hover:bg-gray-50 transition-colors duration-200">
          <td className="px-4 py-4">
            <input
              type="checkbox"
              checked={selectedVendors.includes(vendor.id)}
              onChange={(e) => handleSelectVendor(vendor.id, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {vendor.vendorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{vendor.vendorName}</div>
                <div className="text-sm text-gray-500">{vendor.gstNumber || "No GST"}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {vendor.vendorType}
            </span>
          </td>
          <td className="px-4 py-4 text-sm text-gray-900">
            {vendor.contactPersonName || "Not specified"}
          </td>
          <td className="px-4 py-4 text-sm text-gray-500">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {vendor.mobileNumber}
              </div>
              {vendor.emailAddress && (
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {vendor.emailAddress}
                </div>
              )}
            </div>
          </td>
          <td className="px-4 py-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {vendor.city}, {vendor.state}
            </div>
          </td>
          <td className="px-4 py-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {vendor.status}
            </span>
          </td>
          <td className="px-4 py-4 text-sm font-medium">
            <div className="flex items-center space-x-2 flex-wrap">
              <button
                onClick={() => viewVendor(vendor.id)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteVendor(vendor.id)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Delete"
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
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredVendors.length)}</span> of{" "}
                <span>{filteredVendors.length}</span> entries
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

      {/* Vendor Details Modal */}
      {vendorModalOpen && selectedVendor && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Vendor Details</h3>
                  <button onClick={() => setVendorModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                        <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                        <p className="text-gray-900">{selectedVendor.vendorName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Person</label>
                        <p className="text-gray-900">{selectedVendor.contactPersonName || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                        <p className="text-gray-900">{selectedVendor.vendorType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedVendor.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedVendor.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                        <p className="text-gray-900">{selectedVendor.mobileNumber}</p>
                      </div>
                      {selectedVendor.alternateNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Alternate Number</label>
                          <p className="text-gray-900">{selectedVendor.alternateNumber}</p>
                        </div>
                      )}
                      {selectedVendor.emailAddress && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email Address</label>
                          <p className="text-gray-900">{selectedVendor.emailAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Address Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">{selectedVendor.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-gray-900">{selectedVendor.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <p className="text-gray-900">{selectedVendor.state}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pincode</label>
                        <p className="text-gray-900">{selectedVendor.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tax Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Tax Information</h4>
                    <div className="space-y-3">
                      {selectedVendor.gstNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">GST Number</label>
                          <p className="text-gray-900">{selectedVendor.gstNumber}</p>
                        </div>
                      )}
                      {selectedVendor.panNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">PAN Number</label>
                          <p className="text-gray-900">{selectedVendor.panNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Bank Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedVendor.bankName && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Bank Name</label>
                          <p className="text-gray-900">{selectedVendor.bankName}</p>
                        </div>
                      )}
                      {selectedVendor.accountHolderName && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Account Holder Name</label>
                          <p className="text-gray-900">{selectedVendor.accountHolderName}</p>
                        </div>
                      )}
                      {selectedVendor.accountNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Account Number</label>
                          <p className="text-gray-900">{selectedVendor.accountNumber}</p>
                        </div>
                      )}
                      {selectedVendor.ifscCode && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                          <p className="text-gray-900">{selectedVendor.ifscCode}</p>
                        </div>
                      )}
                      {selectedVendor.paymentTerms && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                          <p className="text-gray-900">{selectedVendor.paymentTerms}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Edit Vendor
                  </button>
                  <button
                    onClick={() => setVendorModalOpen(false)}
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
      {deleteModalOpen && vendorToDelete && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Vendor</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{vendorToDelete.vendorName}</span>?
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
