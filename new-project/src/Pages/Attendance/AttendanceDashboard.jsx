import { useState } from "react"
import { z } from "zod"
import { Users, CheckCircle, XCircle, Home, Clock, RefreshCw } from "lucide-react"

const dateSchema = z.object({
  date: z.string().min(1, "Date is required"),
})

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState("2024-01-08")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [trendPeriod, setTrendPeriod] = useState("7")

  const attendanceData = {
    totalEmployees: 150,
    presentToday: 132,
    absentToday: 18,
    wfhToday: 45,
    lateMarked: 12,
  }

  // Chart data
  const trendData = {
    7: [
      { day: "Jan 2", present: 125, absent: 25 },
      { day: "Jan 3", present: 135, absent: 15 },
      { day: "Jan 4", present: 140, absent: 10 },
      { day: "Jan 5", present: 138, absent: 12 },
      { day: "Jan 6", present: 142, absent: 8 },
      { day: "Jan 7", present: 139, absent: 11 },
      { day: "Jan 8", present: 132, absent: 18 },
    ],
    30: [
      { day: "Week 1", present: 130, absent: 20 },
      { day: "Week 2", present: 135, absent: 15 },
      { day: "Week 3", present: 140, absent: 10 },
      { day: "Week 4", present: 132, absent: 18 },
    ],
  }

  const departmentData = [
    { name: "Engineering", present: 45, absent: 5 },
    { name: "Marketing", present: 28, absent: 2 },
    { name: "Sales", present: 32, absent: 3 },
    { name: "HR", present: 15, absent: 2 },
    { name: "Finance", present: 12, absent: 6 },
  ]

  const lateComers = [
    {
      rank: 1,
      name: "Rajesh Kumar",
      department: "Engineering",
      times: 5,
      avgLate: "45 min",
      color: "from-red-500 to-orange-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      department: "Marketing",
      times: 4,
      avgLate: "30 min",
      color: "from-orange-500 to-yellow-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      rank: 3,
      name: "Amit Singh",
      department: "Sales",
      times: 3,
      avgLate: "25 min",
      color: "from-yellow-500 to-amber-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      rank: 4,
      name: "Sneha Patel",
      department: "HR",
      times: 3,
      avgLate: "20 min",
      color: "from-gray-500 to-gray-600",
      bg: "bg-gray-50",
      text: "text-gray-600",
    },
    {
      rank: 5,
      name: "Arjun Reddy",
      department: "Finance",
      times: 2,
      avgLate: "15 min",
      color: "from-gray-400 to-gray-500",
      bg: "bg-gray-50",
      text: "text-gray-600",
    },
  ]

  const handleDateChange = (e) => {
    const newDate = e.target.value
    try {
      dateSchema.parse({ date: newDate })
      setSelectedDate(newDate)
    } catch (error) {
      console.error("Invalid date:", error.errors)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    showNotification("Data refreshed successfully!", "success")
  }

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, textColor = "text-gray-900" }) => (
    <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  // Line Chart Component
  const LineChart = ({ data, width = 400, height = 200 }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.present, d.absent)))
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const getX = (index) => padding + (index * chartWidth) / (data.length - 1)
    const getY = (value) => padding + chartHeight - (value / maxValue) * chartHeight

    const presentPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.present)}`).join(" ")
    const absentPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.absent)}`).join(" ")

    return (
      <div className="w-full">
        <div className="flex items-center justify-center mb-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 50, 100, 150].map((value) => (
            <g key={value}>
              <line
                x1={padding}
                y1={getY(value)}
                x2={width - padding}
                y2={getY(value)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text x={padding - 10} y={getY(value) + 4} fontSize="12" fill="#9ca3af" textAnchor="end">
                {value}
              </text>
            </g>
          ))}

          {/* Present line */}
          <path
            d={presentPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Absent line */}
          <path
            d={absentPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.present)} r="4" fill="#10b981" />
              <circle cx={getX(i)} cy={getY(d.absent)} r="4" fill="#ef4444" />
              <text x={getX(i)} y={height - 10} fontSize="12" fill="#6b7280" textAnchor="middle">
                {d.day}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  // Donut Chart Component
  const DonutChart = ({ office = 87, wfh = 45 }) => {
    const total = office + wfh
    const officePercentage = (office / total) * 100
    const wfhPercentage = (wfh / total) * 100

    const radius = 80
    const strokeWidth = 30
    const circumference = 2 * Math.PI * radius

    const officeStrokeDasharray = `${(officePercentage / 100) * circumference} ${circumference}`
    const wfhStrokeDasharray = `${(wfhPercentage / 100) * circumference} ${circumference}`
    const wfhStrokeDashoffset = -((officePercentage / 100) * circumference)

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" className="mb-4">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#6366f1"
            strokeWidth={strokeWidth}
            strokeDasharray={officeStrokeDasharray}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#a855f7"
            strokeWidth={strokeWidth}
            strokeDasharray={wfhStrokeDasharray}
            strokeDashoffset={wfhStrokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Office ({office})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">WFH ({wfh})</span>
          </div>
        </div>
      </div>
    )
  }

  // Bar Chart Component
  const BarChart = ({ data, width = 400, height = 200 }) => {
    const maxValue = Math.max(...data.map((d) => d.present + d.absent))
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = (chartWidth / data.length) * 0.6

    return (
      <div className="w-full">
        <div className="flex items-center justify-center mb-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 10, 20, 30, 40, 50].map((value) => (
            <g key={value}>
              <line
                x1={padding}
                y1={padding + chartHeight - (value / maxValue) * chartHeight}
                x2={width - padding}
                y2={padding + chartHeight - (value / maxValue) * chartHeight}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={padding + chartHeight - (value / maxValue) * chartHeight + 4}
                fontSize="12"
                fill="#9ca3af"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2
            const presentHeight = (d.present / maxValue) * chartHeight
            const absentHeight = (d.absent / maxValue) * chartHeight

            return (
              <g key={i}>
                {/* Present bar */}
                <rect
                  x={x}
                  y={padding + chartHeight - presentHeight}
                  width={barWidth}
                  height={presentHeight}
                  fill="#10b981"
                  rx="2"
                />
                {/* Absent bar (stacked) */}
                <rect
                  x={x}
                  y={padding + chartHeight - presentHeight - absentHeight}
                  width={barWidth}
                  height={absentHeight}
                  fill="#ef4444"
                  rx="2"
                />
                {/* Department label */}
                <text x={x + barWidth / 2} y={height - 10} fontSize="12" fill="#6b7280" textAnchor="middle">
                  {d.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className="p-6  ml-4 mr-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Attendance Dashboard</h1> */}
          <div className="flex items-center space-x-4 ml-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-3">
          <StatCard
            title="Total Employees"
            value={attendanceData.totalEmployees}
            subtitle="Active employees"
            icon={Users}
            iconBg="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <StatCard
            title="Present Today"
            value={attendanceData.presentToday}
            subtitle="88% attendance"
            icon={CheckCircle}
            iconBg="bg-gradient-to-r from-green-500 to-emerald-500"
            textColor="text-green-600"
          />
          <StatCard
            title="Absent Today"
            value={attendanceData.absentToday}
            subtitle="12% absent"
            icon={XCircle}
            iconBg="bg-gradient-to-r from-red-500 to-orange-500"
            textColor="text-red-600"
          />
          <StatCard
            title="WFH Today"
            value={attendanceData.wfhToday}
            subtitle="34% of present"
            icon={Home}
            iconBg="bg-gradient-to-r from-purple-500 to-pink-500"
            textColor="text-purple-600"
          />
          <StatCard
            title="Late Marked"
            value={attendanceData.lateMarked}
            subtitle="After 9:30 AM"
            icon={Clock}
            iconBg="bg-gradient-to-r from-orange-500 to-yellow-500"
            textColor="text-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-3">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Trend (Last {trendPeriod} Days)</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTrendPeriod("7")}
                  className={`px-3 py-1 text-sm rounded-lg font-medium ${
                    trendPeriod === "7" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTrendPeriod("30")}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    trendPeriod === "30"
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  30D
                </button>
              </div>
            </div>
            <LineChart data={trendData[trendPeriod]} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">WFH vs Office Split</h3>
            <DonutChart office={87} wfh={45} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Late Comers (This Week)</h3>
            <div className="space-y-4">
              {lateComers.map((person) => (
                <div key={person.rank} className={`flex items-center justify-between p-3 ${person.bg} rounded-xl`}>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${person.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {person.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${person.text}`}>{person.times} times</p>
                    <p className="text-xs text-gray-500">Avg: {person.avgLate} late</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department-wise Attendance</h3>
            <BarChart data={departmentData} />
          </div>
        </div>
      </div>
    </div>
  )
}
