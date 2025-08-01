"use client"
import { useState } from "react"
import { z } from "zod"
import { ChevronLeft, ChevronRight, Check, User, Briefcase, CreditCard, CheckCircle } from "lucide-react"

// Zod validation schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().min(1, "Address is required"),
})

const jobDetailsSchema = z.object({
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  salaryType: z.enum(["fixed", "hourly", "commission"], { required_error: "Salary type is required" }),
  monthlySalary: z.number().optional(),
  hourlyRate: z.number().optional(),
  commissionRate: z.number().optional(),
  commissionType: z.enum(["percentage", "fixed"]).optional(),
})

const bankDetailsSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits"),
  bankName: z.string().min(1, "Bank name is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}[0-9]{7}$/, "Invalid IFSC code format"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
})

const statusSchema = z.object({
  status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
  notes: z.string().optional(),
})

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    // Job Details
    designation: "",
    department: "",
    dateOfJoining: "",
    salaryType: "",
    monthlySalary: "",
    hourlyRate: "",
    commissionRate: "",
    commissionType: "percentage",
    // Bank Details
    panNumber: "",
    aadhaarNumber: "",
    bankName: "",
    ifscCode: "",
    accountHolderName: "",
    accountNumber: "",
    // Status
    status: "",
    notes: "",
  })
  const [errors, setErrors] = useState({})

  const totalSteps = 4

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateStep = (step) => {
    let schema
    let data = {}

    switch (step) {
      case 1:
        schema = personalInfoSchema
        data = {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }
        break
      case 2:
        schema = jobDetailsSchema
        data = {
          designation: formData.designation,
          department: formData.department,
          dateOfJoining: formData.dateOfJoining,
          salaryType: formData.salaryType,
          ...(formData.salaryType === "fixed" && { monthlySalary: Number.parseFloat(formData.monthlySalary) || 0 }),
          ...(formData.salaryType === "hourly" && { hourlyRate: Number.parseFloat(formData.hourlyRate) || 0 }),
          ...(formData.salaryType === "commission" && {
            commissionRate: Number.parseFloat(formData.commissionRate) || 0,
            commissionType: formData.commissionType,
          }),
        }
        break
      case 3:
        schema = bankDetailsSchema
        data = {
          panNumber: formData.panNumber,
          aadhaarNumber: formData.aadhaarNumber,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
        }
        break
      case 4:
        schema = statusSchema
        data = {
          status: formData.status,
          notes: formData.notes,
        }
        break
      default:
        return true
    }

    try {
      schema.parse(data)
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

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep(4)) {
      alert("Employee saved successfully!")
      console.log("Form data:", formData)
    }
  }

  const formatPhone = (value) => {
    return value.replace(/\D/g, "").slice(0, 10)
  }

  const formatPAN = (value) => {
    return value.toUpperCase().slice(0, 10)
  }

  const formatAadhaar = (value) => {
    return value.replace(/\D/g, "").slice(0, 12)
  }

  const formatIFSC = (value) => {
    return value.toUpperCase().slice(0, 11)
  }

  const StepIndicator = ({ step, isActive, isCompleted }) => {
    if (isCompleted) {
      return (
        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
          <Check className="w-5 h-5" />
        </div>
      )
    }
    if (isActive) {
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
          {step}
        </div>
      )
    }
    return (
      <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
        {step}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen py-8">
      <div className="max-w-full mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Employee</h1>
          <p className="text-gray-600">Fill in the employee details across multiple steps</p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Personal Info</p>
                  <p className="text-xs text-gray-500">Basic details</p>
                </div>
              </div>

              {/* Connector */}
              <div className={`w-16 h-1 rounded ${currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`}></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <StepIndicator step={2} isActive={currentStep === 2} isCompleted={currentStep > 2} />
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
                    Job Details
                  </p>
                  <p className={`text-xs ${currentStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>Work information</p>
                </div>
              </div>

              {/* Connector */}
              <div className={`w-16 h-1 rounded ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <StepIndicator step={3} isActive={currentStep === 3} isCompleted={currentStep > 3} />
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
                    Bank Details
                  </p>
                  <p className={`text-xs ${currentStep >= 3 ? "text-gray-500" : "text-gray-400"}`}>Financial info</p>
                </div>
              </div>

              {/* Connector */}
              <div className={`w-16 h-1 rounded ${currentStep > 3 ? "bg-green-500" : "bg-gray-200"}`}></div>

              {/* Step 4 */}
              <div className="flex items-center">
                <StepIndicator step={4} isActive={currentStep === 4} isCompleted={currentStep > 4} />
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= 4 ? "text-gray-900" : "text-gray-500"}`}>
                    Status
                  </p>
                  <p className={`text-xs ${currentStep >= 4 ? "text-gray-500" : "text-gray-400"}`}>Final setup</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Step {currentStep} of {totalSteps}
              </p>
              <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Section 1: Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter employee full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="employee@company.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Section 2: Job Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.designation ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Software Engineer, Manager"
                  />
                  {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select department</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                    <option value="design">Design</option>
                    <option value="support">Customer Support</option>
                  </select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.dateOfJoining ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
                </div>

                {/* Salary Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.salaryType}
                    onChange={(e) => handleInputChange("salaryType", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.salaryType ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select salary type</option>
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                    <option value="commission">Commission</option>
                  </select>
                  {errors.salaryType && <p className="text-red-500 text-sm mt-1">{errors.salaryType}</p>}
                </div>

                {/* Monthly Salary (for Fixed) */}
                {formData.salaryType === "fixed" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Salary (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.monthlySalary}
                      onChange={(e) => handleInputChange("monthlySalary", e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.monthlySalary ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter monthly salary"
                    />
                    {errors.monthlySalary && <p className="text-red-500 text-sm mt-1">{errors.monthlySalary}</p>}
                  </div>
                )}

                {/* Hourly Rate (for Hourly) */}
                {formData.salaryType === "hourly" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.hourlyRate ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter hourly rate"
                    />
                    {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                  </div>
                )}

                {/* Commission Rate (for Commission) */}
                {formData.salaryType === "commission" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={formData.commissionRate}
                        onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                        min="0"
                        step="0.01"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          errors.commissionRate ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter rate"
                      />
                      <select
                        value={formData.commissionType}
                        onChange={(e) => handleInputChange("commissionType", e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">₹</option>
                      </select>
                    </div>
                    {errors.commissionRate && <p className="text-red-500 text-sm mt-1">{errors.commissionRate}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Section 3: Bank Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", formatPAN(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.panNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ABCDE1234F"
                  />
                  {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", formatAadhaar(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.aadhaarNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="12-digit Aadhaar number"
                  />
                  {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.bankName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., State Bank of India"
                  />
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", formatIFSC(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.ifscCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="SBIN0001234"
                  />
                  {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.accountHolderName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="As per bank records"
                  />
                  {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.accountNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Bank account number"
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Status */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Section 4: Status</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Inactive</span>
                    </label>
                  </div>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Any additional information about the employee..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    <ChevronLeft className="inline-block w-5 h-5 mr-2" />
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-4">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Next
                    <ChevronRight className="inline-block w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <Check className="inline-block w-5 h-5 mr-2" />
                    Save Employee
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
