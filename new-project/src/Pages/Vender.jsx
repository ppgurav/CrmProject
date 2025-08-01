
import { useState } from "react"
import { z } from "zod"
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

// Zod validation schema
const vendorSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  contactPersonName: z.string().optional(),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  alternateNumber: z
    .string()
    .regex(/^\d{10}$/, "Alternate number must be 10 digits")
    .optional()
    .or(z.literal("")),
  emailAddress: z.string().email("Invalid email address").optional().or(z.literal("")),
  vendorType: z.string().min(1, "Vendor type is required"),
  status: z.string().min(1, "Status is required"),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional()
    .or(z.literal("")),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .optional()
    .or(z.literal("")),
  paymentTerms: z.string().optional(),
})

const indianStates = [
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
]

const vendorTypes = ["Supplier", "Service Provider", "Freight", "Contractor", "Consultant", "Other"]

export default function Vender() {
  const [formData, setFormData] = useState({
    vendorName: "",
    contactPersonName: "",
    mobileNumber: "",
    alternateNumber: "",
    emailAddress: "",
    vendorType: "",
    status: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    paymentTerms: "",
  })

  const [errors, setErrors] = useState({})
  const [panFile, setPanFile] = useState(null)
  const [gstFile, setGstFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (fileType === "pan") {
      setPanFile(file)
    } else if (fileType === "gst") {
      setGstFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      vendorSchema.parse(formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitSuccess(true)
      console.log("Form submitted successfully:", formData)
      console.log("PAN File:", panFile)
      console.log("GST File:", gstFile)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const InputField = ({ label, name, type = "text", required = false, icon: Icon, placeholder, pattern }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        pattern={pattern}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[name] && (
        <p className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  const SelectField = ({ label, name, options, required = false, icon: Icon, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  const TextareaField = ({ label, name, required = false, icon: Icon, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        rows={3}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[name] && (
        <p className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  const FileUpload = ({ label, fileType, file, onChange }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Upload className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onChange(e, fileType)}
          className="hidden"
          id={`${fileType}-upload`}
        />
        <label
          htmlFor={`${fileType}-upload`}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </label>
        {file && (
          <span className="text-sm text-gray-600 flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {file.name}
          </span>
        )}
      </div>
    </div>
  )

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Vendor Registration Successful!</h2>
          <p className="text-green-700">Your vendor information has been submitted successfully.</p>
          <button
            onClick={() => {
              setSubmitSuccess(false)
              setFormData({
                vendorName: "",
                contactPersonName: "",
                mobileNumber: "",
                alternateNumber: "",
                emailAddress: "",
                vendorType: "",
                status: "",
                gstNumber: "",
                panNumber: "",
                address: "",
                state: "",
                city: "",
                pincode: "",
                bankName: "",
                accountHolderName: "",
                accountNumber: "",
                ifscCode: "",
                paymentTerms: "",
              })
              setPanFile(null)
              setGstFile(null)
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register Another Vendor
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className=" max-w-full mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Registration</h1>
        <p className="text-gray-600">Please fill in all the required information to register a new vendor.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Vendor Name"
              name="vendorName"
              required
              icon={Building2}
              placeholder="Enter full vendor or firm name"
            />
            <InputField
              label="Contact Person Name"
              name="contactPersonName"
              icon={User}
              placeholder="Person to talk to"
            />
            <InputField
              label="Mobile Number"
              name="mobileNumber"
              required
              icon={Phone}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
            />
            <InputField
              label="Alternate Number"
              name="alternateNumber"
              icon={Phone}
              placeholder="Optional secondary number"
              pattern="[0-9]{10}"
            />
            <InputField
              label="Email Address"
              name="emailAddress"
              type="email"
              icon={Mail}
              placeholder="Work or billing email"
            />
            <SelectField
              label="Vendor Type"
              name="vendorType"
              required
              options={vendorTypes}
              placeholder="Select vendor type"
            />
            <SelectField
              label="Status"
              name="status"
              required
              options={["Active", "Inactive"]}
              placeholder="Select status"
            />
          </div>
        </div>

        {/* Section 2: Address & GST */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Address & GST
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="GST Number" name="gstNumber" placeholder="15-digit alphanumeric GST number" />
            <InputField label="PAN Number" name="panNumber" placeholder="10-digit PAN number" />
            <div className="md:col-span-2">
              <TextareaField
                label="Address"
                name="address"
                required
                icon={MapPin}
                placeholder="Enter full business address"
              />
            </div>
            <SelectField label="State" name="state" required options={indianStates} placeholder="Select state" />
            <InputField label="City" name="city" required placeholder="Enter city name" />
            <InputField label="Pincode" name="pincode" required placeholder="6-digit pincode" pattern="[0-9]{6}" />
          </div>
        </div>

        {/* Section 3: Bank Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Bank Name" name="bankName" icon={CreditCard} placeholder="Enter bank name" />
            <InputField
              label="Account Holder Name"
              name="accountHolderName"
              icon={User}
              placeholder="Enter account holder name"
            />
            <InputField label="Account Number" name="accountNumber" placeholder="Enter account number" />
            <InputField label="IFSC Code" name="ifscCode" placeholder="Enter IFSC code" />
          </div>
        </div>

        {/* Section 4: Payment Terms & Files */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Payment Terms & Files
          </h2>
          <div className="space-y-6">
            <InputField label="Payment Terms" name="paymentTerms" placeholder='e.g., "30 days credit"' />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload label="Upload PAN Copy" fileType="pan" file={panFile} onChange={handleFileChange} />
              <FileUpload label="Upload GST Certificate" fileType="gst" file={gstFile} onChange={handleFileChange} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                vendorName: "",
                contactPersonName: "",
                mobileNumber: "",
                alternateNumber: "",
                emailAddress: "",
                vendorType: "",
                status: "",
                gstNumber: "",
                panNumber: "",
                address: "",
                state: "",
                city: "",
                pincode: "",
                bankName: "",
                accountHolderName: "",
                accountNumber: "",
                ifscCode: "",
                paymentTerms: "",
              })
              setErrors({})
              setPanFile(null)
              setGstFile(null)
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Register Vendor"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
