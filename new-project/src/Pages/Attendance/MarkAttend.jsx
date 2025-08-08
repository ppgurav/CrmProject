import { useState, useEffect } from "react"
import { z } from "zod"
import { Clock, CheckCircle, Upload, X, Check, Lock, AlertTriangle, MapPin, Wifi } from "lucide-react"

// Zod validation schemas
const attendanceSchema = z.object({
  workPlan: z.string().optional(),
  selfieFile: z.instanceof(File).optional(),
  inTime: z.string().min(1, "IN time is required"),
  outTime: z.string().optional(),
  ipAddress: z.string().min(1, "IP address is required"),
  location: z.string().min(1, "Location is required"),
})

const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "File must be JPG, PNG, or PDF",
    ),
})

export default function MarkAttend() {
  const [attendanceState, setAttendanceState] = useState({
    markedIn: false,
    markedOut: false,
    inTime: null,
    outTime: null,
    workPlan: "",
    selfieFile: null,
    ipAddress: "",
    location: "",
  })

  const [currentDateTime, setCurrentDateTime] = useState("")
  const [timeRestricted, setTimeRestricted] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    updateDateTime()
    detectLocation()
    checkTimeRestrictions()

    const interval = setInterval(updateDateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const updateDateTime = () => {
    const now = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    setCurrentDateTime(now.toLocaleDateString("en-US", options))
  }

  const checkTimeRestrictions = () => {
    const now = new Date()
    const currentHour = now.getHours()
    // Mark IN allowed between 7:00 AM and 11:00 AM
    setTimeRestricted(currentHour < 7 || currentHour >= 11)
  }

  const detectLocation = () => {
    // Simulate IP detection
    setTimeout(() => {
      setAttendanceState((prev) => ({
        ...prev,
        ipAddress: "192.168.1.100",
      }))
    }, 1000)

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4)
          const lon = position.coords.longitude.toFixed(4)
          setAttendanceState((prev) => ({
            ...prev,
            location: `${lat}, ${lon}`,
          }))
        },
        () => {
          setAttendanceState((prev) => ({
            ...prev,
            location: "Location access denied",
          }))
        },
      )
    } else {
      setAttendanceState((prev) => ({
        ...prev,
        location: "Geolocation not supported",
      }))
    }
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const markIn = () => {
    try {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      // Validate with Zod
      const validationData = {
        inTime: timeString,
        ipAddress: attendanceState.ipAddress,
        location: attendanceState.location,
      }

      attendanceSchema.pick({ inTime: true, ipAddress: true, location: true }).parse(validationData)

      setAttendanceState((prev) => ({
        ...prev,
        markedIn: true,
        inTime: timeString,
      }))

      showNotification("Successfully marked IN!", "success")
    } catch (error) {
      if (error instanceof z.ZodError) {
        showNotification(error.errors[0].message, "error")
      } else {
        showNotification("Failed to mark IN", "error")
      }
    }
  }

  const markOut = () => {
    try {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      // Validate with Zod
      const validationData = {
        inTime: attendanceState.inTime,
        outTime: timeString,
        workPlan: attendanceState.workPlan,
        selfieFile: attendanceState.selfieFile,
        ipAddress: attendanceState.ipAddress,
        location: attendanceState.location,
      }

      attendanceSchema.parse(validationData)

      setAttendanceState((prev) => ({
        ...prev,
        markedOut: true,
        outTime: timeString,
      }))

      showNotification("Successfully marked OUT! Have a great day!", "success")
    } catch (error) {
      if (error instanceof z.ZodError) {
        showNotification(error.errors[0].message, "error")
      } else {
        showNotification("Failed to mark OUT", "error")
      }
    }
  }

  const handleSelfieUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        fileSchema.parse({ file })
        setAttendanceState((prev) => ({
          ...prev,
          selfieFile: file,
        }))
        showNotification("Selfie uploaded successfully!", "success")
      } catch (error) {
        if (error instanceof z.ZodError) {
          showNotification(error.errors[0].message, "error")
        }
      }
    }
  }

  const removeSelfie = () => {
    setAttendanceState((prev) => ({
      ...prev,
      selfieFile: null,
    }))
    showNotification("Selfie removed", "info")
  }

  const calculateTotalHours = () => {
    if (!attendanceState.inTime || !attendanceState.outTime) return "--:--"

    const inTime = new Date(`2024-01-01 ${convertTo24Hour(attendanceState.inTime)}`)
    const outTime = new Date(`2024-01-01 ${convertTo24Hour(attendanceState.outTime)}`)
    const diffMs = outTime - inTime
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHours}:${diffMinutes.toString().padStart(2, "0")}`
  }

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")
    if (hours === "12") {
      hours = "00"
    }
    if (modifier === "PM") {
      hours = Number.parseInt(hours, 10) + 12
    }
    return `${hours}:${minutes}`
  }

  const getStatusIcon = () => {
    if (attendanceState.markedOut) {
      return <CheckCircle className="w-10 h-10 text-white" />
    } else if (attendanceState.markedIn) {
      return <Check className="w-10 h-10 text-white" />
    } else {
      return <Clock className="w-10 h-10 text-white" />
    }
  }

  const getStatusTitle = () => {
    if (attendanceState.markedOut) {
      return "Day Completed Successfully!"
    } else if (attendanceState.markedIn) {
      return `You are marked IN at ${attendanceState.inTime}`
    } else {
      return "Ready to Start Your Day!"
    }
  }

  const getStatusMessage = () => {
    if (attendanceState.markedOut) {
      return "Your attendance has been recorded. Thank you for your hard work today!"
    } else if (attendanceState.markedIn) {
      return "Complete your work plan and mark OUT when you finish your day"
    } else {
      return "Click the Mark IN button below to log your attendance"
    }
  }

  const getStatusColor = () => {
    if (attendanceState.markedOut) {
      return "from-green-500 to-emerald-500"
    } else if (attendanceState.markedIn) {
      return "from-blue-500 to-indigo-500"
    } else {
      return "from-green-500 to-emerald-500"
    }
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
      <div className="container mx-auto px-6 py-8 max-w-full  ml-4 mr-4">
        {/* Header */}
        {/* <div className="text-center mb-3">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">{currentDateTime}</p>
        </div> */}

        {/* Time Restriction Notice */}
        {timeRestricted && !attendanceState.markedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Mark IN Time Restriction</p>
                <p className="text-sm text-yellow-700">You can only mark IN between 7:00 AM and 11:00 AM</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Status Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="text-center">
            <div
              className={`w-20 h-20 bg-gradient-to-r ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-4 ${!attendanceState.markedOut ? "animate-bounce" : ""}`}
            >
              {getStatusIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStatusTitle()}</h2>
            <p className="text-gray-600 mb-4">{getStatusMessage()}</p>

            {/* Time Display */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600">IN Time</div>
                <div className={`text-xl font-bold ${attendanceState.inTime ? "text-green-600" : "text-gray-400"}`}>
                  {attendanceState.inTime || "--:--"}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600">OUT Time</div>
                <div className={`text-xl font-bold ${attendanceState.outTime ? "text-red-600" : "text-gray-400"}`}>
                  {attendanceState.outTime || "--:--"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Form */}
        {!attendanceState.markedOut ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mark Your Attendance</h3>
                  <p className="text-sm text-gray-600">Complete the form below to log your work day</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Mark IN Section */}
              {!attendanceState.markedIn && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Mark IN</h4>
                    <span className="text-sm text-gray-500">Required to start your day</span>
                  </div>
                  <button
                    onClick={markIn}
                    disabled={timeRestricted}
                    className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 ${
                      timeRestricted
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    }`}
                  >
                    {timeRestricted ? (
                      <>
                        <Lock className="inline-block w-6 h-6 mr-3" />
                        Mark IN Restricted
                      </>
                    ) : (
                      <>
                        <Clock className="inline-block w-6 h-6 mr-3" />
                        Mark IN Now
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Work Plan Section */}
              {attendanceState.markedIn && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Today's Work Plan</h4>
                    <span className="text-sm text-gray-500">Optional</span>
                  </div>
                  <textarea
                    value={attendanceState.workPlan}
                    onChange={(e) => setAttendanceState((prev) => ({ ...prev, workPlan: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Describe your work plan for today (e.g., Working on client demo, Zoho config, team meetings...)"
                  />
                </div>
              )}

              {/* Selfie Upload Section */}
              {attendanceState.markedIn && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Upload Selfie</h4>
                    <span className="text-sm text-gray-500">Optional - For verification</span>
                  </div>

                  {!attendanceState.selfieFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleSelfieUpload}
                        className="hidden"
                        id="selfieUpload"
                      />
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mb-4">JPG, PNG, or PDF (max 5MB)</p>
                      <button
                        type="button"
                        onClick={() => document.getElementById("selfieUpload").click()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        Choose File
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">{attendanceState.selfieFile.name}</span>
                      </div>
                      <button type="button" onClick={removeSelfie} className="text-green-600 hover:text-green-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Location Info */}
              <div className="mb-3">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Location Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-1">
                      <Wifi className="w-4 h-4 text-gray-600 mr-2" />
                      <div className="text-sm font-medium text-gray-600">IP Address</div>
                    </div>
                    <div className="text-sm text-gray-900">{attendanceState.ipAddress || "Detecting..."}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-1">
                      <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                      <div className="text-sm font-medium text-gray-600">Location</div>
                    </div>
                    <div className="text-sm text-gray-900">{attendanceState.location || "Detecting..."}</div>
                  </div>
                </div>
              </div>

              {/* Mark OUT Section */}
              {attendanceState.markedIn && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Mark OUT</h4>
                    <span className="text-sm text-gray-500">End your work day</span>
                  </div>
                  <button
                    onClick={markOut}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-lg"
                  >
                    <Clock className="inline-block w-6 h-6 mr-3" />
                    Mark OUT
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Completion Message */
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You for Completing Your Day!</h3>
            <p className="text-green-700 mb-4">Your attendance has been successfully recorded.</p>
            <div className="bg-white rounded-xl p-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Total Hours</div>
                  <div className="text-lg font-bold text-gray-900">{calculateTotalHours()}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Status</div>
                  <div className="text-lg font-bold text-green-600">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
