"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Users,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react"

// Helper functions
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function formatDate(date) {
  if (!date) return ""
  const dt = typeof date === "string" ? new Date(date) : date
  if (isNaN(dt.getTime())) return ""
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, "0")
  const day = String(dt.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function downloadText(filename, mimeType, text) {
  const blob = new Blob([text], { type: mimeType + ";charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function exportCSV(rows, columns, filename) {
  const header = columns.map((col) => col.header).join(",")
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]
          const val = value == null ? "" : String(value)
          return `"${val.replace(/"/g, '""')}"`
        })
        .join(","),
    )
    .join("\n")
  downloadText(filename.endsWith(".csv") ? filename : filename + ".csv", "text/csv", header + "\n" + body)
}

function exportExcel(rows, columns, filename) {
  const tableHead =
    "<tr>" +
    columns.map((col) => `<th style="border:1px solid #ccc;padding:6px;text-align:left">${col.header}</th>`).join("") +
    "</tr>"
  const tableBody = rows
    .map((row) => {
      const cells = columns
        .map((col) => {
          const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]
          const val = value == null ? "" : String(value)
          return `<td style="border:1px solid #ddd;padding:6px">${val.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`
        })
        .join("")
      return `<tr>${cells}</tr>`
    })
    .join("")
  const html =
    `<html><head><meta charset="utf-8" /></head><body>` +
    `<table style="border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px">${tableHead}${tableBody}</table>` +
    `</body></html>`
  downloadText(filename.endsWith(".xls") ? filename : filename + ".xls", "application/vnd.ms-excel", html)
}

// Sample data
const sampleData = {
  sales: [
    {
      id: 1,
      date: "2025-01-15",
      invoice: "INV-1001",
      customer: "Rajesh Kumar",
      amount: 1250.5,
      method: "Card",
      status: "Paid",
    },
    {
      id: 2,
      date: "2025-01-16",
      invoice: "INV-1002",
      customer: "Priya Sharma",
      amount: 980.0,
      method: "Wire Transfer",
      status: "Pending",
    },
    {
      id: 3,
      date: "2025-01-18",
      invoice: "INV-1003",
      customer: "Amit Patel",
      amount: 2330.75,
      method: "Cash",
      status: "Paid",
    },
    {
      id: 4,
      date: "2025-01-20",
      invoice: "INV-1004",
      customer: "Sneha Reddy",
      amount: 1875.25,
      method: "Card",
      status: "Paid",
    },
    {
      id: 5,
      date: "2025-01-22",
      invoice: "INV-1005",
      customer: "Vikram Singh",
      amount: 3200.0,
      method: "Wire Transfer",
      status: "Pending",
    },
  ],
  purchases: [
    {
      id: 1,
      date: "2025-01-12",
      vendor: "Global Supplies Ltd",
      category: "Office Supplies",
      amount: 320.99,
      method: "Card",
      status: "Approved",
    },
    {
      id: 2,
      date: "2025-01-15",
      vendor: "CloudHost Services",
      category: "Software",
      amount: 199.0,
      method: "Card",
      status: "Approved",
    },
    {
      id: 3,
      date: "2025-01-18",
      vendor: "CourierX Express",
      category: "Logistics",
      amount: 75.5,
      method: "Cash",
      status: "Pending",
    },
    {
      id: 4,
      date: "2025-01-20",
      vendor: "Tech Equipment Co",
      category: "Hardware",
      amount: 1250.0,
      method: "Wire Transfer",
      status: "Approved",
    },
  ],
  payroll: [
    {
      id: 1,
      month: "2025-01",
      employee: "Alex Johnson",
      role: "Manager",
      gross: 3500.0,
      deductions: 300.0,
      net: 3200.0,
      status: "Paid",
      paidOn: "2025-01-30",
    },
    {
      id: 2,
      month: "2025-01",
      employee: "Priya Singh",
      role: "Sales Executive",
      gross: 2600.0,
      deductions: 150.0,
      net: 2450.0,
      status: "Paid",
      paidOn: "2025-01-30",
    },
    {
      id: 3,
      month: "2025-01",
      employee: "Marco Liu",
      role: "Support Specialist",
      gross: 2400.0,
      deductions: 100.0,
      net: 2300.0,
      status: "Pending",
      paidOn: "",
    },
  ],
  attendance: [
    {
      id: 1,
      date: "2025-01-22",
      employee: "Alex Johnson",
      checkIn: "09:03",
      checkOut: "17:46",
      hours: 8.7,
      status: "Present",
    },
    {
      id: 2,
      date: "2025-01-22",
      employee: "Priya Singh",
      checkIn: "09:11",
      checkOut: "18:10",
      hours: 8.98,
      status: "Present",
    },
    {
      id: 3,
      date: "2025-01-22",
      employee: "Marco Liu",
      checkIn: "",
      checkOut: "",
      hours: 0,
      status: "Absent",
    },
  ],
}

// Report configurations
const REPORTS = [
  { key: "sales", label: "Sales Report", icon: TrendingUp },
  { key: "purchases", label: "Purchase Report", icon: ClipboardList },
  { key: "payroll", label: "Payroll Report", icon: Users },
  { key: "attendance", label: "Attendance Report", icon: Clock },
]

// Column definitions for each report type
const COLUMNS = {
  sales: [
    { header: "Date", accessor: "date" },
    { header: "Invoice #", accessor: "invoice" },
    { header: "Customer", accessor: "customer" },
    { header: "Amount", accessor: (row) => `$${row.amount.toFixed(2)}` },
    { header: "Method", accessor: "method" },
    { header: "Status", accessor: "status" },
  ],
  purchases: [
    { header: "Date", accessor: "date" },
    { header: "Vendor", accessor: "vendor" },
    { header: "Category", accessor: "category" },
    { header: "Amount", accessor: (row) => `$${row.amount.toFixed(2)}` },
    { header: "Method", accessor: "method" },
    { header: "Status", accessor: "status" },
  ],
  payroll: [
    { header: "Month", accessor: "month" },
    { header: "Employee", accessor: "employee" },
    { header: "Role", accessor: "role" },
    { header: "Gross", accessor: (row) => `$${row.gross.toFixed(2)}` },
    { header: "Deductions", accessor: (row) => `$${row.deductions.toFixed(2)}` },
    { header: "Net Pay", accessor: (row) => `$${row.net.toFixed(2)}` },
    { header: "Status", accessor: "status" },
    { header: "Paid On", accessor: "paidOn" },
  ],
  attendance: [
    { header: "Date", accessor: "date" },
    { header: "Employee", accessor: "employee" },
    { header: "Check In", accessor: "checkIn" },
    { header: "Check Out", accessor: "checkOut" },
    { header: "Hours", accessor: (row) => row.hours.toFixed(2) },
    { header: "Status", accessor: "status" },
  ],
}

export default function ReportAnaly() {
  // State management
  const [activeReport, setActiveReport] = useState("sales")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  // Get current data based on active report
  const currentData = useMemo(() => sampleData[activeReport] || [], [activeReport])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeReport, searchTerm, dateFrom, dateTo, statusFilter])

  // Filter and sort data
  const filteredData = useMemo(() => {
    const filtered = currentData.filter((item) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        Object.values(item).some((value) => value && String(value).toLowerCase().includes(searchTerm.toLowerCase()))

      // Date filter
      const itemDate = item.date || item.month
      const matchesDateRange = (!dateFrom || itemDate >= dateFrom) && (!dateTo || itemDate <= dateTo)

      // Status filter
      const matchesStatus = !statusFilter || item.status === statusFilter

      return matchesSearch && matchesDateRange && matchesStatus
    })

    // Sort data
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue = a[sortColumn]
        let bValue = b[sortColumn]

        // Handle numeric values
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        // Handle string values
        aValue = String(aValue || "").toLowerCase()
        bValue = String(bValue || "").toLowerCase()

        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    return filtered
  }, [currentData, searchTerm, dateFrom, dateTo, statusFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  // Calculate statistics for current report
  const statistics = useMemo(() => {
    switch (activeReport) {
      case "sales": {
        const totalAmount = currentData.reduce((sum, item) => sum + item.amount, 0)
        const paidCount = currentData.filter((item) => item.status === "Paid").length
        const pendingCount = currentData.filter((item) => item.status === "Pending").length
        return [
          { label: "Total Sales", value: currentData.length, icon: FileText },
          { label: "Total Revenue", value: `$${totalAmount.toFixed(2)}`, icon: DollarSign },
          { label: "Paid Invoices", value: paidCount, icon: CheckCircle },
          { label: "Pending", value: pendingCount, icon: AlertTriangle },
        ]
      }
      case "purchases": {
        const totalAmount = currentData.reduce((sum, item) => sum + item.amount, 0)
        const approvedCount = currentData.filter((item) => item.status === "Approved").length
        const pendingCount = currentData.filter((item) => item.status === "Pending").length
        return [
          { label: "Total Purchases", value: currentData.length, icon: ClipboardList },
          { label: "Total Spent", value: `$${totalAmount.toFixed(2)}`, icon: DollarSign },
          { label: "Approved", value: approvedCount, icon: CheckCircle },
          { label: "Pending", value: pendingCount, icon: AlertTriangle },
        ]
      }
      case "payroll": {
        const totalNet = currentData.reduce((sum, item) => sum + item.net, 0)
        const paidCount = currentData.filter((item) => item.status === "Paid").length
        const pendingCount = currentData.filter((item) => item.status === "Pending").length
        return [
          { label: "Total Employees", value: currentData.length, icon: Users },
          { label: "Total Payroll", value: `$${totalNet.toFixed(2)}`, icon: DollarSign },
          { label: "Paid", value: paidCount, icon: CheckCircle },
          { label: "Pending", value: pendingCount, icon: AlertTriangle },
        ]
      }
      case "attendance": {
        const presentCount = currentData.filter((item) => item.status === "Present").length
        const absentCount = currentData.filter((item) => item.status === "Absent").length
        const avgHours = currentData.length
          ? (currentData.reduce((sum, item) => sum + (item.hours || 0), 0) / currentData.length).toFixed(1)
          : "0.0"
        return [
          { label: "Total Records", value: currentData.length, icon: Clock },
          { label: "Present", value: presentCount, icon: CheckCircle },
          { label: "Absent", value: absentCount, icon: AlertTriangle },
          { label: "Avg Hours", value: `${avgHours}h`, icon: TrendingUp },
        ]
      }
      default:
        return []
    }
  }, [activeReport, currentData])

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Export functions
  const handleExportCSV = () => {
    const columns = COLUMNS[activeReport] || []
    exportCSV(filteredData, columns, `${activeReport}-report`)
  }

  const handleExportExcel = () => {
    const columns = COLUMNS[activeReport] || []
    exportExcel(filteredData, columns, `${activeReport}-report`)
  }

  const columns = COLUMNS[activeReport] || []

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <main className="p-6 ml-4">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive business reports with export capabilities for sales, purchases, payroll, and attendance.
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {REPORTS.map((report) => {
              const Icon = report.icon
              const isActive = activeReport === report.key
              return (
                <button
                  key={report.key}
                  onClick={() => setActiveReport(report.key)}
                  className={classNames(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50 border border-gray-200 bg-white",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {report.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statistics.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mr-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Date From */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Date To */}
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            {/* Export Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium bg-white"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleExportExcel}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <FileText className="inline-block w-5 h-5 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {REPORTS.find((r) => r.key === activeReport)?.label || "Report Data"}
              </h3>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.header}
                      onClick={() => typeof column.accessor === "string" && handleSort(column.accessor)}
                      className={classNames(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        typeof column.accessor === "string" ? "cursor-pointer hover:bg-gray-100" : "",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {column.header}
                        {typeof column.accessor === "string" && sortColumn === column.accessor && (
                          <span className="text-indigo-600">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columns.map((column, colIndex) => {
                      const value =
                        typeof column.accessor === "function" ? column.accessor(item) : item[column.accessor]

                      return (
                        <td key={colIndex} className="px-4 py-4 text-sm text-gray-900">
                          {column.accessor === "status" ? (
                            <span
                              className={classNames(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                value === "Paid" || value === "Approved" || value === "Present"
                                  ? "bg-green-100 text-green-800"
                                  : value === "Pending" || value === "Absent"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800",
                              )}
                            >
                              {value}
                            </span>
                          ) : (
                            value || "-"
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
                      No data found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> of{" "}
                <span className="font-medium">{filteredData.length}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={classNames(
                          "px-3 py-2 border rounded-lg",
                          page === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-500 hover:bg-gray-50",
                        )}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
