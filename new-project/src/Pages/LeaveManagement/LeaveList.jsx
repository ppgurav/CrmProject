import { useState, useEffect, useMemo } from "react"
import { z } from "zod"
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  PanelLeft,
  Heart,
  Sun,
  AlertCircle,
  Coffee,
} from "lucide-react"

// Zod schema for leave application validation
const leaveApplicationSchema = z.object({
  id: z.number(),
  employeeName: z.string().min(1, "Employee name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  leaveType: z.string().min(1, "Leave type is required"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().min(1, "To date is required"),
  reason: z.string().min(1, "Reason is required"),
  appliedDate: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  duration: z.number().positive("Duration must be positive"),
  halfDay: z.boolean(),
  department: z.string().min(1, "Department is required"),
})

export default function LeaveList() {
  // Sample leave application data
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      leaveType: "Sick Leave",
      fromDate: "2024-01-15",
      toDate: "2024-01-16",
      reason: "Fever and flu symptoms. Need rest to recover.",
      appliedDate: "2024-01-12",
      status: "approved",
      approvedBy: "John Manager",
      duration: 2,
      halfDay: false,
      department: "Engineering",
    },
    {
      id: 2,
      employeeName: "Michael Chen",
      employeeId: "EMP002",
      leaveType: "Vacation Leave",
      fromDate: "2024-02-01",
      toDate: "2024-02-05",
      reason: "Family vacation to Goa. Pre-planned trip with family.",
      appliedDate: "2024-01-20",
      status: "pending",
      duration: 5,
      halfDay: false,
      department: "Marketing",
    },
    {
      id: 3,
      employeeName: "Emily Rodriguez",
      employeeId: "EMP003",
      leaveType: "Casual Leave",
      fromDate: "2024-01-25",
      toDate: "2024-01-25",
      reason: "Personal work - bank visit and documentation.",
      appliedDate: "2024-01-23",
      status: "approved",
      approvedBy: "Sarah Manager",
      duration: 0.5,
      halfDay: true,
      department: "Design",
    },
    {
      id: 4,
      employeeName: "David Kumar",
      employeeId: "EMP004",
      leaveType: "Emergency Leave",
      fromDate: "2024-01-18",
      toDate: "2024-01-19",
      reason: "Family emergency - father hospitalized.",
      appliedDate: "2024-01-18",
      status: "approved",
      approvedBy: "John Manager",
      duration: 2,
      halfDay: false,
      department: "Sales",
    },
    {
      id: 5,
      employeeName: "Lisa Thompson",
      employeeId: "EMP005",
      leaveType: "Sick Leave",
      fromDate: "2024-01-22",
      toDate: "2024-01-24",
      reason: "Migraine and severe headache. Doctor advised rest.",
      appliedDate: "2024-01-21",
      status: "rejected",
      rejectionReason: "Insufficient sick leave balance",
      duration: 3,
      halfDay: false,
      department: "HR",
    },
    {
      id: 6,
      employeeName: "James Wilson",
      employeeId: "EMP006",
      leaveType: "Casual Leave",
      fromDate: "2024-02-10",
      toDate: "2024-02-10",
      reason: "Wedding ceremony of cousin. Family function.",
      appliedDate: "2024-02-05",
      status: "pending",
      duration: 1,
      halfDay: false,
      department: "Finance",
    },
    {
      id: 7,
      employeeName: "Anna Smith",
      employeeId: "EMP007",
      leaveType: "Vacation Leave",
      fromDate: "2024-03-15",
      toDate: "2024-03-20",
      reason: "Annual vacation with family to Kerala backwaters.",
      appliedDate: "2024-02-28",
      status: "approved",
      approvedBy: "Mike Director",
      duration: 6,
      halfDay: false,
      department: "Operations",
    },
    {
      id: 8,
      employeeName: "Robert Brown",
      employeeId: "EMP008",
      leaveType: "Emergency Leave",
      fromDate: "2024-01-30",
      toDate: "2024-01-30",
      reason: "Child fell sick, need to take to hospital.",
      appliedDate: "2024-01-30",
      status: "pending",
      duration: 0.5,
      halfDay: true,
      department: "Engineering",
    },
  ])

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedApplications, setSelectedApplications] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [applicationModalOpen, setApplicationModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [applicationToDelete, setApplicationToDelete] = useState(null)

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    const filtered = leaveApplications.filter((application) => {
      const matchesSearch =
        application.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.reason.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLeaveType =
        !leaveTypeFilter || application.leaveType.toLowerCase().includes(leaveTypeFilter.toLowerCase())
      const matchesStatus = !statusFilter || application.status === statusFilter
      const matchesDepartment = !departmentFilter || application.department.toLowerCase() === departmentFilter

      return matchesSearch && matchesLeaveType && matchesStatus && matchesDepartment
    })

    // Sort applications
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue
        switch (sortColumn) {
          case "employeeName":
            aValue = a.employeeName.toLowerCase()
            bValue = b.employeeName.toLowerCase()
            break
          case "leaveType":
            aValue = a.leaveType.toLowerCase()
            bValue = b.leaveType.toLowerCase()
            break
          case "fromDate":
            aValue = new Date(a.fromDate)
            bValue = new Date(b.fromDate)
            break
          case "appliedDate":
            aValue = new Date(a.appliedDate)
            bValue = new Date(b.appliedDate)
            break
          case "duration":
            aValue = a.duration
            bValue = b.duration
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
  }, [leaveApplications, searchTerm, leaveTypeFilter, statusFilter, departmentFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentApplications = filteredApplications.slice(startIndex, endIndex)

  // Helper functions
  const getLeaveTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "sick leave":
        return Heart
      case "vacation leave":
        return Sun
      case "casual leave":
        return Coffee
      case "emergency leave":
        return AlertCircle
      default:
        return Calendar
    }
  }

  const getLeaveTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "sick leave":
        return "bg-red-100 text-red-800"
      case "vacation leave":
        return "bg-purple-100 text-purple-800"
      case "casual leave":
        return "bg-green-100 text-green-800"
      case "emergency leave":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (duration, halfDay) => {
    if (halfDay) {
      return "Half Day"
    }
    return duration === 1 ? "1 Day" : `${duration} Days`
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
      setSelectedApplications(currentApplications.map((app) => app.id))
    } else {
      setSelectedApplications([])
    }
  }

  const handleSelectApplication = (id, checked) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, id])
    } else {
      setSelectedApplications(selectedApplications.filter((appId) => appId !== id))
      setSelectAll(false)
    }
  }

  const viewApplication = (id) => {
    const application = leaveApplications.find((app) => app.id === id)
    setSelectedApplication(application)
    setApplicationModalOpen(true)
  }

  const deleteApplication = (id) => {
    const application = leaveApplications.find((app) => app.id === id)
    setApplicationToDelete(application)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (applicationToDelete) {
      setLeaveApplications(leaveApplications.filter((app) => app.id !== applicationToDelete.id))
      setDeleteModalOpen(false)
      setApplicationToDelete(null)
    }
  }

  const exportApplications = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Employee Name,Employee ID,Leave Type,From Date,To Date,Duration,Status,Applied Date,Reason\n" +
      filteredApplications
        .map(
          (app) =>
            `"${app.employeeName}","${app.employeeId}","${app.leaveType}","${app.fromDate}","${app.toDate}","${formatDuration(app.duration, app.halfDay)}","${app.status}","${app.appliedDate}","${app.reason}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "leave_applications.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, leaveTypeFilter, statusFilter, departmentFilter])

  // Calculate stats
  const totalApplications = leaveApplications.length
  const pendingApplications = leaveApplications.filter((app) => app.status === "pending").length
  const approvedApplications = leaveApplications.filter((app) => app.status === "approved").length
  const rejectedApplications = leaveApplications.filter((app) => app.status === "rejected").length

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6">
        {/* Page Title */}
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900">Leave Applications</h1> */}
          {/* <p className="text-gray-600 mt-2">Manage and track all leave requests</p> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">+3</span> this week
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingApplications}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <span className="font-medium">Awaiting</span> approval
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedApplications}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{Math.round((approvedApplications / totalApplications) * 100)}%</span>{" "}
                  approval rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Rejected Applications */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{rejectedApplications}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">This month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Leave Type Filter */}
              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Leave Types</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="design">Design</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportApplications}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={() => (window.location.href = "/leave-management/apply-leave")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Apply Leave
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Leave Applications</h3>
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
                    onClick={() => handleSort("employeeName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Employee
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("leaveType")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Leave Type
                    <PanelLeft className="inline-block w-4 h-4 ml-1" />
                  </th>
                  <th
                    onClick={() => handleSort("fromDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Leave Dates
                  </th>
                  <th
                    onClick={() => handleSort("duration")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Duration
                  </th>
                  <th
                    onClick={() => handleSort("appliedDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Applied Date
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
                {currentApplications.map((application) => {
                  const LeaveIcon = getLeaveTypeIcon(application.leaveType)
                  return (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(application.id)}
                          onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {application.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.employeeName}</div>
                            <div className="text-sm text-gray-500">
                              {application.employeeId} • {application.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <LeaveIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(application.leaveType)}`}
                          >
                            {application.leaveType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {new Date(application.fromDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(application.toDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(application.duration, application.halfDay)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.appliedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewApplication(application.id)}
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
                            onClick={() => deleteApplication(application.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredApplications.length)}</span>{" "}
                of <span>{filteredApplications.length}</span> entries
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

      {/* Application Details Modal */}
      {applicationModalOpen && selectedApplication && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
         <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Leave Application Details</h3>
                  <button onClick={() => setApplicationModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Employee Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee Name</label>
                        <p className="text-gray-900">{selectedApplication.employeeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee ID</label>
                        <p className="text-gray-900">{selectedApplication.employeeId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-gray-900">{selectedApplication.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Leave Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Leave Type</label>
                        <div className="flex items-center mt-1">
                          {(() => {
                            const LeaveIcon = getLeaveTypeIcon(selectedApplication.leaveType)
                            return <LeaveIcon className="w-4 h-4 mr-2 text-gray-500" />
                          })()}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(selectedApplication.leaveType)}`}
                          >
                            {selectedApplication.leaveType}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Duration</label>
                        <p className="text-gray-900">
                          {formatDuration(selectedApplication.duration, selectedApplication.halfDay)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}
                        >
                          {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Leave Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">From Date</label>
                        <p className="text-gray-900">{new Date(selectedApplication.fromDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">To Date</label>
                        <p className="text-gray-900">{new Date(selectedApplication.toDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Applied Date</label>
                        <p className="text-gray-900">
                          {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedApplication.approvedBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Approved By</label>
                          <p className="text-gray-900">{selectedApplication.approvedBy}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reason</label>
                      <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">{selectedApplication.reason}</p>
                    </div>
                    {selectedApplication.rejectionReason && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                        <p className="text-red-700 mt-1 p-3 bg-red-50 rounded-lg">
                          {selectedApplication.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Edit Application
                  </button>
                  <button
                    onClick={() => setApplicationModalOpen(false)}
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
      {deleteModalOpen && applicationToDelete && (
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete Leave Application</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete the leave application by{" "}
                  <span className="font-semibold">{applicationToDelete.employeeName}</span> for{" "}
                  <span className="font-semibold">{applicationToDelete.leaveType}</span>? This will permanently remove
                  the application from the system.
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
