
// import { useState } from "react"
// import { z } from "zod"
// import { ChevronLeft, ChevronRight, Check, User, Briefcase, CreditCard, CheckCircle } from "lucide-react"

// // Zod validation schemas
// const personalInfoSchema = z.object({
//   fullName: z.string().min(1, "Full name is required"),
//   gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
//   dateOfBirth: z.string().min(1, "Date of birth is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
//   address: z.string().min(1, "Address is required"),
// })

// const jobDetailsSchema = z.object({
//   designation: z.string().min(1, "Designation is required"),
//   department: z.string().min(1, "Department is required"),
//   dateOfJoining: z.string().min(1, "Date of joining is required"),
//   salaryType: z.enum(["fixed", "hourly", "commission"], { required_error: "Salary type is required" }),
//   monthlySalary: z.number().optional(),
//   hourlyRate: z.number().optional(),
//   commissionRate: z.number().optional(),
//   commissionType: z.enum(["percentage", "fixed"]).optional(),
// })

// const bankDetailsSchema = z.object({
//   panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
//   aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits"),
//   bankName: z.string().min(1, "Bank name is required"),
//   ifscCode: z.string().regex(/^[A-Z]{4}[0-9]{7}$/, "Invalid IFSC code format"),
//   accountHolderName: z.string().min(1, "Account holder name is required"),
//   accountNumber: z.string().min(1, "Account number is required"),
// })

// const statusSchema = z.object({
//   status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
//   notes: z.string().optional(),
// })

// export default function AddEmployee() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [formData, setFormData] = useState({
//     // Personal Info
//     fullName: "",
//     gender: "",
//     dateOfBirth: "",
//     email: "",
//     phone: "",
//     address: "",
//     // Job Details
//     designation: "",
//     department: "",
//     dateOfJoining: "",
//     salaryType: "",
//     monthlySalary: "",
//     hourlyRate: "",
//     commissionRate: "",
//     commissionType: "percentage",
//     // Bank Details
//     panNumber: "",
//     aadhaarNumber: "",
//     bankName: "",
//     ifscCode: "",
//     accountHolderName: "",
//     accountNumber: "",
//     // Status
//     status: "",
//     notes: "",
//   })
//   const [errors, setErrors] = useState({})

//   const totalSteps = 4

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const validateStep = (step) => {
//     let schema
//     let data = {}

//     switch (step) {
//       case 1:
//         schema = personalInfoSchema
//         data = {
//           fullName: formData.fullName,
//           gender: formData.gender,
//           dateOfBirth: formData.dateOfBirth,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//         }
//         break
//       case 2:
//         schema = jobDetailsSchema
//         data = {
//           designation: formData.designation,
//           department: formData.department,
//           dateOfJoining: formData.dateOfJoining,
//           salaryType: formData.salaryType,
//           ...(formData.salaryType === "fixed" && { monthlySalary: Number.parseFloat(formData.monthlySalary) || 0 }),
//           ...(formData.salaryType === "hourly" && { hourlyRate: Number.parseFloat(formData.hourlyRate) || 0 }),
//           ...(formData.salaryType === "commission" && {
//             commissionRate: Number.parseFloat(formData.commissionRate) || 0,
//             commissionType: formData.commissionType,
//           }),
//         }
//         break
//       case 3:
//         schema = bankDetailsSchema
//         data = {
//           panNumber: formData.panNumber,
//           aadhaarNumber: formData.aadhaarNumber,
//           bankName: formData.bankName,
//           ifscCode: formData.ifscCode,
//           accountHolderName: formData.accountHolderName,
//           accountNumber: formData.accountNumber,
//         }
//         break
//       case 4:
//         schema = statusSchema
//         data = {
//           status: formData.status,
//           notes: formData.notes,
//         }
//         break
//       default:
//         return true
//     }

//     try {
//       schema.parse(data)
//       setErrors({})
//       return true
//     } catch (error) {
//       const newErrors = {}
//       error.errors.forEach((err) => {
//         newErrors[err.path[0]] = err.message
//       })
//       setErrors(newErrors)
//       return false
//     }
//   }

//   const nextStep = () => {
//     if (validateStep(currentStep) && currentStep < totalSteps) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1)
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (validateStep(4)) {
//       alert("Employee saved successfully!")
//       console.log("Form data:", formData)
//     }
//   }

//   const formatPhone = (value) => {
//     return value.replace(/\D/g, "").slice(0, 10)
//   }

//   const formatPAN = (value) => {
//     return value.toUpperCase().slice(0, 10)
//   }

//   const formatAadhaar = (value) => {
//     return value.replace(/\D/g, "").slice(0, 12)
//   }

//   const formatIFSC = (value) => {
//     return value.toUpperCase().slice(0, 11)
//   }

//   const StepIndicator = ({ step, isActive, isCompleted }) => {
//     if (isCompleted) {
//       return (
//         <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
//           <Check className="w-5 h-5" />
//         </div>
//       )
//     }
//     if (isActive) {
//       return (
//         <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
//           {step}
//         </div>
//       )
//     }
//     return (
//       <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
//         {step}
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen py-8">
//       <div className="max-w-full mx-auto px-4  ml-4 mr-4">
//         {/* Page Title */}
//         {/* <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Employee</h1>
//           <p className="text-gray-600">Fill in the employee details across multiple steps</p>
//         </div> */}

//         {/* Step Indicator */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {/* Step 1 */}
//               <div className="flex items-center">
//                 <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className="text-md font-medium text-gray-900">Personal Info</p>
//                   <p className="text-xs text-gray-500">Basic details</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 2 */}
//               <div className="flex items-center">
//                 <StepIndicator step={2} isActive={currentStep === 2} isCompleted={currentStep > 2} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
//                     Job Details
//                   </p>
//                   <p className={`text-md ${currentStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>Work information</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 3 */}
//               <div className="flex items-center">
//                 <StepIndicator step={3} isActive={currentStep === 3} isCompleted={currentStep > 3} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-md font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
//                     Bank Details
//                   </p>
//                   <p className={`text-xs ${currentStep >= 3 ? "text-gray-500" : "text-gray-400"}`}>Financial info</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 3 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 4 */}
//               <div className="flex items-center">
//                 <StepIndicator step={4} isActive={currentStep === 4} isCompleted={currentStep > 4} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-md font-medium ${currentStep >= 4 ? "text-gray-900" : "text-gray-500"}`}>
//                     Status
//                   </p>
//                   <p className={`text-xs ${currentStep >= 4 ? "text-gray-500" : "text-gray-400"}`}>Final setup</p>
//                 </div>
//               </div>
//             </div>

//             {/* Progress */}
//             <div className="text-right">
//               <p className="text-sm font-medium text-gray-900">
//                 Step {currentStep} of {totalSteps}
//               </p>
//               <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
//                 <div
//                   className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full transition-all duration-300"
//                   style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Step 1: Personal Information */}
//           {currentStep === 1 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 1: Personal Information</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange("fullName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.fullName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter employee full name"
//                   />
//                   {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleInputChange("gender", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.gender ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfBirth}
//                     onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfBirth ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="employee@company.com"
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.phone ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="10-digit phone number"
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     rows={3}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
//                       errors.address ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter full address"
//                   />
//                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Job Details */}
//           {currentStep === 2 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
//                   <Briefcase className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 2: Job Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Designation */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Designation <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.designation}
//                     onChange={(e) => handleInputChange("designation", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.designation ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., Software Engineer, Manager"
//                   />
//                   {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
//                 </div>

//                 {/* Department */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.department}
//                     onChange={(e) => handleInputChange("department", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.department ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select department</option>
//                     <option value="engineering">Engineering</option>
//                     <option value="marketing">Marketing</option>
//                     <option value="sales">Sales</option>
//                     <option value="hr">Human Resources</option>
//                     <option value="finance">Finance</option>
//                     <option value="operations">Operations</option>
//                     <option value="design">Design</option>
//                     <option value="support">Customer Support</option>
//                   </select>
//                   {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
//                 </div>

//                 {/* Date of Joining */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Joining <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfJoining}
//                     onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfJoining ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
//                 </div>

//                 {/* Salary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.salaryType}
//                     onChange={(e) => handleInputChange("salaryType", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.salaryType ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select salary type</option>
//                     <option value="fixed">Fixed</option>
//                     <option value="hourly">Hourly</option>
//                     <option value="commission">Commission</option>
//                   </select>
//                   {errors.salaryType && <p className="text-red-500 text-sm mt-1">{errors.salaryType}</p>}
//                 </div>

//                 {/* Monthly Salary (for Fixed) */}
//                 {formData.salaryType === "fixed" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Monthly Salary (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.monthlySalary}
//                       onChange={(e) => handleInputChange("monthlySalary", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.monthlySalary ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter monthly salary"
//                     />
//                     {errors.monthlySalary && <p className="text-red-500 text-sm mt-1">{errors.monthlySalary}</p>}
//                   </div>
//                 )}

//                 {/* Hourly Rate (for Hourly) */}
//                 {formData.salaryType === "hourly" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hourly Rate (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.hourlyRate}
//                       onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.hourlyRate ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter hourly rate"
//                     />
//                     {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
//                   </div>
//                 )}

//                 {/* Commission Rate (for Commission) */}
//                 {formData.salaryType === "commission" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Commission Rate <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-2">
//                       <input
//                         type="number"
//                         value={formData.commissionRate}
//                         onChange={(e) => handleInputChange("commissionRate", e.target.value)}
//                         min="0"
//                         step="0.01"
//                         className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                           errors.commissionRate ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="Enter rate"
//                       />
//                       <select
//                         value={formData.commissionType}
//                         onChange={(e) => handleInputChange("commissionType", e.target.value)}
//                         className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                       >
//                         <option value="percentage">%</option>
//                         <option value="fixed">₹</option>
//                       </select>
//                     </div>
//                     {errors.commissionRate && <p className="text-red-500 text-sm mt-1">{errors.commissionRate}</p>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Bank Details */}
//           {currentStep === 3 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
//                   <CreditCard className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 3: Bank Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* PAN Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PAN Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.panNumber}
//                     onChange={(e) => handleInputChange("panNumber", formatPAN(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.panNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="ABCDE1234F"
//                   />
//                   {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
//                 </div>

//                 {/* Aadhaar Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.aadhaarNumber}
//                     onChange={(e) => handleInputChange("aadhaarNumber", formatAadhaar(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.aadhaarNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="12-digit Aadhaar number"
//                   />
//                   {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
//                 </div>

//                 {/* Bank Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.bankName}
//                     onChange={(e) => handleInputChange("bankName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.bankName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., State Bank of India"
//                   />
//                   {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
//                 </div>

//                 {/* IFSC Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.ifscCode}
//                     onChange={(e) => handleInputChange("ifscCode", formatIFSC(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.ifscCode ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="SBIN0001234"
//                   />
//                   {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
//                 </div>

//                 {/* Account Holder Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountHolderName}
//                     onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountHolderName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="As per bank records"
//                   />
//                   {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
//                 </div>

//                 {/* Account Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountNumber}
//                     onChange={(e) => handleInputChange("accountNumber", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Bank account number"
//                   />
//                   {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Status */}
//           {currentStep === 4 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 4: Status</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Employee Status <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Inactive</span>
//                     </label>
//                   </div>
//                   {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
//                 </div>

//                 {/* Additional Notes */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) => handleInputChange("notes", e.target.value)}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
//                     placeholder="Any additional information about the employee..."
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//               <div className="flex gap-4">
//                 {currentStep > 1 && (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//                   >
//                     <ChevronLeft className="inline-block w-5 h-5 mr-2" />
//                     Previous
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => window.history.back()}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>

//               <div className="flex gap-4">
//                 {currentStep < totalSteps ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//                   >
//                     Next
//                     <ChevronRight className="inline-block w-5 h-5 ml-2" />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//                   >
//                     <Check className="inline-block w-5 h-5 mr-2" />
//                     Save Employee
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }













// import { useState } from "react"
// import { useMutation, useQuery } from "@tanstack/react-query"
// import { z } from "zod"
// import { ChevronLeft, ChevronRight, Check, User, Briefcase, CreditCard, CheckCircle, Loader2 } from "lucide-react"

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// const personalInfoSchema = z.object({
//   fullName: z.string().min(1, "Full name is required"),
//   gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
//   dateOfBirth: z.string().min(1, "Date of birth is required"),
//   email: z.string().email("Invalid email address"),
//   personalEmail: z.string().email("Invalid personal email address").optional().or(z.literal("")),
//   phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
//   address: z.string().min(1, "Address is required"),
// })

// const jobDetailsSchema = z.object({
//   designation: z.string().min(1, "Designation is required"),
//   department: z.string().min(1, "Department is required"),
//   dateOfJoining: z.string().min(1, "Date of joining is required"),
//   salaryType: z.enum(["fixed", "hourly", "commission"], { required_error: "Salary type is required" }),
//   monthlySalary: z.number().optional(),
//   hourlyRate: z.number().optional(),
//   commissionRate: z.number().optional(),
//   commissionType: z.enum(["percentage", "fixed"]).optional(),
//   createLogin: z.boolean().default(false),
//   role: z.enum(["agent", "admin", "manager"]).default("agent"),
// })

// const bankDetailsSchema = z.object({
//   panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
//   aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits"),
//   bankName: z.string().min(1, "Bank name is required"),
//   ifscCode: z.string().regex(/^[A-Z]{4}[0-9]{7}$/, "Invalid IFSC code format"),
//   accountHolderName: z.string().min(1, "Account holder name is required"),
//   accountNumber: z.string().min(1, "Account number is required"),
// })

// const statusSchema = z.object({
//   status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
//   notes: z.string().optional(),
// })

// const createEmployee = async (employeeData) => {
//   const token = sessionStorage.getItem("authToken") // Adjust based on your auth implementation
//   const departmentId = sessionStorage.getItem("departmentId") // Adjust based on your department logic

//   const response = await fetch(`${API_BASE_URL}employees`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       "X-Department-Id": departmentId,
//     },
//     body: JSON.stringify(employeeData),
//   })

//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(error.message || "Failed to create employee")
//   }

//   return response.json()
// }

// const fetchDepartments = async () => {
//   const token = sessionStorage.getItem("authToken")

//   const response = await fetch(`${API_BASE_URL}departments`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!response.ok) {
//     throw new Error("Failed to fetch departments")
//   }

//   return response.json()
// }

// export default function AddEmployee() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [formData, setFormData] = useState({
//     // Personal Info
//     fullName: "",
//     gender: "",
//     dateOfBirth: "",
//     email: "",
//     personalEmail: "",
//     phone: "",
//     address: "",
//     // Job Details
//     designation: "",
//     department: "",
//     dateOfJoining: "",
//     salaryType: "",
//     monthlySalary: "",
//     hourlyRate: "",
//     commissionRate: "",
//     commissionType: "percentage",
//     createLogin: false,
//     role: "agent",
//     // Bank Details
//     panNumber: "",
//     aadhaarNumber: "",
//     bankName: "",
//     ifscCode: "",
//     accountHolderName: "",
//     accountNumber: "",
//     // Status
//     status: "",
//     notes: "",
//   })
//   const [errors, setErrors] = useState({})

//   const { data: departments = [], isLoading: departmentsLoading } = useQuery({
//     queryKey: ["departments"],
//     queryFn: fetchDepartments,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })

//   const createEmployeeMutation = useMutation({
//     mutationFn: createEmployee,
//     onSuccess: (data) => {
//       alert("Employee created successfully!")
//       console.log("Employee created:", data)
//       // Reset form or redirect
//       setFormData({
//         fullName: "",
//         gender: "",
//         dateOfBirth: "",
//         email: "",
//         personalEmail: "",
//         phone: "",
//         address: "",
//         designation: "",
//         department: "",
//         dateOfJoining: "",
//         salaryType: "",
//         monthlySalary: "",
//         hourlyRate: "",
//         commissionRate: "",
//         commissionType: "percentage",
//         createLogin: false,
//         role: "agent",
//         panNumber: "",
//         aadhaarNumber: "",
//         bankName: "",
//         ifscCode: "",
//         accountHolderName: "",
//         accountNumber: "",
//         status: "",
//         notes: "",
//       })
//       setCurrentStep(1)
//     },
//     onError: (error) => {
//       alert(`Error: ${error.message}`)
//       console.error("Error creating employee:", error)
//     },
//   })

//   const totalSteps = 4

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const validateStep = (step) => {
//     let schema
//     let data = {}

//     switch (step) {
//       case 1:
//         schema = personalInfoSchema
//         data = {
//           fullName: formData.fullName,
//           gender: formData.gender,
//           dateOfBirth: formData.dateOfBirth,
//           email: formData.email,
//           personalEmail: formData.personalEmail,
//           phone: formData.phone,
//           address: formData.address,
//         }
//         break
//       case 2:
//         schema = jobDetailsSchema
//         data = {
//           designation: formData.designation,
//           department: formData.department,
//           dateOfJoining: formData.dateOfJoining,
//           salaryType: formData.salaryType,
//           ...(formData.salaryType === "fixed" && { monthlySalary: Number.parseFloat(formData.monthlySalary) || 0 }),
//           ...(formData.salaryType === "hourly" && { hourlyRate: Number.parseFloat(formData.hourlyRate) || 0 }),
//           ...(formData.salaryType === "commission" && {
//             commissionRate: Number.parseFloat(formData.commissionRate) || 0,
//             commissionType: formData.commissionType,
//           }),
//           createLogin: formData.createLogin,
//           role: formData.role,
//         }
//         break
//       case 3:
//         schema = bankDetailsSchema
//         data = {
//           panNumber: formData.panNumber,
//           aadhaarNumber: formData.aadhaarNumber,
//           bankName: formData.bankName,
//           ifscCode: formData.ifscCode,
//           accountHolderName: formData.accountHolderName,
//           accountNumber: formData.accountNumber,
//         }
//         break
//       case 4:
//         schema = statusSchema
//         data = {
//           status: formData.status,
//           notes: formData.notes,
//         }
//         break
//       default:
//         return true
//     }

//     try {
//       schema.parse(data)
//       setErrors({})
//       return true
//     } catch (error) {
//       const newErrors = {}
//       error.errors.forEach((err) => {
//         newErrors[err.path[0]] = err.message
//       })
//       setErrors(newErrors)
//       return false
//     }
//   }

//   const nextStep = () => {
//     if (validateStep(currentStep) && currentStep < totalSteps) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1)
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (validateStep(4)) {
//       // Transform form data to match API requirements
//       const [firstName, ...lastNameParts] = formData.fullName.split(" ")
//       const lastName = lastNameParts.join(" ")

//       const apiData = {
//         first_name: firstName,
//         last_name: lastName || "",
//         gender: formData.gender,
//         dob: formData.dateOfBirth,
//         phone: formData.phone,
//         email: formData.email,
//         personal_email: formData.personalEmail || formData.email,
//         address: formData.address,
//         designation: formData.designation,
//         department_id: Number.parseInt(formData.department),
//         join_date: formData.dateOfJoining,
//         salary_type: formData.salaryType,
//         monthly_salary: formData.salaryType === "fixed" ? Number.parseFloat(formData.monthlySalary) : null,
//         create_login: formData.createLogin,
//         role: formData.role,
//       }

//       createEmployeeMutation.mutate(apiData)
//     }
//   }

//   const formatPhone = (value) => {
//     return value.replace(/\D/g, "").slice(0, 10)
//   }

//   const formatPAN = (value) => {
//     return value.toUpperCase().slice(0, 10)
//   }

//   const formatAadhaar = (value) => {
//     return value.replace(/\D/g, "").slice(0, 12)
//   }

//   const formatIFSC = (value) => {
//     return value.toUpperCase().slice(0, 11)
//   }

//   const StepIndicator = ({ step, isActive, isCompleted }) => {
//     if (isCompleted) {
//       return (
//         <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
//           <Check className="w-5 h-5" />
//         </div>
//       )
//     }
//     if (isActive) {
//       return (
//         <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
//           {step}
//         </div>
//       )
//     }
//     return (
//       <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
//         {step}
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen py-8">
//       <div className="max-w-full mx-auto px-4  ml-4 mr-4">
//         {/* Page Title */}
//         {/* <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Employee</h1>
//           <p className="text-gray-600">Fill in the employee details across multiple steps</p>
//         </div> */}

//         {/* Step Indicator */}
//       <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    
//     {/* Steps - Scrollable on small screens */}
//     <div className="overflow-x-auto scrollbar-hide">
//       <div className="flex items-center space-x-4 min-w-max">
//         {/* Step 1 */}
//         <div className="flex items-center">
//           <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
//           <div className="ml-3 hidden sm:block">
//             <p className="text-md font-medium text-gray-900">Personal Info</p>
//             <p className="text-xs text-gray-500">Basic details</p>
//           </div>
//         </div>

//         {/* Connector */}
//         <div className={`w-16 h-1 rounded ${currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`}></div>

//         {/* Step 2 */}
//         <div className="flex items-center">
//           <StepIndicator step={2} isActive={currentStep === 2} isCompleted={currentStep > 2} />
//           <div className="ml-3 hidden sm:block">
//             <p className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
//               Job Details
//             </p>
//             <p className={`text-md ${currentStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>Work information</p>
//           </div>
//         </div>

//         {/* Connector */}
//         <div className={`w-16 h-1 rounded ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>

//         {/* Step 3 */}
//         <div className="flex items-center">
//           <StepIndicator step={3} isActive={currentStep === 3} isCompleted={currentStep > 3} />
//           <div className="ml-3 hidden sm:block">
//             <p className={`text-md font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
//               Bank Details
//             </p>
//             <p className={`text-xs ${currentStep >= 3 ? "text-gray-500" : "text-gray-400"}`}>Financial info</p>
//           </div>
//         </div>

//         {/* Connector */}
//         <div className={`w-16 h-1 rounded ${currentStep > 3 ? "bg-green-500" : "bg-gray-200"}`}></div>

//         {/* Step 4 */}
//         <div className="flex items-center">
//           <StepIndicator step={4} isActive={currentStep === 4} isCompleted={currentStep > 4} />
//           <div className="ml-3 hidden sm:block">
//             <p className={`text-md font-medium ${currentStep >= 4 ? "text-gray-900" : "text-gray-500"}`}>
//               Status
//             </p>
//             <p className={`text-xs ${currentStep >= 4 ? "text-gray-500" : "text-gray-400"}`}>Final setup</p>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Progress Summary */}
//     <div className="text-left sm:text-right">
//       <p className="text-sm font-medium text-gray-900">
//         Step {currentStep} of {totalSteps}
//       </p>
//       <div className="w-full sm:w-24 h-2 bg-gray-200 rounded-full mt-1">
//         <div
//           className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full transition-all duration-300"
//           style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//         ></div>
//       </div>
//     </div>
//   </div>
// </div>


//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Step 1: Personal Information */}
//           {currentStep === 1 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 1: Personal Information</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange("fullName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.fullName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter employee full name"
//                   />
//                   {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleInputChange("gender", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.gender ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfBirth}
//                     onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfBirth ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Work Email <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="employee@company.com"
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Personal Email</label>
//                   <input
//                     type="email"
//                     value={formData.personalEmail}
//                     onChange={(e) => handleInputChange("personalEmail", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.personalEmail ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="personal@gmail.com"
//                   />
//                   {errors.personalEmail && <p className="text-red-500 text-sm mt-1">{errors.personalEmail}</p>}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.phone ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="10-digit phone number"
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     rows={3}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
//                       errors.address ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter full address"
//                   />
//                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Job Details */}
//           {currentStep === 2 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
//                   <Briefcase className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 2: Job Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Designation */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Designation <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.designation}
//                     onChange={(e) => handleInputChange("designation", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.designation ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., Software Engineer, Manager"
//                   />
//                   {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.department}
//                     onChange={(e) => handleInputChange("department", e.target.value)}
//                     disabled={departmentsLoading}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.department ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">{departmentsLoading ? "Loading departments..." : "Select department"}</option>
//                     {departments.map((dept) => (
//                       <option key={dept.id} value={dept.id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
//                 </div>

//                 {/* Date of Joining */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Joining <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfJoining}
//                     onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfJoining ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
//                 </div>

//                 {/* Salary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.salaryType}
//                     onChange={(e) => handleInputChange("salaryType", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.salaryType ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select salary type</option>
//                     <option value="fixed">Fixed</option>
//                     <option value="hourly">Hourly</option>
//                     <option value="commission">Commission</option>
//                   </select>
//                   {errors.salaryType && <p className="text-red-500 text-sm mt-1">{errors.salaryType}</p>}
//                 </div>

//                 {/* Monthly Salary (for Fixed) */}
//                 {formData.salaryType === "fixed" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Monthly Salary (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.monthlySalary}
//                       onChange={(e) => handleInputChange("monthlySalary", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.monthlySalary ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter monthly salary"
//                     />
//                     {errors.monthlySalary && <p className="text-red-500 text-sm mt-1">{errors.monthlySalary}</p>}
//                   </div>
//                 )}

//                 {/* Hourly Rate (for Hourly) */}
//                 {formData.salaryType === "hourly" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hourly Rate (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.hourlyRate}
//                       onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.hourlyRate ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter hourly rate"
//                     />
//                     {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
//                   </div>
//                 )}

//                 {/* Commission Rate (for Commission) */}
//                 {formData.salaryType === "commission" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Commission Rate <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-2">
//                       <input
//                         type="number"
//                         value={formData.commissionRate}
//                         onChange={(e) => handleInputChange("commissionRate", e.target.value)}
//                         min="0"
//                         step="0.01"
//                         className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                           errors.commissionRate ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="Enter rate"
//                       />
//                       <select
//                         value={formData.commissionType}
//                         onChange={(e) => handleInputChange("commissionType", e.target.value)}
//                         className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                       >
//                         <option value="percentage">%</option>
//                         <option value="fixed">₹</option>
//                       </select>
//                     </div>
//                     {errors.commissionRate && <p className="text-red-500 text-sm mt-1">{errors.commissionRate}</p>}
//                   </div>
//                 )}

//                 <div className="md:col-span-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Create Login Account</label>
//                       <div className="flex items-center space-x-4">
//                         <label className="flex items-center">
//                           <input
//                             type="checkbox"
//                             checked={formData.createLogin}
//                             onChange={(e) => handleInputChange("createLogin", e.target.checked)}
//                             className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
//                           />
//                           <span className="ml-2 text-sm text-gray-900">Create login credentials</span>
//                         </label>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Role <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={formData.role}
//                         onChange={(e) => handleInputChange("role", e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                       >
//                         <option value="agent">Agent</option>
//                         <option value="manager">Manager</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ... existing code for hourly and commission fields ... */}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Bank Details */}
//           {currentStep === 3 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
//                   <CreditCard className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 3: Bank Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* PAN Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PAN Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.panNumber}
//                     onChange={(e) => handleInputChange("panNumber", formatPAN(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.panNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="ABCDE1234F"
//                   />
//                   {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
//                 </div>

//                 {/* Aadhaar Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.aadhaarNumber}
//                     onChange={(e) => handleInputChange("aadhaarNumber", formatAadhaar(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.aadhaarNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="12-digit Aadhaar number"
//                   />
//                   {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
//                 </div>

//                 {/* Bank Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.bankName}
//                     onChange={(e) => handleInputChange("bankName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.bankName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., State Bank of India"
//                   />
//                   {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
//                 </div>

//                 {/* IFSC Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.ifscCode}
//                     onChange={(e) => handleInputChange("ifscCode", formatIFSC(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.ifscCode ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="SBIN0001234"
//                   />
//                   {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
//                 </div>

//                 {/* Account Holder Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountHolderName}
//                     onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountHolderName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="As per bank records"
//                   />
//                   {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
//                 </div>

//                 {/* Account Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountNumber}
//                     onChange={(e) => handleInputChange("accountNumber", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Bank account number"
//                   />
//                   {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Status */}
//           {currentStep === 4 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 4: Status</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Employee Status <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Inactive</span>
//                     </label>
//                   </div>
//                   {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
//                 </div>

//                 {/* Additional Notes */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) => handleInputChange("notes", e.target.value)}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
//                     placeholder="Any additional information about the employee..."
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//               <div className="flex gap-4">
//                 {currentStep > 1 && (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     disabled={createEmployeeMutation.isPending}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50"
//                   >
//                     <ChevronLeft className="inline-block w-5 h-5 mr-2" />
//                     Previous
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => window.history.back()}
//                   disabled={createEmployeeMutation.isPending}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//               </div>

//               <div className="flex gap-4">
//                 {currentStep < totalSteps ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     disabled={createEmployeeMutation.isPending}
//                     className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
//                   >
//                     Next
//                     <ChevronRight className="inline-block w-5 h-5 ml-2" />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={createEmployeeMutation.isPending}
//                     className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center"
//                   >
//                     {createEmployeeMutation.isPending ? (
//                       <>
//                         <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
//                         Creating Employee...
//                       </>
//                     ) : (
//                       <>
//                         <Check className="inline-block w-5 h-5 mr-2" />
//                         Save Employee
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }





// import { useState } from "react"
// import { z } from "zod"
// import { ChevronLeft, ChevronRight, Check, User, Briefcase, CreditCard, CheckCircle } from "lucide-react"

// // Zod validation schemas
// const personalInfoSchema = z.object({
//   fullName: z.string().min(1, "Full name is required"),
//   gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
//   dateOfBirth: z.string().min(1, "Date of birth is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
//   address: z.string().min(1, "Address is required"),
// })

// const jobDetailsSchema = z.object({
//   designation: z.string().min(1, "Designation is required"),
//   department: z.string().min(1, "Department is required"),
//   dateOfJoining: z.string().min(1, "Date of joining is required"),
//   salaryType: z.enum(["fixed", "hourly", "commission"], { required_error: "Salary type is required" }),
//   monthlySalary: z.number().optional(),
//   hourlyRate: z.number().optional(),
//   commissionRate: z.number().optional(),
//   commissionType: z.enum(["percentage", "fixed"]).optional(),
// })

// const bankDetailsSchema = z.object({
//   panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
//   aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits"),
//   bankName: z.string().min(1, "Bank name is required"),
//   ifscCode: z.string().regex(/^[A-Z]{4}[0-9]{7}$/, "Invalid IFSC code format"),
//   accountHolderName: z.string().min(1, "Account holder name is required"),
//   accountNumber: z.string().min(1, "Account number is required"),
// })

// const statusSchema = z.object({
//   status: z.enum(["active", "inactive"], { required_error: "Status is required" }),
//   notes: z.string().optional(),
// })

// // Public config for API

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// const API_AUTH_TOKEN =  "token";
// const API_DEPARTMENT_ID =  "departmentIds";


// export default function AddEmployee() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [formData, setFormData] = useState({
//     // Personal Info
//     fullName: "",
//     gender: "",
//     dateOfBirth: "",
//     email: "",
//     phone: "",
//     address: "",
//     // Job Details
//     designation: "",
//     department: API_DEPARTMENT_ID,
//     dateOfJoining: "",
//     salaryType: "",
//     monthlySalary: "",
//     hourlyRate: "",
//     commissionRate: "",
//     commissionType: "percentage",
//     // Bank Details
//     panNumber: "",
//     aadhaarNumber: "",
//     bankName: "",
//     ifscCode: "",
//     accountHolderName: "",
//     accountNumber: "",
//     // Status
//     status: "",
//     notes: "",
//   })
//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [apiError, setApiError] = useState("")
//   const [apiSuccess, setApiSuccess] = useState(null)

//   const totalSteps = 4

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const validateStep = (step) => {
//     let schema
//     let data = {}

//     switch (step) {
//       case 1:
//         schema = personalInfoSchema
//         data = {
//           fullName: formData.fullName,
//           gender: formData.gender,
//           dateOfBirth: formData.dateOfBirth,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//         }
//         break
//       case 2:
//         schema = jobDetailsSchema
//         data = {
//           designation: formData.designation,
//           department: formData.department,
//           dateOfJoining: formData.dateOfJoining,
//           salaryType: formData.salaryType,
//           ...(formData.salaryType === "fixed" && { monthlySalary: Number.parseFloat(formData.monthlySalary) || 0 }),
//           ...(formData.salaryType === "hourly" && { hourlyRate: Number.parseFloat(formData.hourlyRate) || 0 }),
//           ...(formData.salaryType === "commission" && {
//             commissionRate: Number.parseFloat(formData.commissionRate) || 0,
//             commissionType: formData.commissionType,
//           }),
//         }
//         break
//       case 3:
//         schema = bankDetailsSchema
//         data = {
//           panNumber: formData.panNumber,
//           aadhaarNumber: formData.aadhaarNumber,
//           bankName: formData.bankName,
//           ifscCode: formData.ifscCode,
//           accountHolderName: formData.accountHolderName,
//           accountNumber: formData.accountNumber,
//         }
//         break
//       case 4:
//         schema = statusSchema
//         data = {
//           status: formData.status,
//           notes: formData.notes,
//         }
//         break
//       default:
//         return true
//     }

//     try {
//       schema.parse(data)
//       setErrors({})
//       return true
//     } catch (error) {
//       const newErrors = {}
//       error.errors.forEach((err) => {
//         newErrors[err.path[0]] = err.message
//       })
//       setErrors(newErrors)
//       return false
//     }
//   }

//   const nextStep = () => {
//     if (validateStep(currentStep) && currentStep < totalSteps) {
//       setCurrentStep((prev) => prev + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1)
//     }
//   }

//   const splitName = (full) => {
//     const parts = String(full || "")
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean)
//     if (parts.length === 0) return { first: "", last: "" }
//     if (parts.length === 1) return { first: parts[0], last: "" }
//     return { first: parts[0], last: parts.slice(1).join(" ") }
//   }

//   const departmentToId = (value) => {
//     // Try numeric first
//     const numeric = Number(value)
//     if (!Number.isNaN(numeric) && numeric > 0) return numeric
//     // Fallback mapping for known options in the UI
//     const map = {
//       engineering: 1,
//       marketing: 2,
//       sales: 3,
//       hr: 4,
//       finance: 5,
//       operations: 6,
//       design: 7,
//       support: 8,
//     }
//     return map[value] || null
//   }

//   const buildPayload = () => {
//     const { first, last } = splitName(formData.fullName)
//     const payload = {
//       first_name: first,
//       last_name: last,
//       gender: formData.gender || null,
//       dob: formData.dateOfBirth || null,
//       phone: formData.phone || null,
//       personal_email: formData.email || null,
//       address: formData.address || null,
//       designation: formData.designation || null,
//       department_id: departmentToId(formData.department),
//       join_date: formData.dateOfJoining || null,
//       salary_type: formData.salaryType || null,
//       monthly_salary: formData.salaryType === "fixed" ? Number.parseFloat(formData.monthlySalary || "0") || 0 : null,
//       // Defaults aligned with the example request
//       create_login: true,
//       role: "agent",
//     }
//     return payload
//   }

//   const postEmployee = async (payload) => {
//     if (!API_BASE_URL || !API_AUTH_TOKEN) {
//       throw new Error("Missing API configuration. Set NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_AUTH_TOKEN.")
//     }
//     const depHeader = API_DEPARTMENT_ID || String(payload.department_id || "")

//     const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/employees`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${API_AUTH_TOKEN}`,
//         "Content-Type": "application/json",
//         "X-Department-Id": depHeader,
//       },
//       body: JSON.stringify(payload),
//     })

//     if (!res.ok) {
//       const text = await res.text().catch(() => "")
//       throw new Error(text || `Request failed with status ${res.status}`)
//     }
//     // Try to parse JSON, but tolerate empty bodies
//     const data = await res.json().catch(() => ({ message: "Employee created (no JSON body returned)" }))
//     return data
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     // validate the final step to ensure all prior steps are good
//     if (!validateStep(4)) return

//     setApiError("")
//     setApiSuccess(null)
//     setIsSubmitting(true)
//     try {
//       const payload = buildPayload()
//       const data = await postEmployee(payload)
//       setApiSuccess(data)
//       alert("Employee saved successfully!")
//       console.log("API response:", data)
//     } catch (err) {
//       console.error("API error:", err)
//       setApiError(err?.message || "Something went wrong while saving the employee.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const formatPhone = (value) => {
//     return value.replace(/\D/g, "").slice(0, 10)
//   }

//   const formatPAN = (value) => {
//     return value.toUpperCase().slice(0, 10)
//   }

//   const formatAadhaar = (value) => {
//     return value.replace(/\D/g, "").slice(0, 12)
//   }

//   const formatIFSC = (value) => {
//     return value.toUpperCase().slice(0, 11)
//   }

//   const StepIndicator = ({ step, isActive, isCompleted }) => {
//     if (isCompleted) {
//       return (
//         <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
//           <Check className="w-5 h-5" />
//         </div>
//       )
//     }
//     if (isActive) {
//       return (
//         <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
//           {step}
//         </div>
//       )
//     }
//     return (
//       <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold">
//         {step}
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen py-8">
//       <div className="max-w-full mx-auto px-4  ml-4 mr-4">
//         {/* Page Title */}
//         {/* <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Employee</h1>
//           <p className="text-gray-600">Fill in the employee details across multiple steps</p>
//         </div> */}

//         {/* Step Indicator */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {/* Step 1 */}
//               <div className="flex items-center">
//                 <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className="text-md font-medium text-gray-900">Personal Info</p>
//                   <p className="text-xs text-gray-500">Basic details</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 2 */}
//               <div className="flex items-center">
//                 <StepIndicator step={2} isActive={currentStep === 2} isCompleted={currentStep > 2} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-sm font-medium ${currentStep >= 2 ? "text-gray-900" : "text-gray-500"}`}>
//                     Job Details
//                   </p>
//                   <p className={`text-md ${currentStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>Work information</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 3 */}
//               <div className="flex items-center">
//                 <StepIndicator step={3} isActive={currentStep === 3} isCompleted={currentStep > 3} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-md font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
//                     Bank Details
//                   </p>
//                   <p className={`text-xs ${currentStep >= 3 ? "text-gray-500" : "text-gray-400"}`}>Financial info</p>
//                 </div>
//               </div>

//               {/* Connector */}
//               <div className={`w-16 h-1 rounded ${currentStep > 3 ? "bg-green-500" : "bg-gray-200"}`}></div>

//               {/* Step 4 */}
//               <div className="flex items-center">
//                 <StepIndicator step={4} isActive={currentStep === 4} isCompleted={currentStep > 4} />
//                 <div className="ml-3 hidden sm:block">
//                   <p className={`text-md font-medium ${currentStep >= 4 ? "text-gray-900" : "text-gray-500"}`}>
//                     Status
//                   </p>
//                   <p className={`text-xs ${currentStep >= 4 ? "text-gray-500" : "text-gray-400"}`}>Final setup</p>
//                 </div>
//               </div>
//             </div>

//             {/* Progress */}
//             <div className="text-right">
//               <p className="text-sm font-medium text-gray-900">
//                 Step {currentStep} of {totalSteps}
//               </p>
//               <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
//                 <div
//                   className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full transition-all duration-300"
//                   style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {apiError && (
//             <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{apiError}</div>
//           )}
//           {apiSuccess && (
//             <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 break-words">
//               Employee created successfully.
//             </div>
//           )}

//           {/* Step 1: Personal Information */}
//           {currentStep === 1 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 1: Personal Information</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange("fullName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.fullName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter employee full name"
//                   />
//                   {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleInputChange("gender", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.gender ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfBirth}
//                     onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfBirth ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="employee@company.com"
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.phone ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="10-digit phone number"
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Address <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     rows={3}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none ${
//                       errors.address ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Enter full address"
//                   />
//                   {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Job Details */}
//           {currentStep === 2 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
//                   <Briefcase className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 2: Job Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Designation */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Designation <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.designation}
//                     onChange={(e) => handleInputChange("designation", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.designation ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., Software Engineer, Manager"
//                   />
//                   {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
//                 </div>

//                 {/* Department */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.department}
//                     onChange={(e) => handleInputChange("department", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.department ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select department</option>
//                     <option value="engineering">Engineering</option>
//                     <option value="marketing">Marketing</option>
//                     <option value="sales">Sales</option>
//                     <option value="hr">Human Resources</option>
//                     <option value="finance">Finance</option>
//                     <option value="operations">Operations</option>
//                     <option value="design">Design</option>
//                     <option value="support">Customer Support</option>
//                   </select>
//                   {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
//                 </div>

//                 {/* Date of Joining */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Joining <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.dateOfJoining}
//                     onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.dateOfJoining ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {errors.dateOfJoining && <p className="text-red-500 text-sm mt-1">{errors.dateOfJoining}</p>}
//                 </div>

//                 {/* Salary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.salaryType}
//                     onChange={(e) => handleInputChange("salaryType", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.salaryType ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select salary type</option>
//                     <option value="fixed">Fixed</option>
//                     <option value="hourly">Hourly</option>
//                     <option value="commission">Commission</option>
//                   </select>
//                   {errors.salaryType && <p className="text-red-500 text-sm mt-1">{errors.salaryType}</p>}
//                 </div>

//                 {/* Monthly Salary (for Fixed) */}
//                 {formData.salaryType === "fixed" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Monthly Salary (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.monthlySalary}
//                       onChange={(e) => handleInputChange("monthlySalary", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.monthlySalary ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter monthly salary"
//                     />
//                     {errors.monthlySalary && <p className="text-red-500 text-sm mt-1">{errors.monthlySalary}</p>}
//                   </div>
//                 )}

//                 {/* Hourly Rate (for Hourly) */}
//                 {formData.salaryType === "hourly" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Hourly Rate (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.hourlyRate}
//                       onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         errors.hourlyRate ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter hourly rate"
//                     />
//                     {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
//                   </div>
//                 )}

//                 {/* Commission Rate (for Commission) */}
//                 {formData.salaryType === "commission" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Commission Rate <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-2">
//                       <input
//                         type="number"
//                         value={formData.commissionRate}
//                         onChange={(e) => handleInputChange("commissionRate", e.target.value)}
//                         min="0"
//                         step="0.01"
//                         className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                           errors.commissionRate ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="Enter rate"
//                       />
//                       <select
//                         value={formData.commissionType}
//                         onChange={(e) => handleInputChange("commissionType", e.target.value)}
//                         className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                       >
//                         <option value="percentage">%</option>
//                         <option value="fixed">₹</option>
//                       </select>
//                     </div>
//                     {errors.commissionRate && <p className="text-red-500 text-sm mt-1">{errors.commissionRate}</p>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Bank Details */}
//           {currentStep === 3 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
//                   <CreditCard className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 3: Bank Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* PAN Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PAN Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.panNumber}
//                     onChange={(e) => handleInputChange("panNumber", formatPAN(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.panNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="ABCDE1234F"
//                   />
//                   {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
//                 </div>

//                 {/* Aadhaar Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Aadhaar Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.aadhaarNumber}
//                     onChange={(e) => handleInputChange("aadhaarNumber", formatAadhaar(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.aadhaarNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="12-digit Aadhaar number"
//                   />
//                   {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
//                 </div>

//                 {/* Bank Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Bank Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.bankName}
//                     onChange={(e) => handleInputChange("bankName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.bankName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="e.g., State Bank of India"
//                   />
//                   {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
//                 </div>

//                 {/* IFSC Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.ifscCode}
//                     onChange={(e) => handleInputChange("ifscCode", formatIFSC(e.target.value))}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.ifscCode ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="SBIN0001234"
//                   />
//                   {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
//                 </div>

//                 {/* Account Holder Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Holder Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountHolderName}
//                     onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountHolderName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="As per bank records"
//                   />
//                   {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
//                 </div>

//                 {/* Account Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.accountNumber}
//                     onChange={(e) => handleInputChange("accountNumber", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                       errors.accountNumber ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Bank account number"
//                   />
//                   {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Status */}
//           {currentStep === 4 && (
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
//                   <CheckCircle className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section 4: Status</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Employee Status <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="status"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
//                       />
//                       <span className="ml-2 text-sm font-medium text-gray-900">Inactive</span>
//                     </label>
//                   </div>
//                   {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
//                 </div>

//                 {/* Additional Notes */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) => handleInputChange("notes", e.target.value)}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
//                     placeholder="Any additional information about the employee..."
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//               <div className="flex gap-4">
//                 {currentStep > 1 && (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//                   >
//                     <ChevronLeft className="inline-block w-5 h-5 mr-2" />
//                     Previous
//                   </button>
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => window.history.back()}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>

//               <div className="flex gap-4">
//                 {currentStep < totalSteps ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//                   >
//                     Next
//                     <ChevronRight className="inline-block w-5 h-5 ml-2" />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-white ${
//                       isSubmitting
//                         ? "bg-green-400 cursor-not-allowed"
//                         : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <span>Saving...</span>
//                     ) : (
//                       <>
//                         <Check className="inline-block w-5 h-5 mr-2" />
//                         Save Employee
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }





















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

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token")
  const departmentId = sessionStorage.getItem("departmentId") || "1"
  return {
    Authorization: `Bearer ${token}`,
    "X-Department-Id": departmentId,
    "Content-Type": "application/json",
  }
}

const splitName = (fullName) => {
  const parts = (fullName || "").trim().split(" ").filter(Boolean)
  if (parts.length === 0) return { first_name: "", last_name: "" }
  if (parts.length === 1) return { first_name: parts[0], last_name: "" }
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") }
}

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(4)) return

    try {
      const { first_name, last_name } = splitName(formData.fullName)
      const deptIdFromSession = Number.parseInt(sessionStorage.getItem("departmentId") || "1", 10)

      const payload = {
        first_name,
        last_name,
        gender: formData.gender || null,
        dob: formData.dateOfBirth || null,
        phone: formData.phone || null,
        personal_email: formData.email || null,
        address: formData.address || null,
        designation: formData.designation || null,
        department_id: Number.isNaN(deptIdFromSession) ? 1 : deptIdFromSession,
        join_date: formData.dateOfJoining || null,
        salary_type: formData.salaryType || null,
        // conditionally include compensation fields based on salary_type
        ...(formData.salaryType === "fixed" && {
          monthly_salary: Number.parseFloat(formData.monthlySalary) || 0,
        }),
        ...(formData.salaryType === "hourly" && {
          hourly_rate: Number.parseFloat(formData.hourlyRate) || 0,
        }),
        ...(formData.salaryType === "commission" && {
          commission_rate: Number.parseFloat(formData.commissionRate) || 0,
          commission_type: formData.commissionType || "percentage",
        }),
        // extras from example
        create_login: true,
        role: "agent",
      }

      const res = await fetch(`${BASE_URL}employees`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let message = "Failed to create employee"
        try {
          const err = await res.json()
          message = err?.message || JSON.stringify(err) || message
        } catch (_) {}
        alert(message)
        return
      }

      const data = await res.json().catch(() => ({}))
      alert("Employee saved successfully!")
      console.log("Employee created:", data)
      // Optionally: reset the form or navigate back
      // window.history.back()
    } catch (error) {
      console.error("Create employee error:", error)
      alert("Something went wrong while creating the employee.")
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
      <div className="max-w-full mx-auto px-4  ml-4 mr-4">
        {/* Page Title */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Employee</h1>
          <p className="text-gray-600">Fill in the employee details across multiple steps</p>
        </div> */}

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <StepIndicator step={1} isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <div className="ml-3 hidden sm:block">
                  <p className="text-md font-medium text-gray-900">Personal Info</p>
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
                  <p className={`text-md ${currentStep >= 2 ? "text-gray-500" : "text-gray-400"}`}>Work information</p>
                </div>
              </div>

              {/* Connector */}
              <div className={`w-16 h-1 rounded ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <StepIndicator step={3} isActive={currentStep === 3} isCompleted={currentStep > 3} />
                <div className="ml-3 hidden sm:block">
                  <p className={`text-md font-medium ${currentStep >= 3 ? "text-gray-900" : "text-gray-500"}`}>
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
                  <p className={`text-md font-medium ${currentStep >= 4 ? "text-gray-900" : "text-gray-500"}`}>
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
