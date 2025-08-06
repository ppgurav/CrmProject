import { useState, useEffect, useMemo } from "react"
import { z } from "zod"
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  PanelLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Zod schema for invoice validation
const invoiceSchema = z.object({
  id: z.number(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email format"),
  invoiceDate: z.string(),
  dueDate: z.string(),
  amount: z.number().positive("Amount must be positive"),
  status: z.enum(["paid", "pending", "overdue", "cancelled"]),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      rate: z.number(),
      amount: z.number(),
    }),
  ),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
})

export default function Invoice() {
  // Sample invoice data
  const navigate = useNavigate()

  const handleAddInvoice = () => {
    navigate("/sale/invoice/addInvoice")
  }

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      customerName: "Acme Corporation",
      customerEmail: "billing@acme.com",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-14",
      amount: 15750.0,
      status: "paid",
      items: [
        { description: "Web Development Services", quantity: 1, rate: 12000, amount: 12000 },
        { description: "SEO Optimization", quantity: 1, rate: 3750, amount: 3750 },
      ],
      paymentTerms: "Net 30",
      notes: "Thank you for your business!",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      customerName: "Tech Solutions Ltd",
      customerEmail: "accounts@techsolutions.com",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-19",
      amount: 8500.0,
      status: "pending",
      items: [{ description: "Mobile App Development", quantity: 1, rate: 8500, amount: 8500 }],
      paymentTerms: "Net 30",
      notes: "Phase 1 development completed",
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      customerName: "Design Studio Pro",
      customerEmail: "finance@designstudio.com",
      invoiceDate: "2024-01-10",
      dueDate: "2024-02-09",
      amount: 5200.0,
      status: "overdue",
      items: [{ description: "Graphic Design Services", quantity: 4, rate: 1300, amount: 5200 }],
      paymentTerms: "Net 30",
      notes: "Logo and branding package",
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      customerName: "Marketing Hub Inc",
      customerEmail: "billing@marketinghub.com",
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-24",
      amount: 12300.0,
      status: "pending",
      items: [
        { description: "Digital Marketing Campaign", quantity: 1, rate: 10000, amount: 10000 },
        { description: "Content Creation", quantity: 1, rate: 2300, amount: 2300 },
      ],
      paymentTerms: "Net 30",
      notes: "Q1 marketing campaign",
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      customerName: "StartUp Ventures",
      customerEmail: "admin@startupventures.com",
      invoiceDate: "2024-01-30",
      dueDate: "2024-03-01",
      amount: 7800.0,
      status: "paid",
      items: [{ description: "Website Maintenance", quantity: 12, rate: 650, amount: 7800 }],
      paymentTerms: "Net 30",
      notes: "Annual maintenance contract",
    },
    {
      id: 6,
      invoiceNumber: "INV-2024-006",
      customerName: "Global Enterprises",
      customerEmail: "payments@globalent.com",
      invoiceDate: "2024-02-01",
      dueDate: "2024-03-03",
      amount: 18900.0,
      status: "pending",
      items: [
        { description: "E-commerce Platform", quantity: 1, rate: 15000, amount: 15000 },
        { description: "Payment Integration", quantity: 1, rate: 3900, amount: 3900 },
      ],
      paymentTerms: "Net 30",
      notes: "Custom e-commerce solution",
    },
  ])

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort invoices
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortColumn) {
          case "invoiceNumber":
            aValue = a.invoiceNumber.toLowerCase()
            bValue = b.invoiceNumber.toLowerCase()
            break
          case "customerName":
            aValue = a.customerName.toLowerCase()
            bValue = b.customerName.toLowerCase()
            break
          case "invoiceDate":
            aValue = new Date(a.invoiceDate)
            bValue = new Date(b.invoiceDate)
            break
          case "dueDate":
            aValue = new Date(a.dueDate)
            bValue = new Date(b.dueDate)
            break
          case "amount":
            aValue = a.amount
            bValue = b.amount
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
  }, [invoices, searchTerm, statusFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

  // Helper functions
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
      setSelectedInvoices(currentInvoices.map((inv) => inv.id))
    } else {
      setSelectedInvoices([])
    }
  }

  const handleSelectInvoice = (id, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, id])
    } else {
      setSelectedInvoices(selectedInvoices.filter((invId) => invId !== id))
      setSelectAll(false)
    }
  }

  const viewInvoice = (id) => {
    const invoice = invoices.find((inv) => inv.id === id)
    setSelectedInvoice(invoice)
    setInvoiceModalOpen(true)
  }

  const deleteInvoice = (id) => {
    const invoice = invoices.find((inv) => inv.id === id)
    setInvoiceToDelete(invoice)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (invoiceToDelete) {
      setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete.id))
      setDeleteModalOpen(false)
      setInvoiceToDelete(null)
    }
  }

  const exportInvoices = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Invoice Number,Customer,Email,Invoice Date,Due Date,Amount,Status\n" +
      filteredInvoices
        .map(
          (inv) =>
            `"${inv.invoiceNumber}","${inv.customerName}","${inv.customerEmail}","${inv.invoiceDate}","${inv.dueDate}","${formatCurrency(inv.amount)}","${inv.status}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "invoices.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate stats
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending").length
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter((inv) => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6">
        {/* Page Title */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage your invoices and track payments</p>
        </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+3</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Paid Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-gray-900">{paidInvoices}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingInvoices}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <span className="font-medium">{formatCurrency(pendingAmount)}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Overdue Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">{overdueInvoices}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">Needs attention</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportInvoices}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddInvoice}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>
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

          <div className="overflow-x-auto">
            <table className="w-full">
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
                    onClick={() => handleSort("invoiceNumber")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Invoice Number
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("customerName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Customer
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("invoiceDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Invoice Date
                  </th>
                  <th
                    onClick={() => handleSort("dueDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Due Date
                  </th>
                  <th
                    onClick={() => handleSort("amount")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Amount
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
                {currentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {invoice.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                          <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewInvoice(invoice.id)}
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
                          onClick={() => deleteInvoice(invoice.id)}
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
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredInvoices.length)}</span> of{" "}
                <span>{filteredInvoices.length}</span> entries
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

      {/* Invoice Details Modal */}
      {invoiceModalOpen && selectedInvoice && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                  <button onClick={() => setInvoiceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Invoice Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                        <p className="text-gray-900">{selectedInvoice.invoiceNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Invoice Date</label>
                        <p className="text-gray-900">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Due Date</label>
                        <p className="text-gray-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                        <p className="text-gray-900">{selectedInvoice.paymentTerms || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer Name</label>
                        <p className="text-gray-900">{selectedInvoice.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedInvoice.customerEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}
                        >
                          {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedInvoice.amount)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Invoice Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm text-gray-900">{item.description}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Notes</h4>
                    <p className="text-gray-700">{selectedInvoice.notes}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Edit Invoice
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Download PDF
                  </button>
                  <button
                    onClick={() => setInvoiceModalOpen(false)}
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
      {deleteModalOpen && invoiceToDelete && (
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete Invoice</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete invoice{" "}
                  <span className="font-semibold">{invoiceToDelete.invoiceNumber}</span>? This will permanently remove
                  the invoice from the system.
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
