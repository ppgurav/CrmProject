import { useState, useEffect } from "react"
import { z } from "zod"
import { Filter, Download, Printer, ChevronDown, X } from "lucide-react"

// Zod schema for filters
const filtersSchema = z.object({
  monthYear: z.string().min(1, "Month and year is required"),
  department: z.string().optional(),
  employee: z.string().optional(),
  mode: z.string().optional(),
})

// Sample data
const employees = [
  { id: 1, name: "Anjali Sharma", department: "Design", initial: "A", color: "from-purple-500 to-pink-500" },
  { id: 2, name: "Ravi Kumar", department: "Engineering", initial: "R", color: "from-blue-500 to-indigo-500" },
  { id: 3, name: "Priya Patel", department: "Sales", initial: "P", color: "from-green-500 to-emerald-500" },
  { id: 4, name: "Suresh Kumar", department: "HR", initial: "S", color: "from-orange-500 to-red-500" },
  { id: 5, name: "Meera Singh", department: "Marketing", initial: "M", color: "from-cyan-500 to-blue-500" },
]

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "design", label: "Design" },
]

// Generate sample attendance data
const generateAttendanceData = () => {
  const data = {}
  employees.forEach((emp) => {
    data[emp.id] = {}
    for (let day = 1; day <= 31; day++) {
      const rand = Math.random()
      if (day % 7 === 0 || day % 7 === 6) {
        // Weekends
        data[emp.id][day] = "weekend"
      } else if (rand < 0.7) {
        data[emp.id][day] = "present"
      } else if (rand < 0.8) {
        data[emp.id][day] = "wfh"
      } else if (rand < 0.9) {
        data[emp.id][day] = "absent"
      } else if (rand < 0.95) {
        data[emp.id][day] = "leave"
      } else {
        data[emp.id][day] = "halfday"
      }
    }
  })
  return data
}

export default function MonthlySheet() {
  const [filters, setFilters] = useState({
    monthYear: "2024-01",
    department: "",
    employee: "",
    mode: "",
  })

  const [attendanceData, setAttendanceData] = useState({})
  const [filteredEmployees, setFilteredEmployees] = useState(employees)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setAttendanceData(generateAttendanceData())
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const applyFilters = () => {
    try {
      filtersSchema.parse(filters)
      setErrors({})

      let filtered = employees

      if (filters.department) {
        filtered = filtered.filter((emp) => emp.department.toLowerCase() === filters.department.toLowerCase())
      }

      if (filters.employee) {
        filtered = filtered.filter((emp) => emp.id === Number.parseInt(filters.employee))
      }

      setFilteredEmployees(filtered)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      monthYear: "2024-01",
      department: "",
      employee: "",
      mode: "",
    })
    setFilteredEmployees(employees)
    setErrors({})
  }

  const getAttendanceIcon = (status) => {
    switch (status) {
      case "present":
        return <span className="text-green-600 text-lg">✔</span>
      case "wfh":
        return <span className="text-purple-600 text-lg">🏠</span>
      case "absent":
        return <span className="text-red-600 text-lg">✖</span>
      case "leave":
        return <span className="text-orange-600 text-lg">🚫</span>
      case "halfday":
        return <span className="text-yellow-600 text-lg">🕒</span>
      case "weekend":
        return <span className="text-gray-400">—</span>
      default:
        return <span className="text-gray-400">—</span>
    }
  }

  const calculateSummary = (employeeId) => {
    const empData = attendanceData[employeeId] || {}
    let present = 0,
      absent = 0,
      leave = 0,
      wfh = 0

    Object.values(empData).forEach((status) => {
      switch (status) {
        case "present":
          present++
          break
        case "absent":
          absent++
          break
        case "leave":
          leave++
          break
        case "wfh":
          present++ // WFH counts as present
          wfh++
          break
        case "halfday":
          present += 0.5
          break
      }
    })

    return { present: Math.floor(present), absent, leave, wfh }
  }

  const viewDayDetails = (employeeId, day) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    const status = attendanceData[employeeId]?.[day] || "unknown"
    setSelectedDay({ employee, day, status })
  }

  const printSummary = () => {
    window.print()
  }

  const downloadExcel = () => {
    alert("Excel download functionality would be implemented here")
  }

  const downloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-3">
    <div className="max-w-full mx-auto">
        {/* Page Header */}
        {/* <div className="mb-8"> */}
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Attendance Sheet</h1> */}
          {/* <p className="text-gray-600">Track and manage employee attendance records</p> */}
        {/* </div> */}

        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-4 mb-6">
          <button
            onClick={printSummary}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
            >
              <Download className="w-4 h-4" />
              Download
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl shadow-green-500/10 border border-gray-100 z-50">
                <div className="py-2">
                  <button
                    onClick={downloadExcel}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mr-3 h-4 w-4 text-green-600">📊</span>
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mr-3 h-4 w-4 text-red-600">📄</span>
                    PDF (.pdf)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-600">
                Filter monthly attendance by period, department, employee, and mode
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Month & Year Filter */}
            <div>
              <label htmlFor="monthYearFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Month & Year
              </label>
              <input
                type="month"
                id="monthYearFilter"
                value={filters.monthYear}
                onChange={(e) => handleFilterChange("monthYear", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.monthYear ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.monthYear && <p className="mt-1 text-sm text-red-600">{errors.monthYear}</p>}
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Department (Optional)
              </label>
              <select
                id="departmentFilter"
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Filter */}
            <div>
              <label htmlFor="employeeFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Specific Employee (Optional)
              </label>
              <select
                id="employeeFilter"
                value={filters.employee}
                onChange={(e) => handleFilterChange("employee", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Mode Filter */}
            <div>
              <label htmlFor="modeFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Mode
              </label>
              <select
                id="modeFilter"
                value={filters.mode}
                onChange={(e) => handleFilterChange("mode", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All</option>
                <option value="office">Office</option>
                <option value="wfh">WFH</option>
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
          </div>
        </div>

        {/* Icon Legend */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Icon Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-lg">✔</span>
              <span className="text-sm text-gray-700">Present (Office)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600 text-lg">🏠</span>
              <span className="text-sm text-gray-700">WFH</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-lg">✖</span>
              <span className="text-sm text-gray-700">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-600 text-lg">🚫</span>
              <span className="text-sm text-gray-700">Approved Leave</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600 text-lg">🕒</span>
              <span className="text-sm text-gray-700">Half-day</span>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Attendance Records</h3>
                <p className="text-sm text-gray-600 mt-1">
                  January 2024 - Total: {filteredEmployees.length} employees shown
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Avg Attendance: 85%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span>WFH Days: 45</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 z-10">
                    Employee
                  </th>
                  {/* Days 1-31 */}
                  {Array.from({ length: 31 }, (_, i) => (
                    <th
                      key={i + 1}
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]"
                    >
                      {i + 1}
                    </th>
                  ))}
                  {/* Summary columns */}
                  <th className="px-4 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider border-l border-gray-200 min-w-[60px]">
                    Present
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-red-600 uppercase tracking-wider min-w-[60px]">
                    Absent
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-orange-600 uppercase tracking-wider min-w-[60px]">
                    Leave
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const summary = calculateSummary(employee.id)
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200 z-10">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${employee.color} rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3`}
                          >
                            {employee.initial}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-xs text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Days 1-31 */}
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1
                        const status = attendanceData[employee.id]?.[day] || "unknown"
                        return (
                          <td
                            key={day}
                            className="px-3 py-4 text-center cursor-pointer hover:bg-blue-50"
                            onClick={() => viewDayDetails(employee.id, day)}
                          >
                            {getAttendanceIcon(status)}
                          </td>
                        )
                      })}

                      {/* Summary columns */}
                      <td className="px-4 py-4 text-center text-sm font-medium text-green-600 border-l border-gray-200">
                        {summary.present}
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-medium text-red-600">{summary.absent}</td>
                      <td className="px-4 py-4 text-center text-sm font-medium text-orange-600">{summary.leave}</td>
                      <td className="px-4 py-4 text-center">
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Day Details Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Day Details</h3>
                <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Employee</label>
                  <p className="text-gray-900">{selectedDay.employee.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">January {selectedDay.day}, 2024</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getAttendanceIcon(selectedDay.status)}
                    <span className="text-gray-900 capitalize">{selectedDay.status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
