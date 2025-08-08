import { useState } from "react"
import { z } from "zod"
import { Filter, CheckCircle, XCircle, Eye, Edit, RotateCcw, Camera, X, ChevronLeft, ChevronRight } from "lucide-react"

// Zod schemas for validation
const FilterSchema = z.object({
  dateFrom: z.string().min(1, "From date is required"),
  dateTo: z.string().min(1, "To date is required"),
  employee: z.string().optional(),
  status: z.string().optional(),
})

const ActionSchema = z.object({
  requestId: z.number(),
  action: z.enum(["approve", "reject", "revoke"]),
  reason: z.string().optional(),
})

// Sample data
const sampleRequests = [
  {
    id: 1,
    date: "02-Aug-25",
    employee: { name: "Anjali Sharma", team: "Design Team", avatar: "A", color: "from-purple-500 to-pink-500" },
    inTime: "10:05",
    outTime: "18:45",
    notes: "Logo design task",
    hasSelfie: true,
    status: "pending",
  },
  {
    id: 2,
    date: "01-Aug-25",
    employee: { name: "Amit Singh", team: "Engineering", avatar: "A", color: "from-green-500 to-emerald-500" },
    inTime: "09:55",
    outTime: "17:58",
    notes: "Coding task",
    hasSelfie: false,
    status: "approved",
    approvedBy: "John Doe",
    approvedAt: "01-Aug-25 11:30",
  },
  {
    id: 3,
    date: "03-Aug-25",
    employee: { name: "Priya Patel", team: "Marketing", avatar: "P", color: "from-blue-500 to-indigo-500" },
    inTime: "09:30",
    outTime: "18:15",
    notes: "Campaign planning",
    hasSelfie: true,
    status: "pending",
  },
  {
    id: 4,
    date: "31-Jul-25",
    employee: { name: "Ravi Kumar", team: "Engineering", avatar: "R", color: "from-yellow-500 to-orange-500" },
    inTime: "11:00",
    outTime: "19:30",
    notes: "Personal work",
    hasSelfie: false,
    status: "rejected",
    rejectedBy: "John Doe",
    rejectedAt: "31-Jul-25 14:20",
  },
  {
    id: 5,
    date: "04-Aug-25",
    employee: { name: "Meera Singh", team: "HR", avatar: "M", color: "from-pink-500 to-rose-500" },
    inTime: "09:15",
    outTime: "17:45",
    notes: "Policy review",
    hasSelfie: true,
    status: "pending",
  },
]

export default function WFTlist() {
  const [filters, setFilters] = useState({
    dateFrom: "2024-08-01",
    dateTo: "2024-08-08",
    employee: "",
    status: "",
  })

  const [selectedRequests, setSelectedRequests] = useState(new Set())
  const [requests, setRequests] = useState(sampleRequests)
  const [showSelfieModal, setShowSelfieModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [currentSelfie, setCurrentSelfie] = useState(null)
  const [currentAction, setCurrentAction] = useState(null)
  const [actionReason, setActionReason] = useState("")
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const applyFilters = () => {
    try {
      FilterSchema.parse(filters)
      showNotification("Filters applied successfully!", "success")
    } catch (error) {
      showNotification("Please fill in required filter fields", "error")
    }
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: "2024-08-01",
      dateTo: "2024-08-08",
      employee: "",
      status: "",
    })
    showNotification("Filters cleared!", "info")
  }

  const toggleSelectAll = () => {
    if (selectedRequests.size === requests.length) {
      setSelectedRequests(new Set())
    } else {
      setSelectedRequests(new Set(requests.map((r) => r.id)))
    }
  }

  const toggleRequestSelection = (requestId) => {
    const newSelected = new Set(selectedRequests)
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId)
    } else {
      newSelected.add(requestId)
    }
    setSelectedRequests(newSelected)
  }

  const viewSelfie = (requestId, employeeName) => {
    setCurrentSelfie({ requestId, employeeName })
    setShowSelfieModal(true)
  }

  const openActionModal = (action, requestId) => {
    setCurrentAction({ action, requestId })
    setShowActionModal(true)
  }

  const confirmAction = () => {
    try {
      ActionSchema.parse({
        requestId: currentAction.requestId,
        action: currentAction.action,
        reason: actionReason,
      })

      // Update request status
      setRequests((prev) =>
        prev.map((req) =>
          req.id === currentAction.requestId
            ? {
                ...req,
                status:
                  currentAction.action === "approve"
                    ? "approved"
                    : currentAction.action === "reject"
                      ? "rejected"
                      : req.status,
              }
            : req,
        ),
      )

      const actionMessages = {
        approve: "WFH request approved successfully!",
        reject: "WFH request rejected successfully!",
        revoke: "WFH approval revoked successfully!",
      }

      showNotification(actionMessages[currentAction.action], "success")
      setShowActionModal(false)
      setCurrentAction(null)
      setActionReason("")
    } catch (error) {
      showNotification("Invalid action data", "error")
    }
  }

  const bulkApprove = () => {
    if (selectedRequests.size === 0) {
      showNotification("Please select requests to approve", "error")
      return
    }

    setRequests((prev) => prev.map((req) => (selectedRequests.has(req.id) ? { ...req, status: "approved" } : req)))

    showNotification(`${selectedRequests.size} requests approved successfully!`, "success")
    setSelectedRequests(new Set())
  }

  const bulkReject = () => {
    if (selectedRequests.size === 0) {
      showNotification("Please select requests to reject", "error")
      return
    }

    setRequests((prev) => prev.map((req) => (selectedRequests.has(req.id) ? { ...req, status: "rejected" } : req)))

    showNotification(`${selectedRequests.size} requests rejected successfully!`, "success")
    setSelectedRequests(new Set())
  }

  const viewAuditTrail = (requestId) => {
    setShowAuditModal(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-orange-100", text: "text-orange-800", label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>{config.label}</span>
    )
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 ">
        <div className="flex items-center justify-between ">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900">WFH Approval List</h1> */}
            {/* <p className="text-gray-600 mt-2">Manage work from home requests and approvals</p> */}
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Pending: {pendingCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Approved: {approvedCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Rejected: {rejectedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8  ml-4 mr-4">
        <div className="flex items-center mb-6 ">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-600">Filter WFH requests by date, employee, and status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <select
              value={filters.employee}
              onChange={(e) => setFilters((prev) => ({ ...prev, employee: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Employees</option>
              <option value="anjali">Anjali Sharma</option>
              <option value="amit">Amit Singh</option>
              <option value="priya">Priya Patel</option>
              <option value="ravi">Ravi Kumar</option>
              <option value="meera">Meera Singh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={applyFilters}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={bulkApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Bulk Approve
            </button>
            <button
              onClick={bulkReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Bulk Reject
            </button>
          </div>
        </div>
      </div>

      {/* WFH Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100  ml-4 mr-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WFH Approval Requests</h3>
              <p className="text-sm text-gray-600 mt-1">Manage work from home requests and approvals</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
              >
                {selectedRequests.size === requests.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRequests.size === requests.length && requests.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selfie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRequests.has(request.id)}
                      onChange={() => toggleRequestSelection(request.id)}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${request.employee.color} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4`}
                      >
                        {request.employee.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.employee.name}</div>
                        <div className="text-sm text-gray-500">{request.employee.team}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.inTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.outTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.hasSelfie ? (
                      <button
                        onClick={() => viewSelfie(request.id, request.employee.name)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Camera className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                    {(request.status === "approved" || request.status === "rejected") && (
                      <div className="text-xs text-gray-500 mt-1">
                        by {request.approvedBy || request.rejectedBy}
                        <br />
                        <span className="text-gray-400">{request.approvedAt || request.rejectedAt}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {request.status === "pending" ? (
                        <>
                          <button
                            onClick={() => openActionModal("approve", request.id)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200 font-medium flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => openActionModal("reject", request.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 font-medium flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : request.status === "approved" ? (
                        <>
                          <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center space-x-1">
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => openActionModal("revoke", request.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Revoke</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => viewAuditTrail(request.id)}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
              <span className="font-medium">17</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-1"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-1">
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selfie Modal */}
      {showSelfieModal && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">

         <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{currentSelfie?.employeeName} - WFH Selfie</h3>
                <button onClick={() => setShowSelfieModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Employee Selfie"
                  className="w-48 h-48 rounded-xl mx-auto object-cover border border-gray-200"
                />
                <p className="text-sm text-gray-600 mt-4">Selfie taken at WFH check-in</p>
                <p className="text-xs text-gray-500">August 2, 2024 - 10:05 AM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentAction?.action === "approve"
                    ? "Approve WFH Request"
                    : currentAction?.action === "reject"
                      ? "Reject WFH Request"
                      : "Revoke WFH Approval"}
                </h3>
                <button onClick={() => setShowActionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Are you sure you want to {currentAction?.action} this WFH request?</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Add a reason for this action..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-6 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 font-medium ${
                    currentAction?.action === "approve"
                      ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  {currentAction?.action === "approve"
                    ? "Approve"
                    : currentAction?.action === "reject"
                      ? "Reject"
                      : "Revoke"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditModal && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Audit Trail</h3>
                <button onClick={() => setShowAuditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    action: "Request Submitted",
                    user: "Ravi Kumar",
                    timestamp: "31-Jul-25 09:30",
                    details: "WFH request submitted for personal work",
                  },
                  {
                    action: "Request Reviewed",
                    user: "John Doe (Manager)",
                    timestamp: "31-Jul-25 14:15",
                    details: "Request reviewed and found insufficient justification",
                  },
                  {
                    action: "Request Rejected",
                    user: "John Doe (Manager)",
                    timestamp: "31-Jul-25 14:20",
                    details: "Rejected due to insufficient business justification",
                  },
                ].map((entry, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{entry.action}</h4>
                        <span className="text-xs text-gray-500">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">by {entry.user}</p>
                      <p className="text-sm text-gray-700 mt-2">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
