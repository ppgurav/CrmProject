import { useState } from "react"
import { z } from "zod"
import { Filter, Download, X, Camera, ChevronLeft, ChevronRight } from "lucide-react"

// Zod schemas for validation
const attendanceSchema = z.object({
  inTime: z.string().min(1, "In time is required"),
  outTime: z.string().min(1, "Out time is required"),
  mode: z.enum(["office", "wfh"]),
  status: z.enum(["present", "absent", "leave", "half-day"]),
  notes: z.string().optional(),
})

const filterSchema = z.object({
  date: z.string(),
  department: z.string(),
  mode: z.string(),
  status: z.string(),
})

// Sample data
const sampleEmployees = [
  {
    id: 1,
    name: "Ravi Kumar",
    department: "Engineering",
    inTime: "09:12",
    outTime: "18:00",
    mode: "office",
    status: "present",
    notes: "",
    avatar: "R",
    color: "from-indigo-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Anjali Sharma",
    department: "Design",
    inTime: "10:05",
    outTime: "18:45",
    mode: "wfh",
    status: "present",
    notes: "Design task",
    avatar: "A",
    color: "from-purple-500 to-pink-500",
    hasSelfie: true,
  },
  {
    id: 3,
    name: "Priya Patel",
    department: "Marketing",
    inTime: "09:30",
    outTime: "13:00",
    mode: "office",
    status: "half-day",
    notes: "Medical appointment",
    avatar: "P",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Suresh Kumar",
    department: "Sales",
    inTime: "",
    outTime: "",
    mode: "",
    status: "absent",
    notes: "Sick leave",
    avatar: "S",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 5,
    name: "Meera Singh",
    department: "HR",
    inTime: "10:45",
    outTime: "18:30",
    mode: "wfh",
    status: "present",
    notes: "Traffic jam",
    avatar: "M",
    color: "from-yellow-500 to-orange-500",
    hasSelfie: true,
    isLate: true,
  },
]

export default function DailyReport() {
  const [employees, setEmployees] = useState(sampleEmployees)
  const [selectedEmployees, setSelectedEmployees] = useState(new Set())
  const [filters, setFilters] = useState({
    date: "2024-01-08",
    department: "",
    mode: "",
    status: "",
  })
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showSelfieModal, setShowSelfieModal] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [formData, setFormData] = useState({
    inTime: "",
    outTime: "",
    mode: "office",
    status: "present",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const applyFilters = () => {
    try {
      filterSchema.parse(filters)
      showNotification("Filters applied successfully!", "success")
    } catch (error) {
      showNotification("Invalid filter values", "error")
    }
  }

  const clearFilters = () => {
    setFilters({
      date: "2024-01-08",
      department: "",
      mode: "",
      status: "",
    })
    showNotification("Filters cleared!", "info")
  }

  const updateSelectedCount = (employeeId, checked) => {
    const newSelected = new Set(selectedEmployees)
    if (checked) {
      newSelected.add(employeeId)
    } else {
      newSelected.delete(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set())
    } else {
      setSelectedEmployees(new Set(employees.map((emp) => emp.id)))
    }
  }

  const bulkMarkLeave = () => {
    if (selectedEmployees.size === 0) {
      showNotification("Please select employees to mark as leave.", "error")
      return
    }

    if (confirm(`Mark ${selectedEmployees.size} selected employees as on leave?`)) {
      const updatedEmployees = employees.map((emp) =>
        selectedEmployees.has(emp.id) ? { ...emp, status: "leave", inTime: "", outTime: "", mode: "" } : emp,
      )
      setEmployees(updatedEmployees)
      setSelectedEmployees(new Set())
      showNotification(`${selectedEmployees.size} employees marked as on leave`, "success")
    }
  }

  const viewEditAttendance = (employee) => {
    setCurrentEmployee(employee)
    setFormData({
      inTime: employee.inTime || "",
      outTime: employee.outTime || "",
      mode: employee.mode || "office",
      status: employee.status || "present",
      notes: employee.notes || "",
    })
    setFormErrors({})
    setShowAttendanceModal(true)
  }

  const saveAttendanceChanges = () => {
    try {
      attendanceSchema.parse(formData)

      const updatedEmployees = employees.map((emp) => (emp.id === currentEmployee.id ? { ...emp, ...formData } : emp))
      setEmployees(updatedEmployees)
      setShowAttendanceModal(false)
      showNotification("Attendance updated successfully!", "success")
      setFormErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {}
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message
        })
        setFormErrors(errors)
      }
    }
  }

  const approveWFH = (employeeId) => {
    if (confirm("Approve WFH request for this employee?")) {
      showNotification("WFH request approved!", "success")
    }
  }

  const viewSelfie = (employee) => {
    setCurrentEmployee(employee)
    setShowSelfieModal(true)
  }

  const exportToExcel = () => {
    showNotification("Exporting attendance data...", "info")
    setTimeout(() => {
      showNotification("Attendance data exported successfully!", "success")
    }, 2000)
  }

  const getStatusBadge = (status) => {
    const badges = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      leave: "bg-orange-100 text-orange-800",
      "half-day": "bg-yellow-100 text-yellow-800",
    }
    return badges[status] || "bg-gray-100 text-gray-800"
  }

  const getModeBadge = (mode) => {
    const badges = {
      office: "bg-blue-100 text-blue-800",
      wfh: "bg-purple-100 text-purple-800",
    }
    return badges[mode] || "bg-gray-100 text-gray-800"
  }

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

      {/* Page Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900">Daily Attendance Sheet</h1> */}
            {/* <p className="text-gray-600 mt-2">January 8, 2024 - Total: 150 employees</p> */}
          </div>
          <button
            onClick={exportToExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-600">Filter attendance records by date, department, mode, and status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Mode</label>
            <select
              value={filters.mode}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All</option>
              <option value="office">Office</option>
              <option value="wfh">WFH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="half-day">Half-day</option>
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
            <span className="text-sm text-gray-600">{selectedEmployees.size} selected</span>
            <button
              onClick={bulkMarkLeave}
              disabled={selectedEmployees.size === 0}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark Leave
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Records</h3>
              <p className="text-sm text-gray-600 mt-1">January 8, 2024 - Total: 150 employees</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
              >
                {selectedEmployees.size === employees.length ? "Deselect All" : "Select All"}
              </button>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Present: 132</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Absent: 18</span>
                </div>
              </div>
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
                    checked={selectedEmployees.size === employees.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selfie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(employee.id)}
                      onChange={(e) => updateSelectedCount(employee.id, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${employee.color} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4`}
                      >
                        {employee.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${employee.isLate ? "text-orange-600" : "text-gray-900"}`}
                  >
                    {employee.inTime || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.outTime || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.mode ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModeBadge(employee.mode)}`}>
                        {employee.mode === "wfh" ? "WFH" : "Office"}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.notes || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {employee.hasSelfie ? (
                      <button
                        onClick={() => viewSelfie(employee)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Camera className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {employee.mode === "wfh" && employee.status === "present" && (
                        <>
                          <button
                            onClick={() => approveWFH(employee.id)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <span className="text-gray-300">|</span>
                        </>
                      )}
                      <button
                        onClick={() => viewEditAttendance(employee)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                      >
                        {employee.mode === "wfh" && employee.status === "present" ? "Edit" : "View/Edit"}
                      </button>
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
              <span className="font-medium">150</span> results
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
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center space-x-1">
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        // <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center p-4">
       
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"><div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit Attendance</h3>
                <button onClick={() => setShowAttendanceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
                  <input
                    type="time"
                    value={formData.inTime}
                    onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${formErrors.inTime ? "border-red-300" : "border-gray-300"}`}
                  />
                  {formErrors.inTime && <p className="text-red-500 text-xs mt-1">{formErrors.inTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
                  <input
                    type="time"
                    value={formData.outTime}
                    onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${formErrors.outTime ? "border-red-300" : "border-gray-300"}`}
                  />
                  {formErrors.outTime && <p className="text-red-500 text-xs mt-1">{formErrors.outTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="office">Office</option>
                    <option value="wfh">WFH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                    <option value="half-day">Half-day</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAttendanceChanges}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selfie Modal */}
      {/* {showSelfieModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-100 z-200 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Employee Selfie</h3>
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
                <p className="text-sm text-gray-600 mt-4">Selfie taken at check-in</p>
                <p className="text-xs text-gray-500">January 8, 2024 - 10:05 AM</p>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {showSelfieModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Employee Selfie</h3>
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
          <p className="text-sm text-gray-600 mt-4">Selfie taken at check-in</p>
          <p className="text-xs text-gray-500">January 8, 2024 - 10:05 AM</p>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}
