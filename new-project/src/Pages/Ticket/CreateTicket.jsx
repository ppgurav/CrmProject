import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import { User, AlertCircle, Paperclip, Info, Save, Eye, Send, X, Upload, Trash2, Plus, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Zod validation schema
const ticketSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().optional(),
  customerId: z.string().optional(),
  ticketType: z.string().min(1, "Please select a ticket type"),
  priority: z.string().min(1, "Please select a priority level"),
  assignedTo: z.string().optional(),
  status: z.string().default("open"),
  subject: z.string().min(1, "Please enter a subject"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  browserDevice: z.string().optional(),
  operatingSystem: z.string().optional(),
  urlPage: z.string().optional(),
  errorCode: z.string().optional(),
  stepsToReproduce: z.string().optional(),
})

export default function CreateTicket() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerId: "",
    ticketType: "",
    priority: "",
    assignedTo: "",
    status: "open",
    subject: "",
    description: "",
    browserDevice: "",
    operatingSystem: "",
    urlPage: "",
    errorCode: "",
    stepsToReproduce: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Auto-detect browser and OS
    const userAgent = navigator.userAgent
    let browser = "Unknown"
    let os = "Unknown"

    // Detect browser
    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"

    // Detect OS
    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS")) os = "iOS"

    setFormData((prev) => ({
      ...prev,
      browserDevice: browser,
      operatingSystem: os,
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "description") {
      setCharCount(value.length)
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files)
      .map((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
          return null
        }
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
        }
      })
      .filter(Boolean)

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateForm = () => {
    try {
      ticketSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      const newErrors = {}
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const navigate = useNavigate();
  const handleCreateTicket = () => {
    navigate('/ticket/ticket-list');
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Ticket created successfully!")
      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerId: "",
        ticketType: "",
        priority: "",
        assignedTo: "",
        status: "open",
        subject: "",
        description: "",
        browserDevice: "",
        operatingSystem: "",
        urlPage: "",
        errorCode: "",
        stepsToReproduce: "",
      })
      setUploadedFiles([])
      setCharCount(0)
    }, 2000)
  }

  const saveDraft = () => {
    localStorage.setItem("ticketDraft", JSON.stringify(formData))
    alert("Draft saved successfully!")
  }

  const previewTicket = () => {
    if (!validateForm()) return
    setShowPreview(true)
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  }

  const statusColors = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}

        {/* <div className="mb-8 flex items-center justify-between">
  <div>
  <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Support Ticket</h1>
  <p className="text-gray-600">Fill out the form below to create a new support ticket</p>
  </div>

  <button
    onClick={handleCreateTicket}
    className="px-6 py-3 bg-gradient-to-r from-white to-white border text-black rounded-xl hover:from-gray-400 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  >
    <ArrowLeft className="inline-block w-5 h-5 mr-2" />
    Back To Ticket
  </button>
</div> */}

        {/* Main Form */}
        <div className="max-w-full mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                  <p className="text-sm text-gray-600">Basic details about the customer reporting the issue</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.customerName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && <div className="text-red-500 text-sm mt-1">{errors.customerName}</div>}
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.customerEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="customer@example.com"
                  />
                  {errors.customerEmail && <div className="text-red-500 text-sm mt-1">{errors.customerEmail}</div>}
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="CUST-001"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
                  <p className="text-sm text-gray-600">Provide details about the issue or request</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ticketType"
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.ticketType ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select ticket type</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Billing">Billing & Payment</option>
                    <option value="General">General Inquiry</option>
                    <option value="Account">Account Management</option>
                    <option value="Feature">Feature Request</option>
                    <option value="Bug">Bug Report</option>
                  </select>
                  {errors.ticketType && <div className="text-red-500 text-sm mt-1">{errors.ticketType}</div>}
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.priority ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low - General questions</option>
                    <option value="medium">Medium - Standard issues</option>
                    <option value="high">High - Important problems</option>
                    <option value="urgent">Urgent - Critical issues</option>
                  </select>
                  {errors.priority && <div className="text-red-500 text-sm mt-1">{errors.priority}</div>}
                </div>

                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Auto-assign</option>
                    <option value="Ankita">Ankita - Technical Support</option>
                    <option value="Rahul">Rahul - Billing Support</option>
                    <option value="Priya">Priya - General Support</option>
                    <option value="Arjun">Arjun - Account Manager</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Brief description of the issue"
                />
                {errors.subject && <div className="text-red-500 text-sm mt-1">{errors.subject}</div>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Provide detailed information about the issue, including steps to reproduce, error messages, and any other relevant details..."
                />
                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Minimum 20 characters required</p>
                  <span className={`text-sm ${charCount < 20 ? "text-red-500" : "text-gray-400"}`}>
                    {charCount} characters
                  </span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Paperclip className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Attachments</h2>
                  <p className="text-sm text-gray-600">Upload screenshots, documents, or other relevant files</p>
                </div>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors duration-200"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add("border-indigo-400", "bg-indigo-50")
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove("border-indigo-400", "bg-indigo-50")
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove("border-indigo-400", "bg-indigo-50")
                  const files = Array.from(e.dataTransfer.files)
                  handleFileUpload(files)
                }}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</div>
                <p className="text-sm text-gray-500 mb-4">
                  Support for images, documents, and archives up to 10MB each
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Choose Files
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Paperclip className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
                  <p className="text-sm text-gray-600">Optional details that might help resolve the issue faster</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="browserDevice" className="block text-sm font-medium text-gray-700 mb-2">
                    Browser/Device
                  </label>
                  <input
                    type="text"
                    id="browserDevice"
                    name="browserDevice"
                    value={formData.browserDevice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Chrome 120, iPhone 15, Windows 11"
                  />
                </div>

                <div>
                  <label htmlFor="operatingSystem" className="block text-sm font-medium text-gray-700 mb-2">
                    Operating System
                  </label>
                  <select
                    id="operatingSystem"
                    name="operatingSystem"
                    value={formData.operatingSystem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select OS</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Linux">Linux</option>
                    <option value="iOS">iOS</option>
                    <option value="Android">Android</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="urlPage" className="block text-sm font-medium text-gray-700 mb-2">
                    URL/Page Where Issue Occurred
                  </label>
                  <input
                    type="url"
                    id="urlPage"
                    name="urlPage"
                    value={formData.urlPage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/page"
                  />
                </div>

                <div>
                  <label htmlFor="errorCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Error Code/Message
                  </label>
                  <input
                    type="text"
                    id="errorCode"
                    name="errorCode"
                    value={formData.errorCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Error 404, Connection timeout"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="stepsToReproduce" className="block text-sm font-medium text-gray-700 mb-2">
                  Steps to Reproduce (if applicable)
                </label>
                <textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  rows={4}
                  value={formData.stepsToReproduce}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Enter...&#10;4. Observe the error..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  <Save className="inline-block w-4 h-4 mr-2" />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={previewTicket}
                  className="px-6 py-3 border border-indigo-300 text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  <Eye className="inline-block w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="inline-block w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="inline-block w-4 h-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Ticket Preview</h3>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Ticket Header */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{formData.subject}</h4>
                        <p className="text-sm text-gray-600">Ticket #TCK-NEW</p>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${priorityColors[formData.priority]}`}
                        >
                          {formData.priority}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[formData.status]}`}
                        >
                          {formData.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Customer Information</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <p className="font-medium text-gray-900">{formData.customerName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Email:</span>
                          <p className="font-medium text-gray-900">{formData.customerEmail}</p>
                        </div>
                        {formData.customerPhone && (
                          <div>
                            <span className="text-sm text-gray-600">Phone:</span>
                            <p className="font-medium text-gray-900">{formData.customerPhone}</p>
                          </div>
                        )}
                        {formData.customerId && (
                          <div>
                            <span className="text-sm text-gray-600">Customer ID:</span>
                            <p className="font-medium text-gray-900">{formData.customerId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Ticket Details</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Type:</span>
                          <p className="font-medium text-gray-900">{formData.ticketType}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Assigned To:</span>
                          <p className="font-medium text-gray-900">{formData.assignedTo || "Auto-assign"}</p>
                        </div>
                        {formData.browserDevice && (
                          <div>
                            <span className="text-sm text-gray-600">Browser/Device:</span>
                            <p className="font-medium text-gray-900">{formData.browserDevice}</p>
                          </div>
                        )}
                        {formData.operatingSystem && (
                          <div>
                            <span className="text-sm text-gray-600">OS:</span>
                            <p className="font-medium text-gray-900">{formData.operatingSystem}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Description</h5>
                    <div className="text-gray-700 whitespace-pre-wrap">{formData.description}</div>
                  </div>

                  {formData.stepsToReproduce && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Steps to Reproduce</h5>
                      <div className="text-gray-700 whitespace-pre-wrap">{formData.stepsToReproduce}</div>
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Attachments</h5>
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                          </div>
                        ))}
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
