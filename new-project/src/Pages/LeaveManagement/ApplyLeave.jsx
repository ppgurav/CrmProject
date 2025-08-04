import { useState } from "react"
import { z } from "zod"
import {
  CheckCircle,
  Heart,
  Sun,
  AlertTriangle,
  Calendar,
  Upload,
  X,
  Send,
  RotateCcw,
  ChevronRight,
  Check,
} from "lucide-react"

const leaveSchema = z.object({
  leaveType: z.string().min(1, "Please select a leave type"),
  fromDate: z.string().min(1, "From date is required"),
  toDate: z.string().min(1, "To date is required"),
  reason: z.string().min(10, "Please provide a detailed reason (minimum 10 characters)"),
  halfDay: z.boolean().optional(),
})

export default function ApplyLeave() {
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    halfDay: false,
  })

  const [uploadedFile, setUploadedFile] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)

  const leaveQuotas = [
    {
      type: "Casual Leave",
      used: 8,
      total: 12,
      percentage: 67,
      color: "green",
      icon: CheckCircle,
    },
    {
      type: "Sick Leave",
      used: 5,
      total: 10,
      percentage: 50,
      color: "blue",
      icon: Heart,
    },
    {
      type: "Vacation",
      used: 12,
      total: 15,
      percentage: 80,
      color: "purple",
      icon: Sun,
    },
    {
      type: "Emergency",
      used: 3,
      total: 5,
      percentage: 60,
      color: "orange",
      icon: AlertTriangle,
    },
  ]

  const recentApplications = [
    {
      type: "Sick Leave",
      dates: "Aug 15-16, 2024",
      duration: "2 days",
      status: "Approved",
      statusColor: "green",
      icon: Heart,
    },
    {
      type: "Vacation Leave",
      dates: "Sep 1-5, 2024",
      duration: "5 days",
      status: "Pending",
      statusColor: "yellow",
      icon: Sun,
    },
    {
      type: "Casual Leave",
      dates: "Jul 20, 2024",
      duration: "Half day",
      status: "Approved",
      statusColor: "green",
      icon: CheckCircle,
    },
  ]

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Handle half day logic
    if (name === "halfDay" && checked) {
      setFormData((prev) => ({ ...prev, toDate: prev.fromDate }))
    }

    if (name === "fromDate" && formData.halfDay) {
      setFormData((prev) => ({ ...prev, toDate: value }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        showNotification("Please upload a valid file (JPG, PNG, PDF)", "error")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        showNotification("File size must be less than 10MB", "error")
        return
      }

      setUploadedFile(file)
      showNotification("File uploaded successfully!", "success")
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    document.getElementById("proofUpload").value = ""
    showNotification("File removed", "info")
  }

  const resetForm = () => {
    setFormData({
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      halfDay: false,
    })
    setUploadedFile(null)
    setErrors({})
    if (document.getElementById("proofUpload")) {
      document.getElementById("proofUpload").value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      leaveSchema.parse(formData)

      // Additional validation
      if (new Date(formData.fromDate) > new Date(formData.toDate)) {
        showNotification("From date cannot be later than To date", "error")
        return
      }

      console.log("Submitting leave request:", { ...formData, file: uploadedFile })

      setTimeout(() => {
        setShowSuccessModal(true)
        resetForm()
        showNotification("Email notification sent to your manager", "info")
      }, 1000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
        showNotification("Please fix the form errors", "error")
      }
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        textDark: "text-green-700",
        progress: "bg-green-600",
        progressBg: "bg-green-200",
        border: "border-green-100",
        shadow: "shadow-green-500/5",
      },
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        textDark: "text-blue-700",
        progress: "bg-blue-600",
        progressBg: "bg-blue-200",
        border: "border-blue-100",
        shadow: "shadow-blue-500/5",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        textDark: "text-purple-700",
        progress: "bg-purple-600",
        progressBg: "bg-purple-200",
        border: "border-purple-100",
        shadow: "shadow-purple-500/5",
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        textDark: "text-orange-700",
        progress: "bg-orange-600",
        progressBg: "bg-orange-200",
        border: "border-orange-100",
        shadow: "shadow-orange-500/5",
      },
    }
    return colors[color]
  }

  const getStatusClasses = (color) => {
    const statusColors = {
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
    }
    return statusColors[color]
  }

  const today = new Date().toISOString().split("T")[0]

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

      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Leave</h1> */}
          {/* <p className="text-gray-600">Submit your leave application with proper documentation</p> */}
        </div>

        {/* Leave Quota Display */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {leaveQuotas.map((quota, index) => {
            const colors = getColorClasses(quota.color)
            const IconComponent = quota.icon

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg ${colors.shadow} p-6 ${colors.border} border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${colors.text}`}>{quota.type}</p>
                    <p className={`text-2xl font-bold ${colors.textDark}`}>
                      {quota.used} <span className="text-sm font-normal text-gray-500">/ {quota.total}</span>
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className={`w-full ${colors.progressBg} rounded-full h-2`}>
                    <div
                      className={`${colors.progress} h-2 rounded-full`}
                      style={{ width: `${quota.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leave Application Form */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Leave Application Form</h3>
                <p className="text-sm text-gray-600">Fill out the form below to submit your leave request</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leave Type */}
                <div>
                  <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.leaveType ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select leave type</option>
                    <option value="casual">Casual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="emergency">Emergency Leave</option>
                    <option value="vacation">Vacation Leave</option>
                  </select>
                  {errors.leaveType && <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>}
                </div>

                {/* Half Day Checkbox */}
                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      id="halfDay"
                      name="halfDay"
                      checked={formData.halfDay}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Half Day Leave</div>
                      <div className="text-xs text-gray-500">Check if applying for half day only</div>
                    </div>
                  </label>
                </div>

                {/* From Date */}
                <div>
                  <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    min={today}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.fromDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.fromDate && <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>}
                </div>

                {/* To Date */}
                <div>
                  <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    min={formData.fromDate || today}
                    disabled={formData.halfDay}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      formData.halfDay ? "bg-gray-100" : ""
                    } ${errors.toDate ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.toDate && <p className="text-red-500 text-sm mt-1">{errors.toDate}</p>}
                </div>
              </div>

              {/* Reason */}
              <div className="mt-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                    errors.reason ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Please provide a detailed reason for your leave request..."
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              {/* Upload Proof */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Supporting Document <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="proofUpload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {!uploadedFile ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">Medical certificate, documents (PDF, JPG, PNG - max 10MB)</p>
                      <button
                        type="button"
                        onClick={() => document.getElementById("proofUpload").click()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        Choose File
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
                      </div>
                      <button type="button" onClick={removeFile} className="text-green-600 hover:text-green-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Leave Applications */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Leave Applications</h3>
                <p className="text-sm text-gray-600">Your latest leave requests and their status</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200">
                View All
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application, index) => {
                const IconComponent = application.icon
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 ${getColorClasses(application.icon === Heart ? "blue" : application.icon === Sun ? "purple" : "green").bg} rounded-full flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${getColorClasses(application.icon === Heart ? "blue" : application.icon === Sun ? "purple" : "green").text}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{application.type}</div>
                        <div className="text-sm text-gray-600">
                          {application.dates} • {application.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(application.statusColor)}`}
                      >
                        {application.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave Request Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Your leave application has been successfully submitted and is now pending approval from your manager.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      Pending Approval
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false)
                      showNotification("Redirecting to leave history...", "info")
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    View History
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
