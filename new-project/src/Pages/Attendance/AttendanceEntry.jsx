import { useState } from "react"
import { z } from "zod"
import { Upload, Download, Camera, Clock, Users, FileText, AlertCircle } from "lucide-react"

const attendanceSchema = z
  .object({
    employee: z.string().min(1, "Employee selection is required"),
    date: z.string().min(1, "Date is required"),
    mode: z.enum(["office", "wfh"], { required_error: "Mode is required" }),
    status: z.enum(["present", "half-day", "absent", "leave"], { required_error: "Status is required" }),
    inTime: z.string().optional(),
    outTime: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.mode === "wfh" && (!data.notes || data.notes.trim() === "")) {
        return false
      }
      return true
    },
    {
      message: "Notes are required for WFH entries",
      path: ["notes"],
    },
  )

const employees = [
  { id: "1", name: "Ravi Shah", department: "Development" },
  { id: "2", name: "Anjali Sharma", department: "Design" },
  { id: "3", name: "Amit Kumar", department: "Development" },
  { id: "4", name: "Priya Sharma", department: "Marketing" },
  { id: "5", name: "Rahul Gupta", department: "Sales" },
]

export default function AttendanceEntry() {
  const [formData, setFormData] = useState({
    employee: "",
    date: new Date().toISOString().split("T")[0],
    mode: "",
    status: "",
    inTime: "",
    outTime: "",
    notes: "",
  })

  const [errors, setErrors] = useState({})
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState("")
  const [bulkFile, setBulkFile] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelfieFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelfiePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBulkUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBulkFile(file)
      alert(`File "${file.name}" uploaded successfully! Processing...`)
      setTimeout(() => {
        alert("Bulk upload completed successfully!")
        setBulkFile(null)
        e.target.value = ""
      }, 2000)
    }
  }

  const resetForm = () => {
    setFormData({
      employee: "",
      date: new Date().toISOString().split("T")[0],
      mode: "",
      status: "",
      inTime: "",
      outTime: "",
      notes: "",
    })
    setErrors({})
    setSelfieFile(null)
    setSelfiePreview("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      attendanceSchema.parse(formData)
      alert("Attendance entry saved successfully!")
      resetForm()
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

  const downloadTemplate = () => {
    alert("Excel template downloaded successfully!")
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-6">
      <div className="max-w-full mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Manual Attendance Entry
          </h1>
          <p className="text-gray-600 mt-2">Add or edit attendance records manually</p>
        </div>

        {/* Manual Entry Form */}
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Add Attendance Record
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee *</label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.employee ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose an employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
                {errors.employee && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.employee}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode *</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.mode ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select mode</option>
                  <option value="office">Office</option>
                  <option value="wfh">Work From Home</option>
                </select>
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.mode}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.status ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="present">Present</option>
                  <option value="half-day">Half-day</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.status}
                  </p>
                )}
              </div>

              {/* In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
                <input
                  type="time"
                  name="inTime"
                  value={formData.inTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
                <input
                  type="time"
                  name="outTime"
                  value={formData.outTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes {formData.mode === "wfh" && "*"}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.notes ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Add any remarks or notes (required for WFH)"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.notes}
                </p>
              )}
            </div>

            {/* Selfie Upload (WFH only) */}
            {formData.mode === "wfh" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Selfie (Optional for WFH)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                    id="selfieUpload"
                  />
                  {!selfiePreview ? (
                    <div onClick={() => document.getElementById("selfieUpload").click()} className="cursor-pointer">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to upload selfie</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={selfiePreview || "/placeholder.svg"}
                        alt="Selfie preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <p className="mt-2 text-sm text-green-600">Selfie uploaded successfully</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelfiePreview("")
                          setSelfieFile(null)
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>

        {/* Bulk Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 p-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Bulk Entry (Excel Upload)
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bulkUpload"
                />
                <div onClick={() => document.getElementById("bulkUpload").click()} className="cursor-pointer">
                  <Upload className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-lg font-medium text-gray-900">Upload Excel File</p>
                  <p className="text-sm text-gray-600">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-2">Supports .xlsx, .xls, .csv files</p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="mt-4 w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </button>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Upload Instructions</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <p>Download the Excel template using the button below</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <p>Fill in the attendance data following the format</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <p>Upload the completed file</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <p>Review and confirm the import</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <h5 className="font-medium text-yellow-800 mb-2">Required Columns:</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Employee ID/Code</li>
                  <li>• Date (YYYY-MM-DD)</li>
                  <li>• In Time (HH:MM)</li>
                  <li>• Out Time (HH:MM)</li>
                  <li>• Mode (Office/WFH)</li>
                  <li>• Status (Present/Absent/Leave/Half-day)</li>
                  <li>• Notes (Optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
