import { useState } from "react"
import { z } from "zod"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Sun,
  Home,
  Plus,
  Download,
  Printer,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Zod schema for attendance entry validation
const attendanceEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  status: z.enum(["present", "absent", "leave", "half-day"]),
  inTime: z.string().optional(),
  outTime: z.string().optional(),
  mode: z.enum(["office", "wfh"]).optional(),
  notes: z.string().optional(),
})

export default function Report() {
  const [dayDetailsModal, setDayDetailsModal] = useState(false)
  const [entryModal, setEntryModal] = useState(false)
  const [downloadMenu, setDownloadMenu] = useState(false)
  const [currentEditingEntry, setCurrentEditingEntry] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    status: "present",
    inTime: "",
    outTime: "",
    mode: "office",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState(null)

  // Sample attendance data
  const attendanceData = [
    { id: 1, date: "01-Aug", inTime: "09:20", outTime: "18:00", mode: "Office", status: "Present", notes: "" },
    { id: 2, date: "02-Aug", inTime: "10:05", outTime: "18:45", mode: "WFH", status: "Present", notes: "Logo design" },
    { id: 3, date: "03-Aug", inTime: "09:15", outTime: "18:30", mode: "Office", status: "Present", notes: "" },
    {
      id: 5,
      date: "05-Aug",
      inTime: "09:30",
      outTime: "18:15",
      mode: "Office",
      status: "Present",
      notes: "Client meeting",
    },
    { id: 7, date: "07-Aug", inTime: "10:15", outTime: "19:00", mode: "WFH", status: "Present", notes: "UI mockups" },
    { id: 9, date: "09-Aug", inTime: "—", outTime: "—", mode: "—", status: "Absent", notes: "Sick leave" },
    {
      id: 10,
      date: "10-Aug",
      inTime: "09:45",
      outTime: "13:30",
      mode: "Office",
      status: "Half-day",
      notes: "Medical appointment",
    },
    { id: 15, date: "15-Aug", inTime: "—", outTime: "—", mode: "—", status: "Leave", notes: "Annual leave" },
  ]

  const calendarData = {
    1: "Present",
    2: "WFH",
    3: "Present",
    5: "Present",
    6: "Present",
    7: "WFH",
    8: "Present",
    9: "Absent",
    10: "Half-day",
    12: "Present",
    13: "Present",
    14: "WFH",
    15: "Leave",
    16: "Present",
    17: "Present",
    19: "Present",
    20: "Present",
    21: "WFH",
    22: "Present",
    23: "Absent",
    24: "Half-day",
    26: "Present",
    27: "Present",
    28: "WFH",
    29: "Present",
    30: "Present",
    31: "Present",
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const validateForm = (data) => {
    try {
      attendanceEntrySchema.parse(data)
      setFormErrors({})
      return true
    } catch (error) {
      const errors = {}
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message
      })
      setFormErrors(errors)
      return false
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (validateForm(formData)) {
      console.log(currentEditingEntry ? "Updating entry:" : "Adding new entry:", formData)
      setEntryModal(false)
      setCurrentEditingEntry(null)
      setFormData({ date: "", status: "present", inTime: "", outTime: "", mode: "office", notes: "" })
      showNotification(currentEditingEntry ? "Entry updated successfully!" : "Entry added successfully!", "success")
    }
  }

  const openDayDetails = (day, status) => {
    setSelectedDay({ day, status })
    setDayDetailsModal(true)
  }

  const openAddEntry = () => {
    setCurrentEditingEntry(null)
    setFormData({ date: "", status: "present", inTime: "", outTime: "", mode: "office", notes: "" })
    setFormErrors({})
    setEntryModal(true)
  }

  const openEditEntry = (entryId) => {
    const entry = attendanceData.find((item) => item.id === entryId)
    if (entry) {
      setCurrentEditingEntry(entryId)
      setFormData({
        date: `2024-08-${entry.date.split("-")[0].padStart(2, "0")}`,
        status: entry.status.toLowerCase().replace("-", "-"),
        inTime: entry.inTime !== "—" ? entry.inTime : "",
        outTime: entry.outTime !== "—" ? entry.outTime : "",
        mode: entry.mode.toLowerCase(),
        notes: entry.notes,
      })
      setFormErrors({})
      setEntryModal(true)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Present: "bg-green-500 hover:bg-green-600",
      WFH: "bg-blue-500 hover:bg-blue-600",
      Absent: "bg-red-500 hover:bg-red-600",
      Leave: "bg-yellow-500 hover:bg-yellow-600",
      "Half-day": "bg-orange-500 hover:bg-orange-600",
    }
    return colors[status] || "bg-gray-100"
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      Present: "bg-green-100 text-green-800",
      Absent: "bg-red-100 text-red-800",
      Leave: "bg-yellow-100 text-yellow-800",
      "Half-day": "bg-orange-100 text-orange-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getModeBadgeColor = (mode) => {
    const colors = {
      Office: "bg-blue-100 text-blue-800",
      WFH: "bg-purple-100 text-purple-800",
    }
    return colors[mode] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
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

      {/* Main Content */}
      <main className="p-6  ml-4 mr-4">
        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-2 mb-6">
          <button
            onClick={openAddEntry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </button>
          <button
            onClick={() => {
              window.print()
              showNotification("Print dialog opened!", "info")
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <div className="relative">
            <button
              onClick={() => setDownloadMenu(!downloadMenu)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {downloadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl shadow-green-500/10 border border-gray-100 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      console.log("Downloading Excel report...")
                      showNotification("Excel report download started!", "success")
                      setDownloadMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="mr-3 h-4 w-4 text-green-600" />
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => {
                      console.log("Downloading PDF report...")
                      showNotification("PDF report download started!", "success")
                      setDownloadMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="mr-3 h-4 w-4 text-red-600" />
                    PDF (.pdf)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Anjali Sharma</h2>
                <p className="text-gray-600">Design Team • Employee ID: EMP001</p>
                <p className="text-sm text-gray-500">anjali.sharma@company.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Report Period</div>
              <div className="text-lg font-semibold text-gray-900">August 2024</div>
              <div className="text-sm text-gray-500">31 days total</div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Working Days</p>
                <p className="text-2xl font-bold text-gray-900">26</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-green-500/5 p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Present Days</p>
                <p className="text-2xl font-bold text-green-700">23</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">WFH Days</p>
                <p className="text-2xl font-bold text-blue-700">5</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-red-500/5 p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Absent</p>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-yellow-500/5 p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Leave</p>
                <p className="text-2xl font-bold text-yellow-700">1</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-500/5 p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Half-day</p>
                <p className="text-2xl font-bold text-orange-700">2</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Calendar View
              </h3>
              <p className="text-sm text-gray-600 mt-1">Color-coded attendance for August 2024</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>WFH</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Leave</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Half-day</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Calendar Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {/* Week 1 */}
            <div className="text-center text-sm text-gray-400 py-3"></div>
            <div className="text-center text-sm text-gray-400 py-3"></div>
            <div className="text-center text-sm text-gray-400 py-3"></div>
            <div className="text-center text-sm text-gray-400 py-3"></div>
            {[1, 2, 3].map((day) => (
              <div
                key={day}
                onClick={() => openDayDetails(day, calendarData[day])}
                className={`text-center text-sm py-3 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium ${getStatusColor(calendarData[day])}`}
              >
                {day}
              </div>
            ))}

            {/* Week 2 */}
            <div className="text-center text-sm py-3 bg-gray-100 text-gray-400 rounded-lg">4</div>
            {[5, 6, 7, 8, 9, 10].map((day) => (
              <div
                key={day}
                onClick={() => openDayDetails(day, calendarData[day])}
                className={`text-center text-sm py-3 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium ${getStatusColor(calendarData[day])}`}
              >
                {day}
              </div>
            ))}

            {/* Week 3 */}
            <div className="text-center text-sm py-3 bg-gray-100 text-gray-400 rounded-lg">11</div>
            {[12, 13, 14, 15, 16, 17].map((day) => (
              <div
                key={day}
                onClick={() => openDayDetails(day, calendarData[day])}
                className={`text-center text-sm py-3 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium ${getStatusColor(calendarData[day])}`}
              >
                {day}
              </div>
            ))}

            {/* Week 4 */}
            <div className="text-center text-sm py-3 bg-gray-100 text-gray-400 rounded-lg">18</div>
            {[19, 20, 21, 22, 23, 24].map((day) => (
              <div
                key={day}
                onClick={() => openDayDetails(day, calendarData[day])}
                className={`text-center text-sm py-3 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium ${getStatusColor(calendarData[day])}`}
              >
                {day}
              </div>
            ))}

            {/* Week 5 */}
            <div className="text-center text-sm py-3 bg-gray-100 text-gray-400 rounded-lg">25</div>
            {[26, 27, 28, 29, 30, 31].map((day) => (
              <div
                key={day}
                onClick={() => openDayDetails(day, calendarData[day])}
                className={`text-center text-sm py-3 text-white rounded-lg cursor-pointer transition-colors duration-200 font-medium ${getStatusColor(calendarData[day])}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Log Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Daily Log Table
                </h3>
                <p className="text-sm text-gray-600 mt-1">Detailed attendance records for August 2024</p>
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="all">All Records</option>
                  <option value="present">Present Only</option>
                  <option value="wfh">WFH Only</option>
                  <option value="absent">Absent Only</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Out Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.inTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.outTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModeBadgeColor(entry.mode)}`}>
                        {entry.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(entry.status)}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.notes || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditEntry(entry.id)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                      >
                        Edit
                      </button>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                <span className="font-medium">26</span> working days
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
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
                <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Day Details Modal */}
      {dayDetailsModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  August {selectedDay.day}, 2024 - Attendance Details
                </h3>
                <button onClick={() => setDayDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span
                    className={`font-semibold ${
                      selectedDay.status === "Present"
                        ? "text-green-600"
                        : selectedDay.status === "WFH"
                          ? "text-blue-600"
                          : selectedDay.status === "Absent"
                            ? "text-red-600"
                            : selectedDay.status === "Leave"
                              ? "text-yellow-600"
                              : "text-orange-600"
                    }`}
                  >
                    {selectedDay.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 block">In Time</span>
                    <span className="text-lg font-semibold text-gray-900">09:15</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700 block">Out Time</span>
                    <span className="text-lg font-semibold text-gray-900">18:00</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 block">Mode</span>
                  <span className="text-lg font-semibold text-gray-900">Office</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Entry Modal */}
      {entryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentEditingEntry ? "Edit Attendance Entry" : "Add Attendance Entry"}
                </h3>
                <button onClick={() => setEntryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        formErrors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
                    <input
                      type="time"
                      value={formData.inTime}
                      onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
                    <input
                      type="time"
                      value={formData.outTime}
                      onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
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
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Add any notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEntryModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
