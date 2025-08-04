import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Home, Ban, X, Clock, BarChart3, Info } from "lucide-react"
import { z } from "zod"

// Zod schema for attendance data validation
const AttendanceSchema = z.object({
  status: z.enum(["present", "wfh", "leave", "absent", "half-day"]),
  inTime: z.string().optional(),
  outTime: z.string().optional(),
  mode: z.string().optional(),
  notes: z.string().optional(),
  selfie: z.boolean().optional(),
})

const MonthDataSchema = z.record(z.string(), AttendanceSchema)

export default function Calender() {
  const [currentMonth, setCurrentMonth] = useState("2024-08")
  const [selectedDay, setSelectedDay] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Sample attendance data
  const [attendanceData] = useState({
    "2024-08": {
      1: { status: "present", inTime: "09:20", outTime: "18:00", mode: "Office", notes: "", selfie: false },
      2: { status: "wfh", inTime: "10:05", outTime: "18:45", mode: "WFH", notes: "Logo design task", selfie: true },
      3: { status: "present", inTime: "09:15", outTime: "18:30", mode: "Office", notes: "", selfie: false },
      5: {
        status: "present",
        inTime: "09:30",
        outTime: "18:15",
        mode: "Office",
        notes: "Client meeting",
        selfie: false,
      },
      6: { status: "present", inTime: "09:25", outTime: "18:20", mode: "Office", notes: "", selfie: false },
      7: { status: "wfh", inTime: "10:15", outTime: "19:00", mode: "WFH", notes: "UI mockups", selfie: true },
      8: { status: "present", inTime: "09:10", outTime: "18:05", mode: "Office", notes: "", selfie: false },
      9: { status: "absent", inTime: "", outTime: "", mode: "", notes: "Sick leave", selfie: false },
      10: {
        status: "half-day",
        inTime: "09:45",
        outTime: "13:30",
        mode: "Office",
        notes: "Medical appointment",
        selfie: false,
      },
      12: { status: "present", inTime: "09:20", outTime: "18:10", mode: "Office", notes: "", selfie: false },
      13: { status: "present", inTime: "09:35", outTime: "18:25", mode: "Office", notes: "", selfie: false },
      14: { status: "wfh", inTime: "10:00", outTime: "18:30", mode: "WFH", notes: "Team collaboration", selfie: true },
      15: { status: "leave", inTime: "", outTime: "", mode: "", notes: "Annual leave", selfie: false },
      16: { status: "present", inTime: "09:15", outTime: "18:15", mode: "Office", notes: "", selfie: false },
      17: { status: "present", inTime: "09:25", outTime: "18:35", mode: "Office", notes: "", selfie: false },
      19: { status: "present", inTime: "09:30", outTime: "18:20", mode: "Office", notes: "", selfie: false },
      20: { status: "present", inTime: "09:20", outTime: "18:15", mode: "Office", notes: "", selfie: false },
      21: { status: "wfh", inTime: "10:10", outTime: "18:40", mode: "WFH", notes: "Project planning", selfie: true },
      22: { status: "present", inTime: "09:15", outTime: "18:10", mode: "Office", notes: "", selfie: false },
      23: { status: "absent", inTime: "", outTime: "", mode: "", notes: "Personal emergency", selfie: false },
      24: {
        status: "half-day",
        inTime: "09:30",
        outTime: "13:45",
        mode: "Office",
        notes: "Family function",
        selfie: false,
      },
      26: { status: "present", inTime: "09:25", outTime: "18:25", mode: "Office", notes: "", selfie: false },
      27: { status: "present", inTime: "09:20", outTime: "18:30", mode: "Office", notes: "", selfie: false },
      28: { status: "wfh", inTime: "10:05", outTime: "18:50", mode: "WFH", notes: "Documentation work", selfie: true },
      29: { status: "present", inTime: "09:15", outTime: "18:20", mode: "Office", notes: "", selfie: false },
      30: { status: "present", inTime: "09:30", outTime: "18:15", mode: "Office", notes: "", selfie: false },
      31: { status: "present", inTime: "09:20", outTime: "18:25", mode: "Office", notes: "", selfie: false },
    },
  })

  const changeMonth = (newMonth) => {
    setCurrentMonth(newMonth)
  }

  const previousMonth = () => {
    const [year, month] = currentMonth.split("-")
    const date = new Date(year, month - 1, 1)
    date.setMonth(date.getMonth() - 1)
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    setCurrentMonth(newMonth)
  }

  const nextMonth = () => {
    const [year, month] = currentMonth.split("-")
    const date = new Date(year, month - 1, 1)
    date.setMonth(date.getMonth() + 1)
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    setCurrentMonth(newMonth)
  }

  const generateCalendar = () => {
    const [year, month] = currentMonth.split("-")
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const today = new Date()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 bg-gray-50 rounded-lg"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = attendanceData[currentMonth] && attendanceData[currentMonth][day]
      const dayOfWeek = new Date(year, month - 1, day).getDay()
      const currentDate = new Date(year, month - 1, day)

      let cellClass =
        "h-16 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center text-sm font-medium border-2 "
      let StatusIcon = null

      if (dayData) {
        // Validate data with Zod
        try {
          AttendanceSchema.parse(dayData)
        } catch (error) {
          console.error("Invalid attendance data:", error)
        }

        switch (dayData.status) {
          case "present":
            cellClass += "bg-green-500 text-white border-green-600 hover:bg-green-600"
            StatusIcon = Check
            break
          case "wfh":
            cellClass += "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
            StatusIcon = Home
            break
          case "leave":
            cellClass += "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600"
            StatusIcon = Ban
            break
          case "absent":
            cellClass += "bg-red-500 text-white border-red-600 hover:bg-red-600"
            StatusIcon = X
            break
          case "half-day":
            cellClass += "bg-orange-500 text-white border-orange-600 hover:bg-orange-600"
            StatusIcon = Clock
            break
        }
      } else {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          cellClass += "bg-gray-100 text-gray-400 border-gray-200"
        } else if (currentDate > today) {
          cellClass += "bg-gray-50 text-gray-500 border-gray-200"
        } else {
          cellClass += "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
          StatusIcon = () => <span>?</span>
        }
      }

      days.push(
        <div key={day} className={cellClass} onClick={() => dayData && showDayDetails(day, dayData)}>
          <div className="text-xs mb-1">{StatusIcon && <StatusIcon size={12} />}</div>
          <div className="font-bold">{day}</div>
        </div>,
      )
    }

    return days
  }

  const showDayDetails = (day, data) => {
    setSelectedDay({ day, data })
    setShowModal(true)
  }

  const closeDayModal = () => {
    setShowModal(false)
    setSelectedDay(null)
  }

  const calculateSummary = () => {
    const monthData = attendanceData[currentMonth] || {}
    let presentDays = 0
    let wfhDays = 0
    let leaveDays = 0
    let absentDays = 0
    let halfDays = 0

    Object.values(monthData).forEach((day) => {
      switch (day.status) {
        case "present":
          presentDays++
          break
        case "wfh":
          wfhDays++
          break
        case "leave":
          leaveDays++
          break
        case "absent":
          absentDays++
          break
        case "half-day":
          halfDays++
          break
      }
    })

    const totalWorkingDays = presentDays + wfhDays + leaveDays + absentDays + halfDays
    const attendanceRate =
      totalWorkingDays > 0 ? (((presentDays + wfhDays + halfDays * 0.5) / totalWorkingDays) * 100).toFixed(1) : 0

    return {
      presentDays,
      wfhDays,
      leaveDays,
      absentDays,
      halfDays,
      totalWorkingDays,
      attendanceRate,
    }
  }

  const getMonthName = () => {
    const [year, month] = currentMonth.split("-")
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const summary = calculateSummary()

  const statusColors = {
    present: "text-green-600 bg-green-100",
    wfh: "text-blue-600 bg-blue-100",
    leave: "text-yellow-600 bg-yellow-100",
    absent: "text-red-600 bg-red-100",
    "half-day": "text-orange-600 bg-orange-100",
  }

  const statusLabels = {
    present: "Present (Office)",
    wfh: "Work From Home",
    leave: "On Leave",
    absent: "Absent",
    "half-day": "Half Day",
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDayModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              {/* <h1 className="text-3xl font-bold text-gray-900">My Attendance Calendar</h1> */}
              {/* <p className="text-gray-600">View your monthly attendance in calendar format</p> */}
            </div>

            {/* Month Picker */}
            <div className="flex items-center space-x-2">
              <label htmlFor="monthPicker" className="text-sm font-medium text-gray-700">
                Month:
              </label>
              <select
                id="monthPicker"
                value={currentMonth}
                onChange={(e) => changeMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="2024-08">August 2024</option>
                <option value="2024-07">July 2024</option>
                <option value="2024-06">June 2024</option>
                <option value="2024-05">May 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-03">March 2024</option>
                <option value="2024-02">February 2024</option>
                <option value="2024-01">January 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Legend</h2>
              <p className="text-sm text-gray-600">Color codes for different attendance statuses</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Check size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">Present</div>
                <div className="text-xs text-green-600">Office/Regular</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Home size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-800">WFH</div>
                <div className="text-xs text-blue-600">Work From Home</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Ban size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-yellow-800">Leave</div>
                <div className="text-xs text-yellow-600">Approved Leave</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                <X size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-red-800">Absent</div>
                <div className="text-xs text-red-600">Not Marked</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Clock size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-800">Half-day</div>
                <div className="text-xs text-orange-600">Partial Day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getMonthName()}</h3>
                <p className="text-sm text-gray-600">Click on any date to view details</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {/* Calendar Headers */}
              <div className="text-center text-sm font-medium text-gray-500 py-3">Sun</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Mon</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Tue</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Wed</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Thu</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Fri</div>
              <div className="text-center text-sm font-medium text-gray-500 py-3">Sat</div>

              {/* Calendar Days */}
              {generateCalendar()}
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
                <p className="text-sm text-gray-600">Attendance breakdown for {getMonthName()}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {/* Present Days */}
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-700">{summary.presentDays}</div>
                <div className="text-sm font-medium text-green-600">Present Days</div>
              </div>

              {/* WFH Days */}
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{summary.wfhDays}</div>
                <div className="text-sm font-medium text-blue-600">WFH Days</div>
              </div>

              {/* Leave Days */}
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-700">{summary.leaveDays}</div>
                <div className="text-sm font-medium text-yellow-600">Leave Days</div>
              </div>

              {/* Absent Days */}
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-red-700">{summary.absentDays}</div>
                <div className="text-sm font-medium text-red-600">Absent Days</div>
              </div>

              {/* Half Days */}
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-700">{summary.halfDays}</div>
                <div className="text-sm font-medium text-orange-600">Half Days</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{summary.totalWorkingDays}</div>
                  <div className="text-sm text-gray-600">Total Working Days</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{summary.attendanceRate}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">8.2</div>
                  <div className="text-sm text-gray-600">Avg Hours/Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Details Modal */}
        {showModal && selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {new Date(
                      currentMonth.split("-")[0],
                      currentMonth.split("-")[1] - 1,
                      selectedDay.day,
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    - Attendance Details
                  </h3>
                  <button
                    onClick={closeDayModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between p-4 rounded-xl ${statusColors[selectedDay.data.status]}`}
                  >
                    <span className="text-sm font-medium">Status</span>
                    <span className="font-semibold">{statusLabels[selectedDay.data.status]}</span>
                  </div>

                  {(selectedDay.data.inTime || selectedDay.data.outTime) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 block">IN Time</span>
                        <span className="text-lg font-semibold text-gray-900">{selectedDay.data.inTime || "—"}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 block">OUT Time</span>
                        <span className="text-lg font-semibold text-gray-900">{selectedDay.data.outTime || "—"}</span>
                      </div>
                    </div>
                  )}

                  {selectedDay.data.mode && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 block">Mode</span>
                      <span className="text-lg font-semibold text-gray-900">{selectedDay.data.mode}</span>
                    </div>
                  )}

                  {selectedDay.data.notes && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Notes</span>
                      <p className="text-gray-900">{selectedDay.data.notes}</p>
                    </div>
                  )}

                  {selectedDay.data.selfie && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700 block mb-2">Selfie</span>
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Selfie uploaded</span>
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">View</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
