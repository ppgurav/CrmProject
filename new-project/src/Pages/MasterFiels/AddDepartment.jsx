import { useState } from "react"
import { Building2, MapPin, FileText, Paperclip, Check, Upload, X, Users } from "lucide-react"

export default function AddDepartment() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    managerId: "",
    managerName: "",
    managerEmail: "",
    budget: "",
    location: "",
    floor: "",
    capacity: "",
    remarks: "",
  })

  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [files, setFiles] = useState({
    orgChart: null,
    budgetDoc: null,
  })
  const [errors, setErrors] = useState({})

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

  const handleTagInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput.trim())
      setTagInput("")
    }
  }

  const addTag = (tagText) => {
    if (tagText && !tags.includes(tagText)) {
      setTags((prev) => [...prev, tagText])
    }
  }

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPG, PNG, and Excel files are allowed")
        return
      }

      setFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }))
    }
  }

  const removeFile = (fileType) => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: null,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = ["name", "status", "location"]

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required"
      }
    })

    // Budget validation (if provided)
    if (formData.budget && isNaN(formData.budget)) {
      newErrors.budget = "Budget must be a valid number"
    }

    // Capacity validation (if provided)
    if (formData.capacity && isNaN(formData.capacity)) {
      newErrors.capacity = "Capacity must be a valid number"
    }

    // Email validation (if provided)
    if (formData.managerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.managerEmail)) {
      newErrors.managerEmail = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Show success message
      alert("Department saved successfully!")
      console.log("Form data:", formData)
      console.log("Tags:", tags)
      console.log("Files:", files)
    }
  }

  const locations = [
    "Head Office",
    "Branch Office - Mumbai",
    "Branch Office - Delhi",
    "Branch Office - Bangalore",
    "Branch Office - Chennai",
    "Branch Office - Hyderabad",
    "Branch Office - Pune",
    "Remote/Virtual",
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto p-6 bg-white bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen space-y-8 mb-8 mr-4 ml-4"
    >
      {/* 1. Basic Information */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Sales & Marketing"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Brief description of department"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="planning">Planning</option>
              <option value="restructuring">Restructuring</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Annual Budget
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.budget ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 500000"
            />
            {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              onBlur={() => {
                if (tagInput.trim()) {
                  addTag(tagInput.trim())
                  setTagInput("")
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Add tags separated by commas (e.g., Revenue, Customer-facing, Core)"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Manager & Location */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Manager & Location</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manager ID */}
          <div>
            <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-2">
              Manager ID
            </label>
            <input
              type="text"
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., EMP001"
            />
          </div>

          {/* Manager Name */}
          <div>
            <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-2">
              Manager Name
            </label>
            <input
              type="text"
              id="managerName"
              name="managerName"
              value={formData.managerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Department head name"
            />
          </div>

          {/* Manager Email */}
          <div>
            <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Manager Email
            </label>
            <input
              type="email"
              id="managerEmail"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.managerEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="manager@company.com"
            />
            {errors.managerEmail && <p className="mt-1 text-sm text-red-600">{errors.managerEmail}</p>}
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Team Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.capacity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Maximum team size"
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          </div>
        </div>
      </div>

      {/* 3. Location & Physical Details */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Location & Physical Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location} value={location.toLowerCase().replace(/\s+/g, "-")}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Floor */}
          <div>
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
              Floor/Level
            </label>
            <input
              type="text"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 3rd Floor, Ground Floor"
            />
          </div>
        </div>
      </div>

      {/* 4. Notes / Remarks */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Notes / Remarks</h2>
        </div>
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Internal notes about the department, goals, special requirements..."
          />
        </div>
      </div>

      {/* 5. Attachments */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
            <Paperclip className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Attachments (Optional)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Org Chart */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Org Chart</label>
            <div className="relative">
              <input
                type="file"
                id="orgChart"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "orgChart")}
                className="hidden"
              />
              <label
                htmlFor="orgChart"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors duration-200"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Organization chart</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </label>
            </div>
            {files.orgChart && (
              <div className="mt-2">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{files.orgChart.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("orgChart")}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Budget Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Budget Document</label>
            <div className="relative">
              <input
                type="file"
                id="budgetDoc"
                accept=".pdf,.xlsx,.xls"
                onChange={(e) => handleFileChange(e, "budgetDoc")}
                className="hidden"
              />
              <label
                htmlFor="budgetDoc"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors duration-200"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Budget spreadsheet</p>
                  <p className="text-xs text-gray-500">PDF, Excel up to 10MB</p>
                </div>
              </label>
            </div>
            {files.budgetDoc && (
              <div className="mt-2">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{files.budgetDoc.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("budgetDoc")}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Submit Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Save Department
          </button>
        </div>
      </div>
    </form>
  )
}
