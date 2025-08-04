
import { useState } from "react"
import { User, MapPin, FileText, Paperclip, Check, Upload, X } from "lucide-react"

export default function Customer() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    mobile: "",
    alternateNumber: "",
    customerType: "",
    gstNumber: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    remarks: "",
  })

  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [files, setFiles] = useState({
    idProof: null,
    visitingCard: null,
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
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPG, and PNG files are allowed")
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
    const requiredFields = ["fullName", "mobile", "customerType", "address", "state", "city", "pincode"]

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required"
      }
    })

    // Mobile number validation
    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits"
    }

    // Pincode validation
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits"
    }

    // GST validation (if provided)
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST number format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Show success message
      alert("Customer saved successfully!")
      console.log("Form data:", formData)
      console.log("Tags:", tags)
      console.log("Files:", files)
    }
  }

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
  ]

  return (
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
              placeholder="Enter customer name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
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
              placeholder="If applicable"
            />
          </div>

          {/* Email Address */}
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
              placeholder="customer@example.com"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                setFormData((prev) => ({ ...prev, mobile: value }))
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
          </div>

          {/* Alternate Number */}
          <div>
            <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Alternate Number
            </label>
            <input
              type="tel"
              id="alternateNumber"
              name="alternateNumber"
              value={formData.alternateNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Optional"
            />
          </div>

          {/* Customer Type */}
          <div>
            <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Type <span className="text-red-500">*</span>
            </label>
            <select
              id="customerType"
              name="customerType"
              value={formData.customerType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.customerType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select customer type</option>
              <option value="lead">Lead</option>
              <option value="client">Client</option>
              <option value="reseller">Reseller</option>
              <option value="partner">Partner</option>
              <option value="vendor">Vendor</option>
            </select>
            {errors.customerType && <p className="mt-1 text-sm text-red-600">{errors.customerType}</p>}
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
              placeholder="Add tags separated by commas (e.g., VIP, Premium, Local)"
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

      {/* 2. GST & Address */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">GST & Address</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GST Number */}
          <div>
            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
              GST Number
            </label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().slice(0, 15)
                setFormData((prev) => ({ ...prev, gstNumber: value }))
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.gstNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="15-character GST number"
            />
            {errors.gstNumber && <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state} value={state.toLowerCase().replace(/\s+/g, "-")}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter city name"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setFormData((prev) => ({ ...prev, pincode: value }))
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="6-digit pincode"
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full postal address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* 3. Notes / Remarks */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
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
            placeholder="Internal notes about the customer..."
          />
        </div>
      </div>

      {/* 4. Attachments */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
            <Paperclip className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Attachments (Optional)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload ID Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Proof</label>
            <div className="relative">
              <input
                type="file"
                id="idProof"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "idProof")}
                className="hidden"
              />
              <label
                htmlFor="idProof"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors duration-200"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Aadhar, PAN, etc.</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </label>
            </div>
            {files.idProof && (
              <div className="mt-2">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{files.idProof.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("idProof")}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Visiting Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Visiting Card</label>
            <div className="relative">
              <input
                type="file"
                id="visitingCard"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "visitingCard")}
                className="hidden"
              />
              <label
                htmlFor="visitingCard"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors duration-200"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Business card</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              </label>
            </div>
            {files.visitingCard && (
              <div className="mt-2">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{files.visitingCard.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("visitingCard")}
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

      {/* 5. Submit Section */}
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
            Save Customer
          </button>
        </div>
      </div>
    </form>
  )
}
