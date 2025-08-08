"use client"

import { useState } from "react"
import { z } from "zod"
import { User, Target, Calendar, FileText, Paperclip, Check, Upload, X, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const leadSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  mobile: z.string().min(1, "Mobile is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  companyName: z.string().optional(),
  cityState: z.string().optional(),
  leadSource: z.string().min(1, "Lead Source is required"),
  interestedIn: z.array(z.string()).min(1, "Select at least one interest"),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, "Assigned To is required"),
  nextFollowup: z.string().min(1, "Next Follow-up is required"),
  priority: z.string().min(1, "Priority is required"),
})

export default function AddLead() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    companyName: "",
    cityState: "",
    leadSource: "",
    interestedIn: [],
    budgetRange: "",
    notes: "",
    assignedTo: "",
    nextFollowup: "",
    priority: "",
  })

  const [uploadFile, setUploadFile] = useState(null)
  const [errors, setErrors] = useState({})

  const interests = ["Domain", "Hosting", "Website", "Email", "WhatsApp Panel"]
  const leadSources = ["Website", "WhatsApp", "Referral", "Cold Call", "Social Media", "Event / Exhibition"]
  const priorities = ["Low", "Medium", "High"]
  const employees = ["John Doe", "Jane Smith", "Alex Kim"]
  const budgets = ["Under 25k", "25k-50k", "50k-1L", "1L+"]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox" && name === "interestedIn") {
      const updatedInterests = checked
        ? [...formData.interestedIn, value]
        : formData.interestedIn.filter((item) => item !== value)
      setFormData({ ...formData, interestedIn: updatedInterests })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPG, and PNG files are allowed")
        return
      }
      setUploadFile(file)
    }
  }

  const removeFile = () => {
    setUploadFile(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      leadSchema.parse(formData)
      setErrors({})
      console.log("Form submitted:", formData)
      console.log("Upload file:", uploadFile)
      alert("Lead submitted successfully!")
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {}
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      companyName: "",
      cityState: "",
      leadSource: "",
      interestedIn: [],
      budgetRange: "",
      notes: "",
      assignedTo: "",
      nextFollowup: "",
      priority: "",
    })
    setUploadFile(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4 ">
       
      <div className="max-w-full mx-auto  ml-4 mr-4">
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Lead ✍️</h1> */}
          {/* <p className="text-gray-600">Capture and manage your potential customers</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter lead's full name"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="lead@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Company or organization"
                />
              </div>

              {/* City, State */}
              <div>
                <label htmlFor="cityState" className="block text-sm font-medium text-gray-700 mb-2">
                  City, State
                </label>
                <input
                  type="text"
                  id="cityState"
                  name="cityState"
                  value={formData.cityState}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              {/* Lead Source */}
              <div>
                <label htmlFor="leadSource" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source <span className="text-red-500">*</span>
                </label>
                <select
                  id="leadSource"
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.leadSource ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select lead source</option>
                  {leadSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                {errors.leadSource && <p className="mt-1 text-sm text-red-600">{errors.leadSource}</p>}
              </div>
            </div>
          </div>

          {/* 2. Interest & Requirements */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Interest & Requirements</h2>
            </div>

            {/* Interested In */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interested In <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      name="interestedIn"
                      value={interest}
                      checked={formData.interestedIn.includes(interest)}
                      onChange={handleInputChange}
                      className="mr-3 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interestedIn && <p className="mt-2 text-sm text-red-600">{errors.interestedIn}</p>}
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select budget range</option>
                {budgets.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Assignment & Follow-up */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Assignment & Follow-up</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned To */}
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.assignedTo ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select team member</option>
                  {employees.map((employee) => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>}
              </div>

              {/* Next Follow-up */}
              <div>
                <label htmlFor="nextFollowup" className="block text-sm font-medium text-gray-700 mb-2">
                  Next Follow-up Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="nextFollowup"
                  name="nextFollowup"
                  value={formData.nextFollowup}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.nextFollowup ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nextFollowup && <p className="mt-1 text-sm text-red-600">{errors.nextFollowup}</p>}
              </div>

              {/* Priority */}
              <div className="md:col-span-2">
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
                  <option value="">Select priority level</option>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
              </div>
            </div>
          </div>

          {/* 4. Notes */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Additional Notes</h2>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Any additional information about the lead..."
              />
            </div>
          </div>

          {/* 5. File Upload */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <Paperclip className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Visiting Card / Documents</label>
              <div className="relative">
                <input
                  type="file"
                  id="uploadFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="uploadFile"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors duration-200"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload documents</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </label>
              </div>
              {uploadFile && (
                <div className="mt-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600 flex-1">{uploadFile.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6. Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Submit Lead
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
